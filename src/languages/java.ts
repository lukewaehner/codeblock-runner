import { LanguageExecutor } from "./types";

export const JavaExecutor: LanguageExecutor = {
	ids: ["java"],
	name: "Java",

	settings: [
		{
			key: "javaCustomCommand",
			name: "Custom command (optional)",
			description:
				"Custom shell command to compile and run Java code. Leave empty to use default behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Note: Your code should have 'public class Main' for simple execution.\n\n" +
				"Examples:\n" +
				"  simple: cp {file} {dir}/Main.java && javac {dir}/Main.java && java -cp {dir} Main {args}\n" +
				"  with maven: cd {dir} && mvn exec:java -Dexec.mainClass=Main -Dexec.args='{args}'",
			defaultValue: "",
			placeholder:
				"cp {file} {dir}/Main.java && javac {dir}/Main.java && java -cp {dir} Main {args}",
			isTextArea: true,
		},
		{
			key: "javacCommand",
			name: "Java compiler",
			description:
				"The Java compiler to use (e.g., javac, or full path). Only used if custom command is empty.",
			defaultValue: "javac",
			placeholder: "javac",
		},
		{
			key: "javaCommand",
			name: "Java runtime",
			description:
				"The Java runtime to use (e.g., java, or full path). Only used if custom command is empty.",
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
