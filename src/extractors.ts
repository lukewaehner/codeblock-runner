import { App } from "obsidian";
import { CodeExtractor } from "./types";

// Registry of known plugin extractors
// These are only used if the corresponding plugin is detected/enabled
export const PLUGIN_EXTRACTOR_REGISTRY: CodeExtractor[] = [
	// Code Styler plugin support
	{
		name: "code-styler",
		pluginId: "code-styler", // Official plugin ID
		detect: (el) => el.querySelector(".code-styler-line") !== null,
		extract: (el) => {
			const lines = el.querySelectorAll(".code-styler-line-text");
			if (lines.length > 0) {
				return Array.from(lines)
					.map((line) => line.textContent || "")
					.join("\n");
			}
			return "";
		},
	},
	// Add more plugin extractors here as needed
	// Example for future plugins:
	// {
	//   name: "another-code-plugin",
	//   pluginId: "another-code-plugin",
	//   detect: (el) => el.querySelector(".another-plugin-class") !== null,
	//   extract: (el) => { ... }
	// }
];

export function getActiveExtractors(app: App): CodeExtractor[] {
	const activeExtractors: CodeExtractor[] = [];

	for (const extractor of PLUGIN_EXTRACTOR_REGISTRY) {
		// If pluginId is specified, check if plugin is enabled
		if (extractor.pluginId) {
			// @ts-ignore - accessing internal API
			const isEnabled = app.plugins?.enabledPlugins?.has(
				extractor.pluginId
			);
			if (isEnabled) {
				console.log(
					`[CodeRunner] Plugin detected: ${extractor.name} (${extractor.pluginId})`
				);
				activeExtractors.push(extractor);
			}
		} else {
			// No pluginId means always try this extractor
			activeExtractors.push(extractor);
		}
	}

	return activeExtractors;
}

export function extractCodeFromElement(codeElement: Element, app: App): string {
	console.log("[CodeRunner] Attempting to extract code...");

	// Get extractors for currently enabled plugins
	const activeExtractors = getActiveExtractors(app);
	console.log(
		`[CodeRunner] ${activeExtractors.length} plugin extractor(s) active`
	);

	// Try plugin-specific extractors first
	for (const extractor of activeExtractors) {
		if (extractor.detect(codeElement)) {
			console.log(
				`[CodeRunner] Detected ${extractor.name} plugin format`
			);
			const extracted = extractor.extract(codeElement);
			if (extracted) {
				console.log(
					`[CodeRunner] Successfully extracted using ${extractor.name} extractor`
				);
				return extracted;
			}
		}
	}

	console.log(
		"[CodeRunner] No plugin format detected, using standard extraction"
	);

	// Fallback: standard extraction with line number stripping
	let codeText = codeElement.textContent ?? "";

	// If line numbers are present (format: "  1|code" or "  1 code")
	// Remove them from each line
	const lines = codeText.split("\n");
	const hasLineNumbers =
		lines.length > 1 &&
		lines.every((line) => line.match(/^\s*\d+[|\s]/) || line.trim() === "");

	if (hasLineNumbers) {
		console.log("[CodeRunner] Detected inline line numbers, stripping...");
		codeText = lines
			.map((line) => line.replace(/^\s*\d+[|\s]/, ""))
			.join("\n");
	}

	return codeText;
}
