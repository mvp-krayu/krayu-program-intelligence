#!/usr/bin/env bash
# GOV — Shared Contract Artifact Validator
# Parameterized replacement for per-stream validate_*_contract.sh scripts.
# Checks artifact presence, required field patterns, and launcher executability.
#
# Usage:
#   validate_contract.sh --stream-dir <path> [options]
#
# Options:
#   --stream-dir <path>          Directory containing stream artifacts (docs/pios/IG.x)
#   --required-files <f1,f2,...> Comma-separated artifact filenames that must exist
#   --required-patterns <p1,...> Comma-separated grep patterns that must match in stream-dir
#   --launcher <path>            Script path that must exist and be executable
#   --delegation-check <path>    Pattern or path that must appear in launcher (delegation chain)
#   --repo-root <path>           Repository root (default: git toplevel)
#
# Exit codes:
#   0 = PASS
#   1 = FAIL

set -euo pipefail

# ── ARGS ──────────────────────────────────────────────────────────────────────
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
STREAM_DIR=""
REQUIRED_FILES_RAW=""
REQUIRED_PATTERNS_RAW=""
LAUNCHER=""
DELEGATION_CHECK=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-root)         REPO_ROOT="$2";           shift 2 ;;
    --stream-dir)        STREAM_DIR="$2";          shift 2 ;;
    --required-files)    REQUIRED_FILES_RAW="$2";  shift 2 ;;
    --required-patterns) REQUIRED_PATTERNS_RAW="$2"; shift 2 ;;
    --launcher)          LAUNCHER="$2";            shift 2 ;;
    --delegation-check)  DELEGATION_CHECK="$2";    shift 2 ;;
    *) echo "ERROR: unknown option $1"; exit 1 ;;
  esac
done

[ -z "$STREAM_DIR" ] && { echo "ERROR: --stream-dir required"; echo "Usage: validate_contract.sh --stream-dir <path> [options]"; exit 1; }

# Resolve stream dir
[[ "$STREAM_DIR" == /* ]] || STREAM_DIR="$REPO_ROOT/$STREAM_DIR"

STREAM_NAME="$(basename "$STREAM_DIR")"
PASS=0; FAIL=0

echo "=== Shared Contract Validator: $STREAM_NAME ==="
echo "Stream dir: $STREAM_DIR"
echo ""

# Check stream dir exists
[ -d "$STREAM_DIR" ] && echo "  PASS  Stream dir exists: $STREAM_NAME" && PASS=$((PASS+1)) \
                     || { echo "  FAIL  Stream dir missing: $STREAM_DIR"; FAIL=$((FAIL+1)); }

# ── REQUIRED FILES ────────────────────────────────────────────────────────────
if [ -n "$REQUIRED_FILES_RAW" ]; then
  IFS=',' read -ra REQUIRED_FILES <<< "$REQUIRED_FILES_RAW"
  for fname in "${REQUIRED_FILES[@]}"; do
    fname="$(echo "$fname" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    [ -f "$STREAM_DIR/$fname" ] && R="PASS" || R="FAIL"
    echo "  $R  Artifact exists: $fname"
    [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
  done
fi

# ── REQUIRED PATTERNS ────────────────────────────────────────────────────────
if [ -n "$REQUIRED_PATTERNS_RAW" ]; then
  IFS=',' read -ra REQUIRED_PATTERNS <<< "$REQUIRED_PATTERNS_RAW"
  for pattern in "${REQUIRED_PATTERNS[@]}"; do
    pattern="$(echo "$pattern" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
    MATCH=$(grep -rl "$pattern" "$STREAM_DIR" 2>/dev/null || true)
    [ -n "$MATCH" ] && R="PASS" || R="FAIL"
    echo "  $R  Pattern found in artifacts: $pattern"
    [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
  done
fi

# ── LAUNCHER CHECK ───────────────────────────────────────────────────────────
if [ -n "$LAUNCHER" ]; then
  [[ "$LAUNCHER" == /* ]] || LAUNCHER="$REPO_ROOT/$LAUNCHER"
  [ -f "$LAUNCHER" ] && R_EXISTS="PASS" || R_EXISTS="FAIL"
  echo "  $R_EXISTS  Launcher exists: $(basename "$LAUNCHER")"
  [ "$R_EXISTS" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

  if [ -f "$LAUNCHER" ]; then
    [ -x "$LAUNCHER" ] && R="PASS" || R="FAIL"
    echo "  $R  Launcher is executable: $(basename "$LAUNCHER")"
    [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
  fi
fi

# ── DELEGATION CHAIN CHECK ───────────────────────────────────────────────────
if [ -n "$DELEGATION_CHECK" ] && [ -n "$LAUNCHER" ] && [ -f "$LAUNCHER" ]; then
  grep -q "$DELEGATION_CHECK" "$LAUNCHER" 2>/dev/null && R="PASS" || R="FAIL"
  echo "  $R  Delegation chain present: $DELEGATION_CHECK"
  [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
fi

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo ""
echo "=== Results ==="
echo "PASS: $PASS / FAIL: $FAIL"
[ "$FAIL" -eq 0 ] && echo "VERDICT: PASS" && exit 0 || echo "VERDICT: FAIL" && exit 1
