// Plugin extractor interface
// Each extractor handles a specific Obsidian plugin that modifies code block rendering

export interface PluginExtractor {
	// Plugin name (for logging/display)
	name: string;

	// Obsidian plugin ID (e.g., "code-styler")
	// If specified, extractor only runs if plugin is enabled
	pluginId?: string;

	// Detect if this extractor should handle the code block
	// Return true if the element matches this plugin's structure
	detect: (codeElement: Element) => boolean;

	// Extract clean code text from the modified DOM
	// Return the code string, or empty string if extraction fails
	extract: (codeElement: Element) => string;
}
