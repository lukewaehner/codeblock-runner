// Template for adding a new language executor
// Copy this file and customize for your language

import { LanguageExecutor } from "./types";

export const TemplateExecutor: LanguageExecutor = {
	// Language identifiers (markdown code block identifiers)
	// Example: ["python", "py"] means both ```python and ```py will work
	ids: ["your-language", "yl"],

	// Display name shown in Settings UI
	name: "Your Language",

	// Optional: Settings this language needs
	// Remove this entire section if your language doesn't need configuration
	settings: [
		{
			key: "yourLanguageCommand", // Unique key (e.g., "pythonCommand", "nodeCommand")
			name: "Your Language command", // Display name in settings
			description:
				"The command to execute your language (e.g., your-lang, /usr/bin/your-lang)",
			defaultValue: "your-lang", // Default command
			placeholder: "your-lang", // Placeholder text in input
		},
		// Add more settings if needed:
		// {
		//   key: "yourLanguageFlags",
		//   name: "Compiler flags",
		//   description: "Additional flags to pass to the compiler",
		//   defaultValue: "-O2",
		// },
	],

	// Build the execution command
	buildCommand: (settings, code, userArgs) => {
		// settings: User's plugin settings (access your settings via settings.yourLanguageCommand)
		// code: The actual code from the code block
		// userArgs: Array of user arguments (if they provided any)

		// OPTION 1: Inline execution (fast, good for quick snippets)
		// Use when your language supports inline code execution
		if (userArgs.length === 0) {
			return {
				command: settings.yourLanguageCommand || "your-lang",
				args: ["-e", code], // Adjust flags for your language
				usesTempFile: false,
			};
		}

		// OPTION 2: Temp file execution (needed for proper argv)
		// Use when user provides arguments or language requires files
		return {
			command: settings.yourLanguageCommand || "your-lang",
			args: [], // Executor will add: [tempFilePath, ...userArgs]
			usesTempFile: true,
			tempFileExtension: "yl", // File extension for your language
		};

		// OPTION 3: Always use temp file (for compiled languages)
		// Uncomment and customize if your language always needs compilation:
		/*
		return {
			command: "/bin/bash",
			args: [
				"-c",
				`compiler "$TEMP_FILE" -o "$TEMP_FILE.out" && "$TEMP_FILE.out" ${userArgs.join(" ")}`
			],
			usesTempFile: true,
			tempFileExtension: "yl",
		};
		*/
	},
};
