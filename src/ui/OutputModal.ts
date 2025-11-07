import { App, Modal } from "obsidian";
import { ExecutionResult } from "../types";

export class OutputModal extends Modal {
	result: ExecutionResult;
	language: string;

	constructor(app: App, result: ExecutionResult, language: string) {
		super(app);
		this.result = result;
		this.language = language;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass("codeblock-runner-output");

		// Title
		contentEl.createEl("h2", { text: `Output (${this.language})` });

		// Create output container
		const outputContainer = contentEl.createDiv({
			cls: "output-container",
		});

		// Stdout
		if (this.result.stdout) {
			const stdoutSection = outputContainer.createDiv({
				cls: "output-section",
			});
			stdoutSection.createEl("h3", { text: "Output" });
			const stdoutPre = stdoutSection.createEl("pre");
			stdoutPre.createEl("code", { text: this.result.stdout });
		}

		// Stderr
		if (this.result.stderr) {
			const stderrSection = outputContainer.createDiv({
				cls: "output-section output-error",
			});
			stderrSection.createEl("h3", {
				text: this.result.timedOut ? "Timeout" : "Error",
			});
			const stderrPre = stderrSection.createEl("pre");
			stderrPre.createEl("code", { text: this.result.stderr });
		}

		// Execution info
		const infoSection = outputContainer.createDiv({ cls: "output-info" });

		if (this.result.exitCode !== null && this.result.exitCode !== 0) {
			infoSection.createEl("div", {
				text: `Exit code: ${this.result.exitCode}`,
				cls: "exit-code-error",
			});
		}

		infoSection.createEl("div", {
			text: `Executed in ${(this.result.executionTime / 1000).toFixed(
				2
			)}s`,
		});

		// Close button
		const buttonContainer = contentEl.createDiv({
			cls: "button-container",
		});
		const closeButton = buttonContainer.createEl("button", {
			text: "Close",
		});
		closeButton.addEventListener("click", () => this.close());
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
