import { LanguageExecutor } from "./types";

export const PythonExecutor: LanguageExecutor = {
	ids: ["python", "py"],
	name: "Python",

	settings: [
		{
			key: "pythonCommand",
			name: "Python command",
			description:
				"The command to use for executing Python code (e.g., python3, python, or full path)",
			defaultValue: "python3",
			placeholder: "python3",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// If user provides arguments, use temp file for proper sys.argv
		if (userArgs.length > 0) {
			return {
				command: settings.pythonCommand || "python3",
				args: [], // Temp file path and userArgs will be added by executor
				usesTempFile: true,
				tempFileExtension: "py",
			};
		}

		// No arguments: use -c for inline execution (faster)
		return {
			command: settings.pythonCommand || "python3",
			args: ["-c", code],
			usesTempFile: false,
		};
	},
};
