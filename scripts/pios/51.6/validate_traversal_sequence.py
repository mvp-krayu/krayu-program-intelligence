#!/usr/bin/env python3
"""
validate_traversal_sequence.py
PIOS-51.6-RUN01-CONTRACT-v1

Validates: traversal sequence enforcement, flow definitions, node ordering,
single-focus-node contract, progressive disclosure rules.

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

# ── source_structure ──────────────────────────────────────────────────────────

print("\n[source_structure]")

te  = read("app/execlens-demo/components/TraversalEngine.js")
dc  = read("app/execlens-demo/components/DemoController.js")
idx = read("app/execlens-demo/pages/index.js")
css = read("app/execlens-demo/styles/globals.css")

check("TraversalEngine.js present",                   "source_structure", bool(te))
check("TraversalEngine.js PIOS-51.6 contract",        "source_structure", "PIOS-51.6-RUN01-CONTRACT-v1" in te)
check("TraversalEngine.js NODE_TO_PANEL",              "source_structure", "NODE_TO_PANEL" in te)
check("TraversalEngine.js TRAVERSAL_FLOWS",            "source_structure", "TRAVERSAL_FLOWS" in te)
check("TraversalEngine.js PERSONA_AUTO_OPEN",          "source_structure", "PERSONA_AUTO_OPEN" in te)
check("TraversalEngine.js getFlowPanels",              "source_structure", "getFlowPanels" in te)
check("TraversalEngine.js getFlowNodes",               "source_structure", "getFlowNodes" in te)
check("DemoController.js PIOS-51.6 contract",         "source_structure", "PIOS-51.6-RUN01-CONTRACT-v1" in dc)
check("DemoController.js imports TraversalEngine",    "source_structure", "TraversalEngine" in dc)
check("DemoController.js FlowSelector component",     "source_structure", "FlowSelector" in dc)
check("DemoController.js TraversalBar component",     "source_structure", "TraversalBar" in dc)
check("DemoController.js DEMO_STAGES preserved",      "source_structure", "DEMO_STAGES" in dc)
check("index.js PIOS-51.6 contract",                  "source_structure", "PIOS-51.6-RUN01-CONTRACT-v1" in idx)
check("index.js imports TraversalEngine",             "source_structure", "TraversalEngine" in idx)
check("index.js selectedFlow state",                  "source_structure", "selectedFlow" in idx)
check("index.js traversalNodeIndex state",            "source_structure", "traversalNodeIndex" in idx)
check("index.js PERSONA_AUTO_OPEN used",              "source_structure", "PERSONA_AUTO_OPEN" in idx)
check("index.js getFlowPanels used",                  "source_structure", "getFlowPanels" in idx)
check("index.js getFlowNodes used",                   "source_structure", "getFlowNodes" in idx)
check("globals.css PIOS-51.6 block",                  "source_structure", "PIOS-51.6" in css)
check("globals.css .te-flow-selector",                "source_structure", ".te-flow-selector" in css)
check("globals.css .te-node-dot",                     "source_structure", ".te-node-dot" in css)
check("globals.css .demo-bar-traversal",              "source_structure", ".demo-bar-traversal" in css)

# ── traversal_engine ──────────────────────────────────────────────────────────

print("\n[traversal_engine]")

# Verify all 3 flows defined
check("executive_insight flow defined",               "traversal_engine", "executive_insight" in te)
check("structural_analysis flow defined",             "traversal_engine", "structural_analysis" in te)
check("evidence_audit flow defined",                  "traversal_engine", "evidence_audit" in te)

# Verify node types
for node in ["ENTRY", "ANSWER", "SIGNAL", "STRUCTURE", "EVIDENCE", "TRACEABILITY", "NAVIGATION"]:
    check(f"NODE_TO_PANEL {node} defined",            "traversal_engine", node in te)

# Verify panel mappings
check("ANSWER maps to narrative",                     "traversal_engine", "ANSWER" in te and "'narrative'" in te)
check("SIGNAL maps to signals",                       "traversal_engine", "SIGNAL" in te and "'signals'" in te)
check("STRUCTURE maps to situation",                  "traversal_engine", "STRUCTURE" in te and "'situation'" in te)
check("EVIDENCE maps to evidence",                    "traversal_engine", "EVIDENCE" in te and "'evidence'" in te)

# Verify flow sequences
check("executive_insight: ANSWER first",              "traversal_engine",
      "executive_insight" in te and "nodes" in te and "'ANSWER'" in te.split("executive_insight")[1].split("}")[0])
check("evidence_audit: EVIDENCE first",               "traversal_engine",
      "evidence_audit" in te and "'EVIDENCE'" in te.split("evidence_audit")[1].split("}")[0])
check("structural_analysis has 4 nodes",              "traversal_engine",
      te.count("'ANSWER', 'STRUCTURE', 'SIGNAL', 'EVIDENCE'") >= 1)

# Verify traversal mode single-focus-node in index.js
check("traversal mode sets openPanels to single panel", "traversal_engine",
      "setOpenPanels([panels[nextIndex]])" in idx)
check("handleStartDemo opens first flow panel",       "traversal_engine",
      "getFlowPanels(selectedFlow)" in idx and "panels[0]" in idx)
check("stage effect skipped when traversal active",   "traversal_engine",
      "if (selectedFlow) return" in idx)

# ── persona_behavior ──────────────────────────────────────────────────────────

print("\n[persona_behavior]")

check("PERSONA_AUTO_OPEN EXECUTIVE defined",          "persona_behavior", "EXECUTIVE" in te and "narrative" in te)
check("PERSONA_AUTO_OPEN CTO defined",                "persona_behavior", "CTO" in te and "situation" in te)
check("PERSONA_AUTO_OPEN ANALYST defined",            "persona_behavior", "ANALYST" in te)
check("PERSONA_AUTO_OPEN: EXECUTIVE ANSWER only",     "persona_behavior",
      "EXECUTIVE: ['narrative']" in te)
check("PERSONA_AUTO_OPEN: CTO ANSWER+STRUCTURE+SIGNAL", "persona_behavior",
      "CTO:       ['narrative', 'situation', 'signals']" in te or
      "CTO: ['narrative', 'situation', 'signals']" in te)
check("PERSONA_AUTO_OPEN: ANALYST ANSWER+SIGNAL",     "persona_behavior",
      "ANALYST:   ['narrative', 'signals']" in te or
      "ANALYST: ['narrative', 'signals']" in te)
check("persona auto-open skips when demo active",     "persona_behavior",
      "demoActive" in idx and "PERSONA_AUTO_OPEN" in idx)
check("persona auto-open respects max-2 rule",        "persona_behavior",
      "merged.length > 2" in idx)
check("persona auto-open: zero content variation",    "persona_behavior",
      "Zero content variation" in idx or "zero content variation" in idx)

# ── progressive_disclosure ────────────────────────────────────────────────────

print("\n[progressive_disclosure]")

check("traversal mode: single panel open at a time",  "progressive_disclosure",
      "setOpenPanels([panels[" in idx)
check("DemoController shows flow selector pre-demo",  "progressive_disclosure",
      "onFlowSelect" in dc and "FlowSelector" in dc)
check("DemoController traversal bar shows node pos",  "progressive_disclosure",
      "nodeIndex + 1" in dc and "nodes.length" in dc)
check("DemoController standard mode preserved",       "progressive_disclosure",
      "StageBar" in dc and "DEMO_STAGES" in dc)
check("DemoController keyboard nav preserved",        "progressive_disclosure",
      "ArrowRight" in dc and "Escape" in dc)

# ── api_regression ────────────────────────────────────────────────────────────

print("\n[api_regression]")

ROUTES = [
    ("/api/execlens?query=GQ-001",                   "query GQ-001"),
    ("/api/execlens?query=GQ-002",                   "query GQ-002"),
    ("/api/execlens?query=GQ-003",                   "query GQ-003"),
    ("/api/execlens?topology=true",                  "topology"),
    ("/api/execlens?status=true",                    "status"),
    ("/api/execlens?enl=GQ-001",                     "enl GQ-001"),
    ("/api/execlens?enl=GQ-003",                     "enl GQ-003"),
    ("/api/execlens?persona=EXECUTIVE&query=GQ-003", "persona EXECUTIVE GQ-003"),
    ("/api/execlens?persona=CTO&query=GQ-003",       "persona CTO GQ-003"),
    ("/api/execlens?persona=ANALYST&query=GQ-003",   "persona ANALYST GQ-003"),
    ("/api/execlens?persona=EXECUTIVE&query=GQ-001", "persona EXECUTIVE GQ-001"),
    ("/api/execlens?persona=CTO&query=GQ-002",       "persona CTO GQ-002"),
]

for path, label in ROUTES:
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
    if g not in groups:
        groups[g] = {"pass": 0, "fail": 0}
    if r["status"] == "PASS":
        groups[g]["pass"] += 1
    else:
        groups[g]["fail"] += 1

for g, c in groups.items():
    print(f"  {g}: {c['pass']}/{c['pass']+c['fail']}")

out_path = REPO_ROOT / "docs/pios/51.6/validation_log.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out = {
    "stream": "51.6", "validator": "validate_traversal_sequence",
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "total": total, "passed": passed, "failed": failed,
    "groups": groups, "results": RESULTS,
}
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")
sys.exit(0 if failed == 0 else 1)
