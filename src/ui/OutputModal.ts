import { App, Modal, Notice } from "obsidian";
import { ExecutionResult } from "../types";

// Modal to display code execution output
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

		// Add keyboard shortcuts
		this.scope.register([], "Escape", () => {
			this.close();
			return false;
		});

		// Ctrl/Cmd + C -> copy output
		this.scope.register(["Mod"], "c", () => {
			this.copyAllOutput();
			return false;
		});

		// Header with title and badge
		const header = contentEl.createDiv({ cls: "output-header" });
		header.createEl("h2", { text: `Output (${this.language})` });

		// Status badge
		const statusBadge = header.createEl("span", {
			cls: "output-status-badge",
		});

		const executionTime = (this.result.executionTime / 1000).toFixed(2);

		if (this.result.exitCode === 0 && !this.result.timedOut) {
			statusBadge.addClass("status-success");
			statusBadge.setText(`✓ Success • ${executionTime}s`);
		} else if (this.result.timedOut) {
			statusBadge.addClass("status-timeout");
			statusBadge.setText(`⏱ Timeout • ${executionTime}s`);
		} else {
			statusBadge.addClass("status-error");
			statusBadge.setText(`✗ Failed • Exit ${this.result.exitCode}`);
		}

		// Output content area
		const contentArea = contentEl.createDiv({ cls: "output-content-area" });

		// Stdout in container
		if (this.result.stdout) {
			const outputBox = contentArea.createDiv({ cls: "output-box" });
			const pre = outputBox.createEl("pre");
			pre.createEl("code", { text: this.result.stdout });
		}

		// Stderr in container with error styling
		if (this.result.stderr) {
			const errorBox = contentArea.createDiv({
				cls: "output-box output-box-error",
			});
			const pre = errorBox.createEl("pre");
			pre.createEl("code", { text: this.result.stderr });
		}

		// Footer with buttons
		const footer = contentEl.createDiv({ cls: "output-footer" });

		// Copy button (primary action)
		const copyButton = footer.createEl("button", {
			text: "Copy",
			cls: "mod-cta",
		});
		copyButton.addEventListener("click", () => this.copyAllOutput());

		// Close button (secondary)
		const closeButton = footer.createEl("button", {
			text: "Close",
		});
		closeButton.addEventListener("click", () => this.close());
	}

	copyAllOutput() {
		let fullOutput = "";
		if (this.result.stdout) {
			fullOutput += "=== Output ===\n" + this.result.stdout + "\n\n";
		}
		if (this.result.stderr) {
			fullOutput += "=== Error ===\n" + this.result.stderr + "\n\n";
		}
		fullOutput += `Exit code: ${this.result.exitCode}\n`;
		fullOutput += `Executed in ${(this.result.executionTime / 1000).toFixed(
			2
		)}s`;

		navigator.clipboard.writeText(fullOutput);
		new Notice("Output copied to clipboard");
	}

	// Potentially swap to just Stdout down the line
	// should unspghagetti the copy logic a bit
	copyStdout() {
		return this.result.stdout ? this.result.stdout : this.result.stderr ? this.result.stderr : "";
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
