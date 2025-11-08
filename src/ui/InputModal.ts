import { App, Modal, Setting } from "obsidian";

// Modal to get user inputs (command-line args) upon shift+click run button
export class InputModal extends Modal {
	result: string;
	onSubmit: (result: string) => void;
	placeholder: string;
	title: string;
	defaultValue: string;

	constructor(
		app: App,
		title: string,
		placeholder: string,
		defaultValue: string,
		onSubmit: (result: string) => void
	) {
		super(app);
		this.title = title;
		this.placeholder = placeholder;
		this.defaultValue = defaultValue;
		this.onSubmit = onSubmit;
		this.result = defaultValue;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass("codeblock-runner-input");

		contentEl.createEl("h2", { text: this.title });

		new Setting(contentEl)
			.setName("Arguments")
			.setDesc("Space-separated arguments to pass to your code")
			.addText((text) =>
				text
					.setPlaceholder(this.placeholder)
					.setValue(this.defaultValue)
					.onChange((value) => {
						this.result = value;
					})
					.inputEl.addEventListener("keydown", (e: KeyboardEvent) => {
						if (e.key === "Enter") {
							e.preventDefault();
							this.close();
							this.onSubmit(this.result);
						}
					})
			);

		const buttonContainer = contentEl.createDiv({
			cls: "input-button-container",
		});

		const runButton = buttonContainer.createEl("button", {
			text: "Run",
			cls: "mod-cta",
		});
		runButton.addEventListener("click", () => {
			this.close();
			this.onSubmit(this.result);
		});

		const cancelButton = buttonContainer.createEl("button", {
			text: "Cancel",
		});
		cancelButton.addEventListener("click", () => {
			this.close();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
