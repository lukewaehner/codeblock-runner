# Source Structure

This directory contains the modularized source code for the Codeblock Runner plugin.

## Architecture

```
src/
├── main.ts              # Plugin entry point & lifecycle (127 lines)
├── types.ts             # TypeScript interfaces & types (19 lines)
├── settings.ts          # Settings defaults (6 lines)
├── languages.ts         # Language command mappings (10 lines)
├── extractors.ts        # Code extraction system (104 lines)
├── executor.ts          # Code execution logic (75 lines)
└── ui/
    ├── OutputModal.ts   # Output display modal (79 lines)
    └── SettingsTab.ts   # Settings UI (64 lines)
```

## Module Responsibilities

### `main.ts`

-   Plugin lifecycle (onload, onunload)
-   Registers markdown post processor
-   Coordinates between modules
-   Minimal, focused on orchestration

### `types.ts`

-   All TypeScript interfaces
-   Shared types across modules
-   Single source of truth for data structures

### `settings.ts`

-   Default settings values
-   Settings interface (defined in types.ts)

### `languages.ts`

-   Maps language identifiers to execution commands
-   Easy to extend for new languages (C, C++, Rust)

### `extractors.ts`

-   Plugin-aware code extraction
-   Handles code-styler and other plugins
-   Dynamic plugin detection
-   Fallback extraction for standard code blocks

### `executor.ts`

-   Spawns child processes to run code
-   Handles timeouts, stdout, stderr
-   Returns structured execution results

### `ui/OutputModal.ts`

-   Displays execution results
-   Shows stdout, stderr, timing, exit codes
-   Styled modal interface

### `ui/SettingsTab.ts`

-   Plugin settings interface
-   Python path configuration
-   Timeout settings
-   Language support information

## Design Principles

Following AGENTS.md guidelines:

-   ✅ Each module < 200 lines (largest is 127)
-   ✅ Clear separation of concerns
-   ✅ Single responsibility per file
-   ✅ Easy to understand and maintain
-   ✅ Easy to extend (add new languages/extractors)
