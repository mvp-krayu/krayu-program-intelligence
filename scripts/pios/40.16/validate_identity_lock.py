#!/usr/bin/env python3
"""
Stream 40.16 — Identity Lock Validation
Recomputes SHA-256 for each artifact in baseline_identity_lock.json
and compares against recorded hashes.

Usage:
  python3 scripts/pios/40.16/validate_identity_lock.py
"""

import hashlib
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
LOCK_PATH = REPO_ROOT / "docs" / "pios" / "40.16" / "baseline" / "baseline_identity_lock.json"


def sha256(path):
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


def main():
    if not LOCK_PATH.exists():
        print(f"FAIL — identity lock not found: {LOCK_PATH}", file=sys.stderr)
        sys.exit(1)

    lock = json.loads(LOCK_PATH.read_text())
    results = []

    for entry in lock["artifacts"]:
        path = REPO_ROOT / entry["path"]
        expected = entry["sha256"]
        if not path.exists():
            results.append((entry["path"], "FAIL", "file not found"))
            continue
        actual = sha256(path)
        if actual == expected:
            results.append((entry["path"], "PASS", actual[:16]))
        else:
            results.append((entry["path"], "FAIL", f"expected {expected[:16]}, got {actual[:16]}"))

    for path, result, detail in results:
        print(f"[{result}] {path} ({detail})")

    overall = "PASS" if all(r == "PASS" for _, r, _ in results) else "FAIL"
    passed = sum(1 for _, r, _ in results if r == "PASS")
    print(f"\nIdentity lock: {overall} ({passed}/{len(results)})")

    if overall == "FAIL":
        sys.exit(1)


if __name__ == "__main__":
    main()
