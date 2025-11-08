import { PluginExtractor } from "./types";

// Code Styler plugin extractor
// https://github.com/mayurankv/Obsidian-Code-Styler
// Code Styler adds line numbers to the code blocks, extracting just the inner HTML will include the line numbers, breaking execution.
export const CodeStylerExtractor: PluginExtractor = {
	name: "Code Styler",
	pluginId: "code-styler",

	detect: (el) => {
		// Code Styler wraps lines in .code-styler-line divs
		return el.querySelector(".code-styler-line") !== null;
	},

	extract: (el) => {
		// Extract text from .code-styler-line-text elements
		// Number are stored in .code-styler-line-number elements, so ignore all
		const lines = el.querySelectorAll(".code-styler-line-text");
		if (lines.length > 0) {
			return Array.from(lines)
				.map((line) => line.textContent || "")
				.join("\n");
		}
		return "";
	},
};
