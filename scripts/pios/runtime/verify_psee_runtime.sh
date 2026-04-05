#!/usr/bin/env bash
# PSEE-RUNTIME.2 — Runtime Verification
#
# Usage:
#   verify_psee_runtime.sh <runtime_dir>
#
# Checks:
#   1. Required runtime files present
#   2. manifest.json present and parseable
#   3. operator_case_view.md hash matches manifest
#   4. Pipeline script does not reference forbidden input paths
#   5. All produced files are within the runtime target namespace
#
# Exit codes:
#   0 = VERIFICATION_COMPLETE
#   1 = FAIL

set -euo pipefail

RUNTIME_DIR="${1:-}"
if [ -z "$RUNTIME_DIR" ]; then
  echo "ERROR: usage: verify_psee_runtime.sh <runtime_dir>"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
[[ "$RUNTIME_DIR" != /* ]] && RUNTIME_DIR="$REPO_ROOT/$RUNTIME_DIR"

PIPELINE_SCRIPT="$REPO_ROOT/scripts/pios/runtime/run_psee_pipeline.sh"

PASS=0; FAIL=0
VIOLATIONS=()

pass() { echo "  PASS  $1"; PASS=$((PASS+1)); }
fail() { echo "  FAIL  $1"; FAIL=$((FAIL+1)); VIOLATIONS+=("$1"); }

echo "=== PSEE-RUNTIME Verification ==="
echo "Runtime dir: $RUNTIME_DIR"
echo ""

# ── CHECK 1: REQUIRED FILES PRESENT ──────────────────────────────────────────
echo "--- Check 1: Required runtime files present ---"

for f in \
  "operator_case_view.md" \
  "manifest.json" \
  "execution.log"; do
  [ -f "$RUNTIME_DIR/$f" ] && pass "Present: $f" || fail "Missing: $f"
done
echo ""

# ── CHECK 2: MANIFEST PARSEABLE ───────────────────────────────────────────────
echo "--- Check 2: manifest.json parseable ---"

MANIFEST="$RUNTIME_DIR/manifest.json"
if [ -f "$MANIFEST" ]; then
  jq '.' "$MANIFEST" > /dev/null 2>&1 && pass "manifest.json is valid JSON" || fail "manifest.json is not valid JSON"
  MANIFEST_FILE=$(jq -r '.files | keys[0]' "$MANIFEST" 2>/dev/null || echo "")
  [ -n "$MANIFEST_FILE" ] && pass "Manifest references file: $MANIFEST_FILE" || fail "Manifest has no file entries"
else
  fail "manifest.json absent — cannot check"
fi
echo ""

# ── CHECK 3: HASH VERIFICATION ────────────────────────────────────────────────
echo "--- Check 3: operator_case_view.md hash matches manifest ---"

OCV="$RUNTIME_DIR/operator_case_view.md"
if [ -f "$OCV" ] && [ -f "$MANIFEST" ]; then
  EXPECTED_HASH=$(jq -r '.files["operator_case_view.md"].sha256 // empty' "$MANIFEST" 2>/dev/null || echo "")
  ACTUAL_HASH=$(shasum -a 256 "$OCV" | awk '{print $1}')

  if [ -z "$EXPECTED_HASH" ]; then
    fail "No sha256 for operator_case_view.md in manifest"
  elif [ "$EXPECTED_HASH" = "$ACTUAL_HASH" ]; then
    pass "Hash match: operator_case_view.md sha256=${ACTUAL_HASH:0:16}..."
  else
    fail "Hash mismatch: expected=${EXPECTED_HASH:0:16}... actual=${ACTUAL_HASH:0:16}..."
  fi
else
  fail "Cannot verify hash — operator_case_view.md or manifest.json absent"
fi
echo ""

# ── CHECK 4: PIPELINE SCRIPT FORBIDDEN PATH CHECK ────────────────────────────
echo "--- Check 4: Pipeline script forbidden path check ---"

if [ -f "$PIPELINE_SCRIPT" ]; then
  FORBIDDEN_HITS=()
  for forbidden in "docs/pios/IG.5" "docs/pios/IG.6" "docs/pios/IG.7" \
                   "docs/pios/PSEE.3" "docs/pios/PSEE.3B" "docs/pios/PSEE.UI" \
                   "_replay_"; do
    # Check for operational reads of forbidden paths: jq, cat, <, or variable assignment
    # that reference the path as an actual input — not guard declarations.
    # Guard declarations are lines that ONLY assign the path to a shell variable or
    # list it inside a for-loop body (ending with " \" or ""; do").
    # Strategy: grep for file-read constructs on the forbidden path.
    HIT=$(grep -nE "(jq|cat|<|source|\.)\s.*$forbidden|$forbidden.*\s*[<(]" \
          "$PIPELINE_SCRIPT" 2>/dev/null | \
          grep -v 'FAIL_SAFE_STOP' | \
          grep -v 'for forbidden' || true)
    [ -n "$HIT" ] && FORBIDDEN_HITS+=("$forbidden: $(echo "$HIT" | head -1)")
  done

  if [ ${#FORBIDDEN_HITS[@]} -eq 0 ]; then
    pass "No forbidden input paths referenced in pipeline script"
  else
    for hit in "${FORBIDDEN_HITS[@]}"; do
      fail "Forbidden path in pipeline script: $hit"
    done
  fi
else
  fail "Pipeline script not found: $PIPELINE_SCRIPT"
fi
echo ""

# ── CHECK 5: OUTPUT NAMESPACE COMPLIANCE ──────────────────────────────────────
echo "--- Check 5: Output namespace compliance ---"

EXPECTED_NS="docs/pios/PSEE.RUNTIME/"
if [ -f "$PIPELINE_SCRIPT" ]; then
  # Verify script writes only to PSEE.RUNTIME path
  WRITE_PATHS=$(grep -E 'OUT_ROOT|">\s*"\$|cat\s*>' "$PIPELINE_SCRIPT" 2>/dev/null | \
                grep -v "PSEE.RUNTIME\|OUT_ROOT\|\$OUT_ROOT\|\$OPERATOR_VIEW\|\$EXEC_LOG\|\$MANIFEST" || true)
  if [ -z "$WRITE_PATHS" ]; then
    pass "Pipeline script write paths consistent with PSEE.RUNTIME namespace"
  else
    fail "Unexpected write paths in pipeline script: $WRITE_PATHS"
  fi

  # Verify output files exist in the correct namespace
  for f in operator_case_view.md manifest.json execution.log; do
    ACTUAL_PATH=$(realpath "$RUNTIME_DIR/$f" 2>/dev/null || echo "")
    if [[ "$ACTUAL_PATH" == *"PSEE.RUNTIME"* ]]; then
      pass "Output in correct namespace: $f"
    else
      fail "Output outside PSEE.RUNTIME namespace: $f → $ACTUAL_PATH"
    fi
  done
else
  fail "Cannot check namespace compliance — pipeline script absent"
fi
echo ""

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════"
echo "Runtime dir: $RUNTIME_DIR"
echo "PASS: $PASS"
echo "FAIL: $FAIL"

if [ "$FAIL" -eq 0 ]; then
  echo ""
  echo "VERIFICATION_COMPLETE"
  exit 0
else
  echo ""
  echo "VIOLATIONS:"
  for v in "${VIOLATIONS[@]}"; do echo "  ✗ $v"; done
  echo ""
  echo "VERIFICATION_FAIL"
  exit 1
fi
