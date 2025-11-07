import { LanguageExecutor } from "./types";

export const ShellExecutor: LanguageExecutor = {
	ids: ["bash", "sh", "shell", "zsh"],
	name: "Shell",

	settings: [
		{
			key: "shellCommand",
			name: "Shell command",
			description:
				"The shell to use for executing scripts (e.g., /bin/bash, /bin/zsh, or /bin/sh)",
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
