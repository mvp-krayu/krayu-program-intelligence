#!/usr/bin/env bash
# GOV — Shared Zero-Delta Comparator
# Compares two run namespaces after provenance normalization.
# No hardcoded run names. Applies full IG normalization rules (N-01..N-10).
#
# Usage:
#   validate_zero_delta.sh <reference_run> <test_run> [--repo-root <path>]
#
# Arguments:
#   <reference_run>  Absolute path, or run directory name (resolved under docs/pios/runs/)
#   <test_run>       Same
#
# Exit codes:
#   0 = PASS (zero delta)
#   1 = FAIL (drift detected or missing namespace)

set -euo pipefail

# ── ARGS ─────────────────────────────────────────────────────────────────────
REF_ARG=""
TEST_ARG=""
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-root) REPO_ROOT="$2"; shift 2 ;;
    -*) echo "ERROR: unknown option $1"; exit 1 ;;
    *)
      if [ -z "$REF_ARG" ]; then REF_ARG="$1"
      elif [ -z "$TEST_ARG" ]; then TEST_ARG="$1"
      else echo "ERROR: unexpected argument $1"; exit 1
      fi
      shift ;;
  esac
done

[ -z "$REF_ARG" ] && { echo "ERROR: reference_run required"; echo "Usage: validate_zero_delta.sh <reference_run> <test_run> [--repo-root <path>]"; exit 1; }
[ -z "$TEST_ARG" ] && { echo "ERROR: test_run required"; echo "Usage: validate_zero_delta.sh <reference_run> <test_run> [--repo-root <path>]"; exit 1; }

RUNS_DIR="$REPO_ROOT/docs/pios/runs"

# Resolve paths — accept absolute or bare run names
[[ "$REF_ARG" == /* ]] && REF="$REF_ARG" || REF="$RUNS_DIR/$REF_ARG"
[[ "$TEST_ARG" == /* ]] && TEST="$TEST_ARG" || TEST="$RUNS_DIR/$TEST_ARG"

REF_NAME="$(basename "$REF")"
TEST_NAME="$(basename "$TEST")"

# ── NORMALIZATION (N-01..N-10) ────────────────────────────────────────────────
# Strips all provenance fields. Normalizes all run path references.
normalize() {
  sed -E \
    -e 's/run_id: .*/run_id: __NORM__/' \
    -e 's/contract: .*/contract: __NORM__/' \
    -e 's/upstream_contract: .*/upstream_contract: __NORM__/' \
    -e 's/date: [0-9]{4}-[0-9]{2}-[0-9]{2}/date: __NORM__/' \
    -e 's/date: .*/date: __NORM__/' \
    -e 's/regeneration_context: .*/regeneration_context: __NORM__/' \
    -e 's/adapter_binding: .*/adapter_binding: __NORM__/' \
    -e 's/github_[a-z_]+: .*/github_field: __NORM__/' \
    -e 's/jira_[a-z_]+: .*/jira_field: __NORM__/' \
    -e 's/orchestration_[a-z_]+: .*/orch_field: __NORM__/' \
    -e 's/source_profile_[a-z_]+: .*/profile_field: __NORM__/' \
    -e 's/resolved\.[a-z_]+: .*/resolved_field: __NORM__/' \
    -e 's|runs/run_[a-z0-9_]+/|runs/__RUN__/|g' \
    -e 's/run_[0-9]{2}_[a-z_]+/__RUN__/g' \
    "$1"
}

# ── MAIN ──────────────────────────────────────────────────────────────────────
PASS=0; FAIL=0
DRIFT_FILES=()

echo "=== Shared Zero-Delta Comparator ==="
echo "Reference: $REF_NAME"
echo "Test run:  $TEST_NAME"
echo ""

# Namespace existence
[ -d "$REF" ] && echo "  PASS  Reference namespace present: $REF_NAME" && PASS=$((PASS+1)) \
              || { echo "  FAIL  Reference namespace missing: $REF"; FAIL=$((FAIL+1)); }
[ -d "$TEST" ] && echo "  PASS  Test namespace present: $TEST_NAME" && PASS=$((PASS+1)) \
               || { echo "  FAIL  Test namespace missing: $TEST"; FAIL=$((FAIL+1)); exit 1; }

# Find governed artifact dirs in reference
REF_SUBDIRS=()
for sub in 40.2 40.3 40.4; do
  [ -d "$REF/$sub" ] && REF_SUBDIRS+=("$REF/$sub")
done

if [ ${#REF_SUBDIRS[@]} -eq 0 ]; then
  echo "  FAIL  No governed artifact dirs (40.2/40.3/40.4) found in reference"
  FAIL=$((FAIL+1))
  echo ""
  echo "PASS: $PASS / FAIL: $FAIL"
  echo "VERDICT: DRIFT_DETECTED"
  exit 1
fi

# File-by-file comparison
for f in $(find "${REF_SUBDIRS[@]}" -name "*.md" 2>/dev/null | sort); do
  rel="${f#$REF/}"
  t="$TEST/$rel"
  if [ ! -f "$t" ]; then
    echo "  FAIL  MISSING in $TEST_NAME: $rel"
    FAIL=$((FAIL+1)); DRIFT_FILES+=("$rel"); continue
  fi
  if diff <(normalize "$f") <(normalize "$t") > /dev/null 2>&1; then
    PASS=$((PASS+1))
  else
    echo "  FAIL  DRIFT: $rel"
    FAIL=$((FAIL+1)); DRIFT_FILES+=("$rel")
  fi
done

# File count check
REF_COUNT=$(find "${REF_SUBDIRS[@]}" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
TEST_COUNT=0
for sub in 40.2 40.3 40.4; do
  [ -d "$TEST/$sub" ] && TEST_COUNT=$((TEST_COUNT + $(find "$TEST/$sub" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')))
done
[ "$REF_COUNT" = "$TEST_COUNT" ] \
  && echo "  PASS  File count matches: $REF_COUNT" && PASS=$((PASS+1)) \
  || { echo "  FAIL  File count mismatch: ref=$REF_COUNT test=$TEST_COUNT"; FAIL=$((FAIL+1)); }

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo ""
echo "=== Results ==="
echo "PASS: $PASS / FAIL: $FAIL"
if [ ${#DRIFT_FILES[@]} -gt 0 ]; then
  echo "Drift files:"
  for f in "${DRIFT_FILES[@]}"; do echo "  $f"; done
fi
[ "$FAIL" -eq 0 ] && echo "VERDICT: NONE (zero delta)" && exit 0 || echo "VERDICT: DRIFT_DETECTED" && exit 1
