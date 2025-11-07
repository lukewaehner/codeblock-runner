import { LanguageExecutor } from "./types";

export const RubyExecutor: LanguageExecutor = {
	ids: ["ruby", "rb"],
	name: "Ruby",

	settings: [
		{
			key: "rubyCommand",
			name: "Ruby command",
			description:
				"The command to use for executing Ruby code (e.g., ruby, or full path)",
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
