#!/usr/bin/env python3
"""
validate_entry_correction.py
PIOS-51.6R.1-RUN01-CONTRACT-v1

Validates: persona-first entry model, flow selector demotion,
single CTA at entry, flow override only during active demo.

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

# ── entry_hierarchy ───────────────────────────────────────────────────────────

print("\n[entry_hierarchy]")

idx = read("app/execlens-demo/pages/index.js")
dc  = read("app/execlens-demo/components/DemoController.js")
css = read("app/execlens-demo/styles/globals.css")

check("index.js has PIOS-51.6R.1 contract",           "entry_hierarchy", "PIOS-51.6R.1-RUN01-CONTRACT-v1" in idx)
check("DemoController.js has PIOS-51.6R.1 contract",  "entry_hierarchy", "PIOS-51.6R.1-RUN01-CONTRACT-v1" in dc)
check("Pre-demo: only Start button at entry",          "entry_hierarchy",
      "demo-entry-zone" not in idx and "demo-start-btn" in idx)
check("Flow selector not in pre-demo hero",            "entry_hierarchy",
      "demo-flow-inline-wrap" not in idx)
check("Single CTA: no competing flow action at entry", "entry_hierarchy",
      idx.count("demo-start-btn") == 1 and "demo-flow-inline" not in idx)
check("Flow override inside TraversalBar only",        "entry_hierarchy",
      "te-flow-override" in dc and "TraversalBar" in dc)
check("Flow override absent from pre-demo render",     "entry_hierarchy",
      "te-flow-override" not in idx)
check("globals.css has PIOS-51.6R.1 block",            "entry_hierarchy", "PIOS-51.6R.1" in css)
check("globals.css .te-flow-override",                 "entry_hierarchy", ".te-flow-override" in css)
check("globals.css .te-bar-flow-zone",                 "entry_hierarchy", ".te-bar-flow-zone" in css)

# ── persona_priority ──────────────────────────────────────────────────────────

print("\n[persona_priority]")

te  = read("app/execlens-demo/components/TraversalEngine.js")
enl = read("app/execlens-demo/components/ENLPanel.js")

check("PERSONA_DEFAULT_FLOW in index.js",              "persona_priority", "PERSONA_DEFAULT_FLOW" in idx)
check("Persona→flow auto-binding effect present",      "persona_priority",
      "PERSONA_DEFAULT_FLOW[enlPersona]" in idx)
check("PersonaNarrativeHeader in ENLPanel",            "persona_priority", "PersonaNarrativeHeader" in enl)
check("Persona narrative dominant: framing_label",     "persona_priority", "framing_label" in enl)
check("Persona narrative dominant: primary_question",  "persona_priority", "primary_question" in enl)
check("PERSONA_AUTO_OPEN preserved in TraversalEngine","persona_priority", "PERSONA_AUTO_OPEN" in te)
check("Persona auto-open effect in index.js",          "persona_priority", "PERSONA_AUTO_OPEN" in idx)

# ── no_traversal_logic_change ─────────────────────────────────────────────────

print("\n[no_traversal_logic_change]")

te_51_6_sha = read("app/execlens-demo/components/TraversalEngine.js")
check("TraversalEngine.js PIOS-51.6 contract preserved", "no_traversal_logic_change",
      "PIOS-51.6-RUN01-CONTRACT-v1" in te and "TraversalEngine.js" in te)
check("TraversalEngine.js NOT modified in 51.6R.1",    "no_traversal_logic_change",
      "51.6R.1" not in te)
check("TRAVERSAL_FLOWS unchanged",                     "no_traversal_logic_change",
      "executive_insight" in te and "structural_analysis" in te and "evidence_audit" in te)
check("NODE_TO_PANEL unchanged",                       "no_traversal_logic_change",
      "NODE_TO_PANEL" in te and "ANSWER" in te and "narrative" in te)
check("getFlowPanels unchanged",                       "no_traversal_logic_change",
      "getFlowPanels" in te)
check("Traversal single-focus logic in index.js",      "no_traversal_logic_change",
      "getFlowPanels(selectedFlow)" in idx and "setOpenPanels([panels[nextIndex]])" in idx)

# ── no_data_mutation ──────────────────────────────────────────────────────────

print("\n[no_data_mutation]")

check("No new fetch calls in index.js",                "no_data_mutation", idx.count("fetch(") == 1)
check("No new fetch calls in DemoController",          "no_data_mutation", "fetch(" not in dc)
check("No new API routes",                             "no_data_mutation",
      "api/execlens" not in dc and idx.count("api/execlens") == 1)
check("ENLPanel not modified in 51.6R.1",              "no_data_mutation",
      "51.6R.1" not in enl)
check("TraversalEngine not modified",                  "no_data_mutation",
      "51.6R" not in te)

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

# ── Summary ──────────────────────────────────────────────────────────────────

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

out_path = REPO_ROOT / "docs/pios/51.6R.1/validation_log.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out = {"stream": "51.6R.1", "timestamp": datetime.utcnow().isoformat() + "Z",
       "total": total, "passed": passed, "failed": failed, "groups": groups, "results": RESULTS}
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")
sys.exit(0 if failed == 0 else 1)
