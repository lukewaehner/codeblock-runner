// Plugin extractor registry
// To add support for a new plugin, import its extractor and add to the array

import { App } from "obsidian";
import { PluginExtractor } from "./types";
import { CodeStylerExtractor } from "./code-styler";

// Add new plugin extractors here
const PLUGIN_EXTRACTORS: PluginExtractor[] = [
	CodeStylerExtractor,
	// Add more extractors here:
];

// Gets the active extractors for the currently enabled plugins
export function getActiveExtractors(app: App): PluginExtractor[] {
	const activeExtractors: PluginExtractor[] = [];

	for (const extractor of PLUGIN_EXTRACTORS) {
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
