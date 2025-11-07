export interface CodeRunnerSettings {
	pythonCommand: string;
	executionTimeout: number;
}

export interface ExecutionResult {
	stdout: string;
	stderr: string;
	exitCode: number | null;
	executionTime: number;
	timedOut: boolean;
}

export interface CodeExtractor {
	name: string;
	pluginId?: string; // Optional: Obsidian plugin ID to check if enabled
	detect: (codeElement: Element) => boolean;
	extract: (codeElement: Element) => string;
}
