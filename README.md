# Codeblock Runner

Execute code blocks directly in Obsidian and view output in a modal window. Perfect for students taking coding classes, quick prototyping, or testing small snippets.

## Features

-   **One-Click Execution**: Adds a "Run Code" button to every code block in reading view
-   **Instant Output**: View stdout, stderr, and execution time in a dismissible modal
-   **Language Support**: Currently supports Python (more languages coming soon)
-   **Error Handling**: Clearly displays errors and exit codes
-   **Timeout Protection**: Prevents infinite loops from hanging Obsidian

## Use Cases

Perfect for:

-   Testing code snippets while taking notes in coding classes
-   Quick Python experiments without leaving your notes
-   Learning to code with immediate feedback
-   Prototyping small scripts
-   Running examples from tutorials and documentation

## Installation

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from releases
2. Create a folder `<VaultFolder>/.obsidian/plugins/codeblock-runner/`
3. Copy the downloaded files into that folder
4. Reload Obsidian
5. Enable the plugin in **Settings → Community plugins**

## Usage

### Running Code

1. Write a code block in your note with a supported language (e.g., `python`)
2. Switch to **Reading View**
3. Click the **"Run Code"** button that appears on the code block
4. View the output in the modal that appears
5. Click outside the modal or press `Escape` to dismiss it

### Example

````markdown
```python
print("Hello from Obsidian!")
for i in range(5):
    print(f"Count: {i}")
```
````

Click "Run Code" and you'll see:

```
Hello from Obsidian!
Count: 0
Count: 1
Count: 2
Count: 3
Count: 4

Executed in 0.05s
```

### Error Handling

If your code has an error, it will be displayed in the output:

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

## Supported Languages

-   ✅ **Python** - Requires Python installed and in PATH (or configure path in settings)
-   🔜 **C** - Coming soon
-   🔜 **C++** - Coming soon
-   🔜 **Rust** - Coming soon

## Settings

### Python Path

By default, the plugin uses `python3` from your system PATH. If you need to use a specific Python installation:

1. Go to **Settings → Codeblock Runner**
2. Set **Python Command** to your desired path (e.g., `/usr/local/bin/python3.11` or `python`)

### Execution Timeout

Configure the maximum time (in seconds) a code block can run before being terminated. Default is 30 seconds.

## Requirements

-   **Desktop only**: This plugin uses Node.js child_process APIs and is not compatible with mobile devices
-   **Language Runtimes**: You must have the appropriate language runtime installed (e.g., Python, C compiler, etc.)

## Security Note

⚠️ **This plugin executes code on your system.** Only run code blocks from trusted sources. The code runs with the same permissions as Obsidian.

## Known Limitations

-   Desktop only (requires Node.js child_process)
-   No stdin support (can't interact with running programs)
-   No persistent state between executions
-   Working directory is the vault root

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

### Manual Testing

1. Build the plugin
2. Copy `main.js`, `manifest.json`, and `styles.css` to `<Vault>/.obsidian/plugins/codeblock-runner/`
3. Reload Obsidian and enable the plugin

## Feedback & Contributions

This is a personal project for coding classes, but feedback and contributions are welcome!

-   **Issues**: [GitHub Issues](https://github.com/lukewaehner/codeblock-runner/issues)
-   **Discussions**: [GitHub Discussions](https://github.com/lukewaehner/codeblock-runner/discussions)

## License

MIT
