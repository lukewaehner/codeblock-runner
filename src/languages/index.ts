// Language registry
// To add a new language, just import it here and add to the array

import { LanguageExecutor } from "./types";
import { PythonExecutor } from "./python";
import { JavaScriptExecutor } from "./javascript";
import { TypeScriptExecutor } from "./typescript";
import { JavaExecutor } from "./java";
import { CExecutor } from "./c";
import { CppExecutor } from "./cpp";
import { RustExecutor } from "./rust";
import { GoExecutor } from "./go";
import { RubyExecutor } from "./ruby";
import { PHPExecutor } from "./php";
import { ShellExecutor } from "./shell";

// Add new language executors here
// Ordered by popularity/common usage
const LANGUAGE_EXECUTORS: LanguageExecutor[] = [
	PythonExecutor,
	JavaScriptExecutor,
	TypeScriptExecutor,
	JavaExecutor,
	CExecutor,
	CppExecutor,
	GoExecutor,
	RustExecutor,
	RubyExecutor,
	PHPExecutor,
	ShellExecutor,
];

// Build lookup map: language id -> executor
const LANGUAGE_MAP = new Map<string, LanguageExecutor>();
for (const executor of LANGUAGE_EXECUTORS) {
	for (const id of executor.ids) {
		LANGUAGE_MAP.set(id.toLowerCase(), executor);
	}
}

export function getLanguageExecutor(
	languageId: string
): LanguageExecutor | undefined {
	return LANGUAGE_MAP.get(languageId.toLowerCase());
}

export function getSupportedLanguages(): string[] {
	return Array.from(new Set(LANGUAGE_EXECUTORS.map((e) => e.name))).sort();
}

export function getAllLanguageIds(): string[] {
	return Array.from(LANGUAGE_MAP.keys()).sort();
}

export function getAllLanguageSettings() {
	const allSettings: Record<string, string> = {};

	for (const executor of LANGUAGE_EXECUTORS) {
		if (executor.settings) {
			for (const setting of executor.settings) {
				allSettings[setting.key] = setting.defaultValue;
			}
		}
	}

	return allSettings;
}

export function getAllLanguageExecutors(): LanguageExecutor[] {
	return LANGUAGE_EXECUTORS;
}
