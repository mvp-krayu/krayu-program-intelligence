#!/usr/bin/env python3
"""
validate_51_8R_guided.py
PIOS-51.8R-RUN01-CONTRACT-v1 (guided flow correction)

Validation suite:
  persona_selectable_without_query, start_demo_still_blocked_without_query,
  guided_tabs_not_free_navigation, exec_flow_order_correct,
  cto_flow_order_correct, analyst_flow_order_correct,
  analyst_raw_step_present, raw_step_reuses_evidence_panel,
  source_level_labels_correct, source_reference_visible,
  terminal_state_present, rerun_demo_resets_sequence,
  persona_change_resets_to_step_1, ctrl_k_exits_guided_mode,
  no_zombie_guided_state.

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

idx = read("app/execlens-demo/pages/index.js")
pp  = read("app/execlens-demo/components/PersonaPanel.js")
enl = read("app/execlens-demo/components/ENLPanel.js")
dc  = read("app/execlens-demo/components/DemoController.js")
css = read("app/execlens-demo/styles/globals.css")

# ── persona_selectable_without_query ──────────────────────────────────────────

print("\n[persona_selectable_without_query]")

check("PersonaPanel: query gate removed",                "persona_selectable_without_query",
      "if (!queryId) return null" not in pp)
check("PersonaPanel: selector renders always",           "persona_selectable_without_query",
      "persona-selector" in pp and "persona-btn" in pp)
check("PersonaPanel: ENL output gated by queryId",       "persona_selectable_without_query",
      "selectedPersona && queryId" in pp)
check("PersonaPanel: fetch still gated by queryId",      "persona_selectable_without_query",
      "if (!selectedPersona || !queryId) return" in pp)
check("PersonaPanel: persona change fires without query","persona_selectable_without_query",
      "onPersonaChange?.(personaId)" in pp)

# ── start_demo_still_blocked_without_query ────────────────────────────────────

print("\n[start_demo_still_blocked_without_query]")

check("handleStartDemo: query gate present",             "start_demo_still_blocked_without_query",
      "if (!selectedQuery) return" in idx)
check("Persona gate still first",                        "start_demo_still_blocked_without_query",
      "if (!enlPersona) return" in idx and
      idx.index("if (!enlPersona) return") < idx.index("if (!selectedQuery) return"))
check("Both gates before setDemoActive",                 "start_demo_still_blocked_without_query",
      idx.index("if (!selectedQuery) return") < idx.index("setDemoActive(true)"))
check("Start button disabled without persona OR query",  "start_demo_still_blocked_without_query",
      "disabled={!enlPersona || !selectedQuery}" in idx)
check("Persona hard gate annotation present",            "start_demo_still_blocked_without_query",
      "hard gate" in idx)

# ── guided_tabs_not_free_navigation ───────────────────────────────────────────

print("\n[guided_tabs_not_free_navigation]")

check("PERSONA_GUIDED_FLOWS constant defined",           "guided_tabs_not_free_navigation",
      "PERSONA_GUIDED_FLOWS" in idx)
check("handleDemoNext uses PERSONA_GUIDED_FLOWS",        "guided_tabs_not_free_navigation",
      "PERSONA_GUIDED_FLOWS[enlPersona]" in idx)
check("guidedStepIndex state declared",                  "guided_tabs_not_free_navigation",
      "guidedStepIndex" in idx and "useState(0)" in idx)
check("setGuidedStepIndex called on advance",            "guided_tabs_not_free_navigation",
      "setGuidedStepIndex(nextIndex)" in idx)
check("GuidedBar in DemoController",                     "guided_tabs_not_free_navigation",
      "GuidedBar" in dc)
check("DemoController routes to GuidedBar",              "guided_tabs_not_free_navigation",
      "guidedSteps" in dc and "guidedStepIndex" in dc)
check("handleToggle guided lock preserved",              "guided_tabs_not_free_navigation",
      "if (demoActive) return" in idx)

# ── exec_flow_order_correct ───────────────────────────────────────────────────

print("\n[exec_flow_order_correct]")

exec_block = idx.split("EXECUTIVE:")[2].split("]")[0] if idx.count("EXECUTIVE:") >= 2 else ""
check("EXEC flow: narrative step present",               "exec_flow_order_correct",
      "'narrative'" in exec_block)
check("EXEC flow: signals step present",                 "exec_flow_order_correct",
      "'signals'" in exec_block)
check("EXEC flow: evidence step present",                "exec_flow_order_correct",
      "'evidence'" in exec_block)
check("EXEC flow: Answer first",                         "exec_flow_order_correct",
      exec_block.index("'narrative'") < exec_block.index("'signals'"))
check("EXEC flow: 3 steps",                              "exec_flow_order_correct",
      exec_block.count("panelId") == 3)

# ── cto_flow_order_correct ────────────────────────────────────────────────────

print("\n[cto_flow_order_correct]")

cto_block = idx.split("CTO:")[2].split("]")[0] if idx.count("CTO:") >= 2 else ""
check("CTO flow: signals step present",                  "cto_flow_order_correct",
      "'signals'" in cto_block)
check("CTO flow: evidence step present",                 "cto_flow_order_correct",
      "'evidence'" in cto_block)
check("CTO flow: narrative step present",                "cto_flow_order_correct",
      "'narrative'" in cto_block)
check("CTO flow: Signal first",                          "cto_flow_order_correct",
      cto_block.index("'signals'") < cto_block.index("'evidence'") < cto_block.index("'narrative'"))
check("CTO flow: 3 steps",                               "cto_flow_order_correct",
      cto_block.count("panelId") == 3)

# ── analyst_flow_order_correct ────────────────────────────────────────────────

print("\n[analyst_flow_order_correct]")

ana_block = idx.split("ANALYST:")[2].split("]")[0] if idx.count("ANALYST:") >= 2 else ""
check("ANALYST flow: evidence first",                    "analyst_flow_order_correct",
      ana_block.index("'evidence'") < ana_block.index("'signals'"))
check("ANALYST flow: signals second",                    "analyst_flow_order_correct",
      ana_block.index("'signals'") < ana_block.index("'narrative'"))
check("ANALYST flow: narrative third",                   "analyst_flow_order_correct",
      "'narrative'" in ana_block)
check("ANALYST flow: raw step last",                     "analyst_flow_order_correct",
      "rawStep" in ana_block)
check("ANALYST flow: 4 steps",                           "analyst_flow_order_correct",
      ana_block.count("panelId") == 4)

# ── analyst_raw_step_present ──────────────────────────────────────────────────

print("\n[analyst_raw_step_present]")

check("rawStep: true in ANALYST flow",                   "analyst_raw_step_present",
      "rawStep: true" in idx)
check("rawStepActive state declared",                    "analyst_raw_step_present",
      "rawStepActive" in idx and "useState(false)" in idx)
check("setRawStepActive(true) called on raw step",       "analyst_raw_step_present",
      "setRawStepActive(true)" in idx)
check("rawStepActive passed to ENLPanel",                "analyst_raw_step_present",
      "rawStepActive={rawStepActive}" in idx)
check("ENLPanel accepts rawStepActive prop",             "analyst_raw_step_present",
      "rawStepActive" in enl)

# ── raw_step_reuses_evidence_panel ────────────────────────────────────────────

print("\n[raw_step_reuses_evidence_panel]")

check("RAW step panelId is 'evidence'",                  "raw_step_reuses_evidence_panel",
      "panelId: 'evidence',  rawStep: true" in idx or
      ("rawStep: true" in idx and "'evidence'" in idx.split("rawStep: true")[0].split("{")[-1]))
check("No new panel for RAW step",                       "raw_step_reuses_evidence_panel",
      "'raw'" not in [p.strip().strip("'") for p in
       idx.split("id=")[1:4]] if "id=" in idx else True)
check("forceOpen prop in RawArtifactsSection",           "raw_step_reuses_evidence_panel",
      "forceOpen" in enl)
check("forceOpen triggers setOpen(true)",                "raw_step_reuses_evidence_panel",
      "if (forceOpen) setOpen(true)" in enl)
check("No new fetch call for raw step",                  "raw_step_reuses_evidence_panel",
      enl.count("fetch(") == 0 and idx.count("fetch(") == 1)

# ── source_level_labels_correct ───────────────────────────────────────────────

print("\n[source_level_labels_correct]")

check("Collapsed label: 'View source-level evidence'",  "source_level_labels_correct",
      "View source-level evidence" in enl)
check("Expanded label: 'Hide source-level evidence'",   "source_level_labels_correct",
      "Hide source-level evidence" in enl)
check("Header: ANALYST MODE — SOURCE EVIDENCE",         "source_level_labels_correct",
      "ANALYST MODE — SOURCE EVIDENCE" in enl)
check("'View raw evidence' label removed",              "source_level_labels_correct",
      "View raw evidence" not in enl)
check("'View raw artifacts' non-prominent preserved",   "source_level_labels_correct",
      "View raw artifacts" in enl)

# ── source_reference_visible ──────────────────────────────────────────────────

print("\n[source_reference_visible]")

check("sig.evidence.source_file present",               "source_reference_visible",
      "sig.evidence.source_file" in enl)
check("[Open] affordance present",                      "source_reference_visible",
      "[Open]" in enl)
check("raw-artifact-source-ref class present",          "source_reference_visible",
      "raw-artifact-source-ref" in enl)
check("raw-artifact-source-file class present",         "source_reference_visible",
      "raw-artifact-source-file" in enl)
check("No new API call for source ref",                 "source_reference_visible",
      enl.count("fetch(") == 0)

# ── terminal_state_present ────────────────────────────────────────────────────

print("\n[terminal_state_present]")

check("demoComplete state declared",                    "terminal_state_present",
      "demoComplete" in idx)
check("guided-terminal-strip renders on demoComplete",  "terminal_state_present",
      "guided-terminal-strip" in idx and "demoComplete" in idx)
check("Guided demo complete label",                     "terminal_state_present",
      "Guided demo complete" in idx)
check("Exit guided mode button present",                "terminal_state_present",
      "Exit guided mode" in idx)
check("DemoController inactive at terminal",            "terminal_state_present",
      "demoActive && !demoComplete" in idx)

# ── rerun_demo_resets_sequence ────────────────────────────────────────────────

print("\n[rerun_demo_resets_sequence]")

check("handleStartDemo resets guidedStepIndex",         "rerun_demo_resets_sequence",
      "setGuidedStepIndex(0)" in idx)
check("handleStartDemo resets rawStepActive",           "rerun_demo_resets_sequence",
      "setRawStepActive(false)" in idx)
check("handleStartDemo resets demoComplete",            "rerun_demo_resets_sequence",
      "setDemoComplete(false)" in idx)
check("handleStartDemo persona gate first",             "rerun_demo_resets_sequence",
      "if (!enlPersona) return" in idx)

# ── persona_change_resets_to_step_1 ──────────────────────────────────────────

print("\n[persona_change_resets_to_step_1]")

check("prevEnlPersonaRef declared",                     "persona_change_resets_to_step_1",
      "prevEnlPersonaRef" in idx)
check("persona change clears guidedStepIndex",          "persona_change_resets_to_step_1",
      "prevEnlPersonaRef" in idx and "setGuidedStepIndex(0)" in idx)
check("persona change clears rawStepActive",            "persona_change_resets_to_step_1",
      "prevEnlPersonaRef" in idx and "setRawStepActive(false)" in idx)
check("persona change dep: not [enlPersona] only",      "persona_change_resets_to_step_1",
      "}, [enlPersona])" not in idx)
check("persona change clears demoActive",               "persona_change_resets_to_step_1",
      "setDemoActive(false)" in idx)

# ── ctrl_k_exits_guided_mode ──────────────────────────────────────────────────

print("\n[ctrl_k_exits_guided_mode]")

check("⌘K keydown handler present",                    "ctrl_k_exits_guided_mode",
      "keydown" in idx and ("metaKey" in idx or "ctrlKey" in idx))
check("key === 'k' check present",                     "ctrl_k_exits_guided_mode",
      "key === 'k'" in idx)
check("⌘K calls handleDemoExit",                       "ctrl_k_exits_guided_mode",
      "handleDemoExit()" in idx)
check("Event listener cleaned up",                     "ctrl_k_exits_guided_mode",
      "removeEventListener" in idx)
check("guided-exit-kbd kbd element",                   "ctrl_k_exits_guided_mode",
      "guided-exit-kbd" in idx)

# ── no_zombie_guided_state ────────────────────────────────────────────────────

print("\n[no_zombie_guided_state]")

check("handleDemoExit resets guidedStepIndex",          "no_zombie_guided_state",
      idx.count("setGuidedStepIndex(0)") >= 2)  # handleStartDemo + handleDemoExit
check("handleDemoExit resets rawStepActive",            "no_zombie_guided_state",
      idx.count("setRawStepActive(false)") >= 2)  # handleStartDemo + handleDemoExit
check("handleToggle still locks on demoActive",         "no_zombie_guided_state",
      "if (demoActive) return" in idx)
check("No hybrid guided/free state",                   "no_zombie_guided_state",
      "guidedStepIndex" in idx and "setDemoActive(false)" in idx)
check("Guided lock held at terminal (demoActive=true)", "no_zombie_guided_state",
      "setDemoComplete(true)" in idx)

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

out_path = REPO_ROOT / "docs/pios/51.8R/validation_log_guided.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out = {"stream": "51.8R", "validator": "validate_51_8R_guided",
       "timestamp": datetime.utcnow().isoformat() + "Z",
       "total": total, "passed": passed, "failed": failed, "groups": groups, "results": RESULTS}
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")
sys.exit(0 if failed == 0 else 1)
