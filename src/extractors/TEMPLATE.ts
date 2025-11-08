// Template for adding a new plugin extractor
// Copy this file and customize for your plugin

import { PluginExtractor } from "./types";

export const TemplateExtractor: PluginExtractor = {
	// Display name for this extractor (shown in logs)
	name: "Your Plugin Name",

	// Optional: Obsidian plugin ID from the plugin's manifest.json
	// If specified, this extractor only runs when the plugin is enabled
	// Leave undefined to always try this extractor, could have conflicts with others!
	pluginId: "your-plugin-id",

	// Detect if this code block uses your plugin's format
	detect: (codeElement) => {
		// STEP 1: Inspect the code block in DevTools (Cmd/Ctrl+Shift+I)
		// Look for unique CSS classes or DOM structure your plugin adds

		// Example patterns:
		// - Specific class: return codeElement.classList.contains("your-plugin-class");
		// - Wrapper element: return codeElement.querySelector(".your-wrapper") !== null;
		// - Data attribute: return codeElement.hasAttribute("data-your-plugin");

		// REPLACE THIS with your detection logic:
		return codeElement.querySelector(".your-plugin-indicator") !== null;
	},

	// Extract clean code text from the modified DOM
	extract: (codeElement) => {
		// STEP 2: Figure out where the actual code lives
		// Your plugin likely wraps code in specific elements

		// Example patterns:

		// Pattern 1: Code in specific elements
		const codeLines = codeElement.querySelectorAll(".your-code-line");
		if (codeLines.length > 0) {
			return Array.from(codeLines)
				.map((line) => line.textContent || "")
				.join("\n");
		}

		// Pattern 2: Code in a single container
		const codeContainer = codeElement.querySelector(".your-code-content");
		if (codeContainer) {
			return codeContainer.textContent || "";
		}

		// Pattern 3: Code in data attributes
		const linesWithData = codeElement.querySelectorAll("[data-code-line]");
		if (linesWithData.length > 0) {
			return Array.from(linesWithData)
				.map((el) => el.getAttribute("data-code-line") || "")
				.join("\n");
		}

		// If extraction fails, return empty string to trigger fallback
		return "";
	},
};
