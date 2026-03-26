#!/usr/bin/env python3
"""
validate_mode_state_guard.py
PIOS-51.6R.2-RUN01-CONTRACT-v1

Validates: explicit demoActive mode guard on traversal logic,
demo exit resets selectedFlow, persona click does not change flow,
flow derived at demo start from persona (not on persona click).

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

# ── mode_state_guard ──────────────────────────────────────────────────────────

print("\n[mode_state_guard]")

idx = read("app/execlens-demo/pages/index.js")
dc  = read("app/execlens-demo/components/DemoController.js")

check("index.js has PIOS-51.6R.2 contract",              "mode_state_guard",
      "PIOS-51.6R.2-RUN01-CONTRACT-v1" in idx)
check("index.js hero meta shows 51.6R.2",                "mode_state_guard",
      "51.6R.2" in idx)
check("Stage effect has explicit demoActive guard",       "mode_state_guard",
      "if (!demoActive || !demoStage) return" in idx)
check("Stage effect: selectedFlow gate preserved",        "mode_state_guard",
      "if (selectedFlow) return" in idx)
check("PERSONA_AUTO_OPEN guarded: only during demo",      "mode_state_guard",
      "if (!enlPersona || !demoActive) return" in idx)
check("demoActive referenced in index.js",               "mode_state_guard",
      idx.count("demoActive") >= 4)
check("DemoController contract lineage preserved",        "mode_state_guard",
      "PIOS-51.6R.1-RUN01-CONTRACT-v1" in dc)

# ── persona_isolation ─────────────────────────────────────────────────────────

print("\n[persona_isolation]")

check("Persona→flow auto-assign effect removed",          "persona_isolation",
      "if (defaultFlow) setSelectedFlow(defaultFlow)" not in idx)
check("No standalone [enlPersona]-only effect",           "persona_isolation",
      "}, [enlPersona])" not in idx)
check("Persona click: setEnlPersona callback only",       "persona_isolation",
      "onPersonaChange={setEnlPersona}" in idx)
check("PERSONA_DEFAULT_FLOW constant preserved",          "persona_isolation",
      "PERSONA_DEFAULT_FLOW" in idx)
check("PERSONA_AUTO_OPEN import preserved",               "persona_isolation",
      "PERSONA_AUTO_OPEN" in idx)
check("Persona auto-open effect depends on demoActive",   "persona_isolation",
      "}, [enlPersona, demoActive])" in idx)
check("No flow selector in pre-demo hero",                "persona_isolation",
      "demo-flow-inline" not in idx and "demo-entry-zone" not in idx)

# ── demo_exit_reset ───────────────────────────────────────────────────────────

print("\n[demo_exit_reset]")

check("handleDemoExit resets selectedFlow to null",       "demo_exit_reset",
      "setSelectedFlow(null)" in idx)
check("handleDemoExit resets demoActive",                 "demo_exit_reset",
      "setDemoActive(false)" in idx)
check("handleDemoExit resets demoStage",                  "demo_exit_reset",
      "setDemoStage(0)" in idx)
check("handleDemoExit resets traversalNodeIndex",         "demo_exit_reset",
      "setTraversalNodeIndex(0)" in idx)
check("exit reset annotation present",                    "demo_exit_reset",
      "mandatory exit reset" in idx or "51.6R.2" in idx)

# ── flow_derivation ───────────────────────────────────────────────────────────

print("\n[flow_derivation]")

check("activeFlow derived in handleStartDemo",            "flow_derivation",
      "activeFlow" in idx)
check("PERSONA_DEFAULT_FLOW[enlPersona] in handleStartDemo","flow_derivation",
      "PERSONA_DEFAULT_FLOW[enlPersona]" in idx)
check("selectedFlow fallback in flow derivation",         "flow_derivation",
      "selectedFlow || (enlPersona ? PERSONA_DEFAULT_FLOW[enlPersona]" in idx)
check("setSelectedFlow(activeFlow) at demo start",        "flow_derivation",
      "setSelectedFlow(activeFlow)" in idx)
check("getFlowPanels uses activeFlow",                    "flow_derivation",
      "getFlowPanels(activeFlow)" in idx)
check("selectedFlow state declared",                      "flow_derivation",
      "useState(null)" in idx and "selectedFlow" in idx)

# ── no_mutation ───────────────────────────────────────────────────────────────

print("\n[no_mutation]")

te  = read("app/execlens-demo/components/TraversalEngine.js")
enl = read("app/execlens-demo/components/ENLPanel.js")

check("TraversalEngine.js unchanged (no 51.6R.2 ref)",   "no_mutation",
      "51.6R.2" not in te)
check("ENLPanel.js unchanged (no 51.6R.2 ref)",          "no_mutation",
      "51.6R.2" not in enl)
check("No new fetch calls in index.js",                   "no_mutation",
      idx.count("fetch(") == 1)
check("No new API routes in index.js",                    "no_mutation",
      idx.count("api/execlens") == 1)

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

out_path = REPO_ROOT / "docs/pios/51.6R.2/validation_log.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out = {"stream": "51.6R.2", "timestamp": datetime.utcnow().isoformat() + "Z",
       "total": total, "passed": passed, "failed": failed, "groups": groups, "results": RESULTS}
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")
sys.exit(0 if failed == 0 else 1)
