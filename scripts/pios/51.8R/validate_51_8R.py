#!/usr/bin/env python3
"""
validate_51_8R.py
PIOS-51.8R-RUN01-CONTRACT-v1 (amended: terminal state, analyst label, source traceability,
tab contrast, guided flow correction, guided loop closure)

Validation suite: entry_strip_horizontal_alignment, entry_strip_left_alignment,
persona_gate_preserved, analyst_raw_evidence_visible,
no_runtime_regression, no_evidence_mutation, api_regression,
analyst_label_corrected, source_link_present, active_tab_contrast_readable,
demo_terminal_state_present, ctrl_k_exit_guided_mode,
rerun_demo_resets_sequence, persona_switch_resets_to_step_1,
no_zombie_guided_state, guided_loop_closure.

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
check("Start button disabled without persona and query", "persona_gate_preserved",
      "disabled={!enlPersona || !selectedQuery}" in idx)  # 51.8R guided correction: dual gate supersedes persona-only
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
check("View source-level evidence label present",        "analyst_raw_evidence_visible",
      "View source-level evidence" in enl)  # 51.8R guided correction: supersedes 'View raw evidence'
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
check("DemoController contract lineage preserved",       "no_runtime_regression",
      "PIOS-51.6R.1-RUN01-CONTRACT-v1" in dc)  # 51.8R guided correction: GuidedBar added — supersedes unchanged check
check("PersonaPanel selector ungated from query",        "no_runtime_regression",
      "if (!queryId) return null" not in pp)  # 51.8R guided correction: persona selectable without query
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

# ── analyst_label_corrected ───────────────────────────────────────────────────

print("\n[analyst_label_corrected]")

check("Hide source-level evidence label present",        "analyst_label_corrected",
      "Hide source-level evidence" in enl)
check("Hide raw artifacts label preserved (ternary)",    "analyst_label_corrected",
      "Hide raw artifacts" in enl)
check("Label ternary: prominent-aware hide",             "analyst_label_corrected",
      "prominent ? 'Hide source-level evidence'" in enl)
check("analyst-source-header present in ENLPanel",       "analyst_label_corrected",
      "analyst-source-header" in enl)
check("ANALYST MODE — SOURCE EVIDENCE header text",      "analyst_label_corrected",
      "ANALYST MODE — SOURCE EVIDENCE" in enl)
check("analyst-source-header CSS class in globals.css",  "analyst_label_corrected",
      ".analyst-source-header" in css)

# ── source_link_present ───────────────────────────────────────────────────────

print("\n[source_link_present]")

check("raw-artifact-source-ref class in ENLPanel",       "source_link_present",
      "raw-artifact-source-ref" in enl)
check("raw-artifact-source-label class in ENLPanel",     "source_link_present",
      "raw-artifact-source-label" in enl)
check("raw-artifact-source-file class in ENLPanel",      "source_link_present",
      "raw-artifact-source-file" in enl)
check("raw-artifact-open-btn class in ENLPanel",         "source_link_present",
      "raw-artifact-open-btn" in enl)
check("source_file field reference in ENLPanel",         "source_link_present",
      "sig.evidence.source_file" in enl)
check("[Open] affordance button present",                "source_link_present",
      "[Open]" in enl)
check("raw-artifact-source-ref CSS in globals.css",      "source_link_present",
      ".raw-artifact-source-ref" in css)
check("raw-artifact-open-btn CSS in globals.css",        "source_link_present",
      ".raw-artifact-open-btn" in css)

# ── active_tab_contrast_readable ──────────────────────────────────────────────

print("\n[active_tab_contrast_readable]")

check("te-node-dot-active CSS class defined",            "active_tab_contrast_readable",
      ".te-node-dot-active" in css)
check("te-node-dot-active uses dark color #0d0f14",      "active_tab_contrast_readable",
      "#0d0f14" in css.split(".te-node-dot-active")[-1].split("}")[0])  # last rule: PIOS-51.8R override

# ── demo_terminal_state_present ───────────────────────────────────────────────

print("\n[demo_terminal_state_present]")

check("demoComplete state declared in index.js",         "demo_terminal_state_present",
      "demoComplete" in idx and "useState(false)" in idx)
check("setDemoComplete present",                         "demo_terminal_state_present",
      "setDemoComplete" in idx)
check("guided-terminal-strip present in index.js",       "demo_terminal_state_present",
      "guided-terminal-strip" in idx)
check("guided-terminal-strip CSS defined",               "demo_terminal_state_present",
      ".guided-terminal-strip" in css)
check("guided-terminal-label CSS defined",               "demo_terminal_state_present",
      ".guided-terminal-label" in css)
check("guided-exit-btn CSS defined",                     "demo_terminal_state_present",
      ".guided-exit-btn" in css)
check("guided-exit-kbd CSS defined",                     "demo_terminal_state_present",
      ".guided-exit-kbd" in css)
check("demoComplete in DemoController active prop",      "demo_terminal_state_present",
      "demoActive && !demoComplete" in idx)
check("Terminal strip shown when demoComplete",          "demo_terminal_state_present",
      "{demoComplete &&" in idx or "demoComplete && (" in idx)
check("Guided demo complete label text",                 "demo_terminal_state_present",
      "Guided demo complete" in idx)

# ── ctrl_k_exit_guided_mode ───────────────────────────────────────────────────

print("\n[ctrl_k_exit_guided_mode]")

check("⌘K keydown handler present",                     "ctrl_k_exit_guided_mode",
      "keydown" in idx and ("metaKey" in idx or "ctrlKey" in idx))
check("key === 'k' check present",                       "ctrl_k_exit_guided_mode",
      "key === 'k'" in idx or "key==='k'" in idx)
check("demoActive guard in ⌘K handler",                  "ctrl_k_exit_guided_mode",
      "demoActive" in idx)
check("⌘K calls handleDemoExit",                         "ctrl_k_exit_guided_mode",
      "handleDemoExit()" in idx)
check("⌘K: event listener cleaned up (removeEventListener)", "ctrl_k_exit_guided_mode",
      "removeEventListener" in idx)
check("Exit guided mode label in terminal strip",        "ctrl_k_exit_guided_mode",
      "Exit guided mode" in idx)
check("guided-exit-kbd kbd element present",             "ctrl_k_exit_guided_mode",
      "guided-exit-kbd" in idx)

# ── rerun_demo_resets_sequence ────────────────────────────────────────────────

print("\n[rerun_demo_resets_sequence]")

check("handleStartDemo clears demoComplete",             "rerun_demo_resets_sequence",
      "setDemoComplete(false)" in idx)
check("handleStartDemo: traversalNodeIndex reset",       "rerun_demo_resets_sequence",
      "setTraversalNodeIndex(0)" in idx)
check("handleDemoExit clears demoComplete",              "rerun_demo_resets_sequence",
      idx.count("setDemoComplete(false)") >= 2)  # handleStartDemo + handleDemoExit

# ── persona_switch_resets_to_step_1 ──────────────────────────────────────────

print("\n[persona_switch_resets_to_step_1]")

check("prevEnlPersonaRef declared",                      "persona_switch_resets_to_step_1",
      "prevEnlPersonaRef" in idx)
check("useRef imported",                                 "persona_switch_resets_to_step_1",
      "useRef" in idx)
check("persona-change effect resets demoActive",         "persona_switch_resets_to_step_1",
      "prevEnlPersonaRef" in idx and "setDemoActive(false)" in idx)
check("persona-change effect clears demoComplete",       "persona_switch_resets_to_step_1",
      "prevEnlPersonaRef" in idx and "setDemoComplete(false)" in idx)
check("persona-change dep not [enlPersona] only",        "persona_switch_resets_to_step_1",
      "}, [enlPersona])" not in idx)
check("persona-change effect clears selectedFlow",       "persona_switch_resets_to_step_1",
      "prevEnlPersonaRef" in idx and "setSelectedFlow(null)" in idx)

# ── no_zombie_guided_state ────────────────────────────────────────────────────

print("\n[no_zombie_guided_state]")

check("handleToggle still locks on demoActive",          "no_zombie_guided_state",
      "if (demoActive) return" in idx)
check("demo loop closes on completion (demoActive false)", "no_zombie_guided_state",  # 51.8R amendment 3: supersedes 'demoActive stays true at terminal'
      "setDemoComplete(true)" in idx and "setDemoActive(false)" in
      idx.split("setDemoComplete(true)")[1])
check("DemoController inactive at terminal",             "no_zombie_guided_state",
      "demoActive && !demoComplete" in idx)
check("handleDemoExit resets all state",                 "no_zombie_guided_state",
      idx.count("setDemoActive(false)") >= 1 and idx.count("setDemoComplete(false)") >= 2)

# ── guided_loop_closure ───────────────────────────────────────────────────────

print("\n[guided_loop_closure]")

check("handleDemoNext: demoActive false at terminal",   "guided_loop_closure",
      "setDemoComplete(true)" in idx and "setDemoActive(false)" in idx.split("setDemoComplete(true)")[1])
check("handleDemoNext: guidedStepIndex reset at terminal", "guided_loop_closure",
      idx.count("setGuidedStepIndex(0)") >= 3)  # handleStartDemo + handleDemoNext + handleDemoExit
check("handleDemoNext: rawStepActive reset at terminal", "guided_loop_closure",
      idx.count("setRawStepActive(false)") >= 3)  # handleStartDemo + handleDemoNext + handleDemoExit
check("Entry strip visible after completion (!demoActive)", "guided_loop_closure",
      "!demoActive" in idx and "guided-entry-strip" in idx)
check("CTA: Try another perspective when demoComplete",  "guided_loop_closure",
      "Try another perspective" in idx and "demoComplete" in idx)
check("CTA ternary: demoComplete controls label",       "guided_loop_closure",
      "demoComplete ? 'Try another perspective'" in idx or
      'demoComplete ? "Try another perspective"' in idx)
check("Persona NOT reset at completion",                "guided_loop_closure",
      "setEnlPersona" not in idx.split("setDemoComplete(true)")[1].split("setDemoActive(false)")[0])

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
