#!/usr/bin/env bash

# CE.2 — 5 MINUTE SCORECARD
# Usage:
# bash ce2_scorecard.sh CE.2-R01-MIX

set -euo pipefail

RUN_ID="$1"

BASE_PATH="runs/pios"
R40_5="$BASE_PATH/40.5/$RUN_ID"
R40_6="$BASE_PATH/40.6/$RUN_ID"
R40_7="$BASE_PATH/40.7/$RUN_ID"
R40_8="$BASE_PATH/40.8/$RUN_ID"
R40_9="$BASE_PATH/40.9/$RUN_ID"
R40_10="$BASE_PATH/40.10/$RUN_ID"
R40_11="$BASE_PATH/40.11/$RUN_ID"

echo "======================================"
echo "CE.2 FINAL 5-MINUTE SCORECARD"
echo "RUN: $RUN_ID"
echo "======================================"

# ------------------------------------
# 0. LOOP INTEGRITY (40.11)
# ------------------------------------
LOOP_STATUS=$(jq -r '.closure_status // .status // "UNKNOWN"' "$R40_11/loop_closure_report.json" 2>/dev/null || echo "MISSING")

if [[ "$LOOP_STATUS" == "PASS" ]]; then
  echo "40.11 LOOP INTEGRITY: PASS"
else
  echo "40.11 LOOP INTEGRITY: FAIL ($LOOP_STATUS)"
fi

# ------------------------------------
# 1. FEEDBACK (40.9)
# ------------------------------------
STATE_CHANGE_COUNT=$(jq '[.changes[]? | select(.type=="STATE_CHANGE")] | length' "$R40_9/feedback_signal_registry.json" 2>/dev/null || echo 0)

if [[ "$STATE_CHANGE_COUNT" -gt 0 ]]; then
  echo "40.9 CHANGE DETECTED: PASS ($STATE_CHANGE_COUNT STATE_CHANGE)"
else
  echo "40.9 CHANGE DETECTED: FAIL (no STATE_CHANGE)"
fi

# ------------------------------------
# 2. CONTROL (40.10)
# ------------------------------------
DIRECTIVES=$(jq -r '[.directives[]?.type] | unique | join(",")' "$R40_10/control_directive_registry.json" 2>/dev/null || echo "")

if [[ "$DIRECTIVES" == *"NO_ACTION"* && "$DIRECTIVES" != *","* ]]; then
  echo "40.10 CONTROL ACTIVATION: FAIL (only NO_ACTION)"
elif [[ -z "$DIRECTIVES" ]]; then
  echo "40.10 CONTROL ACTIVATION: FAIL (no directives)"
else
  echo "40.10 CONTROL ACTIVATION: PASS ($DIRECTIVES)"
fi

# ------------------------------------
# 3. STATE CHANGE (40.6)
# ------------------------------------
STATE_DIFF=$(jq '[.diagnoses[]? | select(.state_transition != null)] | length' "$R40_6/condition_output.json" 2>/dev/null || echo 0)

if [[ "$STATE_DIFF" -gt 0 ]]; then
  echo "40.6 STATE CHANGE: PASS ($STATE_DIFF transitions)"
else
  echo "40.6 STATE CHANGE: FAIL (no transitions detected)"
fi

# ------------------------------------
# 4. DIAGNOSIS ADAPTATION (40.7)
# ------------------------------------
DIAG_COUNT=$(jq '.diagnoses | length' "$R40_7/intelligence_output.json" 2>/dev/null || echo 0)

if [[ "$DIAG_COUNT" -gt 0 ]]; then
  echo "40.7 DIAGNOSIS OUTPUT: PASS ($DIAG_COUNT entries)"
else
  echo "40.7 DIAGNOSIS OUTPUT: FAIL (no diagnosis)"
fi

# ------------------------------------
# 5. DELIVERY INTEGRITY (40.8)
# ------------------------------------
DELIVERY_KEYS=$(jq 'keys | length' "$R40_8/delivery_output_packet.json" 2>/dev/null || echo 0)

if [[ "$DELIVERY_KEYS" -gt 0 ]]; then
  echo "40.8 DELIVERY STRUCTURE: PASS"
else
  echo "40.8 DELIVERY STRUCTURE: FAIL"
fi

# ------------------------------------
# 6. SIGNAL DELTA (40.5)
# ------------------------------------
SIG_PARTIAL=$(jq '[.signals[]? | select(.state=="PARTIAL")] | length' "$R40_5/signal_output.json" 2>/dev/null || echo 0)

if [[ "$SIG_PARTIAL" -gt 0 ]]; then
  echo "40.5 SIGNAL SHIFT: PASS ($SIG_PARTIAL PARTIAL signals)"
else
  echo "40.5 SIGNAL SHIFT: CHECK (no PARTIAL signals detected)"
fi

# ------------------------------------
# 7. TRACEABILITY CHECK
# ------------------------------------
TRACE_COUNT=$(jq '.events | length' "runs/pios/ce2/$RUN_ID/injected_evidence_log.json" 2>/dev/null || echo 0)

if [[ "$TRACE_COUNT" -gt 0 ]]; then
  echo "TRACEABILITY: PASS ($TRACE_COUNT injected events)"
else
  echo "TRACEABILITY: FAIL (no injection log)"
fi

# ------------------------------------
# FINAL SUMMARY
# ------------------------------------
echo "======================================"
echo "SUMMARY"

FAIL=0

[[ "$LOOP_STATUS" != "PASS" ]] && FAIL=1
[[ "$STATE_CHANGE_COUNT" -eq 0 ]] && FAIL=1
[[ "$DIRECTIVES" == *"NO_ACTION"* && "$DIRECTIVES" != *","* ]] && FAIL=1

if [[ "$FAIL" -eq 0 ]]; then
  echo "CE.2 RESULT: PASS ✅"
else
  echo "CE.2 RESULT: FAIL ❌"
fi

echo "======================================"
