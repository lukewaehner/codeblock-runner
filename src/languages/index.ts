// Language registry
// To add a new language, just import it here and add to the array

import { LanguageExecutor } from "./types";
import { PythonExecutor } from "./python";

// Add new language executors here
const LANGUAGE_EXECUTORS: LanguageExecutor[] = [
	PythonExecutor,
	// Import and add more languages here:
	// CExecutor,
	// CppExecutor,
	// RustExecutor,
	// JavaScriptExecutor,
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
	const allSettings: Record<string, any> = {};

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
