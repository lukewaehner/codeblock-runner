import { spawn } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { CodeRunnerSettings, ExecutionResult } from "./types";
import { getLanguageExecutor } from "./languages";

export async function executeCode(
	code: string,
	language: string,
	settings: CodeRunnerSettings,
	userArgs?: string
): Promise<ExecutionResult> {
	const startTime = Date.now();

	return new Promise((resolve) => {
		const executor = getLanguageExecutor(language);

		if (!executor) {
			resolve({
				stdout: "",
				stderr: `Unsupported language: ${language}\nCheck Settings for supported languages.`,
				exitCode: 1,
				executionTime: 0,
				timedOut: false,
			});
			return;
		}

		// Parse user arguments (space-separated)
		const parsedArgs =
			userArgs && userArgs.trim() ? userArgs.trim().split(/\s+/) : [];

		// Build command using language-specific executor
		const commandSpec = executor.buildCommand(settings, code, parsedArgs);

		let args: string[];
		let tempFile: string | null = null;

		if (commandSpec.usesTempFile) {
			// Create temporary file
			const ext = commandSpec.tempFileExtension || "txt";
			tempFile = join(tmpdir(), `obsidian-code-${Date.now()}.${ext}`);
			writeFileSync(tempFile, code, "utf8");

			// Add temp file path and user args
			args = [...commandSpec.args, tempFile, ...parsedArgs];
		} else {
			// Use provided args (code is already in them)
			args = commandSpec.args;
		}

		const command = commandSpec.command;

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
			if (tempFile) {
				try {
					unlinkSync(tempFile);
				} catch {}
			}
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

			// Clean up temp file
			if (tempFile) {
				try {
					unlinkSync(tempFile);
				} catch {}
			}

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
