#!/usr/bin/env python3
"""
validate_51_8.py
PIOS-51.8-RUN01-CONTRACT-v1

Validation suite: persona_first_entry, guided_demo_sequence,
free_explore_separation, no_persona_gate_regression,
no_empty_evidence_regression, analyst_raw_access_regression.

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

# ── persona_first_entry ────────────────────────────────────────────────────────

print("\n[persona_first_entry]")

idx = read("app/execlens-demo/pages/index.js")
css = read("app/execlens-demo/styles/globals.css")

check("index.js has PIOS-51.8 contract",                 "persona_first_entry",
      "PIOS-51.8-RUN01-CONTRACT-v1" in idx)
check("guided-entry-steps class present in index.js",    "persona_first_entry",
      "guided-entry-steps" in idx)
check("Step 1 label present",                            "persona_first_entry",
      "Select your lens persona" in idx)
check("Step 2 label present",                            "persona_first_entry",
      "guided-step-num" in idx and "guided-step-label" in idx)
check("Persona and Situation panels present",            "persona_first_entry",
      "id=\"persona\"" in idx and "id=\"situation\"" in idx)  # 51.8R final polish: order superseded — situation moved to first position
check("Panel default open state present",               "persona_first_entry",
      "useState(['situation'])" in idx)  # 51.8R final polish: default superseded — situation expands on entry
check("globals.css has PIOS-51.8 block",                 "persona_first_entry",
      "PIOS-51.8" in css)
check("globals.css .guided-entry-steps defined",         "persona_first_entry",
      ".guided-entry-steps" in css)
check("globals.css .guided-step defined",                "persona_first_entry",
      ".guided-step {" in css or ".guided-step\n" in css or ".guided-step " in css)

# ── guided_demo_sequence ───────────────────────────────────────────────────────

print("\n[guided_demo_sequence]")

check("handleToggle present in index.js",                "guided_demo_sequence",
      "handleToggle" in idx)
check("handleToggle gates on demoActive",                "guided_demo_sequence",
      "if (demoActive) return" in idx and "handleToggle" in idx)
check("handleToggle used on all panel onToggle props",   "guided_demo_sequence",
      idx.count("handleToggle(") >= 5)
check("togglePanel no longer used in onToggle props",    "guided_demo_sequence",
      "onToggle={() => togglePanel(" not in idx)
check("Guided lock annotation present",                  "guided_demo_sequence",
      "guided demo" in idx and "51.8" in idx)
check("Traversal single-focus preserved",                "guided_demo_sequence",
      "setOpenPanels([panels[nextIndex]])" in idx)
check("handleDemoNext advances traversal deterministically","guided_demo_sequence",
      "traversalNodeIndex + 1" in idx)

# ── free_explore_separation ───────────────────────────────────────────────────

print("\n[free_explore_separation]")

check("togglePanel defined and used internally",         "free_explore_separation",
      "const togglePanel = useCallback" in idx)
check("handleToggle calls togglePanel when !demoActive", "free_explore_separation",
      "togglePanel(panelId)" in idx)
check("Free explore effect guarded by !demoActive",      "free_explore_separation",
      "if (!enlPersona || demoActive) return" in idx)
check("Guided toggle locked by demoActive guard",        "free_explore_separation",
      "if (demoActive) return" in idx)
check("handleDemoExit resets to free explore state",     "free_explore_separation",
      "setDemoActive(false)" in idx and "setSelectedFlow(null)" in idx)

# ── no_persona_gate_regression ────────────────────────────────────────────────

print("\n[no_persona_gate_regression]")

check("Persona hard gate preserved",                     "no_persona_gate_regression",
      "if (!enlPersona) return" in idx)
check("Start button disabled without persona and query", "no_persona_gate_regression",
      "disabled={!enlPersona || !selectedQuery}" in idx)  # 51.8R guided correction: dual gate supersedes persona-only
check("persona-gate-message class present",              "no_persona_gate_regression",
      "persona-gate-message" in idx)
check("Gate message text preserved",                     "no_persona_gate_regression",
      "Select a Persona to enable execution" in idx)
check("No default persona bypass",                       "no_persona_gate_regression",
      "setEnlPersona('CTO')" not in idx and "PERSONA_DEFAULT_FLOW.CTO" not in idx)
check("51.7 lineage preserved in index.js",              "no_persona_gate_regression",
      "PIOS-51.7-RUN01-CONTRACT-v1" in idx)

# ── no_empty_evidence_regression ──────────────────────────────────────────────

print("\n[no_empty_evidence_regression]")

check("Evidence blocked-state class present",            "no_empty_evidence_regression",
      "evidence-blocked-state" in idx)
check("Evidence fallback message present",               "no_empty_evidence_regression",
      "Evidence requires a selected Persona" in idx)
check("Evidence guarded by queryData && enlPersona",     "no_empty_evidence_regression",
      "queryData && enlPersona" in idx)
check("Evidence fallback on queryData && !enlPersona",   "no_empty_evidence_regression",
      "queryData && !enlPersona" in idx)
check("globals.css .evidence-blocked-state defined",     "no_empty_evidence_regression",
      ".evidence-blocked-state" in css)
check("ENLPanel renders exactly once",                   "no_empty_evidence_regression",
      idx.count("<ENLPanel") == 1)

# ── analyst_raw_access_regression ─────────────────────────────────────────────

print("\n[analyst_raw_access_regression]")

enl = read("app/execlens-demo/components/ENLPanel.js")

check("RawArtifactsSection present in ENLPanel",         "analyst_raw_access_regression",
      "RawArtifactsSection" in enl)
check("Raw artifacts gated to ANALYST persona",          "analyst_raw_access_regression",
      "persona === 'ANALYST'" in enl)
check("View raw artifacts toggle present",               "analyst_raw_access_regression",
      "View raw artifacts" in enl)
check("ENLPanel contract lineage preserved",             "analyst_raw_access_regression",
      "PIOS-51.6R.4-RUN01-CONTRACT-v1" in enl)
check("ENLPanel not modified in 51.8",                   "analyst_raw_access_regression",
      "PIOS-51.8-RUN01-CONTRACT-v1" not in enl)

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

out_path = REPO_ROOT / "docs/pios/51.8/validation_log.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out = {"stream": "51.8", "timestamp": datetime.utcnow().isoformat() + "Z",
       "total": total, "passed": passed, "failed": failed, "groups": groups, "results": RESULTS}
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")
sys.exit(0 if failed == 0 else 1)
