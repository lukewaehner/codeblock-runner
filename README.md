# Codeblock Runner

This is a plugin for [Obsidian.md](https://obsidian.md) which lets you execute code blocks directly in your notes and view the output in a modal window. It works straight out of the box and is perfect for students taking coding classes, quick prototyping, or testing small snippets without leaving your notes.

## Usage

The plugin adds a **Run Code** button to every code block in reading view. Click the button to execute the code and view the output in a modal window.

### Running code

To run a code block:

1. Write a code block in your note with a supported language (e.g., `python`)
2. Switch to **Reading View**
3. Click the **Run Code** button that appears on the code block
4. View the output in the modal that appears
5. Click outside the modal or press `Escape` to dismiss it

Example:

````markdown
```python
print("Hello from Obsidian!")
for i in range(5):
    print(f"Count: {i}")
```
````

The output modal displays:

-   **Standard output**: All printed output from your code
-   **Standard error**: Any error messages or warnings
-   **Exit code**: The program's exit code (0 indicates success)
-   **Execution time**: How long the code took to run

### Running with arguments

To pass command-line arguments to your code:

1. Hold **Shift** and click the **Run Code** button
2. Enter your arguments in the input modal (space-separated)
3. Click **Submit** to execute with the provided arguments

Arguments are passed as if you ran the code from the command line. For example, in Python, these are accessible via `sys.argv`.

Example:

````markdown
```python
import sys
print(f"Script name: {sys.argv[0]}")
print(f"Arguments: {sys.argv[1:]}")
```
````

Running with arguments `arg1 arg2 arg3` will output:

```
Script name: temp_file.py
Arguments: ['arg1', 'arg2', 'arg3']
```

### Error handling

If your code has an error, it will be displayed in the output modal. The stderr section shows the error message, and the exit code indicates failure (typically non-zero).

Example:

````markdown
```python
print("This works")
print(undefined_variable)
```
````

Output:

```
This works
Error: NameError: name 'undefined_variable' is not defined

Exit code: 1
Executed in 0.03s
```

### Timeout protection

Code execution is automatically terminated if it runs longer than the configured timeout (default 30 seconds). This prevents infinite loops from hanging Obsidian. A timeout message will be displayed in the output modal if this occurs.

## Settings

The settings page allows you to configure execution parameters and language-specific commands.

### General settings

**Execution timeout**: Maximum time (in seconds) a code block can run before being terminated. Default is 30 seconds.

**Default arguments**: Default command-line arguments to pass to code blocks. These are used when clicking **Run Code** normally (without Shift). Can be overridden by using Shift+Click to prompt for arguments.

### Language settings

Each supported language has its own configuration section where you can specify the command or path to use for execution.

#### Custom commands

Many languages support custom command templates, giving you complete control over how code is compiled and executed. This is useful if you want to:

-   Use rustc instead of cargo for Rust
-   Switch between gcc and clang for C/C++
-   Add custom compiler flags or build steps
-   Use your own build system or workflow

Custom commands support template variables that are automatically replaced:

-   `{file}` - Path to the temporary file containing your code
-   `{args}` - Command-line arguments passed to your code
-   `{dir}` - Directory containing the temporary file

**Example custom commands:**

```bash
# Rust with rustc instead of cargo
rustc {file} -o {file}.out && {file}.out {args} && rm {file}.out

# C++ with clang and warnings
clang++ -std=c++20 -Wall -Wextra {file} -o {file}.out && {file}.out {args}

# C with gcc in debug mode
gcc -std=c11 -g -O0 {file} -o {file}.out && {file}.out {args}
```

To use custom commands, find the **Custom command (optional)** setting for your language in **Settings → Codeblock Runner → Language Settings**. Leave it empty to use the default behavior.

#### Python

**Python command**: The command to use for executing Python code. Default is `python3`. You can specify a full path (e.g., `/usr/local/bin/python3.11`) or a different command (e.g., `python`).

#### JavaScript

**Node.js command**: The command to use for executing JavaScript code. Default is `node`. You can specify a full path (e.g., `/usr/local/bin/node`) or a different command (e.g., `nodejs`).

#### C

**C compiler**: The C compiler to use for compiling C code. Default is `gcc`. You can specify `clang` or a full path.

**C compiler flags**: Additional flags to pass to the compiler. Default is `-std=c11`. You can specify optimization flags like `-std=c11 -O2` or debugging flags like `-std=c11 -g`.

#### C++

**C++ compiler**: The C++ compiler to use for compiling C++ code. Default is `g++`. You can specify `clang++` or a full path.

**C++ compiler flags**: Additional flags to pass to the compiler. Default is `-std=c++17`. You can specify optimization flags like `-std=c++20 -O2` or debugging flags like `-std=c++17 -g`.

#### Rust

**Cargo command**: The Cargo command to use for building and running Rust code. Default is `cargo`. You can specify a full path if needed.

**Rust edition**: The Rust edition to use in the generated Cargo.toml. Default is `2021`. You can specify `2018` or `2015` if needed.

Note: The plugin uses `cargo run` which automatically creates a minimal Cargo project, builds, and runs your code. This is the standard way to run Rust code and supports dependencies if you add them to the generated Cargo.toml (though for simple snippets, no dependencies are needed).

#### TypeScript

**ts-node command**: The command to use for executing TypeScript code. Default is `ts-node`. You can specify `npx ts-node` if ts-node is not globally installed, or a full path.

Note: TypeScript execution requires ts-node to be installed. Install it with `npm install -g ts-node typescript` or use `npx ts-node`.

#### Java

**Java compiler**: The Java compiler to use for compiling Java code. Default is `javac`. You can specify a full path if needed.

**Java runtime**: The Java runtime to use for executing compiled Java code. Default is `java`. You can specify a full path if needed.

Note: The plugin automatically detects the class name from your code by looking for `public class ClassName`. Ensure your code has a proper class declaration.

#### Go

**Go command**: The Go command to use for executing Go code. Default is `go`. You can specify a full path if needed.

Note: The plugin uses `go run` which automatically compiles and runs your code in one step.

#### Ruby

**Ruby command**: The command to use for executing Ruby code. Default is `ruby`. You can specify a full path (e.g., `/usr/local/bin/ruby`) or a different command.

#### PHP

**PHP command**: The command to use for executing PHP code. Default is `php`. You can specify a full path (e.g., `/usr/bin/php`) or a different command.

Note: Your PHP code does not need to include the opening `<?php` tag when using inline execution, but should include it when using arguments or temp file execution.

#### Shell

**Shell command**: The shell to use for executing shell scripts. Default is `/bin/bash`. You can specify `/bin/zsh`, `/bin/sh`, or any other shell path.

### Keyboard shortcuts

The following keyboard shortcuts are available:

-   **Shift + Click Run Button**: Prompt for arguments before running
-   **Esc**: Close output modal
-   **Cmd/Ctrl + C**: Copy all output (when modal is open)

## Supported languages

The plugin currently supports the following languages:

-   **Python**: Requires Python installed and in PATH (or configure path in settings)
-   **JavaScript**: Requires Node.js installed and in PATH (or configure path in settings)
-   **TypeScript**: Requires ts-node installed and in PATH (or configure path in settings)
-   **Java**: Requires JDK (javac and java) installed and in PATH (or configure path in settings)
-   **C**: Requires a C compiler (gcc or clang) installed and in PATH (or configure path in settings)
-   **C++**: Requires a C++ compiler (g++ or clang++) installed and in PATH (or configure path in settings)
-   **Go**: Requires Go installed and in PATH (or configure path in settings)
-   **Rust**: Requires Cargo (Rust's package manager) installed and in PATH (or configure path in settings)
-   **Ruby**: Requires Ruby installed and in PATH (or configure path in settings)
-   **PHP**: Requires PHP installed and in PATH (or configure path in settings)
-   **Shell**: Requires bash, zsh, or sh (typically pre-installed on Unix-based systems)

Additional languages can be added by creating language executor modules. See the extensibility section below for details.

## Plugin compatibility

The plugin includes a smart extraction system that handles code blocks modified by other Obsidian plugins. This ensures that code executes correctly even when other plugins add visual enhancements like line numbers or syntax styling.

### Code Styler compatibility

The plugin is fully compatible with the [Code Styler](https://github.com/mayurankv/Obsidian-Code-Styler) plugin. When Code Styler is installed and enabled, the plugin automatically detects its modified DOM structure and cleanly extracts the code without any line numbers or styling artifacts.

This compatibility system is extensible. Additional plugin extractors can be added to support other code-modifying plugins. See the extensibility section below for details.

## Installation

### From Obsidian Community Plugins

The plugin can be installed directly from Obsidian's community plugin browser.

1. Open **Settings → Community plugins**
2. Select **Browse** and search for **Codeblock Runner**
3. Select **Install**
4. Enable the plugin in **Settings → Community plugins**

### Manual installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release
2. Create a folder `<VaultFolder>/.obsidian/plugins/codeblock-runner/`
3. Copy the downloaded files into that folder
4. Reload Obsidian
5. Enable the plugin in **Settings → Community plugins**

## Requirements

-   **Desktop only**: This plugin uses Node.js child_process APIs and is not compatible with mobile devices. The plugin is marked as `isDesktopOnly: true` in the manifest.
-   **Language runtimes**: You must have the appropriate language runtime installed on your system (e.g., Python, Node.js, etc.). The runtime must be accessible via PATH or configured in settings.

## Security note

This plugin executes code on your system with the same permissions as Obsidian. Only run code blocks from trusted sources. The code has access to your filesystem and can perform any operation that your user account can perform.

The plugin includes timeout protection to prevent infinite loops, but it cannot prevent malicious code from performing destructive operations. Exercise caution when running code from unknown sources.

## Known limitations

The plugin has the following limitations:

-   Desktop only (requires Node.js child_process)
-   No stdin support (cannot interact with running programs)
-   No persistent state between executions
-   Working directory is the vault root
-   Execution is synchronous (Obsidian may freeze for long-running operations)

## Extensibility

The plugin is designed to be easily extensible. You can add support for new languages and additional plugin compatibility extractors.

### Adding a new language

To add support for a new language, create a language executor module in `src/languages/`.

**Step 1**: Create `src/languages/your-language.ts`

Define a `LanguageExecutor` object with language IDs, display name, optional settings, and a `buildCommand` function:

```typescript
import { LanguageExecutor } from "./types";

export const YourLanguageExecutor: LanguageExecutor = {
	ids: ["yourlang", "yl"],
	name: "Your Language",

	settings: [
		{
			key: "yourLangCommand",
			name: "Your Language command",
			description: "The command to use for executing Your Language",
			defaultValue: "yourlang",
			placeholder: "yourlang",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		return {
			command: settings.yourLangCommand || "yourlang",
			args: ["-e", code],
			usesTempFile: false,
		};
	},
};
```

**Step 2**: Register in `src/languages/index.ts`

Import and add your executor to the `LANGUAGE_EXECUTORS` array:

```typescript
import { YourLanguageExecutor } from "./your-language";

const LANGUAGE_EXECUTORS: LanguageExecutor[] = [
	PythonExecutor,
	YourLanguageExecutor,
];
```

**Step 3**: Build and test

Run `npm run build` and test your language executor. The plugin will automatically add settings for your language and recognize code blocks with your language IDs.

See `src/languages/README.md` for detailed examples and patterns for different types of languages (interpreted, compiled, etc.).

### Adding plugin compatibility

To add support for another plugin that modifies code block rendering, create a plugin extractor in `src/extractors/`.

**Step 1**: Create `src/extractors/your-plugin.ts`

Define a `PluginExtractor` object with detection and extraction logic:

```typescript
import { PluginExtractor } from "./types";

export const YourPluginExtractor: PluginExtractor = {
	name: "Your Plugin",
	pluginId: "your-plugin-id",

	detect: (codeElement) => {
		return codeElement.querySelector(".your-plugin-wrapper") !== null;
	},

	extract: (codeElement) => {
		const codeLines = codeElement.querySelectorAll(".your-plugin-line");
		if (codeLines.length > 0) {
			return Array.from(codeLines)
				.map((line) => line.textContent || "")
				.join("\n");
		}
		return "";
	},
};
```

**Step 2**: Register in `src/extractors/index.ts`

Import and add your extractor to the `PLUGIN_EXTRACTORS` array:

```typescript
import { YourPluginExtractor } from "./your-plugin";

const PLUGIN_EXTRACTORS: PluginExtractor[] = [
	CodeStylerExtractor,
	YourPluginExtractor,
];
```

**Step 3**: Build and test

Run `npm run build` and test with the target plugin enabled. The extractor will automatically activate when the plugin is detected and cleanly extract code from its modified DOM structure.

See `src/extractors/README.md` for detailed examples and debugging tips.

## Development

### Setup

```bash
npm install
```

### Build

```bash
# Development (watch mode)
npm run dev

# Production build
npm run build
```

### Manual testing

1. Build the plugin with `npm run build`
2. Copy `main.js`, `manifest.json`, and `styles.css` to `<Vault>/.obsidian/plugins/codeblock-runner/`
3. Reload Obsidian and enable the plugin in **Settings → Community plugins**

## Contributions

All contributions are welcome. Please create a pull request or open an issue on GitHub.

Please try to create bug reports and issues that are:

-   **Reproducible**: Include steps to recreate the issue
-   **Specific**: Include relevant details such as language, error messages, system information, etc.
-   **Unique**: Please do not duplicate existing open issues; add to the existing issue instead
-   **Scoped**: Please create a separate issue for each bug you have identified

Feature requests and suggestions for additional language support are welcome.

## License

Distributed under the MIT License. See `LICENSE` for more information.
