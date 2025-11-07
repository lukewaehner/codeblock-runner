import { LanguageExecutor } from "./types";

export const CExecutor: LanguageExecutor = {
	ids: ["c"],
	name: "C",

	settings: [
		{
			key: "cCustomCommand",
			name: "Custom command (optional)",
			description:
				"Custom shell command to compile and run C code. Leave empty to use default behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Examples:\n" +
				"  clang: clang -std=c11 {file} -o {file}.out && {file}.out {args}\n" +
				"  gcc with warnings: gcc -std=c11 -Wall -Wextra {file} -o {file}.out && {file}.out {args}",
			defaultValue: "",
			placeholder:
				"clang -std=c11 {file} -o {file}.out && {file}.out {args}",
			isTextArea: true,
		},
		{
			key: "cCompiler",
			name: "C compiler",
			description:
				"The C compiler to use (e.g., gcc, clang, or full path). Only used if custom command is empty.",
			defaultValue: "gcc",
			placeholder: "gcc",
		},
		{
			key: "cFlags",
			name: "C compiler flags",
			description:
				"Additional flags to pass to the compiler (e.g., -std=c11 -O2). Only used if custom command is empty.",
			defaultValue: "-std=c11",
			placeholder: "-std=c11",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// C always needs compilation with a temp file
		const compiler = settings.cCompiler || "gcc";
		const flags = settings.cFlags || "-std=c11";
		const userArgsStr = userArgs.join(" ");

		// $1 is the temp file path passed by the executor
		// Compile, run, and clean up
		return {
			command: "/bin/sh",
			args: [
				"-c",
				`${compiler} ${flags} "$1" -o "$1.out" && "$1.out" ${userArgsStr}; EXIT_CODE=$?; rm -f "$1.out"; exit $EXIT_CODE`,
				"--", // This separates the -c script from positional parameters
			],
			usesTempFile: true,
			tempFileExtension: "c",
		};
	},
};
