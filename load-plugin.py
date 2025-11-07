#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import shutil
import sys
from pathlib import Path

# Default vault path (change once here)
DEFAULT_VAULT = "~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Second Brain"

REQUIRED = ["manifest.json", "main.js"]
OPTIONAL = ["styles.css"]

# Expands the path to the vault out of the user's home directory


def expand_path(p: str) -> Path:
    return Path(os.path.expandvars(os.path.expanduser(p))).resolve()


# Loads the manifest.json file from the source directory
def load_manifest(src: Path) -> dict:
    mf = src / "manifest.json"
    if not mf.exists():
        # Exit the program with an error message
        sys.exit(f"error: {mf} not found")
    # Load the manifest.json file from the source directory
    return json.loads(mf.read_text(encoding="utf-8"))


# Ensures that the directory exists
def ensure_dir(d: Path) -> None:
    # Create the directory if it doesn't exist
    d.mkdir(parents=True, exist_ok=True)


# Copies the required and optional files from the source directory to the destination directory
def copy_files(src: Path, dst: Path) -> None:
    # Clean the dest dir if exists
    if dst.exists():
        shutil.rmtree(dst)
    ensure_dir(dst)
    # Copy the required and optional files from the source directory to the destination directory
    for name in REQUIRED + OPTIONAL:
        s = src / name
        if s.exists():
            # Copy the file to the destination directory
            shutil.copy2(s, dst / name)


def main(argv: list[str]) -> int:
    # Gets the vault path from CLI or env
    vault_arg = argv[1] if len(argv) > 1 else os.environ.get(
        "OB_VAULT", DEFAULT_VAULT)

    # expand it out
    vault = expand_path(vault_arg)

    # Gets the source directory
    src = Path(__file__).parent.resolve()

    # Loads the manifest.json file from the source directory
    manifest = load_manifest(src)
    plugin_id = manifest.get("id", src.name)

    # Gets the destination directory
    dst = vault / ".obsidian" / "plugins" / plugin_id
    copy_files(src, dst)

    # Copies the required and optional files from the source directory to the destination directory
    print(f"Copied plugin to: {dst}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
