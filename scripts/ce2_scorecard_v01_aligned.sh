#!/usr/bin/env bash
# CE.2 — v0.1-SCHEMA-ALIGNED SCORECARD
# Derived from: inspection of actual CE.2-R01-MIX engine outputs
# Schema authority: runs/pios/{40.5..40.11}/CE.2-R01-MIX/
#
# Usage:
#   bash scripts/ce2_scorecard_v01_aligned.sh CE.2-R01-MIX

set -euo pipefail

RUN_ID="${1:?usage: ce2_scorecard_v01_aligned.sh <RUN_ID>}"

BASE="runs/pios"
R405="$BASE/40.5/$RUN_ID"
R406="$BASE/40.6/$RUN_ID"
R407="$BASE/40.7/$RUN_ID"
R408="$BASE/40.8/$RUN_ID"
R409="$BASE/40.9/$RUN_ID"
R4010="$BASE/40.10/$RUN_ID"
R4011="$BASE/40.11/$RUN_ID"
CE2DIR="$BASE/ce2/$RUN_ID"

# Baseline runs for proxy comparison (40.6 and 40.7)
BASE_406="$BASE/40.6/run_02_executable"
BASE_407="$BASE/40.7/run_02_executable"
BASE_405="$BASE/40.5/run_03_executable"

# v0.1 actual filenames — inspected, not assumed
F_LOOP="$R4011/loop_closure_report.json"
F_FEEDBACK="$R409/feedback_signal_registry.json"
F_CONTROL="$R4010/control_directive_registry.json"
F_COND="$R406/condition_output.json"
F_INTEL="$R407/intelligence_output.json"
F_DELIVERY="$R408/delivery_packet.json"
F_SIGNALS="$R405/signal_output.json"
F_EVIDENCE="$CE2DIR/injected_evidence_log.json"

FAIL=0
SCHEMA_FAIL=0

echo "======================================"
echo "CE.2 FINAL 5-MINUTE SCORECARD"
echo "RUN: $RUN_ID"
echo "ENGINE SCHEMA: v0.1 ACTUAL"
echo "======================================"

# ── SECTION 1: SCHEMA ALIGNMENT ────────────────────────────────────────

echo ""
echo "SCHEMA ALIGNMENT"

check_file() {
  local label="$1" path="$2"
  if [[ -f "$path" ]]; then
    printf "  %-30s %s ✓\n" "$label" "$(basename "$path")"
  else
    printf "  %-30s MISSING — %s\n" "$label" "$path"
    SCHEMA_FAIL=1
  fi
}

check_file "40.11 source:"    "$F_LOOP"
check_file "40.9 source:"     "$F_FEEDBACK"
check_file "40.10 source:"    "$F_CONTROL"
check_file "40.8 source:"     "$F_DELIVERY"
check_file "40.7 source:"     "$F_INTEL"
check_file "40.6 source:"     "$F_COND"
check_file "40.5 source:"     "$F_SIGNALS"
check_file "evidence log:"    "$F_EVIDENCE"
echo "  40.6 explicit transition field: NO (proxy comparison used)"
echo "  scorecard mode: ACTUAL_SCHEMA"

if [[ "$SCHEMA_FAIL" -ne 0 ]]; then
  echo ""
  echo "FATAL: required source files missing — scorecard cannot proceed"
  exit 1
fi

# ── SECTION 2: CE.2 FINAL 5-MINUTE SCORECARD ───────────────────────────

echo ""
echo "CE.2 FINAL 5-MINUTE SCORECARD"
echo "--------------------------------------"

# A. 40.11 LOOP INTEGRITY
# v0.1 contract: chain_status="PASS" AND closure_status="CLOSED" AND blocking_issues=[]
CHAIN_STATUS=$(jq -r '.chain_status // "UNKNOWN"' "$F_LOOP")
CLOSURE_STATUS=$(jq -r '.closure_status // "UNKNOWN"' "$F_LOOP")
BLOCKING=$(jq '.blocking_issues | length' "$F_LOOP")

if [[ "$CHAIN_STATUS" == "PASS" && "$CLOSURE_STATUS" == "CLOSED" && "$BLOCKING" -eq 0 ]]; then
  echo "40.11 LOOP INTEGRITY:        PASS (chain_status=PASS, closure_status=CLOSED, blocking_issues=0)"
else
  echo "40.11 LOOP INTEGRITY:        FAIL (chain_status=$CHAIN_STATUS, closure_status=$CLOSURE_STATUS, blocking=$BLOCKING)"
  FAIL=1
fi

# B. 40.9 CHANGE DETECTED
# v0.1 schema: .signals[].classification ∈ {NO_CHANGE, STATE_CHANGE, ADDED, REMOVED}
NO_CHANGE=$(jq '.classification_summary.NO_CHANGE // 0' "$F_FEEDBACK")
STATE_CHANGE=$(jq '.classification_summary.STATE_CHANGE // 0' "$F_FEEDBACK")
ADDED=$(jq '.classification_summary.ADDED // 0' "$F_FEEDBACK")
REMOVED=$(jq '.classification_summary.REMOVED // 0' "$F_FEEDBACK")
TOTAL_SIGNALS=$(jq '.signals | length' "$F_FEEDBACK")
NONZERO_CHANGE=$(( STATE_CHANGE + ADDED + REMOVED ))

if [[ "$NONZERO_CHANGE" -gt 0 ]]; then
  echo "40.9 CHANGE DETECTED:        PASS (STATE_CHANGE=$STATE_CHANGE ADDED=$ADDED REMOVED=$REMOVED of $TOTAL_SIGNALS entities)"
else
  echo "40.9 CHANGE DETECTED:        FAIL (NO_CHANGE=$NO_CHANGE of $TOTAL_SIGNALS; STATE_CHANGE=0 ADDED=0 REMOVED=0)"
  FAIL=1
fi

# C. 40.10 CONTROL ACTIVATION
# v0.1 schema: .directives[].directive_type ∈ {NO_ACTION, REVIEW_REQUIRED, REGISTER_ENTITY, DEREGISTER_ENTITY}
NO_ACTION=$(jq '.directive_summary.NO_ACTION // 0' "$F_CONTROL")
REVIEW_REQ=$(jq '.directive_summary.REVIEW_REQUIRED // 0' "$F_CONTROL")
REGISTER=$(jq '.directive_summary.REGISTER_ENTITY // 0' "$F_CONTROL")
DEREGISTER=$(jq '.directive_summary.DEREGISTER_ENTITY // 0' "$F_CONTROL")
ACTIVE_DIRECTIVES=$(( REVIEW_REQ + REGISTER + DEREGISTER ))

if [[ "$ACTIVE_DIRECTIVES" -gt 0 ]]; then
  echo "40.10 CONTROL ACTIVATION:    PASS (REVIEW_REQUIRED=$REVIEW_REQ REGISTER=$REGISTER DEREGISTER=$DEREGISTER)"
else
  echo "40.10 CONTROL ACTIVATION:    FAIL (NO_ACTION=$NO_ACTION; REVIEW_REQUIRED=0 REGISTER=0 DEREGISTER=0)"
  FAIL=1
fi

# D. 40.6 STATE MOVEMENT (PROXY — no state_transition field in v0.1)
# Proxy: compare COND-001.components.dependency_load_ratio between baseline and CE.2
# State fields themselves are invariant (hardcoded in engine); value delta is the observable signal
CE2_RATIO=$(jq '.conditions["COND-001"].components.dependency_load_ratio' "$F_COND")
BASE_RATIO=$(jq '.conditions["COND-001"].components.dependency_load_ratio' "$BASE_406/condition_output.json")
CE2_DIAG_STATE=$(jq -r '.diagnoses["DIAG-001"].diagnosis_activation_state' "$F_COND")
BASE_DIAG_STATE=$(jq -r '.diagnoses["DIAG-001"].diagnosis_activation_state' "$BASE_406/condition_output.json")

VALUES_DIFFER=$(jq -n "$CE2_RATIO != $BASE_RATIO")
STATES_DIFFER=$( [[ "$CE2_DIAG_STATE" != "$BASE_DIAG_STATE" ]] && echo "true" || echo "false" )

if [[ "$VALUES_DIFFER" == "true" && "$STATES_DIFFER" == "false" ]]; then
  echo "40.6 STATE MOVEMENT:         PASS — PROXY COMPARISON (COND-001 dependency_load_ratio: baseline=$BASE_RATIO → CE.2=$CE2_RATIO; diagnosis states unchanged — engine-invariant)"
elif [[ "$STATES_DIFFER" == "true" ]]; then
  echo "40.6 STATE MOVEMENT:         PASS — DIRECT (diagnosis state changed: $BASE_DIAG_STATE → $CE2_DIAG_STATE)"
else
  echo "40.6 STATE MOVEMENT:         FAIL (no value change detected; no state transition in v0.1)"
  FAIL=1
fi

# E. 40.7 INTELLIGENCE ADAPTATION
# v0.1 schema: .intelligence (dict, not .diagnoses)
# Compare INTEL-001.components between baseline and CE.2
INTEL_COUNT=$(jq '.intelligence | length' "$F_INTEL")
CE2_INTEL_RATIO=$(jq '.intelligence["INTEL-001"].components.dependency_load_ratio' "$F_INTEL")
BASE_INTEL_RATIO=$(jq '.intelligence["INTEL-001"].components.dependency_load_ratio' "$BASE_407/intelligence_output.json")
INTEL_DIFFER=$(jq -n "$CE2_INTEL_RATIO != $BASE_INTEL_RATIO")

if [[ "$INTEL_COUNT" -gt 0 && "$INTEL_DIFFER" == "true" ]]; then
  echo "40.7 INTELLIGENCE ADAPTATION: PASS ($INTEL_COUNT entries; INTEL-001 dependency_load_ratio: baseline=$BASE_INTEL_RATIO → CE.2=$CE2_INTEL_RATIO; no schema drift)"
else
  echo "40.7 INTELLIGENCE ADAPTATION: FAIL (count=$INTEL_COUNT; value differs=$INTEL_DIFFER)"
  FAIL=1
fi

# F. 40.8 DELIVERY INTEGRITY
# v0.1 filename: delivery_packet.json (not delivery_output_packet.json)
DELIVERY_KEY_COUNT=$(jq 'keys | length' "$F_DELIVERY")
LOSSLESS=$(jq -r '.losslessness_status // "UNKNOWN"' "$R408/delivery_validation_report.json")

if [[ "$DELIVERY_KEY_COUNT" -gt 0 && "$LOSSLESS" == "PASS" ]]; then
  echo "40.8 DELIVERY INTEGRITY:     PASS (delivery_packet.json present; $DELIVERY_KEY_COUNT top-level keys; losslessness=$LOSSLESS)"
else
  echo "40.8 DELIVERY INTEGRITY:     FAIL (keys=$DELIVERY_KEY_COUNT losslessness=$LOSSLESS)"
  FAIL=1
fi

# G. 40.5 SIGNAL SHIFT
# Compare actual SIG-002 dependency_load_ratio and SIG-005 throughput_rate against baseline
CE2_SIG002=$(jq '.signals["SIG-002"].output.dependency_load_ratio' "$F_SIGNALS")
BASE_SIG002=$(jq '.signals["SIG-002"].output.dependency_load_ratio' "$BASE_405/signal_output.json")
CE2_SIG005=$(jq '.signals["SIG-005"].output.throughput_rate' "$F_SIGNALS")
BASE_SIG005=$(jq '.signals["SIG-005"].output.throughput_rate' "$BASE_405/signal_output.json")
SIG002_DIFF=$(jq -n "$CE2_SIG002 != $BASE_SIG002")
SIG005_DIFF=$(jq -n "$CE2_SIG005 != $BASE_SIG005")

if [[ "$SIG002_DIFF" == "true" && "$SIG005_DIFF" == "true" ]]; then
  echo "40.5 SIGNAL SHIFT:           PASS (SIG-002 dep_load_ratio: $BASE_SIG002 -> $CE2_SIG002; SIG-005 throughput: $BASE_SIG005 -> $CE2_SIG005)"
elif [[ "$SIG002_DIFF" == "true" || "$SIG005_DIFF" == "true" ]]; then
  echo "40.5 SIGNAL SHIFT:           PASS (partial — SIG-002 diff=$SIG002_DIFF SIG-005 diff=$SIG005_DIFF)"
else
  echo "40.5 SIGNAL SHIFT:           FAIL (no value change detected)"
  FAIL=1
fi

# H. TRACEABILITY
TRACE_COUNT=$(jq '.events | length' "$F_EVIDENCE")
if [[ "$TRACE_COUNT" -gt 0 ]]; then
  echo "TRACEABILITY:                PASS ($TRACE_COUNT injected events logged)"
else
  echo "TRACEABILITY:                FAIL (no events in injection log)"
  FAIL=1
fi

# ── SECTION 3: ARCHITECTURAL FINDINGS ──────────────────────────────────

echo ""
echo "ARCHITECTURAL FINDINGS"

# Pull from actual run artifacts
FINDING=$(jq -r '.governance_finding.description // ""' "$CE2DIR/baseline_vs_ce2_delta_report.json" 2>/dev/null || echo "")

if [[ -n "$FINDING" ]]; then
  # Wrap to ~80 chars for readability
  echo "- $FINDING" | fold -s -w 78 | sed '2,$s/^/  /'
else
  # Fallback: read directly from control_activation_report
  REASON=$(jq -r '.reason // ""' "$CE2DIR/control_activation_report.json" 2>/dev/null || echo "")
  [[ -n "$REASON" ]] && echo "- $REASON" | fold -s -w 78 | sed '2,$s/^/  /'
fi

# Static findings derived from inspection
echo "- 40.6 activate_cond_* functions hardcode condition_coverage_state; telemetry"
echo "  perturbation propagates to component values only, not state labels"
echo "- compute_sig_003 second branch (AT-001/AT-002 provided) still returns"
echo "  state=BLOCKED — no computation formula exists in v0.1 engine"
echo "- 40.9 feedback and 40.10 control layers unreachable via 40.4 telemetry"
echo "  injection with current engine architecture (assertions 5-8 unachievable)"

# ── SECTION 4: FINAL RESULT ─────────────────────────────────────────────

echo ""
echo "======================================"
echo "FINAL RESULT"

if [[ "$FAIL" -eq 0 ]]; then
  SYSTEM_RESULT="PASS"
else
  SYSTEM_RESULT="FAIL"
fi

SCORECARD_STATUS="VALID"  # schema correctly mapped; results reflect real behavior

echo "SYSTEM RESULT:   $SYSTEM_RESULT"
echo "SCORECARD STATUS: $SCORECARD_STATUS"
echo "INTERPRETATION:"
echo "  - SYSTEM FAIL means actual CE.2 assertions 5-8 fail in real engine outputs"
echo "  - SCORECARD VALID means schema correctly mapped — prior mismatches resolved"
echo "  - Prior scorecard had 6 schema errors (wrong keys/filenames); this scorecard"
echo "    reads actual v0.1 output; failures here reflect real architectural limits"
echo "======================================"
