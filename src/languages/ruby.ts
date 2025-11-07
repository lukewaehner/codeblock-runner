import { LanguageExecutor } from "./types";

export const RubyExecutor: LanguageExecutor = {
	ids: ["ruby", "rb"],
	name: "Ruby",

	settings: [
		{
			key: "rubyCustomCommand",
			name: "Custom command (optional)",
			description:
				"Custom shell command to run Ruby code. Leave empty to use default behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Examples:\n" +
				"  jruby: jruby {file} {args}\n" +
				"  with warnings: ruby -w {file} {args}\n" +
				"  bundled: bundle exec ruby {file} {args}",
			defaultValue: "",
			placeholder: "jruby {file} {args}",
			isTextArea: true,
		},
		{
			key: "rubyCommand",
			name: "Ruby command",
			description:
				"The command to use for executing Ruby code (e.g., ruby, or full path). Only used if custom command is empty.",
			defaultValue: "ruby",
			placeholder: "ruby",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// If user provides arguments, use temp file for proper ARGV
		if (userArgs.length > 0) {
			return {
				command: settings.rubyCommand || "ruby",
				args: [], // Temp file path and userArgs will be added by executor
				usesTempFile: true,
				tempFileExtension: "rb",
			};
		}

		// No arguments: use -e for inline execution (faster)
		return {
			command: settings.rubyCommand || "ruby",
			args: ["-e", code],
			usesTempFile: false,
		};
	},
};
