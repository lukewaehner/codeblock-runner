import { LanguageExecutor } from "./types";

export const CppExecutor: LanguageExecutor = {
	ids: ["cpp", "c++", "cxx"],
	name: "C++",

	settings: [
		{
			key: "cppCustomCommand",
			name: "Custom command (optional)",
			description:
				"Custom shell command to compile and run C++ code. Leave empty to use default behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Examples:\n" +
				"  clang++: clang++ -std=c++20 {file} -o {file}.out && {file}.out {args}\n" +
				"  g++ with warnings: g++ -std=c++17 -Wall -Wextra {file} -o {file}.out && {file}.out {args}",
			defaultValue: "",
			placeholder:
				"clang++ -std=c++20 {file} -o {file}.out && {file}.out {args}",
			isTextArea: true,
		},
		{
			key: "cppCompiler",
			name: "C++ compiler",
			description:
				"The C++ compiler to use (e.g., g++, clang++, or full path). Only used if custom command is empty.",
			defaultValue: "g++",
			placeholder: "g++",
		},
		{
			key: "cppFlags",
			name: "C++ compiler flags",
			description:
				"Additional flags to pass to the compiler (e.g., -std=c++17 -O2). Only used if custom command is empty.",
			defaultValue: "-std=c++17",
			placeholder: "-std=c++17",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// C++ always needs compilation with a temp file
		const compiler = settings.cppCompiler || "g++";
		const flags = settings.cppFlags || "-std=c++17";
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
			tempFileExtension: "cpp",
		};
	},
};
