#!/usr/bin/env bash
# IG.6 — Ingestion Orchestrator
# Binds governed source resolution output (IG.5) to pipeline execution contract.
# Validates chain integrity and determinism. Does NOT invoke pipeline layers directly.
#
# FAIL-SAFE: only accepts governed resolver output.
# Stops on any non-governed, ungoverned, or resolver-unconfirmed input.
#
# Usage:
#   ./ingestion_orchestrator.sh <run_input.json>
#
# Exit codes:
#   0 = ORCHESTRATION_COMPLETE (chain validated, determinism confirmed)
#   1 = ORCHESTRATOR_FAIL or FAIL_SAFE_STOP

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
INPUT_JSON="${1:-}"

# ── ENTRY CHECKS ─────────────────────────────────────────────────────────────
[ -z "$INPUT_JSON" ]   && { echo "FAIL_SAFE_STOP: run input JSON required"; echo "Usage: ingestion_orchestrator.sh <run_input.json>"; exit 1; }
[ ! -f "$INPUT_JSON" ] && { echo "FAIL_SAFE_STOP: input file not found: $INPUT_JSON"; exit 1; }

# ── JSON PARSER ───────────────────────────────────────────────────────────────
# Dot-notation key access via python3
parse_json() {
  python3 - "$INPUT_JSON" "$1" << 'PYEOF'
import json, sys
try:
    data = json.load(open(sys.argv[1]))
    keys = sys.argv[2].split(".")
    v = data
    for k in keys:
        v = v[k]
    print(v if v is not None else "")
except Exception:
    print("")
PYEOF
}

# ── LOAD INPUT FIELDS ─────────────────────────────────────────────────────────
RUN_ID="$(parse_json run_id)"
PROFILE_KIND="$(parse_json profile.kind)"
PROFILE_ADMISSIBILITY="$(parse_json profile.admissibility)"
PROFILE_RESOLUTION="$(parse_json profile.resolution)"
OUTPUT_ROOT="$(parse_json output_root)"
REFERENCE_RUN="$(parse_json reference_run)"
RESOLVER="$(parse_json resolver)"
GOVERNANCE="$(parse_json governance)"
RUN_MODE="$(parse_json run_mode)"
EXEC_MODE="$(parse_json execution_mode)"

echo "=== IG.6 Ingestion Orchestrator ==="
echo "Input:         $INPUT_JSON"
echo "Run ID:        $RUN_ID"
echo "Admissibility: $PROFILE_ADMISSIBILITY"
echo "Governance:    $GOVERNANCE"
echo ""

PASS=0; FAIL=0
pass_check() { echo "  PASS  $1"; PASS=$((PASS+1)); }
fail_check() { echo "  FAIL  $1"; FAIL=$((FAIL+1)); }

# ── FAIL-SAFE GATE ────────────────────────────────────────────────────────────
# Per contract: if source profile output is absent, ungoverned, or resolver chain
# cannot be confirmed → FAIL_SAFE_STOP. This check runs BEFORE all other validation.

if [ "$PROFILE_ADMISSIBILITY" != "GOVERNED" ]; then
  echo ""
  echo "FAIL_SAFE_STOP"
  echo "Reason:  profile.admissibility = '$PROFILE_ADMISSIBILITY' — must be GOVERNED"
  echo "Run ID:  $RUN_ID"
  echo "Resolve: Re-run through IG.5 source_profile_resolver.sh with GOVERNED source"
  exit 1
fi

if [ "$PROFILE_RESOLUTION" != "DETERMINISTIC" ]; then
  echo ""
  echo "FAIL_SAFE_STOP"
  echo "Reason:  profile.resolution = '$PROFILE_RESOLUTION' — must be DETERMINISTIC"
  echo "Run ID:  $RUN_ID"
  echo "Resolve: Re-run through IG.5 source_profile_resolver.sh"
  exit 1
fi

if [ -z "$RUN_ID" ]; then
  echo ""
  echo "FAIL_SAFE_STOP"
  echo "Reason:  run_id is absent from input JSON"
  echo "Resolve: Provide valid governed run input"
  exit 1
fi

# ── CHECK 1: INPUT SCHEMA COMPLETENESS ────────────────────────────────────────
echo "--- Check 1: Input schema completeness ---"

[ -n "$RUN_ID" ]               && pass_check "run_id present: $RUN_ID"            || fail_check "run_id missing"
[ -n "$PROFILE_KIND" ]         && pass_check "profile.kind: $PROFILE_KIND"        || fail_check "profile.kind missing"
[ "$PROFILE_ADMISSIBILITY" = "GOVERNED" ]   && pass_check "profile.admissibility = GOVERNED"   || fail_check "profile.admissibility must be GOVERNED"
[ "$PROFILE_RESOLUTION" = "DETERMINISTIC" ] && pass_check "profile.resolution = DETERMINISTIC" || fail_check "profile.resolution must be DETERMINISTIC"
[ -n "$OUTPUT_ROOT" ]          && pass_check "output_root declared"                || fail_check "output_root missing"
[ -n "$REFERENCE_RUN" ]        && pass_check "reference_run declared"              || fail_check "reference_run missing"
[ -n "$RESOLVER" ]             && pass_check "resolver declared"                   || fail_check "resolver missing"
[ "$GOVERNANCE" = "IG.5" ]     && pass_check "governance = IG.5"                  || fail_check "governance must be IG.5"
[ "$RUN_MODE" = "SOURCE_PROFILED_INGESTION" ] && pass_check "run_mode = SOURCE_PROFILED_INGESTION" || fail_check "run_mode must be SOURCE_PROFILED_INGESTION"
[ "$EXEC_MODE" = "CREATE_ONLY" ] && pass_check "execution_mode = CREATE_ONLY"     || fail_check "execution_mode must be CREATE_ONLY"

echo ""

# ── CHECK 2: RESOLVER CHAIN INTEGRITY ─────────────────────────────────────────
echo "--- Check 2: Governed resolver chain ---"

# Resolver path — resolve relative to REPO_ROOT if not absolute
[[ "$RESOLVER" == /* ]] && RESOLVER_ABS="$RESOLVER" || RESOLVER_ABS="$REPO_ROOT/$RESOLVER"

[ -f "$RESOLVER_ABS" ]  && pass_check "IG.5 resolver present: $RESOLVER" || fail_check "IG.5 resolver not found: $RESOLVER_ABS"
[ -x "$RESOLVER_ABS" ]  && pass_check "IG.5 resolver executable"         || fail_check "IG.5 resolver not executable"

# IG.4 orchestration launcher (must exist in delegation chain)
IG4_LAUNCHER="$REPO_ROOT/scripts/pios/ig4/orchestration_launcher.sh"
[ -f "$IG4_LAUNCHER" ]  && pass_check "IG.4 orchestration_launcher.sh present" || fail_check "IG.4 orchestration_launcher.sh missing"
[ -x "$IG4_LAUNCHER" ]  && pass_check "IG.4 orchestration_launcher.sh executable" || fail_check "IG.4 orchestration_launcher.sh not executable"

# IG.3 bootstrap launcher
IG3_LAUNCHER="$REPO_ROOT/scripts/pios/ig3/bootstrap_launcher.sh"
[ -f "$IG3_LAUNCHER" ]  && pass_check "IG.3 bootstrap_launcher.sh present"    || fail_check "IG.3 bootstrap_launcher.sh missing"
[ -x "$IG3_LAUNCHER" ]  && pass_check "IG.3 bootstrap_launcher.sh executable" || fail_check "IG.3 bootstrap_launcher.sh not executable"

# Confirm IG.5 resolver delegates to IG.4 (delegation chain check)
grep -q "ig4/orchestration_launcher" "$RESOLVER_ABS" 2>/dev/null \
  && pass_check "IG.5 resolver delegates to IG.4 (chain intact)" \
  || fail_check "IG.5 resolver does not delegate to IG.4 — chain broken"

# Confirm IG.4 delegates to IG.3
grep -q "ig3/bootstrap_launcher" "$IG4_LAUNCHER" 2>/dev/null \
  && pass_check "IG.4 launcher delegates to IG.3 (chain intact)" \
  || fail_check "IG.4 launcher does not delegate to IG.3 — chain broken"

echo ""

# Abort if chain is broken — fail-safe applies here too
if [ "$FAIL" -gt 0 ]; then
  echo "FAIL_SAFE_STOP"
  echo "Reason:  Resolver chain cannot be confirmed ($FAIL checks failed)"
  echo "Run ID:  $RUN_ID"
  echo "Resolve: Verify IG.3–IG.5 launcher scripts are present and executable"
  exit 1
fi

# ── CHECK 3: RUN NAMESPACE PROVENANCE ─────────────────────────────────────────
echo "--- Check 3: Run namespace provenance ---"

# Resolve output_root
[[ "$OUTPUT_ROOT" == /* ]] && RUN_DIR="$OUTPUT_ROOT" || RUN_DIR="$REPO_ROOT/$OUTPUT_ROOT"

[ -d "$RUN_DIR" ] \
  && pass_check "Run namespace exists: $(basename "$RUN_DIR")" \
  || { fail_check "Run namespace missing: $RUN_DIR"; echo ""; echo "FAIL_SAFE_STOP"; echo "Reason: run namespace absent — source profile output not found"; exit 1; }

# Adapter binding must exist
ADAPTER_BINDING="$RUN_DIR/adapter_binding.md"
[ -f "$ADAPTER_BINDING" ] \
  && pass_check "adapter_binding.md present" \
  || { fail_check "adapter_binding.md missing"; FAIL=$((FAIL+1)); }

# IG.5 source_profile_layer annotation must be present
if [ -f "$ADAPTER_BINDING" ]; then
  grep -q "source_profile_layer: IG.5" "$ADAPTER_BINDING" 2>/dev/null \
    && pass_check "IG.5 source_profile_layer annotation confirmed" \
    || { fail_check "IG.5 source_profile_layer annotation missing — run was not produced through governed resolver"; FAIL=$((FAIL+1)); }

  # Admissibility annotation matches
  grep -q "profile.admissibility: GOVERNED" "$ADAPTER_BINDING" 2>/dev/null \
    && pass_check "GOVERNED admissibility confirmed in adapter_binding.md" \
    || fail_check "GOVERNED admissibility annotation missing in adapter_binding.md"

  # Profile resolution annotation
  grep -q "profile.resolution: DETERMINISTIC" "$ADAPTER_BINDING" 2>/dev/null \
    && pass_check "DETERMINISTIC resolution confirmed in adapter_binding.md" \
    || fail_check "DETERMINISTIC resolution annotation missing in adapter_binding.md"
fi

# No direct source access — confirm the run has baseline_anchor (proving CREATE_ONLY provenance)
if [ -f "$ADAPTER_BINDING" ]; then
  grep -q "baseline_anchor:" "$ADAPTER_BINDING" 2>/dev/null \
    && pass_check "Baseline anchor recorded in adapter_binding.md" \
    || fail_check "Baseline anchor missing from adapter_binding.md"
fi

echo ""

# Fail-safe: if run has no IG.5 annotation, it was not produced through the governed path
if [ "$FAIL" -gt 0 ]; then
  echo "FAIL_SAFE_STOP"
  echo "Reason:  Run namespace provenance could not be confirmed — resolver chain unverified"
  echo "Run ID:  $RUN_ID"
  echo "Resolve: Re-run through IG.5 source_profile_resolver.sh with GOVERNED source"
  exit 1
fi

# ── CHECK 4: ORCHESTRATION DETERMINISM ────────────────────────────────────────
echo "--- Check 4: Orchestration determinism ---"

SHARED_ZERO_DELTA="$REPO_ROOT/scripts/governance/validate_zero_delta.sh"

if [ ! -f "$SHARED_ZERO_DELTA" ]; then
  fail_check "scripts/governance/validate_zero_delta.sh missing — cannot verify determinism"
else
  # Resolve reference run
  [[ "$REFERENCE_RUN" == /* ]] && REF_DIR="$REFERENCE_RUN" || REF_DIR="$REPO_ROOT/$REFERENCE_RUN"
  REF_NAME="$(basename "$REF_DIR")"
  RUN_NAME="$(basename "$RUN_DIR")"

  if [ ! -d "$REF_DIR" ]; then
    fail_check "Reference run not found: $REF_DIR"
  else
    pass_check "Reference run present: $REF_NAME"
    echo ""
    echo "  Running zero-delta comparison: $RUN_NAME vs $REF_NAME"
    DELTA_OUT="$(bash "$SHARED_ZERO_DELTA" "$REF_NAME" "$RUN_NAME" --repo-root "$REPO_ROOT" 2>&1 || true)"
    echo "$DELTA_OUT" | grep -E "^  (PASS|FAIL)|^VERDICT" | sed 's/^/    /'
    if echo "$DELTA_OUT" | grep -q "VERDICT: NONE"; then
      DELTA_PASS=$(echo "$DELTA_OUT" | grep -c "^  PASS" || echo "0")
      echo ""
      pass_check "Zero-delta: NONE — run is deterministic ($DELTA_PASS checks pass)"
    else
      echo ""
      fail_check "Zero-delta: DRIFT DETECTED — run is not deterministic"
    fi
  fi
fi

echo ""

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════"
echo "Stream:     IG.6"
echo "Run ID:     $RUN_ID"
echo "PASS:       $PASS"
echo "FAIL:       $FAIL"
echo ""

if [ "$FAIL" -eq 0 ]; then
  echo "ORCHESTRATION_COMPLETE"
  echo "Resolver chain confirmed. Run is governed and deterministic."
  exit 0
else
  echo "ORCHESTRATOR_FAIL: $FAIL check(s) failed"
  exit 1
fi
