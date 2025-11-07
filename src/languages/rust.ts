import { LanguageExecutor } from "./types";

export const RustExecutor: LanguageExecutor = {
	ids: ["rust", "rs"],
	name: "Rust",

	settings: [
		{
			key: "rustcCommand",
			name: "Rust compiler",
			description: "The Rust compiler to use (e.g., rustc, or full path)",
			defaultValue: "rustc",
			placeholder: "rustc",
		},
		{
			key: "rustFlags",
			name: "Rust compiler flags",
			description:
				"Additional flags to pass to rustc (e.g., -O, --edition 2021)",
			defaultValue: "",
			placeholder: "-O",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// Rust always needs compilation with a temp file
		const compiler = settings.rustcCommand || "rustc";
		const flags = settings.rustFlags || "";
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
			tempFileExtension: "rs",
		};
	},
};
