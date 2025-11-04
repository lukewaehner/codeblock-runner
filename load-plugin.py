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


def expand_path(p: str) -> Path:
	return Path(os.path.expandvars(os.path.expanduser(p))).resolve()


def load_manifest(src: Path) -> dict:
	mf = src / "manifest.json"
	if not mf.exists():
		sys.exit(f"error: {mf} not found")
	return json.loads(mf.read_text(encoding="utf-8"))


def ensure_dir(d: Path) -> None:
	d.mkdir(parents=True, exist_ok=True)


def copy_files(src: Path, dst: Path) -> None:
	if dst.exists():
		shutil.rmtree(dst)
	ensure_dir(dst)
	for name in REQUIRED + OPTIONAL:
		s = src / name
		if s.exists():
			shutil.copy2(s, dst / name)


def main(argv: list[str]) -> int:
	vault_arg = argv[1] if len(argv) > 1 else os.environ.get("OB_VAULT", DEFAULT_VAULT)

	vault = expand_path(vault_arg)
	src = Path(__file__).parent.resolve()
	manifest = load_manifest(src)
	plugin_id = manifest.get("id", src.name)

	dst = vault / ".obsidian" / "plugins" / plugin_id
	copy_files(src, dst)

	print(f"Copied plugin to: {dst}")
	return 0


if __name__ == "__main__":
	raise SystemExit(main(sys.argv))
