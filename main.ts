import { App, MarkdownPostProcessorContext, normalizePath, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';


interface CodeBlockExportSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: CodeBlockExportSettings = {
	mySetting: 'default'
}

async function saveSnippet(app: App, ctx: MarkdownPostProcessorContext, ext: string, code: string) {
	const note = app.vault.getAbstractFileByPath(ctx.sourcePath);
	const dir = note instanceof TFile && note.parent ? note.parent.path : "";
	const base = note instanceof TFile ? note.basename : "snippet";

	const sep = dir ? "/" : "";
	const safeExt = ext && ext.trim() ? ext : "txt";
	const target0 = normalizePath(`${dir}${sep}${base}_snippet.${safeExt}`);

	const { adapter } = app.vault;

	let path = target0, i = 1;
	const dot = target0.lastIndexOf(".");
	const stem = dot >= 0 ? target0.slice(0, dot) : target0;
	const suffix = dot >= 0 ? target0.slice(dot) : "";

	console.log("[cbexp] target0:", target0);

	while (await adapter.exists(path)) path = `${stem}(${i++})${suffix}`;
	await app.vault.create(path, code);
	console.log("[cbexp] saved to:", path);
	new Notice(`Code snippet saved to ${path}`);
	return path;
}

const EXT_MAP: Record<string, string> = {
	js: "js",
	py: "py",
	cpp: "cpp",
	c: "c",
}

export default class CodeBlockExport extends Plugin {
	settings: CodeBlockExportSettings;

	async onload() {
		this.registerMarkdownPostProcessor((el, ctx) => {
			el.querySelectorAll('pre > code').forEach(code => {
				const pre = code.parentElement as HTMLElement;
				if (pre.dataset.cbexp === "1") return;
				pre.dataset.cbexp = "1";

				pre.style.position = pre.style.position || "relative";
				pre.style.overflow = "visible";

				const btn = document.createElement("button");
				btn.textContent = "Export to file";
				btn.className = "mod-cta";
				Object.assign(btn.style, { position: "absolute", bottom: "5px", right: "5px", fontSize: "12px", zIndex: "10", pointerEvents: "auto" });

				this.registerDomEvent(btn, 'click', async (e) => {
					e.preventDefault();
					e.stopPropagation();

					const data = code.textContent ?? "";
					const lang = code.className.match(/language-([\w+-]+)/i)?.[1]?.toLowerCase() ?? "txt";
					const ext = EXT_MAP[lang] ?? lang;

					try {
						await saveSnippet(this.app, ctx, ext, data);
						new Notice("Code block exported!");
					} catch (err) {
						console.error(err);
						new Notice("Failed to export code block.");
					}
				});

				pre.appendChild(btn);
			});
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}




class SampleSettingTab extends PluginSettingTab {
	plugin: CodeBlockExport;

	constructor(app: App, plugin: CodeBlockExport) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
