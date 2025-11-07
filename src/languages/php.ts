import { LanguageExecutor } from "./types";

export const PHPExecutor: LanguageExecutor = {
	ids: ["php"],
	name: "PHP",

	settings: [
		{
			key: "phpCommand",
			name: "PHP command",
			description:
				"The command to use for executing PHP code (e.g., php, or full path)",
			defaultValue: "php",
			placeholder: "php",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// If user provides arguments, use temp file for proper $argv
		if (userArgs.length > 0) {
			return {
				command: settings.phpCommand || "php",
				args: [], // Temp file path and userArgs will be added by executor
				usesTempFile: true,
				tempFileExtension: "php",
			};
		}

		// No arguments: use -r for inline execution (faster)
		return {
			command: settings.phpCommand || "php",
			args: ["-r", code],
			usesTempFile: false,
		};
	},
};
