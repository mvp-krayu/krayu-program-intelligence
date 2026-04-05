#!/usr/bin/env bash
# PSEE-RUNTIME.4 — Execution State Transition Engine
#
# Usage:
#   execute_phase_transition.sh <runtime_dir>
#
# Transitions engine_state.json: PRE_EXECUTION → PHASE_1_ACTIVE
# when all required preconditions (PC-01, PC-02, PC-03, PC-05) are SATISFIED.
#
# Idempotent: if execution_status is already beyond PRE_EXECUTION, exits NO_OP.
#
# Exit codes:
#   0 = TRANSITION_APPLIED or NO_OP_EXIT
#   1 = FAIL_EXIT (preconditions not met or file error)

set -euo pipefail

RUNTIME_DIR="${1:-}"
if [ -z "$RUNTIME_DIR" ]; then
  echo "ERROR: usage: execute_phase_transition.sh <runtime_dir>"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
[[ "$RUNTIME_DIR" != /* ]] && RUNTIME_DIR="$REPO_ROOT/$RUNTIME_DIR"

ENGINE_STATE="$RUNTIME_DIR/engine_state.json"
TRACE_LOG="$RUNTIME_DIR/execution_trace.log"

# ── FAIL-SAFE: FORBIDDEN INPUT PATHS ─────────────────────────────────────────
for forbidden in \
  "$REPO_ROOT/docs/pios/IG.5" \
  "$REPO_ROOT/docs/pios/IG.6" \
  "$REPO_ROOT/docs/pios/IG.7" \
  "$REPO_ROOT/docs/pios/PSEE.3" \
  "$REPO_ROOT/docs/pios/PSEE.3B" \
  "$REPO_ROOT/docs/pios/PSEE.UI"; do
  if [[ "$RUNTIME_DIR" == "$forbidden"* ]]; then
    echo "FAIL_SAFE_STOP: forbidden runtime dir — $RUNTIME_DIR"
    exit 1
  fi
done

echo "=== PSEE-RUNTIME.4 Phase Transition ==="
echo "Runtime dir: $RUNTIME_DIR"
echo ""

# ── STEP 1: LOAD engine_state.json ────────────────────────────────────────────
[ -f "$ENGINE_STATE" ] || { echo "FAIL_EXIT: engine_state.json not found: $ENGINE_STATE"; exit 1; }

# ── STEP 2: VALIDATE PRECONDITIONS ────────────────────────────────────────────
echo "--- Precondition Validation ---"

FAIL=0

check_pc() {
  local pc="$1"
  local status
  status="$(jq -r --arg pc "$pc" '.preconditions[$pc].status // empty' "$ENGINE_STATE" 2>/dev/null || echo "")"
  if [ "$status" = "SATISFIED" ]; then
    echo "  PASS  $pc = SATISFIED"
  else
    echo "  FAIL  $pc = ${status:-MISSING} (required: SATISFIED)"
    FAIL=$((FAIL+1))
  fi
}

check_pc "PC-01"
check_pc "PC-02"
check_pc "PC-03"
check_pc "PC-05"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "FAIL_EXIT: $FAIL precondition(s) not SATISFIED — transition blocked"
  exit 1
fi

echo "  ALL PRECONDITIONS SATISFIED"
echo ""

# ── STEP 3: VALIDATE CURRENT STATE ────────────────────────────────────────────
echo "--- Current State Validation ---"
CURRENT_STATUS="$(jq -r '.execution_status' "$ENGINE_STATE")"

if [ "$CURRENT_STATUS" != "PRE_EXECUTION" ]; then
  echo "  NO_OP: execution_status = $CURRENT_STATUS (expected PRE_EXECUTION)"
  echo "  Transition already applied — nothing to do."
  echo ""
  echo "NO_OP_EXIT"
  exit 0
fi

echo "  PASS  execution_status = PRE_EXECUTION — transition applicable"
echo ""

# ── STEP 4 + 6: APPLY TRANSITION AND PERSIST engine_state.json ───────────────
echo "--- Applying Transition: PRE_EXECUTION → PHASE_1_ACTIVE ---"

TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
PREV_STATE="PRE_EXECUTION"
NEW_STATE="PHASE_1_ACTIVE"
TRIGGER="PRECONDITION_COMPLETE"

TMPFILE="$(mktemp "${ENGINE_STATE}.tmp.XXXXXX")"

jq \
  --arg new_status "$NEW_STATE" \
  --arg timestamp  "$TIMESTAMP" \
  --arg prev       "$PREV_STATE" \
  --arg trigger    "$TRIGGER" \
  '.execution_status    = $new_status
   | .psee_engine_invoked = true
   | .stream             = "PSEE-RUNTIME.4"
   | .transition         = {
       "previous_state": $prev,
       "new_state":      $new_status,
       "trigger":        $trigger,
       "timestamp":      $timestamp
     }' \
  "$ENGINE_STATE" > "$TMPFILE"

mv "$TMPFILE" "$ENGINE_STATE"

echo "  execution_status     → $NEW_STATE"
echo "  psee_engine_invoked  → true"
echo "  transition.trigger   = $TRIGGER"
echo "  transition.timestamp = $TIMESTAMP"
echo ""

# ── STEP 5 + 7: WRITE execution_trace.log ────────────────────────────────────
echo "--- Writing execution_trace.log ---"

cat >> "$TRACE_LOG" << TRACEOF
=== Transition Entry ===
timestamp:      $TIMESTAMP
previous_state: $PREV_STATE
new_state:      $NEW_STATE
trigger:        $TRIGGER
runtime_dir:    $RUNTIME_DIR
engine_state:   $ENGINE_STATE
outcome:        TRANSITION_APPLIED

TRACEOF

echo "  Written: $TRACE_LOG"
echo ""

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════"
echo "TRANSITION_APPLIED"
echo "  $PREV_STATE → $NEW_STATE"
exit 0
