import { LanguageExecutor } from "./types";

export const TypeScriptExecutor: LanguageExecutor = {
	ids: ["typescript", "ts"],
	name: "TypeScript",

	settings: [
		{
			key: "typescriptCustomCommand",
			name: "Custom command (optional)",
			description:
				"Custom shell command to run TypeScript code. Leave empty to use default behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Examples:\n" +
				"  bun: bun run {file} {args}\n" +
				"  deno: deno run {file} {args}\n" +
				"  tsx: tsx {file} {args}\n" +
				"  compile with tsc: tsc {file} --outFile {file}.js && node {file}.js {args}",
			defaultValue: "",
			placeholder: "tsx {file} {args}",
			isTextArea: true,
		},
		{
			key: "tsNodeCommand",
			name: "ts-node command",
			description:
				"The ts-node command to use for executing TypeScript (e.g., ts-node, npx ts-node, or full path). Only used if custom command is empty.",
			defaultValue: "ts-node",
			placeholder: "ts-node",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// TypeScript requires ts-node or similar
		const tsNode = settings.tsNodeCommand || "ts-node";
		const userArgsStr = userArgs.join(" ");

		// If user provides arguments, use temp file
		if (userArgs.length > 0) {
			return {
				command: "/bin/sh",
				args: ["-c", `${tsNode} "$1" ${userArgsStr}`, "--"],
				usesTempFile: true,
				tempFileExtension: "ts",
			};
		}

		// No arguments: use -e for inline execution if supported
		// Note: ts-node doesn't support -e, so always use temp file
		return {
			command: tsNode,
			args: [],
			usesTempFile: true,
			tempFileExtension: "ts",
		};
	},
};
