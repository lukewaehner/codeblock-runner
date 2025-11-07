import { LanguageExecutor } from "./types";

export const ShellExecutor: LanguageExecutor = {
	ids: ["bash", "sh", "shell", "zsh"],
	name: "Shell",

	settings: [
		{
			key: "shellCustomCommand",
			name: "Custom command (optional)",
			description:
				"Custom shell command to run shell scripts. Leave empty to use default behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Examples:\n" +
				"  zsh: /bin/zsh {file} {args}\n" +
				"  bash with strict mode: bash -euo pipefail {file} {args}\n" +
				"  fish: fish {file} {args}",
			defaultValue: "",
			placeholder: "/bin/zsh {file} {args}",
			isTextArea: true,
		},
		{
			key: "shellCommand",
			name: "Shell command",
			description:
				"The shell to use for executing scripts (e.g., /bin/bash, /bin/zsh, or /bin/sh). Only used if custom command is empty.",
			defaultValue: "/bin/bash",
			placeholder: "/bin/bash",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		const shell = settings.shellCommand || "/bin/bash";

		// If user provides arguments, use temp file for proper $1, $2, etc.
		if (userArgs.length > 0) {
			return {
				command: shell,
				args: [], // Temp file path and userArgs will be added by executor
				usesTempFile: true,
				tempFileExtension: "sh",
			};
		}

		// No arguments: use -c for inline execution (faster)
		return {
			command: shell,
			args: ["-c", code],
			usesTempFile: false,
		};
	},
};
