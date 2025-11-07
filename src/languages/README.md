# Language Executors

This directory contains modular language executors. Each language is self-contained in its own file.

## Custom Command System

**Every language should support custom commands.** This gives users complete flexibility to:

-   Use alternative runtimes (e.g., bun instead of node, pypy instead of python)
-   Switch between compilers (e.g., gcc vs clang, rustc vs cargo)
-   Add custom flags (e.g., optimization, warnings, debugging)
-   Use their own build systems or workflows

### How it works:

1. User sets a custom command in settings with template variables: `{file}`, `{args}`, `{dir}`
2. Executor checks for `{language}CustomCommand` setting (e.g., `pythonCustomCommand`)
3. If set, creates temp file and substitutes variables: `{file}` → `/tmp/code.py`
4. Executes via `/bin/sh -c` with the generated command
5. If empty, falls back to language's default `buildCommand` behavior

### Template Variables:

-   `{file}` - Full path to temp file containing the code (e.g., `/tmp/obsidian-code-123456.py`)
-   `{args}` - User's command-line arguments as a string (e.g., `arg1 arg2 arg3`)
-   `{dir}` - Directory containing the temp file (e.g., `/tmp`)

### Example Custom Commands:

```bash
# Python with PyPy
pypy3 {file} {args}

# Rust with rustc instead of cargo
rustc {file} -o {file}.out && {file}.out {args} && rm {file}.out

# C++ with clang and warnings
clang++ -std=c++20 -Wall -Wextra {file} -o {file}.out && {file}.out {args}

# JavaScript with Bun
bun run {file} {args}
```

## Adding a New Language

To add support for a new language, follow these 3 steps:

### 1. Create a new file: `src/languages/your-language.ts`

**Important**: Always add a custom command setting as the first setting. This gives users complete control over how code is executed.

````typescript
import { LanguageExecutor } from "./types";

export const YourLanguageExecutor: LanguageExecutor = {
	// Language identifiers (used in markdown: ```javascript, ```js)
	ids: ["javascript", "js"],

	// Display name (shown in settings)
	name: "JavaScript",

	// Settings this language needs
	settings: [
		// CUSTOM COMMAND (ALWAYS ADD THIS FIRST)
		{
			key: "javascriptCustomCommand", // Must end with "CustomCommand"
			name: "Custom command (optional)",
			description:
				"Custom shell command to run JavaScript code. Leave empty to use default behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Examples:\n" +
				"  bun: bun run {file} {args}\n" +
				"  deno: deno run {file} {args}",
			defaultValue: "",
			placeholder: "bun run {file} {args}",
			isTextArea: true, // Use textarea for multiline commands
		},
		// DEFAULT SETTINGS (Used when custom command is empty)
		{
			key: "nodeCommand", // Unique key for this setting
			name: "Node.js command",
			description:
				"The command to use for executing JavaScript (e.g., node, nodejs). Only used if custom command is empty.",
			defaultValue: "node",
			placeholder: "node",
		},
	],

	// Build the execution command (only used if custom command is NOT set)
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

### 3. Finished

The plugin will automatically:

-   Register your language IDs (`javascript`, `js`)
-   Add settings to the Settings tab (if you defined any)
-   Show your language in the supported languages list
-   Execute code blocks with ` ```javascript` or ` ```js`

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
