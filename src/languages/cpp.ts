import { LanguageExecutor } from "./types";

export const CppExecutor: LanguageExecutor = {
	ids: ["cpp", "c++", "cxx"],
	name: "C++",

	settings: [
		{
			key: "cppCompiler",
			name: "C++ compiler",
			description:
				"The C++ compiler to use (e.g., g++, clang++, or full path)",
			defaultValue: "g++",
			placeholder: "g++",
		},
		{
			key: "cppFlags",
			name: "C++ compiler flags",
			description:
				"Additional flags to pass to the compiler (e.g., -std=c++17 -O2)",
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
