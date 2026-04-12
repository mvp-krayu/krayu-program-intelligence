#!/usr/bin/env bash
# scripts/ig/run_ig_pipeline.sh
# IG Pipeline Wrapper
# Executes the full IG.5 → IG.4 → IG.3 → IG.7 → IG.6 → IG.7-normalizer chain.
# Produces: docs/pios/runs/<run_id>/payload_manifest.json
#
# Usage:
#   bash scripts/ig/run_ig_pipeline.sh \
#     --client <uuid> \
#     --source <path> \
#     [--run-id <id>] \
#     [--log-level INFO|DEBUG]
#
# Exit codes:
#   0  IG_SUCCESS
#   1  PRE-FLIGHT FAILURE
#   2  PIPELINE FAILURE (IG.5 chain)
#   3  PAYLOAD FAILURE (IG.7 chain)

set -euo pipefail

# ── HELP ──────────────────────────────────────────────────────────────────────
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: run_ig_pipeline.sh --client <uuid> --source <path> [--run-id <id>] [--log-level <level>]"
  echo ""
  echo "Options:"
  echo "  --client     <uuid>         Client UUID (required)"
  echo "  --source     <path>         Source directory path (required)"
  echo "  --run-id     <id>           Run ID (default: run_ig_<timestamp>)"
  echo "  --log-level  INFO|DEBUG     Log level (default: INFO)"
  echo "  --help                      Show this help and exit"
  echo ""
  echo "Produces: docs/pios/runs/<run_id>/payload_manifest.json"
  exit 0
fi

# ── PARSE ARGS ────────────────────────────────────────────────────────────────
CLIENT=""
SOURCE=""
RUN_ID=""
LOG_LEVEL="INFO"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --client)     CLIENT="$2";    shift 2 ;;
    --source)     SOURCE="$2";    shift 2 ;;
    --run-id)     RUN_ID="$2";    shift 2 ;;
    --log-level)  LOG_LEVEL="$2"; shift 2 ;;
    *)
      echo "ERROR: unknown argument: $1"
      echo "Usage: run_ig_pipeline.sh --client <uuid> --source <path> [--run-id <id>] [--log-level <level>]"
      exit 1
      ;;
  esac
done

# ── REPO ROOT ─────────────────────────────────────────────────────────────────
REPO_ROOT="$(git rev-parse --show-toplevel)"

# ── DEFAULT RUN ID ────────────────────────────────────────────────────────────
if [ -z "$RUN_ID" ]; then
  RUN_ID="run_ig_$(date +%Y%m%d_%H%M%S)"
fi

# ── DEBUG MODE ────────────────────────────────────────────────────────────────
if [ "$LOG_LEVEL" = "DEBUG" ]; then
  set -x
fi

# ── LOG SETUP ─────────────────────────────────────────────────────────────────
LOG_DIR="$REPO_ROOT/logs/ig"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/${RUN_ID}.log"

# Tee stdout+stderr to log file while preserving terminal output
exec > >(tee -a "$LOG_FILE") 2>&1

echo "=== IG Pipeline Wrapper ==="
echo "stream:     PSEE.IG.PSEE.END_TO_END.PIPELINE.EXECUTION.01"
echo "run_id:     $RUN_ID"
echo "client:     $CLIENT"
echo "source:     $SOURCE"
echo "log_level:  $LOG_LEVEL"
echo "log_file:   $LOG_FILE"
echo ""

# ── PRE-FLIGHT ────────────────────────────────────────────────────────────────
echo "--- PRE-FLIGHT ---"

PREFLIGHT_FAIL=0

# Required args
if [ -z "$CLIENT" ]; then
  echo "  FAIL  --client is required"
  PREFLIGHT_FAIL=$((PREFLIGHT_FAIL+1))
else
  echo "  PASS  client: $CLIENT"
fi

if [ -z "$SOURCE" ]; then
  echo "  FAIL  --source is required"
  PREFLIGHT_FAIL=$((PREFLIGHT_FAIL+1))
else
  echo "  PASS  source arg present"
fi

# Validate log-level
if [[ "$LOG_LEVEL" != "INFO" && "$LOG_LEVEL" != "DEBUG" ]]; then
  echo "  FAIL  --log-level must be INFO or DEBUG; got: $LOG_LEVEL"
  PREFLIGHT_FAIL=$((PREFLIGHT_FAIL+1))
else
  echo "  PASS  log_level: $LOG_LEVEL"
fi

# Branch check
CURRENT_BRANCH="$(git branch --show-current)"
REQUIRED_BRANCH="work/ig-foundation"
if [ "$CURRENT_BRANCH" != "$REQUIRED_BRANCH" ]; then
  echo "  FAIL  branch mismatch: current=$CURRENT_BRANCH required=$REQUIRED_BRANCH"
  echo "        Run: git checkout $REQUIRED_BRANCH"
  PREFLIGHT_FAIL=$((PREFLIGHT_FAIL+1))
else
  echo "  PASS  branch: $CURRENT_BRANCH"
fi

# Resolve source path (absolute)
[[ "$SOURCE" == /* ]] && SOURCE_ABS="$SOURCE" || SOURCE_ABS="$REPO_ROOT/$SOURCE"
if [ ! -d "$SOURCE_ABS" ]; then
  echo "  FAIL  source directory not found: $SOURCE_ABS"
  PREFLIGHT_FAIL=$((PREFLIGHT_FAIL+1))
else
  echo "  PASS  source directory: $SOURCE_ABS"
fi

# Required IG scripts
IG5="$REPO_ROOT/scripts/pios/ig5/source_profile_resolver.sh"
IG7="$REPO_ROOT/scripts/pios/ig7/ingestion_batch_runner.sh"
for script in "$IG5" "$IG7"; do
  if [ ! -f "$script" ]; then
    echo "  FAIL  script not found: ${script#$REPO_ROOT/}"
    PREFLIGHT_FAIL=$((PREFLIGHT_FAIL+1))
  elif [ ! -x "$script" ]; then
    echo "  FAIL  script not executable: ${script#$REPO_ROOT/}"
    PREFLIGHT_FAIL=$((PREFLIGHT_FAIL+1))
  else
    echo "  PASS  ${script#$REPO_ROOT/}"
  fi
done

# Reference run must exist (required by IG.3 CREATE_ONLY check)
REFERENCE_RUN="$REPO_ROOT/docs/pios/runs/run_05_bootstrap_pipeline"
if [ ! -d "$REFERENCE_RUN" ]; then
  echo "  FAIL  reference_run not found: $REFERENCE_RUN"
  PREFLIGHT_FAIL=$((PREFLIGHT_FAIL+1))
else
  echo "  PASS  reference_run: $(basename "$REFERENCE_RUN")"
fi

# Output run directory must NOT exist (CREATE_ONLY)
OUTPUT_ROOT="$REPO_ROOT/docs/pios/runs/$RUN_ID"
if [ -d "$OUTPUT_ROOT" ]; then
  echo "  FAIL  output_root already exists (CREATE_ONLY): $OUTPUT_ROOT"
  PREFLIGHT_FAIL=$((PREFLIGHT_FAIL+1))
else
  echo "  PASS  output_root is fresh: $OUTPUT_ROOT"
fi

if [ "$PREFLIGHT_FAIL" -gt 0 ]; then
  echo ""
  echo "PRE-FLIGHT FAIL: $PREFLIGHT_FAIL check(s) failed"
  exit 1
fi

echo "PRE-FLIGHT: PASS"
echo ""

# ── STEP 1: GENERATE IG.5 SCHEMA ─────────────────────────────────────────────
echo "--- STEP 1: Generate IG.5 input schema ---"

SCHEMA_FILE="$(mktemp /tmp/${RUN_ID}_XXXXXX.schema)"
trap "rm -f $SCHEMA_FILE" EXIT

cat > "$SCHEMA_FILE" <<SCHEMAEOF
# IG Pipeline Wrapper — auto-generated schema
# run_ig_pipeline.sh — DO NOT EDIT

run_id=$RUN_ID
baseline_anchor=baseline/pios-core-v0.4-final
branch=work/ig-foundation
profile.kind=LOCAL_SNAPSHOT
profile.admissibility=GOVERNED
profile.resolution=DETERMINISTIC
source_path=$SOURCE_ABS
output_root=$OUTPUT_ROOT
reference_run=$REFERENCE_RUN
orchestration_launcher=$REPO_ROOT/scripts/pios/ig4/orchestration_launcher.sh
github.mode=OFF
jira.mode=CAPSULE
run.mode=SOURCE_PROFILED_INGESTION
execution.mode=CREATE_ONLY
SCHEMAEOF

echo "  schema: $SCHEMA_FILE"
echo "  output_root: $OUTPUT_ROOT"
echo "  PASS  schema generated"
echo ""

# ── STEP 2: EXECUTE IG.5 → IG.4 → IG.3 ──────────────────────────────────────
echo "--- STEP 2: Execute IG.5 → IG.4 → IG.3 ---"
echo ""

if ! bash "$IG5" "$SCHEMA_FILE"; then
  echo ""
  echo "PIPELINE FAIL: IG.5 source_profile_resolver.sh returned non-zero"
  exit 2
fi

echo ""

# Verify run directory was created
if [ ! -d "$OUTPUT_ROOT" ]; then
  echo "PIPELINE FAIL: output_root not created: $OUTPUT_ROOT"
  exit 2
fi
echo "  PASS  run directory created: $OUTPUT_ROOT"
echo ""

# ── STEP 3: GENERATE IG.7 run_input.json ─────────────────────────────────────
echo "--- STEP 3: Generate IG.7 run_input.json ---"

RUN_INPUT_JSON="$(mktemp /tmp/${RUN_ID}_run_input_XXXXXX.json)"
trap "rm -f $SCHEMA_FILE $RUN_INPUT_JSON" EXIT

python3 - "$RUN_INPUT_JSON" "$RUN_ID" "$OUTPUT_ROOT" "$REFERENCE_RUN" "$REPO_ROOT" "$CLIENT" <<'PYEOF'
import json, sys

out_path     = sys.argv[1]
run_id       = sys.argv[2]
output_root  = sys.argv[3]
reference    = sys.argv[4]
repo_root    = sys.argv[5]
client_id    = sys.argv[6]

payload = {
    "run_id":          run_id,
    "client_id":       client_id,
    "profile": {
        "kind":          "LOCAL_SNAPSHOT",
        "admissibility": "GOVERNED",
        "resolution":    "DETERMINISTIC"
    },
    "output_root":     output_root,
    "reference_run":   reference,
    "resolver":        f"{repo_root}/scripts/pios/ig5/source_profile_resolver.sh",
    "governance":      "IG.6",
    "run_mode":        "SOURCE_PROFILED_INGESTION",
    "execution_mode":  "CREATE_ONLY"
}

with open(out_path, "w") as f:
    json.dump(payload, f, indent=2)
    f.write("\n")
print(f"  run_input.json: {out_path}")
PYEOF

echo "  PASS  run_input.json generated"
echo ""

# ── STEP 4: EXECUTE IG.7 → IG.6 → IG.7 normalizer ───────────────────────────
echo "--- STEP 4: Execute IG.7 → IG.6 → normalizer ---"
echo ""

if ! bash "$IG7" "$RUN_INPUT_JSON"; then
  echo ""
  echo "PAYLOAD FAIL: ingestion_batch_runner.sh returned non-zero"
  exit 3
fi

echo ""

# ── STEP 5: VALIDATE OUTPUT ───────────────────────────────────────────────────
echo "--- STEP 5: Validate payload_manifest.json ---"

PAYLOAD_MANIFEST="$OUTPUT_ROOT/payload_manifest.json"

if [ ! -f "$PAYLOAD_MANIFEST" ]; then
  echo "  FAIL  payload_manifest.json not found: $PAYLOAD_MANIFEST"
  exit 2
fi
echo "  PASS  payload_manifest.json exists"

# Verify required keys
python3 - "$PAYLOAD_MANIFEST" <<'PYEOF'
import json, sys
try:
    data = json.load(open(sys.argv[1]))
    required_keys = ["layers", "run_id", "governance", "provenance"]
    required_layers = ["L40_2", "L40_3", "L40_4"]
    fail = 0
    for k in required_keys:
        if k in data:
            print(f"  PASS  key present: {k}")
        else:
            print(f"  FAIL  key missing: {k}")
            fail += 1
    layers = data.get("layers", {})
    for l in required_layers:
        if l in layers:
            cnt = layers[l].get("artifact_count", 0)
            print(f"  PASS  {l}: {cnt} artifacts")
        else:
            print(f"  FAIL  layer missing: {l}")
            fail += 1
    if fail > 0:
        sys.exit(1)
except Exception as e:
    print(f"  FAIL  could not parse payload_manifest.json: {e}")
    sys.exit(1)
PYEOF

echo ""

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "════════════════════════════════════════════"
echo "IG_SUCCESS"
echo ""
echo "  run_id:           $RUN_ID"
echo "  client:           $CLIENT"
echo "  log_file:         $LOG_FILE"
echo "  payload_manifest: $PAYLOAD_MANIFEST"
echo "════════════════════════════════════════════"
echo "payload_manifest=$PAYLOAD_MANIFEST"

exit 0
