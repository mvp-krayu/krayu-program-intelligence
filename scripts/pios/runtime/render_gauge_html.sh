#!/usr/bin/env bash
# render_gauge_html.sh — PSEE-UI.REFRESH.1
# Renders gauge_v1_component.html from gauge_state.json
# Authority: PSEE-UI.REFRESH.1
# Usage: bash scripts/pios/runtime/render_gauge_html.sh <runtime_dir> <output_html>
# Example: bash scripts/pios/runtime/render_gauge_html.sh \
#            docs/pios/PSEE.RUNTIME/run_01 \
#            docs/pios/PSEE.UI/run_01_blueedge_surface/gauge_v1_component.html

set -euo pipefail

RUNTIME_DIR="${1:-}"
OUTPUT_HTML="${2:-}"

if [[ -z "$RUNTIME_DIR" || -z "$OUTPUT_HTML" ]]; then
  echo "FAIL_SAFE_STOP: usage: $0 <runtime_dir> <output_html>" >&2
  exit 1
fi

GS_FILE="${RUNTIME_DIR}/gauge_state.json"

if [[ ! -f "$GS_FILE" ]]; then
  echo "FAIL_SAFE_STOP: gauge_state.json not found at ${GS_FILE}" >&2
  exit 1
fi

echo "render_gauge_html.sh — PSEE-UI.REFRESH.1"
echo "  Input:  ${GS_FILE}"
echo "  Output: ${OUTPUT_HTML}"

GS_ABS="$(cd "$(dirname "$GS_FILE")" && pwd)/$(basename "$GS_FILE")"
OUT_ABS="$(cd "$(dirname "$OUTPUT_HTML")" && pwd)/$(basename "$OUTPUT_HTML")"

python3 - << PYEOF
import json, hashlib

with open("${GS_ABS}") as f:
    gs = json.load(f)

execution_status  = gs["state"]["execution_status"]
run_id            = gs["run_id"]
stream            = gs["stream"]

canonical         = gs["score"]["canonical"]
band_label        = gs["score"]["band_label"]
derivation        = gs["score"]["derivation"]
completion_pts    = gs["score"]["components"]["completion_points"]
coverage_pts      = gs["score"]["components"]["coverage_points"]
recon_pts         = gs["score"]["components"]["reconstruction_points"]

projected         = gs["projection"]["value"]
proj_rule         = gs["projection"]["rule"]
proj_caveat       = gs["projection"]["caveat"]

conf_lower        = gs["confidence"]["lower"]
conf_upper        = gs["confidence"]["upper"]

d01_pct           = gs["dimensions"]["DIM-01"]["coverage_percent"]
d01_state         = gs["dimensions"]["DIM-01"]["state_label"]
d02_state         = gs["dimensions"]["DIM-02"]["state_label"]
d02_validated     = gs["dimensions"]["DIM-02"]["validated_units"]
d02_total         = gs["dimensions"]["DIM-02"]["total_units"]
d03_val           = gs["dimensions"]["DIM-03"]["value"]
d03_state         = gs["dimensions"]["DIM-03"]["state_label"]
d04_count         = gs["dimensions"]["DIM-04"]["total_count"]
d04_state         = gs["dimensions"]["DIM-04"]["state_label"]
d05_state         = gs["dimensions"]["DIM-05"]["state"]
d06_state         = gs["dimensions"]["DIM-06"]["state"]

band_color = {"READY": "#3fb950", "CONDITIONAL": "#d29922", "BLOCKED": "#f85149"}.get(band_label, "#8b949e")
d02_color  = "#3fb950" if d02_state == "PASS" else ("#f85149" if d02_state == "FAIL" else "#d29922")

html = """<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Execution Gauge</title>
  <style>
    body { font-family: monospace; background:#0b0f14; color:#e6edf3; padding:20px; }
    .box { border:1px solid #333; padding:20px; max-width:620px; }
    .value { font-size:32px; font-weight:bold; }
    .phase { color:#58a6ff; }
    .label { color:#8b949e; font-size:12px; margin-top:14px; margin-bottom:2px; }
    .band { font-size:18px; font-weight:bold; }
    .deriv { color:#8b949e; font-size:12px; margin-top:2px; }
    .conf-wrap { margin-top:4px; }
    .conf-bar { background:#1f2937; height:6px; border-radius:3px; position:relative; margin-top:4px; width:100%; }
    .conf-fill { height:6px; border-radius:3px; }
    .conf-lower-mark { position:absolute; top:-3px; width:2px; height:12px; background:#8b949e; }
    .caveat { color:#8b949e; font-size:11px; margin-top:6px; border-left:2px solid #333; padding-left:8px; line-height:1.5; }
    .dim-table { width:100%; border-collapse:collapse; margin-top:14px; font-size:13px; }
    .dim-table td { padding:5px 8px; border-bottom:1px solid #1f2937; }
    .dim-table td:first-child { color:#8b949e; width:190px; }
    .stream-label { color:#444; font-size:11px; margin-top:14px; }
  </style>
</head>
<body>
  <div class="box">
    <div>Run: """ + run_id + """</div>
    <div class="phase">Execution Phase: """ + execution_status + """</div>
    <hr style="border-color:#1f2937;margin:14px 0;"/>

    <div class="label">Canonical Score</div>
    <div class="value">""" + str(canonical) + """ <span class="band" style="color:""" + band_color + """;">""" + band_label + """</span></div>
    <div class="deriv">""" + derivation + """ (completion=""" + str(completion_pts) + """ + coverage=""" + str(coverage_pts) + """ + reconstruction=""" + str(recon_pts) + """)</div>

    <div class="label">Projected Score (""" + proj_rule + """)</div>
    <div class="value">""" + str(projected) + """</div>
    <div class="conf-wrap">
      <div class="conf-bar">
        <div class="conf-fill" style="width:""" + str(conf_upper) + """%;background:""" + band_color + """;"></div>
        <div class="conf-lower-mark" style="left:""" + str(conf_lower) + """%;"></div>
      </div>
    </div>
    <div style="color:#8b949e;font-size:12px;margin-top:3px;">Confidence band: [""" + str(conf_lower) + """, """ + str(conf_upper) + """]</div>
    <div class="caveat">""" + proj_caveat + """</div>

    <table class="dim-table">
      <tr><td>DIM-01 Coverage</td><td>""" + str(d01_pct) + """% &mdash; """ + d01_state + """</td></tr>
      <tr><td>DIM-02 Reconstruction</td><td style="color:""" + d02_color + """;">""" + d02_state + """ (""" + str(d02_validated) + """/""" + str(d02_total) + """ units)</td></tr>
      <tr><td>DIM-03 Escalation</td><td>""" + str(d03_val) + """% &mdash; """ + d03_state + """</td></tr>
      <tr><td>DIM-04 Unknown-Space</td><td>""" + str(d04_count) + """ records &mdash; """ + d04_state + """</td></tr>
      <tr><td>DIM-05 Intake</td><td>""" + d05_state + """</td></tr>
      <tr><td>DIM-06 Heuristic</td><td>""" + d06_state + """</td></tr>
    </table>

    <div class="stream-label">Source: """ + stream + """ / gauge_state.json</div>
  </div>
</body>
</html>"""

with open("${OUT_ABS}", "w") as f:
    f.write(html)

sha = hashlib.sha256(html.encode()).hexdigest()
print(f"  gauge_v1_component.html written")
print(f"  sha256: {sha}")
PYEOF

echo "  RENDER_COMPLETE"
