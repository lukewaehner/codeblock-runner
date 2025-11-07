import { CodeRunnerSettings } from "./types";
import { getAllLanguageSettings } from "./languages";

export const DEFAULT_SETTINGS: CodeRunnerSettings = {
	executionTimeout: 30,
	defaultArgs: "",
	...getAllLanguageSettings(), // Dynamically add language-specific settings
};
