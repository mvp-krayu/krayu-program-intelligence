#!/bin/bash

# scan_repository.sh
# Contract: INT-04-40.2-RUNTIME-EXTRACTION
# Stream:   40.2 — PiOS Evidence Connectors Layer
#
# Purpose:
#   Replicates the exact file discovery logic from INT-03-40.2-GITHUB-INTAKE.
#   Produces a sorted list of all files in the repository, excluding .git.
#
# Usage:
#   ./scripts/pios/40.2/scan_repository.sh [REPO_ROOT]
#
# Output:
#   Prints relative file paths to stdout, one per line, sorted.
#   Optionally writes to docs/pios/40.2/scan_output.txt if --save flag is set.
#
# Expected result: 106 files

set -euo pipefail

REPO_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
SAVE=false

for arg in "$@"; do
  if [ "$arg" = "--save" ]; then
    SAVE=true
  fi
done

if [ ! -d "$REPO_ROOT" ]; then
  echo "ERROR: Repository root not found: $REPO_ROOT" >&2
  exit 1
fi

# Exact find command used during INT-03 execution.
# Exclusions: .git directory, node_modules (none found but excluded per contract).
# Only files (not directories) are returned.
RESULTS=$(find "$REPO_ROOT" \
  -not -path '*/.git' \
  -not -path '*/.git/*' \
  -not -path '*/node_modules/*' \
  -not -type d \
  | sed "s|$REPO_ROOT/||" \
  | sort)

FILE_COUNT=$(echo "$RESULTS" | wc -l | tr -d ' ')

echo "$RESULTS"
echo "" >&2
echo "Total files discovered: $FILE_COUNT" >&2

if [ "$FILE_COUNT" -ne 106 ]; then
  echo "WARNING: Expected 106 files, found $FILE_COUNT." >&2
  echo "Repository state may have changed since INT-03 execution (2026-03-18)." >&2
else
  echo "File count verified: 106 PASS" >&2
fi

if [ "$SAVE" = true ]; then
  OUTPUT_PATH="$REPO_ROOT/docs/pios/40.2/scan_output.txt"
  echo "$RESULTS" > "$OUTPUT_PATH"
  echo "Scan output saved to: $OUTPUT_PATH" >&2
fi
