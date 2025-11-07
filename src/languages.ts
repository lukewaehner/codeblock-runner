import { CodeRunnerSettings } from "./types";

// Map language identifiers to execution commands
export const LANGUAGE_COMMANDS: Record<
	string,
	(settings: CodeRunnerSettings) => string[]
> = {
	python: (settings) => [settings.pythonCommand, "-c"],
	py: (settings) => [settings.pythonCommand, "-c"],
};
