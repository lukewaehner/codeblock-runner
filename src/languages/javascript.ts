import { LanguageExecutor } from "./types";

export const JavaScriptExecutor: LanguageExecutor = {
	ids: ["javascript", "js", "node"],
	name: "JavaScript",

	settings: [
		{
			key: "javascriptCustomCommand",
			name: "Custom command (optional)",
			description:
				"Custom shell command to run JavaScript code. Leave empty to use default behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Examples:\n" +
				"  bun: bun run {file} {args}\n" +
				"  deno: deno run {file} {args}\n" +
				"  node with ES modules: node --experimental-modules {file} {args}",
			defaultValue: "",
			placeholder: "bun run {file} {args}",
			isTextArea: true,
		},
		{
			key: "nodeCommand",
			name: "Node.js command",
			description:
				"The command to use for executing JavaScript code (e.g., node, nodejs, or full path). Only used if custom command is empty.",
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
