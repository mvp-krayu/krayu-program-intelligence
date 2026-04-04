#!/usr/bin/env bash
# IG.7 — Ingestion Payload Normalizer
# Reads a governed run namespace (produced through IG.6 orchestration path)
# and emits a normalized payload_manifest.json for downstream 40.2 consumption.
#
# No interpretation, no computation — structural enumeration only.
# Output schema is stable and deterministic (file lists are sorted).
#
# Usage:
#   ./ingestion_payload_normalizer.sh <run_namespace_path>
#
# Produces:
#   <run_namespace_path>/payload_manifest.json
#
# Exit codes:
#   0 = NORMALIZATION_COMPLETE
#   1 = NORMALIZER_FAIL or FAIL_SAFE_STOP

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
RUN_DIR="${1:-}"

PASS=0; FAIL=0
pass() { echo "  PASS  $1"; PASS=$((PASS+1)); }
fail() { echo "  FAIL  $1"; FAIL=$((FAIL+1)); }
info() { echo "  INFO  $1"; }

# ── ENTRY CHECKS ─────────────────────────────────────────────────────────────
[ -z "$RUN_DIR" ] && {
  echo "FAIL_SAFE_STOP: run namespace path required"
  echo "Usage: ingestion_payload_normalizer.sh <run_namespace_path>"
  exit 1
}
[ -d "$RUN_DIR" ] || { echo "FAIL_SAFE_STOP: run namespace not found: $RUN_DIR"; exit 1; }

RUN_NAME="$(basename "$RUN_DIR")"
MANIFEST_OUT="$RUN_DIR/payload_manifest.json"

echo "=== IG.7 Payload Normalizer ==="
echo "Run namespace: $RUN_NAME"
echo ""

# ── CHECK 1: GOVERNANCE PROVENANCE ────────────────────────────────────────────
echo "--- Provenance check ---"

ADAPTER_BINDING="$RUN_DIR/adapter_binding.md"
RUN_MANIFEST="$RUN_DIR/run_manifest.md"

[ -f "$ADAPTER_BINDING" ] && pass "adapter_binding.md present" || {
  fail "adapter_binding.md missing — run was not produced through governed path"
  echo "FAIL_SAFE_STOP"; echo "Reason: missing provenance artifact"; exit 1
}
[ -f "$RUN_MANIFEST" ] && pass "run_manifest.md present" || {
  fail "run_manifest.md missing"
  echo "FAIL_SAFE_STOP"; echo "Reason: missing run manifest"; exit 1
}

grep -q "source_profile_layer: IG.5" "$ADAPTER_BINDING" 2>/dev/null \
  && pass "IG.5 source_profile_layer annotation confirmed" \
  || { fail "IG.5 annotation missing — run not produced through governed resolver"; echo "FAIL_SAFE_STOP"; exit 1; }

grep -q "profile.admissibility: GOVERNED" "$ADAPTER_BINDING" 2>/dev/null \
  && pass "GOVERNED admissibility confirmed" || fail "GOVERNED admissibility annotation missing"

grep -q "profile.resolution: DETERMINISTIC" "$ADAPTER_BINDING" 2>/dev/null \
  && pass "DETERMINISTIC resolution confirmed" || fail "DETERMINISTIC resolution annotation missing"

echo ""

# Abort if provenance failed
if [ "$FAIL" -gt 0 ]; then
  echo "FAIL_SAFE_STOP"
  echo "Reason: payload cannot be normalized — run provenance unconfirmed"
  exit 1
fi

# ── CHECK 2: LAYER STRUCTURE PRESENCE ─────────────────────────────────────────
echo "--- Layer structure check ---"

for layer in 40.2 40.3 40.4; do
  LAYER_DIR="$RUN_DIR/$layer"
  [ -d "$LAYER_DIR" ] && pass "Layer $layer directory present" || fail "Layer $layer directory missing"
done

if [ "$FAIL" -gt 0 ]; then
  echo "FAIL_SAFE_STOP"
  echo "Reason: payload structure incomplete — expected 40.2, 40.3, 40.4 layers"
  exit 1
fi

echo ""

# ── EXTRACT BINDING METADATA ──────────────────────────────────────────────────
extract_binding() {
  grep -m1 "^${1}:" "$ADAPTER_BINDING" 2>/dev/null | sed 's/^[^:]*: *//' | tr -d '\r' || echo ""
}
extract_manifest() {
  grep -m1 "^${1}:" "$RUN_MANIFEST" 2>/dev/null | sed 's/^[^:]*: *//' | tr -d '\r' || echo ""
}

SOURCE_KIND="$(extract_binding "source.kind")"
ADMISSIBILITY="$(extract_binding "profile.admissibility")"
RESOLUTION="$(extract_binding "profile.resolution")"
BASELINE_ANCHOR="$(extract_binding "baseline_anchor")"
STREAM="$(extract_binding "stream")"
RUN_DATE="$(extract_manifest "date")"
LAYER_42_COUNT="$(extract_manifest "layer_40_2")"
LAYER_43_COUNT="$(extract_manifest "layer_40_3")"
LAYER_44_COUNT="$(extract_manifest "layer_40_4")"

# ── ENUMERATE LAYER FILES ─────────────────────────────────────────────────────
enumerate_layer() {
  local dir="$RUN_DIR/$1"
  find "$dir" -maxdepth 1 -type f | sort | while read -r f; do
    echo "$(basename "$f")"
  done
}

L402_FILES="$(enumerate_layer "40.2")"
L403_FILES="$(enumerate_layer "40.3")"
L404_FILES="$(enumerate_layer "40.4")"

L402_COUNT="$(echo "$L402_FILES" | grep -c '.' || echo 0)"
L403_COUNT="$(echo "$L403_FILES" | grep -c '.' || echo 0)"
L404_COUNT="$(echo "$L404_FILES" | grep -c '.' || echo 0)"

info "Layer 40.2: $L402_COUNT files"
info "Layer 40.3: $L403_COUNT files"
info "Layer 40.4: $L404_COUNT files"
echo ""

# ── PRODUCE PAYLOAD MANIFEST ──────────────────────────────────────────────────
echo "--- Emitting payload_manifest.json ---"

python3 - "$MANIFEST_OUT" "$RUN_DIR" "$RUN_NAME" \
  "$SOURCE_KIND" "$ADMISSIBILITY" "$RESOLUTION" "$BASELINE_ANCHOR" \
  "$STREAM" "$RUN_DATE" \
  "$L402_FILES" "$L403_FILES" "$L404_FILES" \
  "$L402_COUNT" "$L403_COUNT" "$L404_COUNT" << 'PYEOF'
import json, sys, os

out_path    = sys.argv[1]
run_dir     = sys.argv[2]
run_name    = sys.argv[3]
source_kind = sys.argv[4]
admit       = sys.argv[5]
resolution  = sys.argv[6]
anchor      = sys.argv[7]
stream      = sys.argv[8]
run_date    = sys.argv[9]
l402_raw    = sys.argv[10]
l403_raw    = sys.argv[11]
l404_raw    = sys.argv[12]
l402_count  = int(sys.argv[13]) if sys.argv[13].isdigit() else 0
l403_count  = int(sys.argv[14]) if sys.argv[14].isdigit() else 0
l404_count  = int(sys.argv[15]) if sys.argv[15].isdigit() else 0

def to_list(raw): return [f for f in raw.strip().split("\n") if f.strip()] if raw.strip() else []

manifest = {
    "payload_schema_version": "1.0",
    "stream": "IG.7",
    "run_id": run_name,
    "governance": "IG.6",
    "date": run_date,
    "source": {
        "kind": source_kind,
        "admissibility": admit,
        "resolution": resolution
    },
    "baseline_anchor": anchor,
    "layers": {
        "L40_2": {
            "path": os.path.join(run_dir, "40.2"),
            "artifact_count": l402_count,
            "artifacts": to_list(l402_raw)
        },
        "L40_3": {
            "path": os.path.join(run_dir, "40.3"),
            "artifact_count": l403_count,
            "artifacts": to_list(l403_raw)
        },
        "L40_4": {
            "path": os.path.join(run_dir, "40.4"),
            "artifact_count": l404_count,
            "artifacts": to_list(l404_raw)
        }
    },
    "provenance": {
        "orchestration_gate": "IG.6",
        "admissibility": admit,
        "determinism": "VERIFIED",
        "source_profile_layer": "IG.5"
    }
}

with open(out_path, "w") as f:
    json.dump(manifest, f, indent=2)
    f.write("\n")
print("  PASS  payload_manifest.json written")
PYEOF

pass "payload_manifest.json emitted: $MANIFEST_OUT"
echo ""

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════"
echo "Run:    $RUN_NAME"
echo "PASS:   $PASS"
echo "FAIL:   $FAIL"
echo ""

if [ "$FAIL" -eq 0 ]; then
  echo "NORMALIZATION_COMPLETE"
  echo "Payload manifest written. Structure is governed and deterministic."
  exit 0
else
  echo "NORMALIZER_FAIL: $FAIL check(s) failed"
  exit 1
fi
