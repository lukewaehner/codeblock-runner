import { LanguageExecutor } from "./types";

export const GoExecutor: LanguageExecutor = {
	ids: ["go", "golang"],
	name: "Go",

	settings: [
		{
			key: "goCommand",
			name: "Go command",
			description: "The Go command to use (e.g., go, or full path)",
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
