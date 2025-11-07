import { LanguageExecutor } from "./types";

export const CExecutor: LanguageExecutor = {
	ids: ["c"],
	name: "C",

	settings: [
		{
			key: "cCompiler",
			name: "C compiler",
			description:
				"The C compiler to use (e.g., gcc, clang, or full path)",
			defaultValue: "gcc",
			placeholder: "gcc",
		},
		{
			key: "cFlags",
			name: "C compiler flags",
			description:
				"Additional flags to pass to the compiler (e.g., -std=c11 -O2)",
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
