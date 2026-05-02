#!/usr/bin/env bash
set -euo pipefail

CLIENT=""
RUN=""
OUTPUT_DIR=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --client)   CLIENT="$2";     shift 2 ;;
    --run)      RUN="$2";        shift 2 ;;
    --output-dir) OUTPUT_DIR="$2"; shift 2 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$CLIENT" || -z "$RUN" ]]; then
  echo "Usage: lens_generate.sh --client <client> --run <run> [--output-dir <dir>]" >&2
  exit 1
fi

BASE_DIR="clients/${CLIENT}/psee/runs/${RUN}"
VAULT_DIR="${BASE_DIR}/vault"
SEMANTIC_DIR="${BASE_DIR}/semantic"
RENDERER="scripts/pios/lens_report_generator.py"

if [[ -z "$OUTPUT_DIR" ]]; then
  OUTPUT_DIR="${BASE_DIR}/reports"
fi

if [[ ! -d "$VAULT_DIR" ]]; then
  echo "ERROR: vault not found: ${VAULT_DIR}" >&2
  exit 1
fi

if [[ ! -d "$SEMANTIC_DIR" ]]; then
  echo "ERROR: semantic bundle not found: ${SEMANTIC_DIR}" >&2
  exit 1
fi

if [[ ! -f "$RENDERER" ]]; then
  echo "ERROR: renderer not found: ${RENDERER}" >&2
  exit 1
fi

python3 "$RENDERER" \
  --client "$CLIENT" \
  --run-id "$RUN" \
  --package-dir "$VAULT_DIR" \
  --semantic-bundle-dir "$SEMANTIC_DIR" \
  --output-dir "$OUTPUT_DIR"

echo ""
echo "Output: $(realpath "$OUTPUT_DIR")"
echo "Reports:"
find "$OUTPUT_DIR" -maxdepth 1 -name "*.html" | sort | while read -r f; do
  echo "  $f"
done
