import { LanguageExecutor } from "./types";

export const TypeScriptExecutor: LanguageExecutor = {
	ids: ["typescript", "ts"],
	name: "TypeScript",

	settings: [
		{
			key: "tsNodeCommand",
			name: "ts-node command",
			description:
				"The ts-node command to use for executing TypeScript (e.g., ts-node, npx ts-node, or full path)",
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
