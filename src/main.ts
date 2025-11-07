import { Notice, Plugin } from "obsidian";
import { CodeRunnerSettings } from "./types";
import { DEFAULT_SETTINGS } from "./settings";
import { getLanguageExecutor } from "./languages";
import { extractCodeFromElement } from "./extractors";
import { executeCode } from "./executor";
import { OutputModal } from "./ui/OutputModal";
import { InputModal } from "./ui/InputModal";
import { CodeBlockRunnerSettingTab } from "./ui/SettingsTab";

export default class CodeBlockRunner extends Plugin {
	settings: CodeRunnerSettings;

	async onload() {
		await this.loadSettings();

		// Register settings tab
		this.addSettingTab(new CodeBlockRunnerSettingTab(this.app, this));

		// Register markdown post processor to add "Run Code" buttons
		this.registerMarkdownPostProcessor((el) => {
			el.querySelectorAll("pre > code").forEach((code) => {
				const pre = code.parentElement as HTMLElement;
				if (pre.dataset.codeRunner === "1") return;
				pre.dataset.codeRunner = "1";

				pre.style.position = pre.style.position || "relative";
				pre.style.overflow = "visible";

				const btn = document.createElement("button");
				btn.textContent = "Run Code";
				btn.className = "mod-cta";

				// Check if single-line to avoid overlap with copy button
				// In Reading View, just count newlines in the text content
				const codeText = code.textContent || "";
				const lineCount = codeText.trim().split("\n").length;
				const isSingleLine = lineCount === 1;

				Object.assign(btn.style, {
					position: "absolute",
					bottom: "5px",
					right: isSingleLine ? "35px" : "5px", // Offset for single-line blocks
					fontSize: "12px",
					zIndex: "10",
					pointerEvents: "auto",
				});

				this.registerDomEvent(btn, "click", async (e) => {
					e.preventDefault();
					e.stopPropagation();

					// Extract language from class
					const lang =
						code.className
							.match(/language-([\w+-]+)/i)?.[1]
							?.toLowerCase() ?? "txt";

					// Check if language is supported
					if (!getLanguageExecutor(lang)) {
						new Notice(`Language "${lang}" is not supported yet`);
						return;
					}

					// Shift+Click to prompt for arguments
					const promptForArgs = e.shiftKey;

					const runCode = async (args?: string) => {
						console.log("[CodeRunner] Extracting code: ");
						console.log(
							"[CodeRunner] Code element HTML:",
							code.innerHTML
						);

						// Use the plugin-aware extraction system
						// This helps with plugis like CodeStyler that modify the inner HTML and need to be santizied before execution
						// NOTE: I will add more extractors with any suggestions
						const codeText = extractCodeFromElement(code, this.app);

						console.log(
							"[CodeRunner] Final codeText length:",
							codeText.length
						);
						console.log(
							"[CodeRunner] Final codeText (first 200 chars):",
							codeText.substring(0, 200)
						);
						console.log("[CodeRunner] === End Debug ===");

						// Show executing notice
						const notice = new Notice(
							`Executing ${lang} code...`,
							0
						);

						try {
							const result = await executeCode(
								codeText,
								lang,
								this.settings,
								args
							);

							notice.hide();

							// Show output modal
							new OutputModal(this.app, result, lang).open();

							// Show success/failure notice
							if (result.exitCode === 0 && !result.timedOut) {
								new Notice(`Code executed successfully`);
							} else if (result.timedOut) {
								new Notice(`Execution timed out`, 5000);
							} else {
								new Notice(
									`Execution failed (exit code: ${result.exitCode})`,
									5000
								);
							}
						} catch (err) {
							notice.hide();
							console.error("Code execution error:", err);
							new Notice(
								`Failed to execute code: ${err.message}`
							);
						}
					};

					if (promptForArgs) {
						// Show input modal
						new InputModal(
							this.app,
							"Run with Arguments",
							"arg1 arg2 arg3",
							this.settings.defaultArgs,
							(args) => runCode(args)
						).open();
					} else {
						// Run immediately with default args
						await runCode(this.settings.defaultArgs);
					}
				});

				pre.appendChild(btn);
			});
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
