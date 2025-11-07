import { App, PluginSettingTab, Setting } from "obsidian";
import { getSupportedLanguages, getAllLanguageExecutors } from "../languages";

export class CodeBlockRunnerSettingTab extends PluginSettingTab {
	plugin: any; // Reference to CodeBlockRunner plugin

	constructor(app: App, plugin: any) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Codeblock Runner Settings" });

		// General settings section
		containerEl.createEl("h3", { text: "General" });

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

		// Default arguments setting
		new Setting(containerEl)
			.setName("Default arguments")
			.setDesc(
				"Default arguments to pass to code (can be overridden when running)"
			)
			.addText((text) =>
				text
					.setPlaceholder("arg1 arg2")
					.setValue(this.plugin.settings.defaultArgs)
					.onChange(async (value) => {
						this.plugin.settings.defaultArgs = value;
						await this.plugin.saveSettings();
					})
			);

		// Language-specific settings (dynamically generated)
		const executors = getAllLanguageExecutors();
		const languagesWithSettings = executors.filter(
			(e) => e.settings && e.settings.length > 0
		);

		if (languagesWithSettings.length > 0) {
			containerEl.createEl("h3", { text: "Language Settings" });

			for (const executor of languagesWithSettings) {
				// Add section header for each language
				containerEl.createEl("h4", {
					text: executor.name,
					cls: "setting-item-heading",
				});

				// Add each setting for this language
				if (executor.settings) {
					for (const langSetting of executor.settings) {
						new Setting(containerEl)
							.setName(langSetting.name)
							.setDesc(langSetting.description)
							.addText((text) =>
								text
									.setPlaceholder(
										langSetting.placeholder ||
											langSetting.defaultValue
									)
									.setValue(
										this.plugin.settings[langSetting.key] ||
											langSetting.defaultValue
									)
									.onChange(async (value) => {
										this.plugin.settings[langSetting.key] =
											value || langSetting.defaultValue;
										await this.plugin.saveSettings();
									})
							);
					}
				}
			}
		}

		// Info section
		containerEl.createEl("h3", { text: "Keyboard Shortcuts" });
		const shortcutsList = containerEl.createEl("ul");
		shortcutsList.createEl("li", {
			text: "Shift + Click Run Button - Prompt for arguments before running",
		});
		shortcutsList.createEl("li", {
			text: "Esc - Close output modal",
		});
		shortcutsList.createEl("li", {
			text: "Cmd/Ctrl + C - Copy all output (when modal is open)",
		});

		containerEl.createEl("h3", { text: "Supported Languages" });
		const langList = containerEl.createEl("ul");

		// Dynamically list supported languages
		const languages = getSupportedLanguages();
		languages.forEach((lang) => {
			langList.createEl("li", { text: lang });
		});

		containerEl.createEl("p", {
			text: "To add more languages, check the documentation or submit a request.",
			cls: "setting-item-description",
		});
	}
}
