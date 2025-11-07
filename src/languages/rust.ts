import { LanguageExecutor } from "./types";

export const RustExecutor: LanguageExecutor = {
	ids: ["rust", "rs"],
	name: "Rust",

	settings: [
		{
			key: "rustCustomCommand",
			name: "Custom command (optional)",
			description:
				"Custom shell command to compile and run Rust code. Leave empty to use default cargo behavior.\n\n" +
				"Available variables:\n" +
				"  {file} - path to temp file with your code\n" +
				"  {args} - command-line arguments\n" +
				"  {dir} - directory containing temp file\n\n" +
				"Examples:\n" +
				"  rustc: rustc {file} -o {file}.out && {file}.out {args} && rm {file}.out\n" +
				"  cargo with release: cd {dir} && cargo new --bin temp && cp {file} temp/src/main.rs && cd temp && cargo run --release -- {args}",
			defaultValue: "",
			placeholder: "rustc {file} -o {file}.out && {file}.out {args}",
			isTextArea: true,
		},
		{
			key: "cargoCommand",
			name: "Cargo command",
			description:
				"The Cargo command to use (e.g., cargo, or full path). Only used if custom command is empty.",
			defaultValue: "cargo",
			placeholder: "cargo",
		},
		{
			key: "rustEdition",
			name: "Rust edition",
			description:
				"Rust edition to use (e.g., 2021, 2018, 2015). Only used if custom command is empty.",
			defaultValue: "2021",
			placeholder: "2021",
		},
	],

	buildCommand: (settings, code, userArgs) => {
		// Rust uses cargo which requires a project structure
		// We'll create a minimal Cargo.toml and use cargo run
		const cargo = settings.cargoCommand || "cargo";
		const edition = settings.rustEdition || "2021";
		const userArgsStr = userArgs.join(" ");

		// $1 is the temp file path
		// Create a minimal Cargo project, run it, and clean up
		return {
			command: "/bin/sh",
			args: [
				"-c",
				`TEMP_FILE="$1" && ` +
					`DIR=$(dirname "$TEMP_FILE") && ` +
					`PROJ_DIR="$DIR/rust_temp_$$" && ` +
					`mkdir -p "$PROJ_DIR/src" && ` +
					`cp "$TEMP_FILE" "$PROJ_DIR/src/main.rs" && ` +
					`cat > "$PROJ_DIR/Cargo.toml" << 'CARGO_EOF'
[package]
name = "temp_runner"
version = "0.1.0"
edition = "${edition}"

[dependencies]
CARGO_EOF
` +
					`cd "$PROJ_DIR" && ${cargo} run --quiet ${userArgsStr}; ` +
					`EXIT_CODE=$?; ` +
					`cd - > /dev/null && rm -rf "$PROJ_DIR"; ` +
					`exit $EXIT_CODE`,
				"--",
			],
			usesTempFile: true,
			tempFileExtension: "rs",
		};
	},
};
