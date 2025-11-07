import { LanguageExecutor } from "./types";

export const PythonExecutor: LanguageExecutor = {
	ids: ["python", "py"],
	name: "Python",

	settings: [
		{
			key: "pythonCustomCommand",
			name: "Custom command (optional)",
			description:
				"Custom shell command to run Python code. Leave empty to use default behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Examples:\n" +
				"  pypy3: pypy3 {file} {args}\n" +
				"  python with optimization: python3 -O {file} {args}\n" +
				"  ipython: ipython {file} -- {args}",
			defaultValue: "",
			placeholder: "pypy3 {file} {args}",
			isTextArea: true,
		},
		{
			key: "pythonCommand",
			name: "Python command",
			description:
				"The command to use for executing Python code (e.g., python3, python, or full path). Only used if custom command is empty.",
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
