import { LanguageExecutor } from "./types";

export const JavaScriptExecutor: LanguageExecutor = {
	ids: ["javascript", "js", "node"],
	name: "JavaScript",

	settings: [
		{
			key: "nodeCommand",
			name: "Node.js command",
			description:
				"The command to use for executing JavaScript code (e.g., node, nodejs, or full path)",
			defaultValue: "node",
			placeholder: "node",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// If user provides arguments, use temp file for proper process.argv
		if (userArgs.length > 0) {
			return {
				command: settings.nodeCommand || "node",
				args: [], // Temp file path and userArgs will be added by executor
				usesTempFile: true,
				tempFileExtension: "js",
			};
		}

		// No arguments: use -e for inline execution (faster)
		return {
			command: settings.nodeCommand || "node",
			args: ["-e", code],
			usesTempFile: false,
		};
	},
};
