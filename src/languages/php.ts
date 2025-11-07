import { LanguageExecutor } from "./types";

export const PHPExecutor: LanguageExecutor = {
	ids: ["php"],
	name: "PHP",

	settings: [
		{
			key: "phpCustomCommand",
			name: "Custom command (optional)",
			description:
				"Custom shell command to run PHP code. Leave empty to use default behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Examples:\n" +
				"  with specific version: php8.2 {file} {args}\n" +
				"  with opcache: php -d opcache.enable_cli=1 {file} {args}\n" +
				"  hhvm: hhvm {file} {args}",
			defaultValue: "",
			placeholder: "php8.2 {file} {args}",
			isTextArea: true,
		},
		{
			key: "phpCommand",
			name: "PHP command",
			description:
				"The command to use for executing PHP code (e.g., php, or full path). Only used if custom command is empty.",
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
