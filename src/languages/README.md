# Language Executors

This directory contains modular language executors. Each language is self-contained in its own file.

## Adding a New Language

To add support for a new language, follow these 3 steps:

### 1. Create a new file: `src/languages/your-language.ts`

````typescript
import { LanguageExecutor } from "./types";

export const YourLanguageExecutor: LanguageExecutor = {
	// Language identifiers (used in markdown: ```javascript, ```js)
	ids: ["javascript", "js"],

	// Display name (shown in settings)
	name: "JavaScript",

	// Optional: Settings this language needs
	settings: [
		{
			key: "nodeCommand", // Unique key for this setting
			name: "Node.js command",
			description:
				"The command to use for executing JavaScript (e.g., node, nodejs)",
			defaultValue: "node",
			placeholder: "node",
		},
	],

	// Build the execution command
	buildCommand: (settings, code, userArgs) => {
		// Option 1: Execute with inline code
		if (userArgs.length === 0) {
			return {
				command: settings.nodeCommand || "node",
				args: ["-e", code], // -e for inline execution
				usesTempFile: false,
			};
		}

		// Option 2: Execute with temp file (for proper argv handling)
		return {
			command: settings.nodeCommand || "node",
			args: [], // Executor will add: [tempFilePath, ...userArgs]
			usesTempFile: true,
			tempFileExtension: "js",
		};
	},
};
````

### 2. Register in `src/languages/index.ts`

```typescript
import { YourLanguageExecutor } from "./your-language";

const LANGUAGE_EXECUTORS: LanguageExecutor[] = [
	PythonExecutor,
	YourLanguageExecutor, // <-- Add here
];
```

### 3. Done! 🎉

That's it! The plugin will automatically:

-   ✅ Register your language IDs (`javascript`, `js`)
-   ✅ Add settings to the Settings tab (if you defined any)
-   ✅ Show your language in the supported languages list
-   ✅ Execute code blocks with ` ```javascript` or ` ```js`

## Examples

### Simple Language (No Arguments, Inline Only)

```typescript
export const ShellExecutor: LanguageExecutor = {
	ids: ["bash", "sh", "shell"],
	name: "Shell",

	buildCommand: (settings, code, userArgs) => {
		return {
			command: "/bin/bash",
			args: ["-c", code],
			usesTempFile: false,
		};
	},
};
```

### Compiled Language (Always Uses Temp File)

```typescript
export const CExecutor: LanguageExecutor = {
	ids: ["c"],
	name: "C",

	settings: [
		{
			key: "gccCommand",
			name: "GCC command",
			description: "The C compiler to use (e.g., gcc, clang)",
			defaultValue: "gcc",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// For C, we need a temp file to compile
		return {
			command: "/bin/bash",
			args: [
				"-c",
				`TEMP_FILE="__TEMP_FILE__" && ` +
					`${
						settings.gccCommand || "gcc"
					} "$TEMP_FILE" -o "${TEMP_FILE}.out" && ` +
					`"${TEMP_FILE}.out" ${userArgs.join(" ")} && ` +
					`rm "${TEMP_FILE}.out"`,
			],
			usesTempFile: true,
			tempFileExtension: "c",
		};
		// Note: __TEMP_FILE__ will be replaced by executor with actual temp file path
	},
};
```

## How It Works

1. **Language Detection**: When user clicks "Run Code", the plugin extracts the language from the markdown (```python → "python")
2. **Executor Lookup**: `getLanguageExecutor("python")` finds the PythonExecutor
3. **Settings Applied**: Plugin passes the user's settings to `buildCommand()`
4. **Command Built**: Your `buildCommand()` returns how to execute the code
5. **Execution**: Executor spawns the process with your command/args

## Tips

-   Use `usesTempFile: true` when you need proper argv or file-based execution
-   Use `usesTempFile: false` for faster inline execution (like `python -c`)
-   Settings are optional - only add them if your language needs configuration
-   The executor automatically handles temp file creation/cleanup
-   User arguments are parsed as space-separated strings
