import { LanguageExecutor } from "./types";

export const GoExecutor: LanguageExecutor = {
	ids: ["go", "golang"],
	name: "Go",

	settings: [
		{
			key: "goCustomCommand",
			name: "Custom command (optional)",
			description:
				"Custom shell command to run Go code. Leave empty to use default behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Examples:\n" +
				"  compile first: go build -o {file}.out {file} && {file}.out {args}\n" +
				"  with race detector: go run -race {file} {args}\n" +
				"  gccgo: gccgo {file} -o {file}.out && {file}.out {args}",
			defaultValue: "",
			placeholder: "go build -o {file}.out {file} && {file}.out {args}",
			isTextArea: true,
		},
		{
			key: "goCommand",
			name: "Go command",
			description:
				"The Go command to use (e.g., go, or full path). Only used if custom command is empty.",
			defaultValue: "go",
			placeholder: "go",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// Go can use 'go run' which compiles and runs in one step
		const goCmd = settings.goCommand || "go";
		const userArgsStr = userArgs.join(" ");

		// $1 is the temp file path
		return {
			command: "/bin/sh",
			args: ["-c", `${goCmd} run "$1" ${userArgsStr}`, "--"],
			usesTempFile: true,
			tempFileExtension: "go",
		};
	},
};
