#!/usr/bin/env python3
"""
validate_51_8R.py
PIOS-51.8R-RUN01-CONTRACT-v1

Validation suite: entry_strip_horizontal_alignment, entry_strip_left_alignment,
persona_gate_preserved, analyst_raw_evidence_visible,
no_runtime_regression, no_evidence_mutation.

Expected: all PASS
"""

import json, sys, urllib.request, urllib.error
from datetime import datetime
from pathlib import Path

RESULTS = []
BASE_URL = "http://localhost:3000"
REPO_ROOT = Path(__file__).resolve().parents[3]

def check(name, group, passed, detail=""):
    RESULTS.append({"name": name, "group": group,
                    "status": "PASS" if passed else "FAIL", "detail": detail})
    print(f"  [{'PASS' if passed else 'FAIL'}] {name}" + (f" — {detail}" if detail else ""))

def read(path):
    try: return (REPO_ROOT / path).read_text()
    except: return ""

def http_get(path):
    try:
        with urllib.request.urlopen(f"{BASE_URL}{path}", timeout=5) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e: return e.code, {}
    except: return 0, {}

# ── entry_strip_horizontal_alignment ──────────────────────────────────────────

print("\n[entry_strip_horizontal_alignment]")

idx = read("app/execlens-demo/pages/index.js")
css = read("app/execlens-demo/styles/globals.css")

check("index.js has PIOS-51.8R contract",                "entry_strip_horizontal_alignment",
      "PIOS-51.8R-RUN01-CONTRACT-v1" in idx)
check("guided-entry-strip present in index.js",          "entry_strip_horizontal_alignment",
      "guided-entry-strip" in idx)
check("guided-step-arrow present (step separator)",      "entry_strip_horizontal_alignment",
      "guided-step-arrow" in idx)
check("Step 1 and Step 2 inside guided-entry-strip",     "entry_strip_horizontal_alignment",
      idx.index("guided-step-arrow") > idx.index("guided-step-num") and
      "guided-step-arrow" in idx.split("guided-entry-strip")[1].split("persona-gate-message")[0])
check("globals.css PIOS-51.8R block present",            "entry_strip_horizontal_alignment",
      "PIOS-51.8R" in css)
check("globals.css .guided-entry-strip defined",         "entry_strip_horizontal_alignment",
      ".guided-entry-strip" in css)
check("globals.css guided-entry-strip flex-direction row","entry_strip_horizontal_alignment",
      "guided-entry-strip" in css and "flex-direction: row" in css.split("guided-entry-strip")[1].split("}")[0])

# ── entry_strip_left_alignment ────────────────────────────────────────────────

print("\n[entry_strip_left_alignment]")

check("guided-entry-steps has align-items: flex-start",  "entry_strip_left_alignment",
      "align-items: flex-start" in css)
check("guided-step-arrow CSS class defined",             "entry_strip_left_alignment",
      ".guided-step-arrow" in css)
check("persona-gate-message outside strip (below)",      "entry_strip_left_alignment",
      "guided-entry-strip" in idx and
      idx.index("persona-gate-message") > idx.index("guided-entry-strip"))
check("Step states (active/done) preserved",             "entry_strip_left_alignment",
      "guided-step-done" in idx and "guided-step-active" in idx)

# ── persona_gate_preserved ────────────────────────────────────────────────────

print("\n[persona_gate_preserved]")

check("Persona hard gate preserved",                     "persona_gate_preserved",
      "if (!enlPersona) return" in idx)
check("Start button still disabled without persona",     "persona_gate_preserved",
      "disabled={!enlPersona}" in idx)
check("Gate message text preserved",                     "persona_gate_preserved",
      "Select a Persona to enable execution" in idx)
check("persona-gate-message class preserved",            "persona_gate_preserved",
      "persona-gate-message" in idx)
check("handleToggle guided lock preserved",              "persona_gate_preserved",
      "if (demoActive) return" in idx and "handleToggle" in idx)
check("51.8 lineage in index.js",                        "persona_gate_preserved",
      "PIOS-51.8-RUN01-CONTRACT-v1" in idx)

# ── analyst_raw_evidence_visible ──────────────────────────────────────────────

print("\n[analyst_raw_evidence_visible]")

enl = read("app/execlens-demo/components/ENLPanel.js")

check("ENLPanel has PIOS-51.8R contract",                "analyst_raw_evidence_visible",
      "PIOS-51.8R-RUN01-CONTRACT-v1" in enl)
check("RawArtifactsSection has prominent prop",          "analyst_raw_evidence_visible",
      "prominent" in enl)
check("prominent render BEFORE chain list",              "analyst_raw_evidence_visible",
      "prominent" in enl and
      enl.index("prominent") < enl.index("enl-chain-list"))
check("View raw evidence label present",                 "analyst_raw_evidence_visible",
      "View raw evidence" in enl)
check("View raw artifacts label preserved",              "analyst_raw_evidence_visible",
      "View raw artifacts" in enl)
check("raw-artifacts-section-prominent CSS class",       "analyst_raw_evidence_visible",
      "raw-artifacts-section-prominent" in enl)
check("raw-artifacts-toggle-prominent CSS class",        "analyst_raw_evidence_visible",
      "raw-artifacts-toggle-prominent" in enl)
check("globals.css .raw-artifacts-section-prominent",    "analyst_raw_evidence_visible",
      ".raw-artifacts-section-prominent" in css)

# ── no_runtime_regression ─────────────────────────────────────────────────────

print("\n[no_runtime_regression]")

te = read("app/execlens-demo/components/TraversalEngine.js")
dc = read("app/execlens-demo/components/DemoController.js")
pp = read("app/execlens-demo/components/PersonaPanel.js")

check("TraversalEngine unchanged",                       "no_runtime_regression",
      "51.8R" not in te and "51.8" not in te)
check("DemoController unchanged",                        "no_runtime_regression",
      "51.8R" not in dc and "51.8" not in dc)
check("PersonaPanel unchanged",                          "no_runtime_regression",
      "51.8R" not in pp)
check("No new fetch calls in ENLPanel",                  "no_runtime_regression",
      "fetch(" not in enl)
check("No new fetch calls in index.js",                  "no_runtime_regression",
      idx.count("fetch(") == 1)
check("No new API routes",                               "no_runtime_regression",
      idx.count("api/execlens") == 1)

# ── no_evidence_mutation ──────────────────────────────────────────────────────

print("\n[no_evidence_mutation]")

check("Raw artifacts read-only: JSON.stringify only",    "no_evidence_mutation",
      "JSON.stringify(sig.evidence" in enl)
check("No setSignals or setEvidence in ENLPanel",        "no_evidence_mutation",
      "setSignals" not in enl and "setEvidence" not in enl)
check("Raw artifacts display: existing orderedSignals",  "no_evidence_mutation",
      "orderedSignals" in enl)
check("No new state variables in ENLPanel",              "no_evidence_mutation",
      enl.count("useState(") == 1)
check("No synthetic content in ENLPanel",                "no_evidence_mutation",
      "synthetic" not in enl)

# ── api_regression ────────────────────────────────────────────────────────────

print("\n[api_regression]")

for path, label in [
    ("/api/execlens?query=GQ-003",                   "query GQ-003"),
    ("/api/execlens?topology=true",                  "topology"),
    ("/api/execlens?status=true",                    "status"),
    ("/api/execlens?persona=EXECUTIVE&query=GQ-003", "persona EXECUTIVE GQ-003"),
    ("/api/execlens?persona=CTO&query=GQ-003",       "persona CTO GQ-003"),
    ("/api/execlens?persona=ANALYST&query=GQ-003",   "persona ANALYST GQ-003"),
]:
    code, _ = http_get(path)
    check(f"route: {label}", "api_regression", code == 200, f"HTTP {code}")

# ── Summary ───────────────────────────────────────────────────────────────────

passed = sum(1 for r in RESULTS if r["status"] == "PASS")
failed = sum(1 for r in RESULTS if r["status"] == "FAIL")
total  = len(RESULTS)

print(f"\nResult: {passed}/{total} PASS")
groups = {}
for r in RESULTS:
    g = r["group"]
    if g not in groups: groups[g] = {"pass": 0, "fail": 0}
    if r["status"] == "PASS": groups[g]["pass"] += 1
    else: groups[g]["fail"] += 1
for g, c in groups.items():
    print(f"  {g}: {c['pass']}/{c['pass']+c['fail']}")

out_path = REPO_ROOT / "docs/pios/51.8R/validation_log.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out = {"stream": "51.8R", "timestamp": datetime.utcnow().isoformat() + "Z",
       "total": total, "passed": passed, "failed": failed, "groups": groups, "results": RESULTS}
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")
sys.exit(0 if failed == 0 else 1)
