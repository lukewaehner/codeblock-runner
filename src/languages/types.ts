// Language executor interface
// Each language module must export an object matching this interface

export interface LanguageSetting {
	key: string; // settings key (e.g., "pythonCommand")
	name: string; // Display name (e.g., "Python command")
	description: string; // Help text
	defaultValue: string; // Default value
	placeholder?: string; // Input placeholder
	isTextArea?: boolean; // Use textarea for multiline input (e.g., custom commands)
}

export interface LanguageExecutor {
	// Language identifiers (e.g., ["python", "py"])
	ids: string[];

	// Display name (e.g., "Python")
	name: string;

	// Settings this language needs (e.g., interpreter path)
	settings?: LanguageSetting[];

	// Build command arguments for execution
	// Returns [command, ...args] where code will be inserted appropriately
	buildCommand: (
		settings: any,
		code: string,
		userArgs: string[]
	) => {
		command: string;
		args: string[];
		usesTempFile: boolean; // If true, executor will create temp file with code
		tempFileExtension?: string; // Extension for temp file (if usesTempFile is true)
	};
}
