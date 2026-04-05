#!/usr/bin/env bash
# PSEE-RUNTIME.5 — Gauge View Renderer (updated: gauge_state.json is score/projection/confidence authority)
#
# Usage:
#   render_gauge_view.sh <rhp_input_root> <runtime_dir>
#
# Reads:   <runtime_dir>/engine_state.json        (PSEE.RUNTIME — lifecycle authority)
#          <runtime_dir>/gauge_state.json          (PSEE.RUNTIME — score/projection/confidence/DIM-01/DIM-02 authority)
#          <runtime_dir>/operator_case_view.md     (PSEE.RUNTIME — read-only)
#          <runtime_dir>/manifest.json              (PSEE.RUNTIME — read-only)
#          <runtime_dir>/gauge_inputs.json          (PSEE.RUNTIME — read-only; DIM-03..DIM-06 only)
# Writes:  <runtime_dir>/gauge_view.json
#
# Suppression rules (PSEE-RUNTIME.5):
#   engine_state.json is the sole source of truth for execution_status and psee_engine_invoked.
#   gauge_state.json is the sole source of truth for canonical_score, projected_score, confidence,
#   and DIM-01/DIM-02 values. Renderer does NOT recompute score logic.
#   gauge_inputs.json supplies DIM-03..DIM-06 only.
#
#   - If gauge_inputs.json absent: SUPPRESSED_FALLBACK (all null)
#   - If engine_state.json → (execution_status == PRE_EXECUTION OR psee_engine_invoked == false):
#       SUPPRESSED_PRE_EXECUTION — scores/projection/confidence all null; DIM state preserved
#   - If engine_state.json → engine invoked AND state != PRE_EXECUTION:
#       ENGINE_FED — full render from gauge_state.json
#
# Rules:
#   - deterministic; read-only on all inputs; no score recomputation; no PSEE.X logic
#   - no modification of engine_state.json, gauge_state.json, or gauge_inputs.json

set -euo pipefail

RHP_ROOT="${1:-}"
RUNTIME_DIR="${2:-}"

if [ -z "$RHP_ROOT" ] || [ -z "$RUNTIME_DIR" ]; then
  echo "ERROR: usage: render_gauge_view.sh <rhp_input_root> <runtime_dir>"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
[[ "$RHP_ROOT"    != /* ]] && RHP_ROOT="$REPO_ROOT/$RHP_ROOT"
[[ "$RUNTIME_DIR" != /* ]] && RUNTIME_DIR="$REPO_ROOT/$RUNTIME_DIR"

# ── FAIL-SAFE: FORBIDDEN INPUT PATHS ─────────────────────────────────────────
for forbidden in \
  "$REPO_ROOT/docs/pios/IG.5" \
  "$REPO_ROOT/docs/pios/IG.6" \
  "$REPO_ROOT/docs/pios/IG.7" \
  "$REPO_ROOT/docs/pios/PSEE.3" \
  "$REPO_ROOT/docs/pios/PSEE.3B" \
  "$REPO_ROOT/docs/pios/PSEE.UI"; do
  if [[ "$RHP_ROOT" == "$forbidden"* ]] || [[ "$RUNTIME_DIR" == "$forbidden"* ]]; then
    echo "FAIL_SAFE_STOP: forbidden input path — $RHP_ROOT / $RUNTIME_DIR"
    exit 1
  fi
done

# ── REQUIRED BASE INPUT FILES ─────────────────────────────────────────────────
OCV="$RUNTIME_DIR/operator_case_view.md"
MANIFEST_FILE="$RUNTIME_DIR/manifest.json"
GAUGE_INPUTS_FILE="$RUNTIME_DIR/gauge_inputs.json"

[ -f "$OCV" ]           || { echo "FAIL_SAFE_STOP: operator_case_view.md not found"; exit 1; }
[ -f "$MANIFEST_FILE" ] || { echo "FAIL_SAFE_STOP: manifest.json not found"; exit 1; }

# ── ENGINE STATE (authoritative execution lifecycle source) ───────────────────
ES_FILE="$RUNTIME_DIR/engine_state.json"
[ -f "$ES_FILE" ] || { echo "FAIL_SAFE_STOP: engine_state.json not found"; exit 1; }
ES_STATUS="$(jq -r '.execution_status' "$ES_FILE")"
ES_ENGINE_INVOKED="$(jq -r '.psee_engine_invoked' "$ES_FILE")"

# ── PYTHON HELPERS (available to all render paths) ───────────────────────────
py_val() {
  local v="$1"
  if [ "$v" = "null" ]; then echo "None"; else echo "$v"; fi
}
py_bool() {
  local v="$1"
  if [ "$v" = "true" ] || [ "$v" = "True" ]; then echo "True"; else echo "False"; fi
}

ES_ENGINE_PY="$(py_bool "$ES_ENGINE_INVOKED")"

# ── EXTRACT BASELINE FIELDS FROM operator_case_view.md ───────────────────────
extract_ocv() {
  grep -m1 "^| $1 |" "$OCV" 2>/dev/null | awk -F'|' '{gsub(/^[[:space:]]+|[[:space:]]+$/,"",$3); print $3}' || echo "null"
}
extract_scalar() {
  grep -m1 "^$1: " "$OCV" 2>/dev/null | sed "s/^$1: //" | tr -d '\r' || echo "null"
}

RUN_ID="$(extract_scalar 'run_id')"
SOURCE_DATE="$(extract_scalar 'source_date')"
SOURCE_RUN="$(extract_scalar 'source_run')"
BASELINE_COMMIT="$(extract_scalar 'baseline_commit')"
RHP_ROOT_OCV="$(extract_scalar 'rhp_root')"
SRC_ANCHOR="$(extract_ocv 'baseline_anchor')"
SRC_VERSION="$(extract_ocv 'version')"
SRC_ADMIT="$(extract_ocv 'admissibility')"
SRC_RES="$(extract_ocv 'resolution')"
TOTAL_ADMITTED="$(extract_scalar 'total_admitted')"
TOTAL_EXCLUDED="$(extract_scalar 'total_excluded')"
ADMITTED_CLASS="$(extract_scalar 'admitted_input_class')"
SYS_NAME="$(echo "$SRC_VERSION" | cut -d'/' -f1)"
SYS_VER="$(echo "$SRC_VERSION" | cut -d'/' -f2)"

GAUGE_VIEW="$RUNTIME_DIR/gauge_view.json"

# ── BRANCH: gauge_inputs.json PRESENT ────────────────────────────────────────
if [ -f "$GAUGE_INPUTS_FILE" ]; then

  # gauge_inputs.json: DIM-03..DIM-06 only (PSEE-RUNTIME.5)
  GI_EXEC_MODE="$(jq -r '.execution_mode'                            "$GAUGE_INPUTS_FILE")"
  GI_D03_VAL="$(jq -r '.panel_02["DIM-03"].value'                    "$GAUGE_INPUTS_FILE")"
  GI_D03_STATE="$(jq -r '.panel_02["DIM-03"].state_label'            "$GAUGE_INPUTS_FILE")"
  GI_D04_TOTAL="$(jq -r '.panel_02["DIM-04"].total_count'            "$GAUGE_INPUTS_FILE")"
  GI_D04_STATE="$(jq -r '.panel_02["DIM-04"].state_label'            "$GAUGE_INPUTS_FILE")"
  GI_D05_STATE="$(jq -r '.panel_02["DIM-05"].state'                  "$GAUGE_INPUTS_FILE")"
  GI_D06_STATE="$(jq -r '.panel_02["DIM-06"].state'                  "$GAUGE_INPUTS_FILE")"

  # gauge_state.json: score/projection/confidence/DIM-01/DIM-02 authority (PSEE-RUNTIME.5)
  # Renderer does NOT recompute score logic — reads gauge_state.json only.
  GS_FILE_R="$RUNTIME_DIR/gauge_state.json"
  [ -f "$GS_FILE_R" ] || { echo "FAIL_SAFE_STOP: gauge_state.json not found — run materialize_gauge_state.sh first"; exit 1; }

  GS_CANONICAL="$(jq    -r '.score.canonical'     "$GS_FILE_R")"
  GS_BAND="$(jq         -r '.score.band_label'    "$GS_FILE_R")"
  GS_PROJ="$(jq         -r '.projection.value'    "$GS_FILE_R")"
  GS_PROJ_RULE="$(jq    -r '.projection.rule'     "$GS_FILE_R")"
  GS_PROJ_CAVEAT="$(jq  -r '.projection.caveat'   "$GS_FILE_R")"
  GS_CONF_LOWER="$(jq   -r '.confidence.lower'    "$GS_FILE_R")"
  GS_CONF_UPPER="$(jq   -r '.confidence.upper'    "$GS_FILE_R")"
  GS_D01_VAL="$(jq      -r '.dimensions["DIM-01"].coverage_percent' "$GS_FILE_R")"
  GS_D01_STATE="$(jq    -r '.dimensions["DIM-01"].state_label'      "$GS_FILE_R")"
  GS_D02_STATE="$(jq    -r '.dimensions["DIM-02"].state'            "$GS_FILE_R")"

  D01_PY="$(py_val "$GS_D01_VAL")"
  D02_PY="None"  # DIM-02 has no numeric bar value (state only)

  # ── SUPPRESSION GATE: engine_state.json is authoritative ─────────────────
  # execution_status and psee_engine_invoked are read from engine_state.json only.
  # gauge_inputs.json values for these fields are NOT consulted.
  if [ "$ES_STATUS" = "PRE_EXECUTION" ] || [ "$ES_ENGINE_INVOKED" = "false" ]; then

    python3 - << PYEOF > "$GAUGE_VIEW"
import json
gauge = {
  "schema_version": "1.0",
  "stream": "PSEE-RUNTIME.5",
  "run_id": "${RUN_ID}",
  "source_date": "${SOURCE_DATE}",
  "source_run": "${SOURCE_RUN}",
  "baseline_commit": "${BASELINE_COMMIT}",
  "rhp_root": "${RHP_ROOT_OCV}",
  "rendering_state": "${ES_STATUS}",
  "suppression_active": True,
  "suppression_reason": "engine not invoked (psee_engine_invoked=false) — scores and projections suppressed per PSEE-RUNTIME.5",
  "engine_state_source": "engine_state.json",
  "panel_01": {
    "run_id": "${RUN_ID}",
    "system_name": "${SYS_NAME}",
    "system_version": "${SYS_VER}",
    "score_display": {
      "canonical_score": None,
      "band_label": None,
      "projected_score": None,
      "projection_rule": None,
      "projection_caveat": None,
      "suppressed": True,
      "suppression_reason": "PRE_EXECUTION — engine not invoked"
    },
    "confidence_band": {
      "lower": None,
      "upper": None,
      "variance_factors": [],
      "status": "SUPPRESSED"
    },
    "state_indicator": {
      "current_state": "${ES_STATUS}",
      "state_label": "${ES_STATUS}",
      "execution_mode": "${GI_EXEC_MODE}",
      "psee_engine_invoked": ${ES_ENGINE_PY}
    }
  },
  "panel_02": {
    "panel_02a": [
      {
        "dim_id": "DIM-01",
        "label": "Coverage",
        "value": ${D01_PY},
        "state_label": "${GI_D01_STATE}",
        "threshold_line": 90,
        "source_field": "PSEEContext.coverage_percent",
        "authority": "DP-5-02; G-08"
      },
      {
        "dim_id": "DIM-02",
        "label": "Reconstruction",
        "value": ${D02_PY},
        "state_label": "${GI_D02_STATE}",
        "threshold_line": None,
        "source_field": "PSEEContext.reconstruction_result",
        "authority": "DP-6-01; G-09; O-07"
      },
      {
        "dim_id": "DIM-03",
        "label": "Escalation Clearance",
        "value": ${GI_D03_VAL},
        "state_label": "${GI_D03_STATE}",
        "threshold_line": None,
        "source_field": "PSEEContext.escalation_log",
        "authority": "ESC-01..06; escalation_interface_spec.md"
      }
    ],
    "panel_02b": {
      "dim_id": "DIM-04",
      "label": "Unknown-Space",
      "total_count": ${GI_D04_TOTAL},
      "breakdown": {"US-CONDITION-01": 0, "US-CONDITION-02": 0, "US-CONDITION-03": 0},
      "state_label": "${GI_D04_STATE}",
      "drill_down_link": "RL-01",
      "source_field": "PSEEContext.us_records",
      "authority": "US-CONDITION-01..03; unknown_space_interface.md"
    },
    "panel_02c": [
      {
        "dim_id": "DIM-05",
        "label": "Intake Completeness",
        "state": "${GI_D05_STATE}",
        "source_field": "PSEEContext.filter_table",
        "authority": "INV-04; G-05"
      },
      {
        "dim_id": "DIM-06",
        "label": "Heuristic Compliance",
        "state": "${GI_D06_STATE}",
        "source_field": "PSEEContext.flags",
        "authority": "HeuristicGuard; heuristic_guard_spec.md",
        "note_if_fail": "Engine implementation defect — see flags"
      }
    ]
  },
  "panel_03": {
    "panel_03a": {
      "title": "Pending Adjudications",
      "count": 0,
      "message": "No pending adjudications.",
      "adjudications": []
    },
    "panel_03b": {
      "title": "Open Review Items",
      "non_canonical_label": "NON-CANONICAL — review context only",
      "review_counter": {
        "us_records": ${GI_D04_TOTAL},
        "open_escalations": 0,
        "future_review_queue": 6,
        "reference_patterns": 3
      },
      "links": [
        {"id": "RL-01", "label": "Unknown-Space Inventory",  "target": "PSEE.X/unknown_space_inventory.md"},
        {"id": "RL-02", "label": "Escalated Positions",      "target": "PSEE.X/unknown_space_inventory.md#section-2"},
        {"id": "RL-03", "label": "Pattern Containment",      "target": "PSEE.X/pattern_containment_matrix.md"},
        {"id": "RL-04", "label": "Future Review Queue",      "target": "PSEE.X/future_review_queue.md"}
      ]
    }
  },
  "panel_04": {
    "table": [
      {
        "run_id": "${RUN_ID}",
        "system_name": "${SYS_NAME}",
        "system_version": "${SYS_VER}",
        "final_state": "${ES_STATUS}",
        "canonical_score": None,
        "band": None,
        "coverage_percent": None,
        "us_record_count": ${GI_D04_TOTAL},
        "open_escalations": 0,
        "source_run": "${SOURCE_RUN}",
        "baseline_anchor": "${SRC_ANCHOR}",
        "admissibility": "${SRC_ADMIT}",
        "resolution": "${SRC_RES}"
      }
    ],
    "sort_options": ["canonical_score", "band"],
    "note": "No aggregation or summarization of scores across rows"
  },
  "intake_summary": {
    "total_admitted": ${TOTAL_ADMITTED},
    "total_excluded": ${TOTAL_EXCLUDED},
    "admitted_input_class": "${ADMITTED_CLASS}",
    "rhp_root": "${RHP_ROOT_OCV}"
  },
  "gauge_authority": {
    "score_model":        "PSEE-GAUGE.0/gauge_score_model.md",
    "dimension_model":    "PSEE-GAUGE.0/dimension_projection_model.md",
    "confidence_model":   "PSEE-GAUGE.0/confidence_and_variance_model.md",
    "projection_spec":    "PSEE-GAUGE.0/projection_logic_spec.md",
    "rendering_contract": "PSEE-GAUGE.0/gauge_rendering_contract.md",
    "operator_visibility":"PSEE-GAUGE.0/operator_visibility_contract.md"
  }
}
print(json.dumps(gauge, indent=2))
PYEOF

    RENDER_MODE="SUPPRESSED_PRE_EXECUTION"

  # ── BRANCH: engine invoked and state != PRE_EXECUTION → full ENGINE_FED ────
  else

    python3 - << PYEOF > "$GAUGE_VIEW"
import json
gauge = {
  "schema_version": "1.0",
  "stream": "PSEE-RUNTIME.5",
  "run_id": "${RUN_ID}",
  "source_date": "${SOURCE_DATE}",
  "source_run": "${SOURCE_RUN}",
  "baseline_commit": "${BASELINE_COMMIT}",
  "rhp_root": "${RHP_ROOT_OCV}",
  "rendering_state": "${ES_STATUS}",
  "suppression_active": False,
  "engine_state_source": "engine_state.json",
  "gauge_state_source": "gauge_state.json",
  "panel_01": {
    "run_id": "${RUN_ID}",
    "system_name": "${SYS_NAME}",
    "system_version": "${SYS_VER}",
    "score_display": {
      "canonical_score": ${GS_CANONICAL},
      "band_label": "${GS_BAND}",
      "projected_score": ${GS_PROJ},
      "projection_rule": "${GS_PROJ_RULE}",
      "projection_caveat": "${GS_PROJ_CAVEAT}",
      "suppressed": False
    },
    "confidence_band": {
      "lower": ${GS_CONF_LOWER},
      "upper": ${GS_CONF_UPPER},
      "variance_factors": [],
      "status": "COMPUTED"
    },
    "state_indicator": {
      "current_state": "${ES_STATUS}",
      "state_label": "${ES_STATUS}",
      "execution_mode": "${GI_EXEC_MODE}",
      "psee_engine_invoked": ${ES_ENGINE_PY}
    }
  },
  "panel_02": {
    "panel_02a": [
      {
        "dim_id": "DIM-01",
        "label": "Coverage",
        "value": ${D01_PY},
        "state_label": "${GS_D01_STATE}",
        "threshold_line": 90,
        "source_field": "PSEEContext.coverage_percent",
        "authority": "DP-5-02; G-08"
      },
      {
        "dim_id": "DIM-02",
        "label": "Reconstruction",
        "value": ${D02_PY},
        "state_label": "${GS_D02_STATE}",
        "threshold_line": None,
        "source_field": "PSEEContext.reconstruction_result",
        "authority": "DP-6-01; G-09; O-07"
      },
      {
        "dim_id": "DIM-03",
        "label": "Escalation Clearance",
        "value": ${GI_D03_VAL},
        "state_label": "${GI_D03_STATE}",
        "threshold_line": None,
        "source_field": "PSEEContext.escalation_log",
        "authority": "ESC-01..06; escalation_interface_spec.md"
      }
    ],
    "panel_02b": {
      "dim_id": "DIM-04",
      "label": "Unknown-Space",
      "total_count": ${GI_D04_TOTAL},
      "breakdown": {"US-CONDITION-01": 0, "US-CONDITION-02": 0, "US-CONDITION-03": 0},
      "state_label": "${GI_D04_STATE}",
      "drill_down_link": "RL-01",
      "source_field": "PSEEContext.us_records",
      "authority": "US-CONDITION-01..03; unknown_space_interface.md"
    },
    "panel_02c": [
      {
        "dim_id": "DIM-05",
        "label": "Intake Completeness",
        "state": "${GI_D05_STATE}",
        "source_field": "PSEEContext.filter_table",
        "authority": "INV-04; G-05"
      },
      {
        "dim_id": "DIM-06",
        "label": "Heuristic Compliance",
        "state": "${GI_D06_STATE}",
        "source_field": "PSEEContext.flags",
        "authority": "HeuristicGuard; heuristic_guard_spec.md",
        "note_if_fail": "Engine implementation defect — see flags"
      }
    ]
  },
  "panel_03": {
    "panel_03a": {
      "title": "Pending Adjudications",
      "count": 0,
      "message": "No pending adjudications.",
      "adjudications": []
    },
    "panel_03b": {
      "title": "Open Review Items",
      "non_canonical_label": "NON-CANONICAL — review context only",
      "review_counter": {
        "us_records": ${GI_D04_TOTAL},
        "open_escalations": 0,
        "future_review_queue": 6,
        "reference_patterns": 3
      },
      "links": [
        {"id": "RL-01", "label": "Unknown-Space Inventory",  "target": "PSEE.X/unknown_space_inventory.md"},
        {"id": "RL-02", "label": "Escalated Positions",      "target": "PSEE.X/unknown_space_inventory.md#section-2"},
        {"id": "RL-03", "label": "Pattern Containment",      "target": "PSEE.X/pattern_containment_matrix.md"},
        {"id": "RL-04", "label": "Future Review Queue",      "target": "PSEE.X/future_review_queue.md"}
      ]
    }
  },
  "panel_04": {
    "table": [
      {
        "run_id": "${RUN_ID}",
        "system_name": "${SYS_NAME}",
        "system_version": "${SYS_VER}",
        "final_state": "${ES_STATUS}",
        "canonical_score": ${GS_CANONICAL},
        "band": "${GS_BAND}",
        "coverage_percent": ${D01_PY},
        "us_record_count": ${GI_D04_TOTAL},
        "open_escalations": 0,
        "source_run": "${SOURCE_RUN}",
        "baseline_anchor": "${SRC_ANCHOR}",
        "admissibility": "${SRC_ADMIT}",
        "resolution": "${SRC_RES}"
      }
    ],
    "sort_options": ["canonical_score", "band"],
    "note": "No aggregation or summarization of scores across rows"
  },
  "intake_summary": {
    "total_admitted": ${TOTAL_ADMITTED},
    "total_excluded": ${TOTAL_EXCLUDED},
    "admitted_input_class": "${ADMITTED_CLASS}",
    "rhp_root": "${RHP_ROOT_OCV}"
  },
  "gauge_authority": {
    "score_model":        "PSEE-GAUGE.0/gauge_score_model.md",
    "dimension_model":    "PSEE-GAUGE.0/dimension_projection_model.md",
    "confidence_model":   "PSEE-GAUGE.0/confidence_and_variance_model.md",
    "projection_spec":    "PSEE-GAUGE.0/projection_logic_spec.md",
    "rendering_contract": "PSEE-GAUGE.0/gauge_rendering_contract.md",
    "operator_visibility":"PSEE-GAUGE.0/operator_visibility_contract.md"
  }
}
print(json.dumps(gauge, indent=2))
PYEOF

    RENDER_MODE="ENGINE_FED"

  fi

# ── BRANCH: gauge_inputs.json ABSENT → suppressed fallback (logged) ───────────
else

  python3 - << PYEOF > "$GAUGE_VIEW"
import json
gauge = {
  "schema_version": "1.0",
  "stream": "PSEE-RUNTIME.4B",
  "run_id": "${RUN_ID}",
  "source_date": "${SOURCE_DATE}",
  "source_run": "${SOURCE_RUN}",
  "baseline_commit": "${BASELINE_COMMIT}",
  "rhp_root": "${RHP_ROOT_OCV}",
  "rendering_state": "${ES_STATUS}",
  "suppression_active": True,
  "suppression_reason": "gauge_inputs.json not found — engine state not materialized",
  "engine_state_source": "engine_state.json",
  "panel_01": {
    "run_id": "${RUN_ID}",
    "system_name": "${SYS_NAME}",
    "system_version": "${SYS_VER}",
    "score_display": {
      "canonical_score": None,
      "band_label": None,
      "projected_score": None,
      "projection_rule": None,
      "projection_caveat": None,
      "suppressed": True,
      "suppression_reason": "gauge_inputs.json absent"
    },
    "confidence_band": {"lower": None, "upper": None, "variance_factors": [], "status": "SUPPRESSED"},
    "state_indicator": {"current_state": "${ES_STATUS}", "state_label": "${ES_STATUS}", "execution_mode": "UNKNOWN", "psee_engine_invoked": ${ES_ENGINE_PY}}
  },
  "panel_02": {
    "panel_02a": [
      {"dim_id": "DIM-01", "value": None, "state_label": "PENDING"},
      {"dim_id": "DIM-02", "value": None, "state_label": "PENDING"},
      {"dim_id": "DIM-03", "value": None, "state_label": "PENDING"}
    ],
    "panel_02b": {"dim_id": "DIM-04", "total_count": None, "state_label": "PENDING"},
    "panel_02c": [
      {"dim_id": "DIM-05", "state": "PENDING"},
      {"dim_id": "DIM-06", "state": "PENDING"}
    ]
  },
  "panel_03": {"panel_03a": {"count": 0, "adjudications": []}, "panel_03b": {"us_records": None}},
  "panel_04": {"table": []}
}
print(json.dumps(gauge, indent=2))
PYEOF

  RENDER_MODE="SUPPRESSED_FALLBACK"
fi

echo ""
echo "=== PSEE-RUNTIME.5 Gauge Renderer ==="
GAUGE_HASH=$(shasum -a 256 "$GAUGE_VIEW" | awk '{print $1}')
echo "Output:       $GAUGE_VIEW"
echo "Mode:         $RENDER_MODE"
echo "sha256:       $GAUGE_HASH"
echo ""
echo "RENDER_COMPLETE"
