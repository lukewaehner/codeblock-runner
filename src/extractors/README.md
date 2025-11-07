# Plugin Extractors

This directory contains extractors for Obsidian plugins that modify code block rendering. Each extractor knows how to extract clean code from a specific plugin's DOM structure.

## Why Extractors?

Some Obsidian plugins modify code blocks by wrapping them in custom HTML (like Code Styler adding line numbers). Without extractors, you'd get corrupted code with all the extra HTML text mixed in.

Extractors detect these plugins and cleanly extract just the code.

## Adding Support for a Plugin

To add support for a new plugin, follow these 3 steps:

### 1. Create `src/extractors/your-plugin.ts`

```typescript
import { PluginExtractor } from "./types";

export const YourPluginExtractor: PluginExtractor = {
	// Display name
	name: "Your Plugin",

	// Obsidian plugin ID (from manifest.json)
	// Optional - if provided, only runs when plugin is enabled
	pluginId: "your-plugin-id",

	// Detect if this code block uses your plugin's structure
	detect: (codeElement) => {
		// Check for plugin-specific CSS classes or DOM structure
		return codeElement.querySelector(".your-plugin-wrapper") !== null;
	},

	// Extract clean code from the modified DOM
	extract: (codeElement) => {
		// Find the actual code content within plugin's wrappers
		const codeLines = codeElement.querySelectorAll(
			".your-plugin-code-line"
		);

		if (codeLines.length > 0) {
			return Array.from(codeLines)
				.map((line) => line.textContent || "")
				.join("\n");
		}

		return ""; // Return empty if extraction fails
	},
};
```

### 2. Register in `src/extractors/index.ts`

```typescript
import { YourPluginExtractor } from "./your-plugin";

const PLUGIN_EXTRACTORS: PluginExtractor[] = [
	CodeStylerExtractor,
	YourPluginExtractor, // <-- Add here
];
```

### 3. Finished

The extractor will automatically:

-   Only run when the plugin is installed and enabled
-   Detect and extract code from that plugin's format
-   Fall back to standard extraction if not detected

## Examples

### Simple Class-Based Extractor

```typescript
export const SimpleExtractor: PluginExtractor = {
	name: "Simple Plugin",
	pluginId: "simple-plugin",

	detect: (el) => el.classList.contains("simple-code-block"),

	extract: (el) => {
		const code = el.querySelector(".simple-code-content");
		return code?.textContent || "";
	},
};
```

### Nested Structure Extractor

```typescript
export const NestedExtractor: PluginExtractor = {
	name: "Nested Plugin",
	pluginId: "nested-plugin",

	detect: (el) => el.querySelector(".nested-wrapper") !== null,

	extract: (el) => {
		// Extract from nested structure
		const lines = el.querySelectorAll(".nested-wrapper .line .content");
		return Array.from(lines)
			.map((line) => line.textContent?.trim() || "")
			.filter((line) => line) // Remove empty lines
			.join("\n");
	},
};
```

### Line Number Stripper (No Plugin ID)

```typescript
export const LineNumberStripper: PluginExtractor = {
	name: "Generic Line Numbers",
	// No pluginId - always tries to detect

	detect: (el) => {
		const text = el.textContent || "";
		const lines = text.split("\n");
		// Check if most lines start with "  1|", "  2|", etc.
		return (
			lines.filter((l) => /^\s*\d+\|/.test(l)).length > lines.length / 2
		);
	},

	extract: (el) => {
		const text = el.textContent || "";
		return text
			.split("\n")
			.map((line) => line.replace(/^\s*\d+\|/, ""))
			.join("\n");
	},
};
```

## How It Works

1. **User clicks "Run Code"**
2. **Active extractors loaded**: Checks which plugins are enabled
3. **Detection phase**: Each extractor's `detect()` is called
4. **First match wins**: When an extractor detects its format, its `extract()` runs
5. **Fallback**: If no extractor matches, standard textContent extraction is used

## Debugging Your Extractor

Add console logs to see what's happening:

```typescript
detect: (el) => {
	console.log("[YourPlugin] Checking element:", el);
	console.log("[YourPlugin] Classes:", el.className);
	console.log("[YourPlugin] Inner HTML:", el.innerHTML?.substring(0, 200));

	const matches = el.querySelector(".your-plugin-class") !== null;
	console.log("[YourPlugin] Match:", matches);

	return matches;
};
```

Then open DevTools Console (Cmd/Ctrl+Shift+I) and click "Run Code" to see the logs.

## Tips

-   **Check plugin source code**: Look at the plugin's GitHub to understand its DOM structure
-   **Inspect in DevTools**: Right-click a code block → Inspect to see the HTML
-   **Test with/without plugin**: Verify extractor only activates when plugin is enabled
-   **Handle edge cases**: What if plugin is partially loaded? Return empty string to fall back
-   **Be specific in detection**: Don't accidentally match standard code blocks

## Common Patterns

### Pattern 1: Lines in Divs

```typescript
// Plugin wraps each line: <div class="line"><span>code</span></div>
extract: (el) => {
	const lines = el.querySelectorAll(".line");
	return Array.from(lines)
		.map((l) => l.textContent || "")
		.join("\n");
};
```

### Pattern 2: Separate Line Numbers

```typescript
// Plugin splits: <span class="number">1</span><span class="code">text</span>
extract: (el) => {
	const codeSpans = el.querySelectorAll(".code");
	return Array.from(codeSpans)
		.map((s) => s.textContent || "")
		.join("\n");
};
```

### Pattern 3: Data Attributes

```typescript
// Plugin stores code in data-* attributes
extract: (el) => {
	const lines = el.querySelectorAll("[data-line-content]");
	return Array.from(lines)
		.map((l) => l.getAttribute("data-line-content") || "")
		.join("\n");
};
```

## Contributing

If you create an extractor for a popular plugin, consider:

1. Testing it with various code samples
2. Adding comments explaining the plugin's structure
3. Sharing it so others can benefit!
