import { App, PluginSettingTab, Setting } from "obsidian";
import type CodeBlockRunner from "../main";

export class CodeBlockRunnerSettingTab extends PluginSettingTab {
	plugin: CodeBlockRunner;

	constructor(app: App, plugin: CodeBlockRunner) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Codeblock Runner Settings" });

		// Python command setting
		new Setting(containerEl)
			.setName("Python command")
			.setDesc(
				"The command to use for executing Python code (e.g., python3, python, or full path)"
			)
			.addText((text) =>
				text
					.setPlaceholder("python3")
					.setValue(this.plugin.settings.pythonCommand)
					.onChange(async (value) => {
						this.plugin.settings.pythonCommand = value || "python3";
						await this.plugin.saveSettings();
					})
			);

		// Execution timeout setting
		new Setting(containerEl)
			.setName("Execution timeout")
			.setDesc(
				"Maximum time (in seconds) a code block can run before being terminated"
			)
			.addText((text) =>
				text
					.setPlaceholder("30")
					.setValue(String(this.plugin.settings.executionTimeout))
					.onChange(async (value) => {
						const timeout = parseInt(value);
						if (!isNaN(timeout) && timeout > 0) {
							this.plugin.settings.executionTimeout = timeout;
							await this.plugin.saveSettings();
						}
					})
			);

		// Info section
		containerEl.createEl("h3", { text: "Supported Languages" });
		const langList = containerEl.createEl("ul");
		langList.createEl("li", { text: "Python (python, py)" });

		containerEl.createEl("p", {
			text: "More languages coming soon: C, C++, Rust",
			cls: "setting-item-description",
		});
	}
}
