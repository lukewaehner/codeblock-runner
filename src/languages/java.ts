import { LanguageExecutor } from "./types";

export const JavaExecutor: LanguageExecutor = {
	ids: ["java"],
	name: "Java",

	settings: [
		{
			key: "javacCommand",
			name: "Java compiler",
			description: "The Java compiler to use (e.g., javac, or full path)",
			defaultValue: "javac",
			placeholder: "javac",
		},
		{
			key: "javaCommand",
			name: "Java runtime",
			description: "The Java runtime to use (e.g., java, or full path)",
			defaultValue: "java",
			placeholder: "java",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// Java always needs compilation with a temp file
		// Extract class name from code (look for 'public class ClassName')
		const classNameMatch = code.match(/public\s+class\s+(\w+)/);
		const className = classNameMatch ? classNameMatch[1] : "Main";

		const compiler = settings.javacCommand || "javac";
		const runtime = settings.javaCommand || "java";
		const userArgsStr = userArgs.join(" ");

		// $1 is the temp file path
		// Compile, run with proper classpath, and clean up
		return {
			command: "/bin/sh",
			args: [
				"-c",
				`TEMP_FILE="$1" && ` +
					`DIR=$(dirname "$TEMP_FILE") && ` +
					`cp "$TEMP_FILE" "$DIR/${className}.java" && ` +
					`${compiler} "$DIR/${className}.java" && ` +
					`${runtime} -cp "$DIR" ${className} ${userArgsStr}; ` +
					`EXIT_CODE=$?; ` +
					`rm -f "$DIR/${className}.java" "$DIR/${className}.class"; ` +
					`exit $EXIT_CODE`,
				"--",
			],
			usesTempFile: true,
			tempFileExtension: "java",
		};
	},
};
