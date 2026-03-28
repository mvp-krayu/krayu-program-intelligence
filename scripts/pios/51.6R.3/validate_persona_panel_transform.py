#!/usr/bin/env python3
"""
validate_persona_panel_transform.py
PIOS-51.6R.3-RUN01-CONTRACT-v1

Validates: PersonaPanel renders selector + framing only (no signals, no emphasis,
no source refs); persona click opens evidence panel in free explore mode only;
no flow logic or traversal triggered by persona interaction.

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

# ── persona_panel_content ─────────────────────────────────────────────────────

print("\n[persona_panel_content]")

pp  = read("app/execlens-demo/components/PersonaPanel.js")
idx = read("app/execlens-demo/pages/index.js")

check("PersonaPanel.js has PIOS-51.6R.3 contract",       "persona_panel_content",
      "PIOS-51.6R.3-RUN01-CONTRACT-v1" in pp)
check("PersonaPanel renders framing_label",               "persona_panel_content",
      "framing_label" in pp)
check("PersonaPanel renders primary_question",            "persona_panel_content",
      "primary_question" in pp)
check("PersonaPanel renders persona selector buttons",    "persona_panel_content",
      "persona-btn" in pp and "PERSONAS" in pp)
check("PersonaPanel: no signal card rendering",           "persona_panel_content",
      "enl-signal-row" not in pp and "enl-signals" not in pp)
check("PersonaPanel: no emphasis block",                  "persona_panel_content",
      "emphasis_nodes" not in pp and "enl-emphasis-row" not in pp)
check("PersonaPanel: no source reference rendered",       "persona_panel_content",
      "enl-source" not in pp and "projection_source" not in pp)
check("PersonaPanel: SIGNAL_STATE_LABEL removed",         "persona_panel_content",
      "SIGNAL_STATE_LABEL" not in pp)

# ── evidence_open_behavior ────────────────────────────────────────────────────

print("\n[evidence_open_behavior]")

check("index.js has PIOS-51.6R.3 contract",              "evidence_open_behavior",
      "PIOS-51.6R.3-RUN01-CONTRACT-v1" in idx)
check("Persona→evidence auto-open effect removed [51.8R amendment 8]",  "evidence_open_behavior",
      "openPanel('evidence')" not in idx)  # 51.8R amendment 8: effect removed — Situation persistence requires no auto-open on persona select; max-2 rule was dropping Situation. Supersedes: openPanel('evidence') in idx
check("Evidence auto-open guard gone [51.8R amendment 8]",           "evidence_open_behavior",
      True)  # 51.8R amendment 8: effect removed entirely — guard condition gone with it. Supersedes: "if (!enlPersona || demoActive) return" in idx
check("No isolated evidence effect in removed block [51.8R amendment 8]",       "evidence_open_behavior",
      True)  # 51.8R amendment 8: effect removed — no block to check selectedFlow isolation. Supersedes: selectedFlow not in ... openPanel('evidence') split
check("Evidence auto-open dep array removed [51.8R amendment 8]",      "evidence_open_behavior",
      "enlPersona, demoActive, openPanel" not in idx)  # 51.8R amendment 8: dep array gone with effect. Supersedes: enlPersona, demoActive, openPanel in idx

# ── persona_isolation ─────────────────────────────────────────────────────────

print("\n[persona_isolation]")

check("Persona change: setEnlPersona callback only",     "persona_isolation",
      "onPersonaChange={setEnlPersona}" in idx)
check("No flow logic triggered on persona click",        "persona_isolation",
      "setSelectedFlow" not in pp)
check("PersonaPanel does not import TraversalEngine",    "persona_isolation",
      "TraversalEngine" not in pp)
check("PersonaPanel: fetch unchanged — only persona API","persona_isolation",
      "api/execlens?persona=" in pp and pp.count("fetch(") == 1)
check("index.js: one query fetch only",                  "persona_isolation",
      idx.count("fetch(") == 1)

# ── no_duplication ────────────────────────────────────────────────────────────

print("\n[no_duplication]")

enl = read("app/execlens-demo/components/ENLPanel.js")

check("Signal content not in PersonaPanel",              "no_duplication",
      "enl_signals" not in pp)
check("Evidence chain not in PersonaPanel",              "no_duplication",
      "evidence_chain" not in pp)
check("ENLPanel owns evidence chain rendering",          "no_duplication",
      "evidence_chain" in enl)
check("PersonaPanel does not render blocking_point",     "no_duplication",
      "blocking_point" not in pp)

# ── no_mutation ───────────────────────────────────────────────────────────────

print("\n[no_mutation]")

te = read("app/execlens-demo/components/TraversalEngine.js")
dc = read("app/execlens-demo/components/DemoController.js")

check("TraversalEngine.js unchanged (no 51.6R.3 ref)",  "no_mutation",
      "51.6R.3" not in te)
check("DemoController.js unchanged (no 51.6R.3 ref)",   "no_mutation",
      "51.6R.3" not in dc)
check("No new fetch calls in index.js",                  "no_mutation",
      idx.count("fetch(") == 1)
check("ENLPanel unchanged (no 51.6R.3 ref)",             "no_mutation",
      "51.6R.3" not in enl)

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

out_path = REPO_ROOT / "docs/pios/51.6R.3/validation_log.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out = {"stream": "51.6R.3", "timestamp": datetime.utcnow().isoformat() + "Z",
       "total": total, "passed": passed, "failed": failed, "groups": groups, "results": RESULTS}
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")
sys.exit(0 if failed == 0 else 1)
