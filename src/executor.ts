import { spawn } from "child_process";
import { CodeRunnerSettings, ExecutionResult } from "./types";
import { LANGUAGE_COMMANDS } from "./languages";

export async function executeCode(
	code: string,
	language: string,
	settings: CodeRunnerSettings
): Promise<ExecutionResult> {
	const startTime = Date.now();

	return new Promise((resolve) => {
		const commandBuilder = LANGUAGE_COMMANDS[language.toLowerCase()];

		if (!commandBuilder) {
			resolve({
				stdout: "",
				stderr: `Unsupported language: ${language}\nCurrently supported: Python`,
				exitCode: 1,
				executionTime: 0,
				timedOut: false,
			});
			return;
		}

		const [command, ...baseArgs] = commandBuilder(settings);
		const args = [...baseArgs, code];

		let stdout = "";
		let stderr = "";
		let timedOut = false;

		const process = spawn(command, args);

		// Set up timeout
		const timeout = setTimeout(() => {
			timedOut = true;
			process.kill();
		}, settings.executionTimeout * 1000);

		process.stdout.on("data", (data) => {
			stdout += data.toString();
		});

		process.stderr.on("data", (data) => {
			stderr += data.toString();
		});

		process.on("error", (error) => {
			clearTimeout(timeout);
			resolve({
				stdout,
				stderr: `Failed to execute: ${error.message}\n\nMake sure ${command} is installed and in your PATH.`,
				exitCode: 1,
				executionTime: Date.now() - startTime,
				timedOut: false,
			});
		});

		process.on("close", (exitCode) => {
			clearTimeout(timeout);
			const executionTime = Date.now() - startTime;

			resolve({
				stdout,
				stderr: timedOut
					? `Execution timed out after ${settings.executionTimeout}s`
					: stderr,
				exitCode,
				executionTime,
				timedOut,
			});
		});
	});
}
