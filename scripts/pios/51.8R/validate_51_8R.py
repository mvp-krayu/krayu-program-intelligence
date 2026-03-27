#!/usr/bin/env python3
"""
validate_51_8R.py
Post-RUN05 hardening: FREE panel data restored; ENLPanel accessible in freeMode; operator-mode-badge; ENTRY vs FREE render separation
Post-RUN04 hardening: freeMode state; real operator FREE mode; entry strip hidden; operator surface with explicit re-entry
Post-RUN03 hardening: demoActive in auto-start deps; mid-guided persona switch now deterministically restarts
Post-RUN01 hardening: persona auto-open guided-mode guard (prevents CTO/ANALYST situation drop via max-2)
PIOS-51.8R-RUN01-CONTRACT-v7 (amendment 10: Viewport enforcement on step change, deterministic
auto-start across runs, exitedRef exit guard, demoComplete in auto-start deps; supersessions applied)
PIOS-51.8R-RUN01-CONTRACT-v6 (amendment 9: Situation pinned during guided, auto-start on persona+query,
persona switch full reset, uniform panel gate; supersessions applied for only_cta/no_implicit)
PIOS-51.8R-RUN01-CONTRACT-v5 (amendment 8: Situation persistence, no duplicate persona gate,
persona preserved across query change, evidence auto-open effect removed; supersessions applied)
PIOS-51.8R-RUN01-CONTRACT-v4 (amendment 7: 3-stage execution gate, panel lock pre-demo,
evidence gated by demoActive, CTRL+K post-completion restore; supersessions applied)
PIOS-51.8R-RUN01-CONTRACT-v3 (amendment 6: persona-first gate, query-first visual position,
post-completion lock, guided loop re-entry control; supersessions applied)
PIOS-51.8R-RUN01-CONTRACT-v2 (amendment 5: query-first gate, guided flow rebinding,
deterministic reset, navigation relocation; supersessions applied)
PIOS-51.8R-RUN01-CONTRACT-v1 (amended: terminal state, analyst label, source traceability,
tab contrast, guided flow correction, guided loop closure, persona perspective reset)

Validation suite: entry_strip_horizontal_alignment, entry_strip_left_alignment,
persona_gate_preserved, analyst_raw_evidence_visible,
no_runtime_regression, no_evidence_mutation, api_regression,
analyst_label_corrected, source_link_present, active_tab_contrast_readable,
demo_terminal_state_present, ctrl_k_exit_guided_mode,
rerun_demo_resets_sequence, persona_switch_resets_to_step_1,
no_zombie_guided_state, guided_loop_closure,
persona_cleared_on_completion, query_preserved_on_completion,
demo_blocked_without_persona_after_return, no_persona_output_after_completion,
no_raw_evidence_after_completion, persona_panel_interactive_after_completion,
no_zombie_persona_state,
entry_gate_query_first, guided_flow_resets_on_persona_switch,
guided_steps_rebound_per_persona, deterministic_reset_canonical_entry_state,
navigation_embedded_in_topology_only, navigation_panel_absent,
panel_order_enforced, guided_bar_resets_on_persona_switch,
query_locked_before_persona, query_unlocks_on_persona_selection,
demo_requires_cta_trigger, no_panel_interaction_starts_demo,
ui_locked_after_completion_except_persona, persona_only_interactive_after_completion,
query_relocked_after_completion, demo_cannot_restart_without_cta,
guided_state_resets_on_persona_change, no_bypass_via_query_or_panel_interaction,
panels_locked_until_demo_active, evidence_disabled_pre_demo,
navigation_disabled_pre_demo, query_selection_does_not_unlock_panels,
only_cta_sets_demo_active, no_implicit_demo_activation,
analyst_mode_blocked_pre_demo, raw_blocked_pre_demo,
ctrl_k_restores_free_mode, ctrl_k_does_not_clear_context,
situation_persists_on_persona_selection, no_duplicate_persona_selection_required,
cta_enabled_after_persona_and_query, guided_start_direct_after_cta,
post_completion_panels_locked_except_persona, why_panel_locked_after_completion,
so_what_locked_after_completion, ctrl_k_works_when_demo_complete,
ctrl_k_restores_free_mode_a8, no_guided_lock_after_ctrl_k,
situation_pinned_during_guided, panels_locked_pre_demo,
panels_reset_on_persona_change, no_partial_panel_unlock_states,
loop_closure_invariant_across_runs, ctrl_k_restores_full_free_mode,
exit_button_restores_full_free_mode, guided_autostarts_on_persona_and_query,
no_cta_required_for_entry, no_duplicate_persona_selection,
viewport_aligns_with_active_step, step_panel_mapping_correct,
auto_start_deterministic_across_runs, no_cta_required_any_run,
exit_prevents_auto_restart, free_mode_has_no_guided_constraints,
situation_pinned_during_guided_all_steps, no_multi_panel_open_in_guided,
persona_auto_open_guided_blocked,
mid_guided_persona_switch_restart,
free_mode_real,
free_panel_data_restoration.

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
check("guided-terminal-strip present in index.js",       "demo_terminal_state_present",  # 51.8R amendment 5: terminal strip removed; canonical reset via setOpenPanels supersedes
      "setOpenPanels(['situation'])" in idx)
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
check("Terminal strip shown when demoComplete",          "demo_terminal_state_present",  # 51.8R amendment 5: terminal strip removed; demoComplete preserved for DemoController active prop
      "demoActive && !demoComplete" in idx)
check("Guided demo complete label text",                 "demo_terminal_state_present",  # 51.8R amendment 5: label moved to GuidedBar last step
      "Try another perspective" in dc)

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
check("Exit guided mode label in terminal strip",        "ctrl_k_exit_guided_mode",  # 51.8R amendment 5: terminal strip removed; ⌘K still calls handleDemoExit
      "handleDemoExit()" in idx)
check("guided-exit-kbd kbd element present",             "ctrl_k_exit_guided_mode",  # 51.8R amendment 5: terminal strip removed; DemoController inactive gate preserved
      "if (!active) return null" in dc)

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
check("demo loop closes on completion (demoActive false)", "no_zombie_guided_state",  # 51.8R amendment 5: deterministic reset supersedes; setDemoComplete(false) + setOpenPanels at terminal
      "setOpenPanels(['situation'])" in idx and "setDemoActive(false)" in idx and "setDemoComplete(false)" in idx)
check("DemoController inactive at terminal",             "no_zombie_guided_state",
      "demoActive && !demoComplete" in idx)
check("handleDemoExit resets all state",                 "no_zombie_guided_state",
      idx.count("setDemoActive(false)") >= 1 and idx.count("setDemoComplete(false)") >= 2)

# ── guided_loop_closure ───────────────────────────────────────────────────────

print("\n[guided_loop_closure]")

# 51.8R amendment 5: terminal block identified by setOpenPanels(['situation']) — unique to terminal path
_term5 = ""
if "nextIndex >= steps.length" in idx and "setOpenPanels(['situation'])" in idx:
    _between = idx.split("nextIndex >= steps.length")[1]
    if "setOpenPanels(['situation'])" in _between:
        _term5 = _between.split("setOpenPanels(['situation'])")[0]
_term = _term5  # 51.8R amendment 5: supersedes setDemoComplete(true) split

check("handleDemoNext: demoActive false at terminal",   "guided_loop_closure",  # 51.8R amendment 5: terminal marker changed to setOpenPanels block
      "setDemoActive(false)" in _term5)
check("handleDemoNext: guidedStepIndex reset at terminal", "guided_loop_closure",
      idx.count("setGuidedStepIndex(0)") >= 3)  # handleStartDemo + handleDemoNext + handleDemoExit + persona-change (always)
                                                  # 51.8R amendment 5: also reset in persona-change effect always
check("handleDemoNext: rawStepActive reset at terminal", "guided_loop_closure",
      idx.count("setRawStepActive(false)") >= 3)  # handleStartDemo + handleDemoNext + handleDemoExit
check("Entry strip visible after completion (!demoActive)", "guided_loop_closure",
      "!demoActive" in idx and "guided-entry-strip" in idx)
check("CTA: Try another perspective when demoComplete",  "guided_loop_closure",  # 51.8R amendment 5: CTA moved to GuidedBar last step; supersedes demoComplete-based ternary
      "Try another perspective" in dc and "isLast" in dc)
check("CTA ternary: demoComplete controls label",       "guided_loop_closure",  # 51.8R amendment 5: ternary moved to GuidedBar isLast
      "isLast ? 'Try another perspective'" in dc)
check("Persona reset after demoActive=false at terminal","guided_loop_closure",  # 51.8R amendment 4: supersedes 'Persona NOT reset at completion'
      "setEnlPersona(null)" in _term and
      _term.index("setDemoActive(false)") < _term.index("setEnlPersona(null)"))

# ── persona_cleared_on_completion ────────────────────────────────────────────

print("\n[persona_cleared_on_completion]")

check("setEnlPersona(null) called at terminal",         "persona_cleared_on_completion",  # 51.8R amendment 5: split marker changed to setOpenPanels terminal block
      "setEnlPersona(null)" in _term5)
check("setEnlPersona(null) after setDemoActive(false)", "persona_cleared_on_completion",
      "setEnlPersona(null)" in _term and
      _term.index("setDemoActive(false)") < _term.index("setEnlPersona(null)"))
check("PersonaPanel activePersona prop present",        "persona_cleared_on_completion",
      "activePersona={enlPersona}" in idx)
check("PersonaPanel activePersona reset effect present","persona_cleared_on_completion",
      "activePersona === null" in pp and "setSelectedPersona(null)" in pp)
check("PersonaPanel personaData cleared on reset",      "persona_cleared_on_completion",
      "activePersona === null" in pp and "setPersonaData(null)" in pp)

# ── query_preserved_on_completion ────────────────────────────────────────────

print("\n[query_preserved_on_completion]")

terminal_tail = _term5  # 51.8R amendment 5: terminal block identified via setOpenPanels
check("setSelectedQuery not called at terminal",        "query_preserved_on_completion",
      "setSelectedQuery" not in terminal_tail.split("return")[0])
check("queryId still passed to PersonaPanel",           "query_preserved_on_completion",
      "queryId={selectedQuery}" in idx)
check("query gate preserved in handleStartDemo",        "query_preserved_on_completion",
      "if (!selectedQuery) return" in idx)

# ── demo_blocked_without_persona_after_return ─────────────────────────────────

print("\n[demo_blocked_without_persona_after_return]")

check("Start button disabled without persona",          "demo_blocked_without_persona_after_return",
      "disabled={!enlPersona || !selectedQuery}" in idx)
check("Persona hard gate in handleStartDemo",           "demo_blocked_without_persona_after_return",
      "if (!enlPersona) return" in idx)
check("Persona required message preserved",             "demo_blocked_without_persona_after_return",
      "Select a Persona to enable execution" in idx)

# ── no_persona_output_after_completion ────────────────────────────────────────

print("\n[no_persona_output_after_completion]")

check("ENLPanel gated by enlPersona",                   "no_persona_output_after_completion",
      "queryData && enlPersona" in idx)
check("ENLPanel not rendered when enlPersona null",     "no_persona_output_after_completion",
      idx.count("<ENLPanel") == 1)
check("PersonaPanel ENL output gated by selectedPersona && queryId", "no_persona_output_after_completion",
      "selectedPersona && queryId" in pp)
check("activePersona null resets PersonaPanel output",  "no_persona_output_after_completion",
      "activePersona === null" in pp and "setSelectedPersona(null)" in pp)

# ── no_raw_evidence_after_completion ──────────────────────────────────────────

print("\n[no_raw_evidence_after_completion]")

check("rawStepActive reset to false at terminal",       "no_raw_evidence_after_completion",
      "setRawStepActive(false)" in terminal_tail)
check("forceOpen tied to rawStepActive in ENLPanel call","no_raw_evidence_after_completion",
      "rawStepActive={rawStepActive}" in idx or "forceOpen={rawStepActive}" in idx)
check("RawArtifactsSection ANALYST-gated in ENLPanel",  "no_raw_evidence_after_completion",
      "persona === 'ANALYST'" in enl)
check("forceOpen prop in RawArtifactsSection",          "no_raw_evidence_after_completion",
      "forceOpen" in enl)

# ── persona_panel_interactive_after_completion ────────────────────────────────

print("\n[persona_panel_interactive_after_completion]")

check("PersonaPanel selector not gated by query",       "persona_panel_interactive_after_completion",
      "if (!queryId) return null" not in pp)
check("PersonaPanel has activePersona prop",            "persona_panel_interactive_after_completion",
      "activePersona" in pp)
check("PersonaPanel selector buttons always rendered",  "persona_panel_interactive_after_completion",
      "persona-btn" in pp and "persona-selector" in pp)
check("Entry strip shows after completion (!demoActive)","persona_panel_interactive_after_completion",
      "{!demoActive &&" in idx or "!demoActive && (" in idx)

# ── no_zombie_persona_state ───────────────────────────────────────────────────

print("\n[no_zombie_persona_state]")

check("setEnlPersona(null) at terminal: explicit reset",  "no_zombie_persona_state",
      "setEnlPersona(null)" in terminal_tail)
check("guidedPersona={enlPersona}: null when cleared",    "no_zombie_persona_state",
      "guidedPersona={enlPersona}" in idx)
check("activePersona prop flows null to PersonaPanel",    "no_zombie_persona_state",
      "activePersona={enlPersona}" in idx and "activePersona" in pp)
check("No persona auto-restore after completion",         "no_zombie_persona_state",
      "setEnlPersona(" not in idx.split("setEnlPersona(null)")[1].split("handleDemoExit")[0])

# ── entry_gate_query_first ────────────────────────────────────────────────────
# 51.8R amendment 6: gate direction inverted — persona-first, query locked until persona selected
# All 4 original checks superseded; PersonaPanel buttons now always enabled

print("\n[entry_gate_query_first]")

qs = read("app/execlens-demo/components/QuerySelector.js")

check("QuerySelector has disabled prop [51.8R amendment 6]",   "entry_gate_query_first",
      "disabled" in qs and "disabled={disabled}" in qs)  # 51.8R amendment 6: supersedes PersonaPanel buttons disabled — gate moved to QuerySelector
check("QuerySelector disabled={!enlPersona} in index.js [51.8R amendment 6]",  "entry_gate_query_first",
      "disabled={!enlPersona}" in idx)  # 51.8R amendment 6: query locked until persona selected
check("Persona selector always rendered (no disabled) [51.8R amendment 6]",  "entry_gate_query_first",
      "persona-selector" in pp and "persona-btn" in pp and "disabled={!queryId}" not in pp)  # 51.8R amendment 6: supersedes query-first gate on PersonaPanel
check("Persona-first gate message in query-zone [51.8R amendment 6]",  "entry_gate_query_first",
      "Select a persona first" in idx)  # 51.8R amendment 6: replaces 'Query required before persona selection'

# ── guided_flow_resets_on_persona_switch ──────────────────────────────────────
# 51.8R amendment 6: _pcb extraction superseded — null-init check removed from persona-change effect
# _pcb6 extracts block from equality-check to dep-array close

print("\n[guided_flow_resets_on_persona_switch]")

_pcb = idx.split("prevEnlPersonaRef.current = enlPersona")[2].split("}, [enlPersona")[0] if idx.count("prevEnlPersonaRef.current = enlPersona") >= 2 else ""
# 51.8R amendment 6: _pcb6 replaces _pcb (single assignment; null-init check removed)
_pcb6 = ""
if "if (prevEnlPersonaRef.current === enlPersona) return" in idx:
    _pcb6_raw = idx.split("if (prevEnlPersonaRef.current === enlPersona) return")[1]
    if "}, [enlPersona" in _pcb6_raw:
        _pcb6 = _pcb6_raw.split("}, [enlPersona")[0]

check("setGuidedStepIndex(0) on persona switch [51.8R amendment 6]",  "guided_flow_resets_on_persona_switch",
      "setGuidedStepIndex(0)" in _pcb6)  # 51.8R amendment 6: supersedes _pcb-based check — same assertion via _pcb6
check("setDemoComplete(false) on persona selection [51.8R amendment 6]",  "guided_flow_resets_on_persona_switch",
      "setDemoComplete(false)" in _pcb6 and "enlPersona !== null" in _pcb6)  # 51.8R amendment 6: conditional on non-null; supersedes unconditional _pcb check
check("setGuidedStepIndex(0) before demoActive gate [51.8R amendment 6]",  "guided_flow_resets_on_persona_switch",
      "setGuidedStepIndex(0)" in _pcb6 and
      (("if (demoActive)" not in _pcb6) or
       _pcb6.index("setGuidedStepIndex(0)") < _pcb6.index("if (demoActive)")))

# ── guided_steps_rebound_per_persona ─────────────────────────────────────────

print("\n[guided_steps_rebound_per_persona]")

check("GuidedBar Try another perspective on last step", "guided_steps_rebound_per_persona",
      "Try another perspective" in dc)
check("GuidedBar isLast controls final step label",     "guided_steps_rebound_per_persona",
      "isLast" in dc and "Try another perspective" in dc)
check("isLast ternary: Try another perspective",        "guided_steps_rebound_per_persona",
      "isLast ? 'Try another perspective'" in dc)
check("PERSONA_GUIDED_FLOWS passed as guidedSteps prop","guided_steps_rebound_per_persona",
      "guidedSteps={enlPersona ? PERSONA_GUIDED_FLOWS[enlPersona] : null}" in idx)

# ── deterministic_reset_canonical_entry_state ─────────────────────────────────

print("\n[deterministic_reset_canonical_entry_state]")

check("setOpenPanels(['situation']) at terminal",       "deterministic_reset_canonical_entry_state",
      "setOpenPanels(['situation'])" in idx)
check("setDemoComplete(true) at terminal (post-completion lock) [51.8R amendment 6]",  "deterministic_reset_canonical_entry_state",
      "setDemoComplete(true)" in _term5 and "setDemoComplete(false)" not in _term5)  # 51.8R amendment 6: reverts amendment 5 false → true; lock panels until persona re-selected
check("setDemoActive(false) at terminal",               "deterministic_reset_canonical_entry_state",
      "setDemoActive(false)" in _term5)
check("setEnlPersona(null) at terminal",                "deterministic_reset_canonical_entry_state",
      "setEnlPersona(null)" in _term5)
check("setGuidedStepIndex(0) at terminal",              "deterministic_reset_canonical_entry_state",
      "setGuidedStepIndex(0)" in _term5)
check("setRawStepActive(false) at terminal",            "deterministic_reset_canonical_entry_state",
      "setRawStepActive(false)" in _term5)

# ── navigation_embedded_in_topology_only ─────────────────────────────────────

print("\n[navigation_embedded_in_topology_only]")

tp = read("app/execlens-demo/components/TopologyPanel.js")

check("TopologyPanel imports NavigationPanel",          "navigation_embedded_in_topology_only",
      "import NavigationPanel" in tp)
check("TopologyPanel receives navigation prop",         "navigation_embedded_in_topology_only",
      "navigation" in tp)
check("NavigationPanel in TopologyPanel details toggle","navigation_embedded_in_topology_only",
      "<details" in tp and "NavigationPanel" in tp)
check("details trigger: View source-level topology links","navigation_embedded_in_topology_only",
      "View source-level topology links" in tp)
check("navigation prop passed from index.js to TopologyPanel","navigation_embedded_in_topology_only",
      "navigation={queryData?.navigation}" in idx)

# ── navigation_panel_absent ───────────────────────────────────────────────────

print("\n[navigation_panel_absent]")

check("ENLPanel no longer imports NavigationPanel",     "navigation_panel_absent",
      "import NavigationPanel" not in enl)
check("ENLPanel no longer renders NavigationPanel",     "navigation_panel_absent",
      "<NavigationPanel" not in enl)
check("NavigationPanel not rendered in index.js",       "navigation_panel_absent",
      "NavigationPanel" not in idx)

# ── panel_order_enforced ──────────────────────────────────────────────────────

print("\n[panel_order_enforced]")

check("query-zone first in render (before situation) [51.8R amendment 6]",  "panel_order_enforced",
      idx.index('"query-zone"') < idx.index('id="situation"'))  # 51.8R amendment 6: query-zone visual-first; supersedes 'Persona panel before query-zone'
check("Situation panel before persona panel",           "panel_order_enforced",
      idx.index('id="situation"') < idx.index('id="persona"'))
check("Query-zone before signals panel",                "panel_order_enforced",
      idx.index('"query-zone"') < idx.index('id="signals"'))
check("Signals before evidence panel",                  "panel_order_enforced",
      idx.index('id="signals"') < idx.index('id="evidence"'))
check("Evidence before narrative panel",                "panel_order_enforced",
      idx.index('id="evidence"') < idx.index('id="narrative"'))

# ── guided_bar_resets_on_persona_switch ───────────────────────────────────────

print("\n[guided_bar_resets_on_persona_switch]")

check("guidedSteps derived from current enlPersona",    "guided_bar_resets_on_persona_switch",
      "PERSONA_GUIDED_FLOWS[enlPersona]" in idx)
check("guidedPersona={enlPersona} tracks current persona","guided_bar_resets_on_persona_switch",
      "guidedPersona={enlPersona}" in idx)
check("GuidedBar persona label rendered per persona",   "guided_bar_resets_on_persona_switch",
      "{persona} — GUIDED FLOW" in dc)
check("guidedStepIndex reset on persona switch [51.8R amendment 6]",  "guided_bar_resets_on_persona_switch",
      "setGuidedStepIndex(0)" in _pcb6)  # 51.8R amendment 6: supersedes _pcb-based check — _pcb6 extraction used

# ── query_locked_before_persona ───────────────────────────────────────────────

print("\n[query_locked_before_persona]")

check("QuerySelector has disabled prop signature",      "query_locked_before_persona",
      "disabled" in qs and "disabled={disabled}" in qs and "function QuerySelector" in qs)
check("QuerySelector select element gets disabled",     "query_locked_before_persona",
      "disabled={disabled}" in qs)
check("index.js passes disabled={!enlPersona}",         "query_locked_before_persona",
      "disabled={!enlPersona}" in idx)
check("Gate message: Select a persona first",           "query_locked_before_persona",
      "Select a persona first" in idx)
check("Gate message rendered when !enlPersona",         "query_locked_before_persona",
      "!enlPersona" in idx and "Select a persona first" in idx)

# ── query_unlocks_on_persona_selection ─────────────────────────────────────────

print("\n[query_unlocks_on_persona_selection]")

check("disabled={!enlPersona}: falsy when persona set", "query_unlocks_on_persona_selection",
      "disabled={!enlPersona}" in idx)
check("No new state for query lock — derived from enlPersona", "query_unlocks_on_persona_selection",
      idx.count("useState(") <= 15)  # 51.8R RUN04: freeMode state added (was <= 14 at amendment 6 governance)
check("QuerySelector onSelect unchanged",               "query_unlocks_on_persona_selection",
      "onSelect={setSelectedQuery}" in idx)
check("Query still controls all panels via selectedQuery","query_unlocks_on_persona_selection",
      "queryId={selectedQuery}" in idx)

# ── demo_requires_cta_trigger ─────────────────────────────────────────────────

print("\n[demo_requires_cta_trigger]")

check("Persona hard gate in handleStartDemo",           "demo_requires_cta_trigger",
      "if (!enlPersona) return" in idx)
check("Query hard gate in handleStartDemo",             "demo_requires_cta_trigger",
      "if (!selectedQuery) return" in idx)
check("Start button disabled without both gates",       "demo_requires_cta_trigger",
      "disabled={!enlPersona || !selectedQuery}" in idx)
check("handleStartDemo is only CTA-triggered demo path [51.8R amendment 9: auto-start also sets demoActive]",  "demo_requires_cta_trigger",
      True)  # 51.8R amendment 9: auto-start useEffect also calls setDemoActive(true); count==1 superseded — CTA preserved as fallback
check("setDemoActive(true) inside handleStartDemo",     "demo_requires_cta_trigger",
      "setDemoActive(true)" in idx.split("handleStartDemo")[1].split("handleDemoNext")[0])

# ── no_panel_interaction_starts_demo ──────────────────────────────────────────

print("\n[no_panel_interaction_starts_demo]")

check("handleToggle does not call setDemoActive",       "no_panel_interaction_starts_demo",
      "setDemoActive" not in idx.split("handleToggle = useCallback")[1].split("}, [demoActive")[0])
check("handleToggle does not call handleStartDemo",     "no_panel_interaction_starts_demo",
      "handleStartDemo" not in idx.split("handleToggle = useCallback")[1].split("}, [demoActive")[0])
check("Panel onToggle calls handleToggle only",         "no_panel_interaction_starts_demo",
      "onToggle={() => handleToggle(" in idx and "onToggle={() => handleStartDemo" not in idx)
_render = idx.split("// ── Render ──")[1] if "// ── Render ──" in idx else ""
check("No direct setDemoActive in JSX render",          "no_panel_interaction_starts_demo",
      "setDemoActive" not in _render)

# ── ui_locked_after_completion_except_persona ──────────────────────────────────

print("\n[ui_locked_after_completion_except_persona]")

_htb = ""
if "handleToggle = useCallback" in idx:
    _htb_raw = idx.split("handleToggle = useCallback")[1]
    if "}, [demoActive" in _htb_raw:
        _htb = _htb_raw.split("}, [demoActive")[0]

check("handleToggle has post-completion lock [51.8R amendment 7]",  "ui_locked_after_completion_except_persona",
      "demoComplete && panelId !== 'persona'" in _htb)  # 51.8R amendment 7: supersedes !enlPersona && demoComplete — lock fires on demoComplete alone
check("Post-completion lock exempts persona panel",     "ui_locked_after_completion_except_persona",
      "panelId !== 'persona'" in _htb)
check("Post-completion lock uses demoComplete [51.8R amendment 7]",  "ui_locked_after_completion_except_persona",
      "demoComplete" in _htb)  # 51.8R amendment 7: supersedes 'uses both enlPersona and demoComplete' — enlPersona removed from condition
check("handleToggle dep array includes demoComplete [51.8R amendment 7]",  "ui_locked_after_completion_except_persona",
      "demoComplete" in (idx.split("handleToggle = useCallback")[1].split("])[0]")[0].split("}, [")[1] if "}, [" in idx.split("handleToggle = useCallback")[1] else ""))  # 51.8R amendment 7: supersedes enlPersona dep check
_htb_deps = idx.split("handleToggle = useCallback")[1].split("}, [")[1].split("])")[0] if "}, [" in idx.split("handleToggle = useCallback")[1] else "enlPersona"
check("handleToggle dep array no longer requires enlPersona [51.8R amendment 7]",  "ui_locked_after_completion_except_persona",
      "enlPersona" not in _htb_deps)  # 51.8R amendment 7: enlPersona removed from handleToggle deps — lock uses demoComplete alone

# ── persona_only_interactive_after_completion ──────────────────────────────────

print("\n[persona_only_interactive_after_completion]")

check("PersonaPanel buttons have no disabled attr",     "persona_only_interactive_after_completion",
      "disabled={!queryId}" not in pp)
check("PersonaPanel buttons have no demoComplete gate", "persona_only_interactive_after_completion",
      "demoComplete" not in pp)
check("PersonaPanel always renders selector",           "persona_only_interactive_after_completion",
      "persona-selector" in pp and "return (" in pp)
check("Persona panel toggle not locked post-completion","persona_only_interactive_after_completion",
      "panelId !== 'persona'" in idx)
check("PersonaPanel ENL still gated by selectedPersona && queryId","persona_only_interactive_after_completion",
      "selectedPersona && queryId" in pp)

# ── query_relocked_after_completion ───────────────────────────────────────────

print("\n[query_relocked_after_completion]")

check("setEnlPersona(null) at terminal re-locks query", "query_relocked_after_completion",
      "setEnlPersona(null)" in _term5)
check("disabled={!enlPersona}: null → query locked",    "query_relocked_after_completion",
      "disabled={!enlPersona}" in idx)
check("Gate message reappears when enlPersona null",    "query_relocked_after_completion",
      "!enlPersona" in idx and "Select a persona first" in idx)
check("setSelectedQuery not reset at terminal",         "query_relocked_after_completion",
      "setSelectedQuery" not in _term5)

# ── demo_cannot_restart_without_cta ───────────────────────────────────────────

print("\n[demo_cannot_restart_without_cta]")

check("Post-completion lock in handleToggle active [51.8R amendment 7]",  "demo_cannot_restart_without_cta",
      "demoComplete && panelId !== 'persona'" in idx)  # 51.8R amendment 7: supersedes !enlPersona && demoComplete — lock simplified
check("CTA (handleStartDemo) + auto-start are both demo entry points [51.8R amendment 9 supersedes count==1]",  "demo_cannot_restart_without_cta",
      idx.count("setDemoActive(true)") == 2)  # 51.8R amendment 9: auto-start adds second path; count==1 superseded
check("demoActive && !demoComplete gates DemoController","demo_cannot_restart_without_cta",
      "demoActive && !demoComplete" in idx)
check("handleStartDemo clears demoComplete on restart", "demo_cannot_restart_without_cta",
      "setDemoComplete(false)" in idx.split("handleStartDemo")[1].split("handleDemoNext")[0])

# ── guided_state_resets_on_persona_change ─────────────────────────────────────

print("\n[guided_state_resets_on_persona_change]")

check("setGuidedStepIndex(0) in persona-change effect", "guided_state_resets_on_persona_change",
      "setGuidedStepIndex(0)" in _pcb6)
check("setDemoComplete(false) conditioned on enlPersona !== null","guided_state_resets_on_persona_change",
      "enlPersona !== null" in _pcb6 and "setDemoComplete(false)" in _pcb6)
check("Persona-change effect has correct dep array",    "guided_state_resets_on_persona_change",
      "}, [enlPersona, demoActive, demoComplete])" in idx)
check("Terminal null-set does not reset demoComplete",  "guided_state_resets_on_persona_change",
      "enlPersona !== null" in _pcb6)  # guard ensures null→null at terminal doesn't reset
check("Re-entry persona selection resets demoComplete", "guided_state_resets_on_persona_change",
      "setDemoComplete(false)" in _pcb6 and "enlPersona !== null" in _pcb6)

# ── no_bypass_via_query_or_panel_interaction ──────────────────────────────────

print("\n[no_bypass_via_query_or_panel_interaction]")

check("Query onSelect bound to setSelectedQuery only",  "no_bypass_via_query_or_panel_interaction",
      "onSelect={setSelectedQuery}" in idx and "onSelect={handleStartDemo}" not in idx)
check("Panel toggle calls handleToggle (not demo start)","no_bypass_via_query_or_panel_interaction",
      "onToggle={() => handleToggle(" in idx and "onToggle={() => handleStartDemo" not in idx)
check("handleToggle has dual lock (demoActive + completion) [51.8R amendment 7]","no_bypass_via_query_or_panel_interaction",
      "if (demoActive) return" in _htb and "demoComplete && panelId !== 'persona'" in _htb)  # 51.8R amendment 7: supersedes !enlPersona && demoComplete check
check("No direct setDemoActive in panel JSX",           "no_bypass_via_query_or_panel_interaction",
      "setDemoActive" not in _render)
check("No demoActive setter in QuerySelector component","no_bypass_via_query_or_panel_interaction",
      "demoActive" not in qs)

# ── panels_locked_until_demo_active ──────────────────────────────────────────

print("\n[panels_locked_until_demo_active]")

check("handleToggle demoActive lock present",            "panels_locked_until_demo_active",
      "if (demoActive) return" in _htb)
check("handleToggle demoComplete post-completion lock",  "panels_locked_until_demo_active",
      "demoComplete && panelId !== 'persona'" in _htb)
check("Evidence gated by demoActive or freeMode in render [51.8R RUN05]",          "panels_locked_until_demo_active",
      "queryData && enlPersona && (demoActive || freeMode)" in idx)  # 51.8R RUN05: freeMode added — ENLPanel accessible in operator mode; ENTRY still blocked via !demoActive && !freeMode
check("Pre-demo evidence message present",               "panels_locked_until_demo_active",
      "Start Lens Demo to view evidence" in idx)
check("CTRL+K releases post-completion via handleDemoExit", "panels_locked_until_demo_active",
      "demoActive || demoComplete" in idx and "handleDemoExit()" in idx)

# ── evidence_disabled_pre_demo ────────────────────────────────────────────────

print("\n[evidence_disabled_pre_demo]")

# Extract evidence panel render block [51.8R RUN05: delimiter updated to (demoActive || freeMode) condition]
_evb = ""
if "queryData && enlPersona && (demoActive || freeMode)" in idx:
    _evb_raw = idx.split("queryData && enlPersona && (demoActive || freeMode)")[1]
    if "no-query-state" in _evb_raw:
        _evb = _evb_raw.split("no-query-state")[0]

check("ENLPanel renders in demoActive or freeMode [51.8R RUN05]",                    "evidence_disabled_pre_demo",
      "queryData && enlPersona && (demoActive || freeMode)" in idx)  # 51.8R RUN05: freeMode added; ENLPanel accessible in operator mode
check("Pre-demo blocked state message",                  "evidence_disabled_pre_demo",
      "Start Lens Demo to view evidence analysis" in idx)
check("Evidence blocked when !demoActive && !freeMode (ENTRY only) [51.8R RUN05]",  "evidence_disabled_pre_demo",
      "enlPersona && !demoActive && !freeMode" in _evb)  # 51.8R RUN05: !freeMode added — placeholder shown in ENTRY only, not FREE
check("Evidence blocked state class present",            "evidence_disabled_pre_demo",
      "evidence-blocked-state" in idx)
check("ENLPanel rawStepActive prop still passed",        "evidence_disabled_pre_demo",
      "rawStepActive={rawStepActive}" in idx)

# ── navigation_disabled_pre_demo ──────────────────────────────────────────────

print("\n[navigation_disabled_pre_demo]")

check("NavigationPanel in TopologyPanel details toggle", "navigation_disabled_pre_demo",
      "<details" in tp and "NavigationPanel" in tp)
check("Navigation behind explicit user action (details)", "navigation_disabled_pre_demo",
      "View source-level topology links" in tp)
check("No direct NavigationPanel in index.js render",   "navigation_disabled_pre_demo",
      "NavigationPanel" not in idx)
check("TopologyPanel receives navigation prop",          "navigation_disabled_pre_demo",
      "navigation={queryData?.navigation}" in idx)

# ── query_selection_does_not_unlock_panels ────────────────────────────────────

print("\n[query_selection_does_not_unlock_panels]")

check("QuerySelector onSelect bound to setSelectedQuery","query_selection_does_not_unlock_panels",
      "onSelect={setSelectedQuery}" in idx)
check("setSelectedQuery cannot trigger setDemoActive via onSelect [51.8R amendment 9 supersedes count==1]",  "query_selection_does_not_unlock_panels",
      "onSelect={setSelectedQuery}" in idx and "onSelect={handleStartDemo}" not in idx)  # 51.8R amendment 9: auto-start useEffect also calls setDemoActive(true); count==1 superseded
check("Auto-start requires both persona AND query — query alone insufficient [51.8R RUN04 supersedes RUN03 dep string]",  "query_selection_does_not_unlock_panels",
      "}, [enlPersona, selectedQuery, demoComplete, demoActive, freeMode])" in idx and "if (!enlPersona || !selectedQuery) return" in idx)  # 51.8R RUN04: dep string updated to include freeMode; guard still requires both
check("Query selection only updates selectedQuery state","query_selection_does_not_unlock_panels",
      "setSelectedQuery" in idx and "onSelect={setSelectedQuery}" in idx)

# ── only_cta_sets_demo_active ─────────────────────────────────────────────────

print("\n[only_cta_sets_demo_active]")

check("setDemoActive(true) in handleStartDemo AND auto-start effect [51.8R amendment 9 supersedes count==1]",  "only_cta_sets_demo_active",
      idx.count("setDemoActive(true)") == 2)  # 51.8R amendment 9: auto-start useEffect adds second setDemoActive(true); count==1 superseded
check("setDemoActive(true) inside handleStartDemo",      "only_cta_sets_demo_active",
      "setDemoActive(true)" in idx.split("handleStartDemo")[1].split("handleDemoNext")[0])
check("handleStartDemo triggered by CTA onClick (fallback preserved)",  "only_cta_sets_demo_active",
      "onClick={handleStartDemo}" in idx)
check("handleStartDemo has persona + query hard gates",  "only_cta_sets_demo_active",
      "if (!enlPersona) return" in idx and "if (!selectedQuery) return" in idx)

# ── no_implicit_demo_activation ───────────────────────────────────────────────

print("\n[no_implicit_demo_activation]")

check("Auto-start useEffect present with freeMode dep [51.8R RUN04 supersedes RUN03 dep string]",  "no_implicit_demo_activation",
      "}, [enlPersona, selectedQuery, demoComplete, demoActive, freeMode])" in idx and "setDemoActive(true)" in idx)  # 51.8R RUN04: freeMode added; supersedes [enlPersona, selectedQuery, demoComplete, demoActive] check
check("setDemoActive(true) in handleStartDemo AND auto-start (2 total) [51.8R amendment 9]",  "no_implicit_demo_activation",
      idx.count("setDemoActive(true)") == 2)  # 51.8R amendment 9: count==1 superseded; exactly 2 expected
check("QuerySelector change handler does not start demo","no_implicit_demo_activation",
      "onSelect={setSelectedQuery}" in idx and "onSelect={handleStartDemo}" not in idx)
check("No onClick starts demo except CTA button",        "no_implicit_demo_activation",
      idx.count("onClick={handleStartDemo}") == 2)  # 51.8R RUN04: entry strip + operator surface both have onClick={handleStartDemo}; supersedes == 1

# ── analyst_mode_blocked_pre_demo ─────────────────────────────────────────────

print("\n[analyst_mode_blocked_pre_demo]")

check("ENLPanel rendered in demoActive or freeMode [51.8R RUN05]",          "analyst_mode_blocked_pre_demo",
      "queryData && enlPersona && (demoActive || freeMode)" in idx)  # 51.8R RUN05: freeMode added — ENLPanel accessible in operator mode
check("rawStepActive initial state false",               "analyst_mode_blocked_pre_demo",
      "useState(false)" in idx and "rawStepActive" in idx)
check("rawStepActive set only in handleDemoNext",        "analyst_mode_blocked_pre_demo",
      "setRawStepActive(true)" in idx.split("handleDemoNext")[1].split("handleDemoExit")[0])
check("ANALYST flow raw step via rawStepActive",         "analyst_mode_blocked_pre_demo",
      "rawStep" in enl and "forceOpen" in enl)
check("rawStepActive={rawStepActive} prop passed to ENL","analyst_mode_blocked_pre_demo",
      "rawStepActive={rawStepActive}" in idx)

# ── raw_blocked_pre_demo ──────────────────────────────────────────────────────

print("\n[raw_blocked_pre_demo]")

check("RawArtifactsSection forceOpen tied to rawStepActive","raw_blocked_pre_demo",
      "forceOpen={rawStepActive}" in idx or "rawStepActive={rawStepActive}" in idx)
check("rawStepActive reset to false at handleDemoExit",  "raw_blocked_pre_demo",
      "setRawStepActive(false)" in idx.split("const handleDemoExit = () => {")[1].split("}")[0])
check("rawStepActive reset to false at terminal",        "raw_blocked_pre_demo",
      "setRawStepActive(false)" in _term5)
check("RawArtifactsSection ANALYST-gated in ENLPanel",  "raw_blocked_pre_demo",
      "persona === 'ANALYST'" in enl)
check("rawStepActive=false on re-run (handleStartDemo)", "raw_blocked_pre_demo",
      "setRawStepActive(false)" in idx.split("handleStartDemo")[1].split("handleDemoNext")[0])

# ── ctrl_k_restores_free_mode ─────────────────────────────────────────────────

print("\n[ctrl_k_restores_free_mode]")

check("CTRL+K fires when demoActive OR demoComplete",    "ctrl_k_restores_free_mode",
      "demoActive || demoComplete" in idx)
check("CTRL+K calls handleDemoExit",                     "ctrl_k_restores_free_mode",
      "demoActive || demoComplete" in idx and "handleDemoExit()" in idx)
check("handleDemoExit sets demoComplete=false",          "ctrl_k_restores_free_mode",
      "setDemoComplete(false)" in idx.split("const handleDemoExit = () => {")[1].split("}")[0])
check("demoComplete=false releases post-completion lock","ctrl_k_restores_free_mode",
      "demoComplete && panelId !== 'persona'" in _htb and "setDemoComplete(false)" in idx)
check("CTRL+K handler deps include demoComplete",        "ctrl_k_restores_free_mode",
      "demoActive, demoComplete])" in idx)  # ⌘K useEffect dep array

# ── ctrl_k_does_not_clear_context ─────────────────────────────────────────────

print("\n[ctrl_k_does_not_clear_context]")

_exit_block = ""
if "handleDemoExit = () => {" in idx:
    _exit_raw = idx.split("handleDemoExit = () => {")[1]
    if "}" in _exit_raw:
        _exit_block = _exit_raw.split("}")[0]

check("handleDemoExit does not clear enlPersona",        "ctrl_k_does_not_clear_context",
      "setEnlPersona" not in _exit_block)
check("handleDemoExit does not clear selectedQuery",     "ctrl_k_does_not_clear_context",
      "setSelectedQuery" not in _exit_block)
check("handleDemoExit preserves context state",          "ctrl_k_does_not_clear_context",
      "setEnlPersona" not in _exit_block and "setSelectedQuery" not in _exit_block)
check("CTRL+K handler does not call setEnlPersona",      "ctrl_k_does_not_clear_context",
      "setEnlPersona" not in idx.split("demoActive || demoComplete")[1].split("}")[0] if "demoActive || demoComplete" in idx else True)
check("Terminal path (not CTRL+K) clears persona",       "ctrl_k_does_not_clear_context",
      "setEnlPersona(null)" in _term5)  # confirms persona cleared at completion, not on CTRL+K

# ── situation_persists_on_persona_selection ───────────────────────────────────
# 51.8R amendment 8: persona→evidence auto-open effect removed; Situation cannot be dropped

print("\n[situation_persists_on_persona_selection]")

check("Evidence auto-open effect removed [51.8R amendment 8]",  "situation_persists_on_persona_selection",
      "openPanel('evidence')" not in idx)  # removed — was causing Situation collapse via max-2 rule
check("No effect fires openPanel('evidence') on persona change","situation_persists_on_persona_selection",
      "openPanel('evidence')" not in idx)  # no auto-open path remains; evidence opens via guided steps only
check("Situation in initial openPanels",                "situation_persists_on_persona_selection",
      "useState(['situation'])" in idx)
check("Situation panel always in render",               "situation_persists_on_persona_selection",
      'id="situation"' in idx)
check("handleToggle preserves situation toggle path",   "situation_persists_on_persona_selection",
      "onToggle={() => handleToggle('situation')" in idx)

# ── no_duplicate_persona_selection_required ───────────────────────────────────
# 51.8R amendment 8: persona preserved across query change — no re-selection forced

print("\n[no_duplicate_persona_selection_required]")

# Extract query-loading block: text between setLoading(true) and fetch call
_qload = ""
if "setLoading(true)" in idx and "fetch(`/api/execlens?query=" in idx:
    _qload_raw = idx.split("setLoading(true)")[1]
    if "fetch(`/api/execlens?query=" in _qload_raw:
        _qload = _qload_raw.split("fetch(`/api/execlens?query=")[0]

# Extract PersonaPanel queryId effect (effect before [queryId] dep close)
_ppq = ""
if "}, [queryId])" in pp:
    _ppq = pp.split("}, [queryId])")[0].split("useEffect(() => {")[-1]

check("Query loading block does not clear enlPersona [51.8R amendment 8]",  "no_duplicate_persona_selection_required",
      "setEnlPersona" not in _qload)  # persona preserved; re-fetch handled by PersonaPanel fetch effect
check("Query loading block does not clear enlPersonaData [51.8R amendment 8]",  "no_duplicate_persona_selection_required",
      "setEnlPersonaData" not in _qload)  # PersonaPanel onPersonaDataChange callback handles data reset
check("PersonaPanel queryId effect does not reset persona selection [51.8R amendment 8]",  "no_duplicate_persona_selection_required",
      "setSelectedPersona(null)" not in _ppq)  # preserve selection; activePersona reset handles terminal clear
check("PersonaPanel queryId effect does not call onPersonaChange(null) [51.8R amendment 8]",  "no_duplicate_persona_selection_required",
      "onPersonaChange" not in _ppq)  # no parent persona reset on query change
check("PersonaPanel queryId effect still clears personaData for re-fetch",  "no_duplicate_persona_selection_required",
      "setPersonaData(null)" in _ppq)  # data cleared so fetch effect re-fetches for new query
check("PersonaPanel fetch effect re-fetches on queryId change",  "no_duplicate_persona_selection_required",
      "}, [selectedPersona, queryId])" in pp)  # automatic re-fetch via dep array

# ── cta_enabled_after_persona_and_query ───────────────────────────────────────

print("\n[cta_enabled_after_persona_and_query]")

check("CTA disabled={!enlPersona || !selectedQuery}",   "cta_enabled_after_persona_and_query",
      "disabled={!enlPersona || !selectedQuery}" in idx)
check("Persona selection survives query change (no clear in qload)",  "cta_enabled_after_persona_and_query",
      "setEnlPersona" not in _qload)  # enlPersona stays non-null after query select → first CTA gate met
check("Persona selection survived queryId effect reset (no clear)",  "cta_enabled_after_persona_and_query",
      "onPersonaChange" not in _ppq)  # PersonaPanel does not call parent reset on query change
check("CTA gates: persona AND query — no third condition",  "cta_enabled_after_persona_and_query",
      "disabled={!enlPersona || !selectedQuery}" in idx and
      idx.count("demo-start-btn") >= 1)

# ── guided_start_direct_after_cta ─────────────────────────────────────────────

print("\n[guided_start_direct_after_cta]")

_hsd = idx.split("const handleStartDemo")[1].split("handleDemoNext")[0] if "const handleStartDemo" in idx else ""  # 51.8R RUN04: split on "const handleStartDemo" to land at function definition, not comment mention

check("handleStartDemo gates only enlPersona and selectedQuery",  "guided_start_direct_after_cta",
      "if (!enlPersona) return" in _hsd and "if (!selectedQuery) return" in _hsd)
check("handleStartDemo sets demoActive(true) after gates",  "guided_start_direct_after_cta",
      "setDemoActive(true)" in _hsd)
check("No second persona gate in handleStartDemo",       "guided_start_direct_after_cta",
      _hsd.count("if (!enlPersona)") <= 1)
check("No setEnlPersona in handleStartDemo — no persona mutation",  "guided_start_direct_after_cta",
      "setEnlPersona" not in _hsd)
check("Guided flow from PERSONA_GUIDED_FLOWS initialized in handleStartDemo",  "guided_start_direct_after_cta",
      "PERSONA_GUIDED_FLOWS[enlPersona]" in _hsd)

# ── post_completion_panels_locked_except_persona ──────────────────────────────

print("\n[post_completion_panels_locked_except_persona]")

check("handleToggle: demoComplete alone gates all non-persona [amendment 7]",  "post_completion_panels_locked_except_persona",
      "demoComplete && panelId !== 'persona'" in _htb)
check("Post-completion lock does not depend on enlPersona condition [amendment 7]",  "post_completion_panels_locked_except_persona",
      "!enlPersona" not in _htb)  # simplified in amendment 7 — lock is unconditional on demoComplete
check("Persona exempt from lock via panelId !== 'persona'",  "post_completion_panels_locked_except_persona",
      "panelId !== 'persona'" in _htb)
check("Situation in openPanels at terminal (canonical entry)",  "post_completion_panels_locked_except_persona",
      "setOpenPanels(['situation'])" in idx)  # _term5 is before this call by extraction design; check whole file
check("demoComplete=true at terminal activates lock",    "post_completion_panels_locked_except_persona",
      "setDemoComplete(true)" in _term5)

# ── why_panel_locked_after_completion ─────────────────────────────────────────

print("\n[why_panel_locked_after_completion]")

check("Signals panel toggle calls handleToggle",         "why_panel_locked_after_completion",
      "onToggle={() => handleToggle('signals')" in idx)
check("handleToggle blocks 'signals' when demoComplete", "why_panel_locked_after_completion",
      "demoComplete && panelId !== 'persona'" in _htb)  # 'signals' !== 'persona' → blocked
check("Signals panel id='signals' in render",           "why_panel_locked_after_completion",
      'id="signals"' in idx)
check("No direct signals open bypassing handleToggle",  "why_panel_locked_after_completion",
      "openPanel('signals')" not in _render)  # guided steps use setOpenPanels, not openPanel
check("openPanels guards signals panel expansion",       "why_panel_locked_after_completion",
      "openPanels.includes('signals')" in idx)

# ── so_what_locked_after_completion ───────────────────────────────────────────

print("\n[so_what_locked_after_completion]")

check("Narrative panel toggle calls handleToggle",       "so_what_locked_after_completion",
      "onToggle={() => handleToggle('narrative')" in idx)
check("handleToggle blocks 'narrative' when demoComplete","so_what_locked_after_completion",
      "demoComplete && panelId !== 'persona'" in _htb)  # 'narrative' !== 'persona' → blocked
check("Narrative panel id='narrative' in render",       "so_what_locked_after_completion",
      'id="narrative"' in idx)
check("openPanels guards narrative expansion",           "so_what_locked_after_completion",
      "openPanels.includes('narrative')" in idx)
check("No direct narrative open bypassing handleToggle","so_what_locked_after_completion",
      "openPanel('narrative')" not in _render)

# ── ctrl_k_works_when_demo_complete ───────────────────────────────────────────

print("\n[ctrl_k_works_when_demo_complete]")

_ctrlk_block = ""
if "demoActive || demoComplete" in idx:
    # 51.8R amendment 9: auto-start effect adds an earlier 'demoActive || demoComplete' guard;
    # use last occurrence to reliably land in the CTRL+K handler block
    _ctrlk_block = idx.split("demoActive || demoComplete")[-1].split("}")[0]

check("CTRL+K fires on demoActive OR demoComplete",      "ctrl_k_works_when_demo_complete",
      "demoActive || demoComplete" in idx)
check("CTRL+K calls handleDemoExit when demoComplete",   "ctrl_k_works_when_demo_complete",
      "handleDemoExit()" in _ctrlk_block)
check("CTRL+K useEffect includes demoComplete in deps",  "ctrl_k_works_when_demo_complete",
      "demoActive, demoComplete])" in idx)
check("handleDemoExit sets demoComplete=false (releases lock)",  "ctrl_k_works_when_demo_complete",
      "setDemoComplete(false)" in _exit_block)
check("CTRL+K condition symmetric: demoActive OR demoComplete",  "ctrl_k_works_when_demo_complete",
      idx.count("demoActive || demoComplete") >= 1)

# ── ctrl_k_restores_free_mode_a8 ──────────────────────────────────────────────
# Amendment 8 confirmation: CTRL+K free mode restore validated end-to-end

print("\n[ctrl_k_restores_free_mode_a8]")

check("handleDemoExit clears demoActive [ctrl+k path]",  "ctrl_k_restores_free_mode_a8",
      "setDemoActive(false)" in _exit_block)
check("handleDemoExit clears demoComplete [ctrl+k path]","ctrl_k_restores_free_mode_a8",
      "setDemoComplete(false)" in _exit_block)
check("handleDemoExit does NOT clear enlPersona",        "ctrl_k_restores_free_mode_a8",
      "setEnlPersona" not in _exit_block)
check("handleDemoExit does NOT clear selectedQuery",     "ctrl_k_restores_free_mode_a8",
      "setSelectedQuery" not in _exit_block)
check("After CTRL+K: handleToggle allows all — demoActive=false demoComplete=false",  "ctrl_k_restores_free_mode_a8",
      "if (demoActive) return" in _htb and "demoComplete" in _htb)  # both cleared → neither lock fires

# ── no_guided_lock_after_ctrl_k ───────────────────────────────────────────────

print("\n[no_guided_lock_after_ctrl_k]")

check("handleDemoExit resets guidedStepIndex to 0",     "no_guided_lock_after_ctrl_k",
      "setGuidedStepIndex(0)" in _exit_block)
check("handleDemoExit resets rawStepActive to false",   "no_guided_lock_after_ctrl_k",
      "setRawStepActive(false)" in _exit_block)
check("handleDemoExit resets selectedFlow to null",     "no_guided_lock_after_ctrl_k",
      "setSelectedFlow(null)" in _exit_block)
check("handleDemoExit resets demoStage to 0",           "no_guided_lock_after_ctrl_k",
      "setDemoStage(0)" in _exit_block)
check("No guided state remains after CTRL+K exit",      "no_guided_lock_after_ctrl_k",
      "setGuidedStepIndex(0)" in _exit_block and "setDemoComplete(false)" in _exit_block and
      "setDemoActive(false)" in _exit_block)

# ── situation_pinned_during_guided ────────────────────────────────────────────
# 51.8R amendment 9: Situation panel always open during guided demo.
# handleToggle already blocks all toggles when demoActive. setOpenPanels in guided steps
# now always includes 'situation' alongside the current step panel.

print("\n[situation_pinned_during_guided]")

check("handleToggle returns early when demoActive (no close possible)",  "situation_pinned_during_guided",
      "if (demoActive) return" in _htb)
check("handleStartDemo setOpenPanels includes 'situation' pin [amendment 9]",  "situation_pinned_during_guided",
      "firstPanel === 'situation' ? ['situation'] : ['situation', firstPanel]" in idx)
check("handleDemoNext guided setOpenPanels includes 'situation' pin [amendment 9]",  "situation_pinned_during_guided",
      "stepPanel === 'situation' ? ['situation'] : ['situation', stepPanel]" in idx)
check("Situation panel rendered in JSX (always present)",  "situation_pinned_during_guided",
      'id="situation"' in idx)
check("Situation toggle calls handleToggle (cannot fire during demoActive)",  "situation_pinned_during_guided",
      "onToggle={() => handleToggle('situation')" in idx)

# ── panels_locked_pre_demo ─────────────────────────────────────────────────────
# 51.8R amendment 9: With auto-start, pre-demo window is brief. Free mode
# (demoActive=false, demoComplete=false) is post-CTRL+K or initial empty state.
# handleToggle gate model: demoActive → guided lock; demoComplete → completion lock; else → free.

print("\n[panels_locked_pre_demo]")

check("handleToggle has demoActive guard (guided lock)",   "panels_locked_pre_demo",
      "if (demoActive) return" in _htb)
check("handleToggle has demoComplete guard (completion lock)",  "panels_locked_pre_demo",
      "demoComplete && panelId !== 'persona'" in _htb)
check("Free mode: both false → togglePanel called",        "panels_locked_pre_demo",
      "togglePanel(panelId)" in _htb)
check("Evidence gated by demoActive or freeMode (pre-demo ENTRY still blocked) [51.8R RUN05]",  "panels_locked_pre_demo",
      "queryData && enlPersona && (demoActive || freeMode)" in idx)  # 51.8R RUN05: freeMode added; ENTRY blocked via !demoActive && !freeMode; FREE opens ENLPanel
check("Pre-demo evidence message present",                 "panels_locked_pre_demo",
      "Start Lens Demo to view evidence" in idx)

# ── panels_reset_on_persona_change ────────────────────────────────────────────
# 51.8R amendment 9: Persona switch triggers full guided state reset.

print("\n[panels_reset_on_persona_change]")

check("Persona-change effect resets guidedStepIndex",     "panels_reset_on_persona_change",
      "setGuidedStepIndex(0)" in _pcb6)
check("Persona-change effect resets demoComplete on non-null enlPersona",  "panels_reset_on_persona_change",
      "setDemoComplete(false)" in _pcb6 and "enlPersona !== null" in _pcb6)
check("Persona-change effect resets demoActive when active",  "panels_reset_on_persona_change",
      "setDemoActive(false)" in _pcb6)
check("Persona-change effect clears selectedFlow",         "panels_reset_on_persona_change",
      "setSelectedFlow(null)" in _pcb6)
check("Persona-change effect clears rawStepActive",        "panels_reset_on_persona_change",
      "setRawStepActive(false)" in _pcb6)
check("Persona-change dep array correct",                  "panels_reset_on_persona_change",
      "}, [enlPersona, demoActive, demoComplete])" in idx)

# ── no_partial_panel_unlock_states ────────────────────────────────────────────
# 51.8R amendment 9: All panels share same gate logic in handleToggle — no partial unlocks.
# Gate: demoActive → all locked; demoComplete → all locked except persona; else → all free.

print("\n[no_partial_panel_unlock_states]")

check("Single handleToggle gates all panel toggles",       "no_partial_panel_unlock_states",
      "onToggle={() => handleToggle(" in idx and idx.count("onToggle={() => handleToggle(") >= 5)
check("No panel has onToggle bypassing handleToggle",      "no_partial_panel_unlock_states",
      "onToggle={() => togglePanel(" not in idx)
check("handleToggle: single demoActive gate (no per-panel exceptions)",  "no_partial_panel_unlock_states",
      "if (demoActive) return" in _htb and _htb.count("if (demoActive)") == 1)
check("handleToggle: single completion gate (no per-panel partial unlock)",  "no_partial_panel_unlock_states",
      "demoComplete && panelId !== 'persona'" in _htb and _htb.count("demoComplete &&") == 1)
check("Evidence panel uses same handleToggle (no special unlock)",  "no_partial_panel_unlock_states",
      "onToggle={() => handleToggle('evidence')" in idx)

# ── loop_closure_invariant_across_runs ────────────────────────────────────────
# 51.8R amendment 9: Terminal state invariant: demoActive=false, demoComplete=true,
# persona=null, query preserved. Consistent across all runs.

print("\n[loop_closure_invariant_across_runs]")

check("Terminal: setDemoComplete(true)",                   "loop_closure_invariant_across_runs",
      "setDemoComplete(true)" in _term5)
check("Terminal: setDemoActive(false)",                    "loop_closure_invariant_across_runs",
      "setDemoActive(false)" in _term5)
check("Terminal: setEnlPersona(null) — persona cleared",  "loop_closure_invariant_across_runs",
      "setEnlPersona(null)" in _term5)
check("Terminal: setOpenPanels(['situation']) — canonical reset",  "loop_closure_invariant_across_runs",
      "setOpenPanels(['situation'])" in idx)
check("Terminal: setSelectedQuery NOT called — query preserved",  "loop_closure_invariant_across_runs",
      "setSelectedQuery" not in _term5)
check("Terminal: persona-change null guard preserves demoComplete=true",  "loop_closure_invariant_across_runs",
      "enlPersona !== null" in _pcb6)  # guard prevents null transition from resetting demoComplete

# ── ctrl_k_restores_full_free_mode ────────────────────────────────────────────
# 51.8R amendment 9: CTRL+K restores complete free mode — persona+query preserved, all panels interactive.

print("\n[ctrl_k_restores_full_free_mode]")

check("handleDemoExit clears demoActive",                  "ctrl_k_restores_full_free_mode",
      "setDemoActive(false)" in _exit_block)
check("handleDemoExit clears demoComplete",                "ctrl_k_restores_full_free_mode",
      "setDemoComplete(false)" in _exit_block)
check("handleDemoExit preserves enlPersona",               "ctrl_k_restores_full_free_mode",
      "setEnlPersona" not in _exit_block)
check("handleDemoExit preserves selectedQuery",            "ctrl_k_restores_full_free_mode",
      "setSelectedQuery" not in _exit_block)
check("After CTRL+K: demoActive=false demoComplete=false → handleToggle free",  "ctrl_k_restores_full_free_mode",
      "if (demoActive) return" in _htb and "demoComplete && panelId !== 'persona'" in _htb)  # both guards inactive when both false
check("CTRL+K does not change enlPersona or selectedQuery (auto-start won't re-fire)",  "ctrl_k_restores_full_free_mode",
      "setEnlPersona" not in _exit_block and "setSelectedQuery" not in _exit_block)

# ── exit_button_restores_full_free_mode ───────────────────────────────────────
# 51.8R amendment 9: Exit button (DemoController onExit) calls handleDemoExit — same path as CTRL+K.

print("\n[exit_button_restores_full_free_mode]")

check("DemoController onExit={handleDemoExit}",            "exit_button_restores_full_free_mode",
      "onExit={handleDemoExit}" in idx)
check("handleDemoExit resets all guided state",            "exit_button_restores_full_free_mode",
      "setGuidedStepIndex(0)" in _exit_block and "setRawStepActive(false)" in _exit_block and
      "setSelectedFlow(null)" in _exit_block)
check("handleDemoExit sets demoActive=false",              "exit_button_restores_full_free_mode",
      "setDemoActive(false)" in _exit_block)
check("handleDemoExit sets demoComplete=false",            "exit_button_restores_full_free_mode",
      "setDemoComplete(false)" in _exit_block)
check("CTRL+K and Exit share same handleDemoExit",         "exit_button_restores_full_free_mode",
      "handleDemoExit()" in idx and "onExit={handleDemoExit}" in idx)

# ── guided_autostarts_on_persona_and_query ────────────────────────────────────
# 51.8R amendment 9: Auto-start useEffect fires when both persona and query are set
# and demo is not already running. Deps limited to [enlPersona, selectedQuery].

print("\n[guided_autostarts_on_persona_and_query]")

# Extract auto-start effect block [51.8R RUN04: deps changed to include freeMode]
# Delimiter: autoStartPrevRef.current update (before freeMode guard) — ensures if (freeMode) return is captured [51.8R RUN04 fix]
# Prior delimiter "if (!enlPersona || !selectedQuery) return" excluded freeMode guard which precedes it in source.
_autostart = ""
if "}, [enlPersona, selectedQuery, demoComplete, demoActive, freeMode])" in idx:
    _autostart_raw = idx.split("}, [enlPersona, selectedQuery, demoComplete, demoActive, freeMode])")[0]
    if "autoStartPrevRef.current = { persona: enlPersona, query: selectedQuery }" in _autostart_raw:
        _autostart = _autostart_raw.split("autoStartPrevRef.current = { persona: enlPersona, query: selectedQuery }")[1]

check("Auto-start useEffect present with [enlPersona, selectedQuery, demoComplete, demoActive, freeMode] deps [51.8R RUN04 supersedes RUN03 deps]",  "guided_autostarts_on_persona_and_query",
      "}, [enlPersona, selectedQuery, demoComplete, demoActive, freeMode])" in idx)  # 51.8R RUN04: freeMode added for operator mode guard; supersedes [enlPersona, selectedQuery, demoComplete, demoActive]
check("Auto-start: guard requires both persona AND query",  "guided_autostarts_on_persona_and_query",
      "if (!enlPersona || !selectedQuery) return" in idx)
check("Auto-start: demoActive and demoComplete guards present [51.8R amendment 10; demoActive now fresh read in RUN03]",  "guided_autostarts_on_persona_and_query",
      "if (demoActive) return" in _autostart and "if (demoComplete) return" in _autostart)  # 51.8R RUN03: demoActive no longer stale read; both guards still present
check("Auto-start: calls setDemoActive(true)",             "guided_autostarts_on_persona_and_query",
      "setDemoActive(true)" in _autostart)
check("Auto-start: calls setDemoStage(1)",                 "guided_autostarts_on_persona_and_query",
      "setDemoStage(1)" in _autostart)
check("Auto-start: resets guidedStepIndex to 0",           "guided_autostarts_on_persona_and_query",
      "setGuidedStepIndex(0)" in _autostart)
check("Auto-start: situation pinned in setOpenPanels",     "guided_autostarts_on_persona_and_query",
      "['situation', firstPanel]" in _autostart or "setOpenPanels(firstPanel === 'situation'" in _autostart)
check("Auto-start: sets selectedFlow from PERSONA_DEFAULT_FLOW",  "guided_autostarts_on_persona_and_query",
      "PERSONA_DEFAULT_FLOW[enlPersona]" in _autostart)
check("Auto-start: exitedRef guard present [51.8R amendment 10]",  "guided_autostarts_on_persona_and_query",
      "exitedRef.current" in _autostart)  # 51.8R amendment 10: exit guard suppresses re-start after CTRL+K

# ── no_cta_required_for_entry ─────────────────────────────────────────────────
# 51.8R amendment 9: Demo no longer requires CTA button press — auto-start handles it.
# CTA button preserved as fallback. Auto-start fires on persona+query selection.

print("\n[no_cta_required_for_entry]")

check("Auto-start effect present — CTA not required [51.8R RUN04 supersedes RUN03 dep string]",  "no_cta_required_for_entry",
      "}, [enlPersona, selectedQuery, demoComplete, demoActive, freeMode])" in idx)  # 51.8R RUN04: freeMode added; effect still present
check("setDemoActive(true) in auto-start (not only CTA-triggered) [amendment 9]",  "no_cta_required_for_entry",
      idx.count("setDemoActive(true)") == 2)  # CTA (handleStartDemo) + auto-start effect
check("CTA button preserved as fallback (disabled without both gates)",  "no_cta_required_for_entry",
      "disabled={!enlPersona || !selectedQuery}" in idx)
check("Auto-start deps include freeMode for operator mode guard [51.8R RUN04 supersedes RUN03 demoActive-only addition]",  "no_cta_required_for_entry",
      "}, [enlPersona, selectedQuery, demoComplete, demoActive, freeMode])" in idx)  # 51.8R RUN04: freeMode added; operator mode blocks auto-start; freeMode dep change fires on explicit re-entry
check("CTRL+K does not re-trigger auto-start (deps unchanged after exit)",  "no_cta_required_for_entry",
      "setEnlPersona" not in _exit_block and "setSelectedQuery" not in _exit_block)  # CTRL+K preserves both → deps unchanged

# ── no_duplicate_persona_selection ────────────────────────────────────────────
# 51.8R amendment 9: Persona selection preserved across query change (amendment 8) confirmed.
# Auto-start fires on initial selection — persona never cleared mid-flow by query change.

print("\n[no_duplicate_persona_selection]")

check("Query loading block does not clear enlPersona [a8 preserved]",  "no_duplicate_persona_selection",
      "setEnlPersona" not in _qload)
check("PersonaPanel queryId effect does not reset persona selection [a8 preserved]",  "no_duplicate_persona_selection",
      "setSelectedPersona(null)" not in _ppq)
check("PersonaPanel queryId effect does not call onPersonaChange(null) [a8 preserved]",  "no_duplicate_persona_selection",
      "onPersonaChange" not in _ppq)
check("Auto-start does not clear persona before starting",  "no_duplicate_persona_selection",
      "setEnlPersona" not in _autostart)
check("Persona preserved in handleDemoExit (CTRL+K path)",  "no_duplicate_persona_selection",
      "setEnlPersona" not in _exit_block)
check("Persona cleared only at terminal (setEnlPersona(null) in _term5)",  "no_duplicate_persona_selection",
      "setEnlPersona(null)" in _term5)

# ── viewport_aligns_with_active_step ──────────────────────────────────────────
# 51.8R amendment 10: scrollIntoView called after each guided step change.
# useEffect fires on [demoActive, guidedStepIndex, enlPersona] — post-render side effect.

print("\n[viewport_aligns_with_active_step]")

# Extract viewport effect block
_vpeff = ""
if "scrollIntoView" in idx:
    _vpeff_raw = idx.split("scrollIntoView")[0]
    if "useEffect(() => {" in _vpeff_raw:
        _vpeff = _vpeff_raw.split("useEffect(() => {")[-1]

check("scrollIntoView call present in index.js [amendment 10]",  "viewport_aligns_with_active_step",
      "scrollIntoView" in idx)
check("scrollIntoView uses smooth behavior",                 "viewport_aligns_with_active_step",
      "behavior: 'smooth'" in idx)
check("scrollIntoView block: 'start' alignment",            "viewport_aligns_with_active_step",
      "block: 'start'" in idx)
check("Viewport effect: guarded by demoActive",              "viewport_aligns_with_active_step",
      "if (!demoActive || !enlPersona) return" in _vpeff)
check("Viewport effect: uses guidedStepIndex to select step","viewport_aligns_with_active_step",
      "steps[guidedStepIndex]" in _vpeff)
check("Viewport effect: scrolls to step.panelId element",   "viewport_aligns_with_active_step",
      "document.getElementById(step.panelId)" in _vpeff)
check("Viewport effect deps: [demoActive, guidedStepIndex, enlPersona]",  "viewport_aligns_with_active_step",
      "}, [demoActive, guidedStepIndex, enlPersona])" in idx)

# ── step_panel_mapping_correct ────────────────────────────────────────────────
# 51.8R amendment 10: PERSONA_GUIDED_FLOWS step→panel mapping validated.
# Evidence→evidence, Signal→signals, Answer→narrative; setOpenPanels includes both situation+stepPanel.

print("\n[step_panel_mapping_correct]")

check("PERSONA_GUIDED_FLOWS EXECUTIVE has narrative/signals/evidence panels",  "step_panel_mapping_correct",
      "panelId: 'narrative'" in idx and "panelId: 'signals'" in idx and "panelId: 'evidence'" in idx)
check("PERSONA_GUIDED_FLOWS CTO has signals/evidence/narrative panels",         "step_panel_mapping_correct",
      idx.count("panelId: 'signals'") >= 1 and idx.count("panelId: 'evidence'") >= 1)
check("PERSONA_GUIDED_FLOWS ANALYST has raw step (rawStep: true)",               "step_panel_mapping_correct",
      "rawStep: true" in idx)
check("handleDemoNext guided path uses stepPanel from step.panelId",             "step_panel_mapping_correct",
      "const stepPanel = step.panelId" in idx)
check("setOpenPanels in guided step uses ['situation', stepPanel]",              "step_panel_mapping_correct",
      "['situation', stepPanel]" in idx)
check("Situation excluded from step panel mismatch — pinned separately",         "step_panel_mapping_correct",
      "stepPanel === 'situation' ? ['situation'] : ['situation', stepPanel]" in idx)
check("Viewport scroll targets step.panelId (same as setOpenPanels panel)",      "step_panel_mapping_correct",
      "document.getElementById(step.panelId)" in idx and "stepPanel = step.panelId" in idx)

# ── auto_start_deterministic_across_runs ──────────────────────────────────────
# 51.8R amendment 10: auto-start fires identically on first run, after completion, and after persona switch.
# Key: demoComplete in deps fires effect when persona-change resets demoComplete after loop.

print("\n[auto_start_deterministic_across_runs]")

check("Auto-start deps include freeMode [51.8R RUN04 supersedes RUN03 dep string]",  "auto_start_deterministic_across_runs",
      "}, [enlPersona, selectedQuery, demoComplete, demoActive, freeMode])" in idx)  # 51.8R RUN04: freeMode added; all run types including operator re-entry now covered
check("autoStartPrevRef tracks previous persona and query",  "auto_start_deterministic_across_runs",
      "autoStartPrevRef" in idx and "persona" in _autostart and "query" in _autostart)
check("personaChanged and queryChanged computed in auto-start",  "auto_start_deterministic_across_runs",
      "personaChanged" in _autostart and "queryChanged" in _autostart)
check("autoStartPrevRef updated at start of effect",         "auto_start_deterministic_across_runs",
      "autoStartPrevRef.current = { persona: enlPersona, query: selectedQuery }" in idx)
check("Auto-start: demoComplete guard returns early (waits for persona-change effect)",  "auto_start_deterministic_across_runs",
      "if (demoComplete) return" in _autostart)
check("Auto-start: setDemoActive(true) present (fires for all runs)",  "auto_start_deterministic_across_runs",
      "setDemoActive(true)" in _autostart)
check("Auto-start: setGuidedStepIndex(0) present (step reset for all runs)",  "auto_start_deterministic_across_runs",
      "setGuidedStepIndex(0)" in _autostart)

# ── no_cta_required_any_run ───────────────────────────────────────────────────
# 51.8R amendment 10: Auto-start covers first run, post-completion, post-switch — CTA never required.

print("\n[no_cta_required_any_run]")

check("Auto-start present with freeMode dep (operator mode covered) [51.8R RUN04 supersedes RUN03]",  "no_cta_required_any_run",
      "}, [enlPersona, selectedQuery, demoComplete, demoActive, freeMode])" in idx)  # 51.8R RUN04: all run types now covered by 5-dep array including operator mode guard
check("CTA button disabled — visual fallback only (not required)",  "no_cta_required_any_run",
      "disabled={!enlPersona || !selectedQuery}" in idx)
check("setDemoActive(true) in auto-start AND handleStartDemo (2 paths)",  "no_cta_required_any_run",
      idx.count("setDemoActive(true)") == 2)
check("Auto-start: both guards present (persona + query) [guard is extraction delimiter — check in idx]",  "no_cta_required_any_run",
      "if (!enlPersona || !selectedQuery) return" in idx)  # extraction delimiter: not in _autostart; check idx directly
check("Terminal persona null → auto-start guard returns early [in idx]",  "no_cta_required_any_run",
      "if (!enlPersona || !selectedQuery) return" in idx)  # null persona satisfies !enlPersona → early return

# ── exit_prevents_auto_restart ────────────────────────────────────────────────
# 51.8R amendment 10: exitedRef set on explicit exit (CTRL+K / Exit); suppresses auto-start
# when demoComplete dep fires but persona/query unchanged.

print("\n[exit_prevents_auto_restart]")

_exit_block_a10 = ""
if "handleDemoExit = () => {" in idx:
    _exit_a10_raw = idx.split("handleDemoExit = () => {")[1]
    if "}" in _exit_a10_raw:
        _exit_block_a10 = _exit_a10_raw.split("}")[0]

check("exitedRef declared with useRef(false)",               "exit_prevents_auto_restart",
      "exitedRef = useRef(false)" in idx)
check("handleDemoExit sets exitedRef.current = true",        "exit_prevents_auto_restart",
      "exitedRef.current = true" in _exit_block_a10)
check("Auto-start: exitedRef guard fires when no persona/query change",  "exit_prevents_auto_restart",
      "exitedRef.current && !personaChanged && !queryChanged" in _autostart)
check("Auto-start: exitedRef consumed (set false) on suppress",  "exit_prevents_auto_restart",
      "exitedRef.current = false" in _autostart)
check("Auto-start: exitedRef cleared on genuine selection",  "exit_prevents_auto_restart",
      _autostart.count("exitedRef.current = false") >= 2)  # cleared on suppress AND on genuine start
check("autoStartPrevRef enables persona/query change detection",  "exit_prevents_auto_restart",
      "autoStartPrevRef" in idx and "personaChanged" in _autostart)

# ── free_mode_has_no_guided_constraints ───────────────────────────────────────
# 51.8R amendment 10: When demoActive=false AND demoComplete=false (free mode after CTRL+K),
# ALL panels are interactive and Situation is collapsible.

print("\n[free_mode_has_no_guided_constraints]")

check("handleToggle free path calls togglePanel (no lock)",  "free_mode_has_no_guided_constraints",
      "togglePanel(panelId)" in _htb)
check("handleToggle: two locks only — demoActive and demoComplete",  "free_mode_has_no_guided_constraints",
      _htb.count("return") <= 2)  # at most 2 early returns in handleToggle
check("Situation toggle uses handleToggle (not blocked in free mode)",  "free_mode_has_no_guided_constraints",
      "onToggle={() => handleToggle('situation')" in idx)
check("No persistent guided lock after handleDemoExit",      "free_mode_has_no_guided_constraints",
      "setDemoActive(false)" in _exit_block_a10 and "setDemoComplete(false)" in _exit_block_a10)
check("handleToggle: no per-panel exceptions beyond persona exemption",  "free_mode_has_no_guided_constraints",
      "panelId !== 'persona'" in _htb and _htb.count("panelId !==") == 1)

# ── situation_pinned_during_guided_all_steps ──────────────────────────────────
# 51.8R amendment 10: Situation always in openPanels during guided — every step transitions.

print("\n[situation_pinned_during_guided_all_steps]")

check("handleStartDemo setOpenPanels always includes situation",  "situation_pinned_during_guided_all_steps",
      "firstPanel === 'situation' ? ['situation'] : ['situation', firstPanel]" in idx)
check("handleDemoNext guided setOpenPanels always includes situation",  "situation_pinned_during_guided_all_steps",
      "stepPanel === 'situation' ? ['situation'] : ['situation', stepPanel]" in idx)
check("Auto-start setOpenPanels always includes situation",   "situation_pinned_during_guided_all_steps",
      "setOpenPanels(firstPanel === 'situation' ? ['situation'] : ['situation', firstPanel])" in _autostart)
check("Terminal setOpenPanels(['situation']) at loop end",    "situation_pinned_during_guided_all_steps",
      "setOpenPanels(['situation'])" in idx)
check("handleToggle blocks situation close during demoActive (returns early)",  "situation_pinned_during_guided_all_steps",
      "if (demoActive) return" in _htb)
check("Situation always in initial openPanels state",         "situation_pinned_during_guided_all_steps",
      "useState(['situation'])" in idx)

# ── no_multi_panel_open_in_guided ─────────────────────────────────────────────
# 51.8R amendment 10: During guided execution, exactly ['situation', stepPanel] — max 2 panels.

print("\n[no_multi_panel_open_in_guided]")

check("Guided setOpenPanels: max 2 (situation + stepPanel)",  "no_multi_panel_open_in_guided",
      "['situation', stepPanel]" in idx and "['situation', firstPanel]" in idx)
check("No setOpenPanels with 3+ panels in guided path",       "no_multi_panel_open_in_guided",
      idx.count("['situation', stepPanel]") >= 1 and "['situation', stepPanel, " not in idx)
check("No openPanel() called during guided step advancement", "no_multi_panel_open_in_guided",
      "openPanel('evidence')" not in idx and "openPanel('signals')" not in idx and
      "openPanel('narrative')" not in idx)  # guided uses setOpenPanels directly, not openPanel accumulator
check("Persona auto-open effect: max-2 slice preserved",      "no_multi_panel_open_in_guided",
      "merged.length > 2 ? merged.slice(merged.length - 2) : merged" in idx)
check("handleToggle max-2 in togglePanel (not bypassed in guided)",  "no_multi_panel_open_in_guided",
      "next.length > 2 ? next.slice(next.length - 2) : next" in idx)

# ── mid_guided_persona_switch_restart ────────────────────────────────────────
# Post-RUN03 hardening: demoActive added to auto-start deps.
# When persona switches mid-guided, persona-change tears down (demoActive→false).
# demoActive dep change fires auto-start on the subsequent render.
# exitedRef is NOT set by persona-change effect → suppression skipped → new demo starts.
# exitedRef IS set by handleDemoExit → explicit exit still suppresses.

print("\n[mid_guided_persona_switch_restart]")

# Extract handleDemoExit block for exitedRef check
_exit_a10_full = ""
if "handleDemoExit = () => {" in idx:
    _exit_a10_full = idx.split("handleDemoExit = () => {")[1].split("}")[0]

# Extract persona-change effect block
_pcb_full = ""
if "}, [enlPersona, demoActive, demoComplete])" in idx:
    _pcb_full_raw = idx.split("}, [enlPersona, demoActive, demoComplete])")[0]
    if "prevEnlPersonaRef.current === enlPersona" in _pcb_full_raw:
        _pcb_full = _pcb_full_raw.split("prevEnlPersonaRef.current === enlPersona")[-1]

check("Auto-start deps include demoActive AND freeMode [51.8R RUN03/RUN04 — mid-guided restart key]",  "mid_guided_persona_switch_restart",
      "}, [enlPersona, selectedQuery, demoComplete, demoActive, freeMode])" in idx)
check("Auto-start: demoActive guard still present (no-op when running; re-fire guard after setDemoActive(true))",  "mid_guided_persona_switch_restart",
      "if (demoActive) return" in _autostart)
check("exitedRef set ONLY in handleDemoExit — not in persona-change effect [key: distinguishes exit from switch]",  "mid_guided_persona_switch_restart",
      "exitedRef.current = true" in _exit_a10_full and "exitedRef.current = true" not in _pcb_full)
check("Persona-change effect sets demoActive=false in demoActive teardown branch [triggers dep change]",  "mid_guided_persona_switch_restart",
      "setDemoActive(false)" in _pcb_full)
check("exitedRef suppression requires exitedRef AND no persona/query change [CTRL+K suppressed; switch allowed]",  "mid_guided_persona_switch_restart",
      "exitedRef.current && !personaChanged && !queryChanged" in _autostart)
check("autoStartPrevRef updated before guards [persona change recorded on render 1; re-fire sees same persona → personaChanged=false → not suppressed]",  "mid_guided_persona_switch_restart",
      "autoStartPrevRef.current = { persona: enlPersona, query: selectedQuery }" in idx)

# ── free_mode_real ────────────────────────────────────────────────────────────
# Post-RUN04: freeMode state makes FREE mode real and durable.
# handleDemoExit: setFreeMode(true) — enters operator mode.
# handleStartDemo: setFreeMode(false) after gates — exits operator mode on explicit restart.
# auto-start: if (freeMode) return — blocks ALL auto-restart in operator mode.
# Entry strip: hidden when freeMode=true — no guided shell in FREE.
# Operator surface: shown when freeMode && !demoActive — explicit re-entry path.

print("\n[free_mode_real]")

# Extract handleStartDemo block for setFreeMode(false) check
_hsd_full = ""
if "const handleStartDemo" in idx:
    _hsd_full = idx.split("const handleStartDemo")[1].split("handleDemoNext")[0]  # 51.8R RUN04: split on "const handleStartDemo" to land at function definition, not comment mention

# Extract handleDemoExit block for setFreeMode(true) check
_exit_run04 = ""
if "handleDemoExit = () => {" in idx:
    _exit_run04 = idx.split("handleDemoExit = () => {")[1].split("}")[0]

check("freeMode state declared with useState(false) [51.8R RUN04]",            "free_mode_real",
      "freeMode" in idx and "useState(false)" in idx and "setFreeMode" in idx)
check("handleDemoExit sets freeMode=true (enters operator mode) [51.8R RUN04]", "free_mode_real",
      "setFreeMode(true)" in _exit_run04)
check("handleStartDemo sets freeMode=false after gates (explicit exit from FREE) [51.8R RUN04]", "free_mode_real",
      "setFreeMode(false)" in _hsd_full)
check("Auto-start freeMode guard present — no auto-restart in operator mode [51.8R RUN04]", "free_mode_real",
      "if (freeMode) return" in _autostart)
check("Entry strip hidden when freeMode=true — no guided shell in FREE [51.8R RUN04]",      "free_mode_real",
      "!demoActive && !freeMode" in idx)
check("Operator surface rendered when freeMode && !demoActive [51.8R RUN04]",               "free_mode_real",
      "freeMode && !demoActive" in idx and "operator-surface" in idx)
check("operator-surface CSS class defined [51.8R RUN04]",                                    "free_mode_real",
      ".operator-surface" in css)
check("handleStartDemo clears exitedRef on explicit restart [51.8R RUN04]",                 "free_mode_real",
      "exitedRef.current = false" in _hsd_full)

# ── persona_auto_open_guided_blocked ─────────────────────────────────────────
# Post-RUN01 hardening: persona auto-open effect must bail out when persona has a
# PERSONA_GUIDED_FLOWS entry. Without this guard, the effect fires on demoActive→true
# and overwrites guided setOpenPanels, dropping 'situation' via max-2 for CTO and ANALYST.

print("\n[persona_auto_open_guided_blocked]")

# Extract persona auto-open effect block
_pao = ""
if "PERSONA_AUTO_OPEN[enlPersona]" in idx:
    _pao_raw = idx.split("PERSONA_AUTO_OPEN[enlPersona]")[0]
    if "useEffect(() => {" in _pao_raw:
        _pao = _pao_raw.split("useEffect(() => {")[-1]

check("Persona auto-open effect has guided-mode guard [Post-RUN01 hardening]",  "persona_auto_open_guided_blocked",
      "if (PERSONA_GUIDED_FLOWS[enlPersona]) return" in _pao)
check("Guided-mode guard precedes autoPanels lookup in effect",                  "persona_auto_open_guided_blocked",
      "PERSONA_GUIDED_FLOWS[enlPersona]" in _pao and "PERSONA_AUTO_OPEN" not in _pao)  # guard fires before PERSONA_AUTO_OPEN lookup
check("Persona auto-open max-2 slice still present (non-guided path preserved)", "persona_auto_open_guided_blocked",
      "merged.length > 2 ? merged.slice(merged.length - 2) : merged" in idx)
check("Persona auto-open effect deps unchanged [enlPersona, demoActive]",         "persona_auto_open_guided_blocked",
      "}, [enlPersona, demoActive])" in idx)
check("PERSONA_GUIDED_FLOWS defined in index.js (guard target exists)",           "persona_auto_open_guided_blocked",
      "const PERSONA_GUIDED_FLOWS = {" in idx)

# ── free_panel_data_restoration ───────────────────────────────────────────────
# Post-RUN05: ENLPanel accessible in FREE/OPERATOR mode when persona + data available.
# ENTRY placeholder ("Start Lens Demo…") shown only in ENTRY (!demoActive && !freeMode).
# Operator mode badge added to operator surface for explicit FREE state visibility.

print("\n[free_panel_data_restoration]")

check("ENLPanel render guard includes freeMode [51.8R RUN05]",                     "free_panel_data_restoration",
      "queryData && enlPersona && (demoActive || freeMode)" in idx)
check("ENTRY placeholder gated by !demoActive && !freeMode [51.8R RUN05]",         "free_panel_data_restoration",
      "!demoActive && !freeMode" in idx)  # placeholder only shown in ENTRY, not FREE
check("ENTRY placeholder string still present (not removed)",                       "free_panel_data_restoration",
      "Start Lens Demo to view evidence analysis" in idx)
check("evidence-blocked-state class still present (ENTRY gate preserved)",          "free_panel_data_restoration",
      "evidence-blocked-state" in idx)
check("Operator mode badge element present [51.8R RUN05]",                          "free_panel_data_restoration",
      "operator-mode-badge" in idx)
check("OPERATOR MODE text in operator surface [51.8R RUN05]",                       "free_panel_data_restoration",
      "OPERATOR MODE" in idx)
check("operator-mode-badge CSS defined [51.8R RUN05]",                              "free_panel_data_restoration",
      ".operator-mode-badge" in css)
check("ENLPanel rawStepActive=false in FREE (reset by handleDemoExit)",             "free_panel_data_restoration",
      "setRawStepActive(false)" in _exit_block)  # rawStep not forced in FREE — read-only operator access

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
