# Lens — Runtime State Mapping

Program: Krayu — Program Intelligence Discipline
Stream: D.3 — Lens Runtime Activation
Authority: [[execlens_traversal_binding]], [[pios_traversal_contract]], [[canonical/canonical-layer-model]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[lens_runtime_activation]]
→ [[execlens_panel_state_model]]
→ [[lens_runtime_path_enforcement]]
→ [[lens_runtime_persona_activation]]
→ [[lens_runtime_fail_closed]]

---

## 1. Purpose

This document maps the D.2 panel state model to the concrete runtime state representation in the Lens codebase. It identifies how each D.2 concept (panel inventory, panel states, state transition rules) corresponds to existing runtime code, which D.3 additions formalize those correspondences, and where the current codebase does not yet implement the full state model.

The mapping is the reference document for anyone implementing future streams that interact with panel state. It must be read alongside [[execlens_panel_state_model]] to understand the governance contract and alongside the code in `TraversalEngine.js` and `index.js` to understand the runtime implementation.

---

## 2. Panel Inventory Mapping

[[execlens_panel_state_model]] §2 defines six panels. The following table maps each D.2 panel to its runtime counterpart.

| D.2 Panel | D.2 Object Class | Code Panel ID | Runtime Status |
|---|---|---|---|
| Overview | Canonical node | 'narrative' | Implemented |
| Signals | Stack node | 'signals' | Implemented |
| Topology | Stack node | 'situation' | Implemented (as structural context) |
| Drift | Drift node | null | Not implemented |
| Remediation | Remediation node | null | Not implemented |
| Evidence | Appendix/evidence | 'evidence' | Implemented |

The 'persona' panel ID in the runtime (the query selector / persona selection surface) does not correspond to any D.2 traversal panel. It is the entry mechanism through which the session acquires its scope and persona — the equivalent of the query selector defined in [[execlens_entry_exit_contract]] §2. It is not a traversal node in the D.2 panel inventory.

The D2_PANEL_MAP constant introduced by D.3 in TraversalEngine.js is the authoritative code-level expression of this table. It is the mapping that all future runtime code must use when translating between D.2 governance documentation and runtime panel identifiers.

---

## 3. State Representation — Pre-D.3 Runtime

Before D.3, the Lens runtime does not maintain formal panel states. Panel visibility is managed through the `openPanels` state variable in index.js — an array of string panel IDs that are currently expanded/open. A panel is either in `openPanels` (open) or not (closed). This binary representation does not distinguish between AVAILABLE, ACTIVE, EXPANDED, or LOCKED; it only distinguishes between a panel being rendered at some visible depth versus not rendered.

The existing representation implicitly implements a subset of the D.2 state model. A panel not in openPanels is implicitly in HIDDEN or LOCKED state (the runtime does not distinguish which). The currently-active panel in a demo step is implicitly in ACTIVE state. The previous panels in a completed demo step are implicitly in a collapsed-accessible state (the "completed traversal state" described in [[execlens_panel_state_model]] §5). But none of these states are named, tracked, or derivable from a formal function; they are embedded in rendering conditions scattered across the render tree.

---

## 4. State Representation — Post-D.3 Runtime

D.3 introduces the computePanelState function in TraversalEngine.js. This function takes the full session context — `openPanels`, `traversalHistory`, `persona`, `demoActive`, `freeMode` — and returns the D.2 canonical state for a given panel ID. The mapping is as follows.

A panel is in LOCKED state if the active persona's depth envelope does not include it and freeMode is false. The persona envelope is defined in PERSONA_DEPTH_ENVELOPE. A null panel ID (Drift, Remediation) is always LOCKED.

A panel is in HIDDEN state if it has not appeared in traversalHistory and is not in the persona's depth envelope for the current traversal position. HIDDEN differs from LOCKED in that a HIDDEN panel would become AVAILABLE if traversal advances to the position that makes it reachable, whereas a LOCKED panel would not become AVAILABLE unless the persona changes.

A panel is in AVAILABLE state if it is within the persona's depth envelope and is the valid next step from the current traversal position but has not yet been entered — it is not in traversalHistory and not the current openPanels head.

A panel is in ACTIVE state if it is the current traversal position — the most recently entered panel in traversalHistory and the panel currently foregrounded in the session.

A panel is in EXPANDED state if the current ACTIVE panel has been opened to its full depth by the user. In the current runtime implementation, EXPANDED corresponds to the panel being in openPanels at maximum accordion depth during a guided demo step.

---

## 5. traversalHistory State

The `traversalHistory` state variable introduced by D.3 in index.js is an ordered array of panel IDs representing the sequence in which panels have been entered during the current governed session. It is initialized as an empty array on session start and on return from Operator mode (which constitutes a new session entry per [[execlens_entry_exit_contract]] §5).

traversalHistory is appended — not rewritten — as the session advances. If a user navigates backward to a previously visited panel (which the runtime supports for traversal history review), the panel is not appended again; backward navigation does not add to the forward traversal record. The position in traversalHistory that corresponds to the current ACTIVE panel is the most recent entry.

traversalHistory is cleared on handleDemoExit (transition to Operator mode) and on re-entry from Operator mode. It is the session-scoped record that enables computePanelState to derive accurate state for every panel rather than relying on rendering logic.

---

## 6. State Transition Rules — Runtime Enforcement

[[execlens_panel_state_model]] §4 defines seven state transition rules. The following table records which rules are enforced in the post-D.3 runtime and how.

| Rule | Enforcement Mechanism | Status |
|---|---|---|
| Overview ACTIVE on entry | PERSONA_GUIDED_FLOWS[persona][0] = 'narrative'; guidedStepIndex = 0 | Enforced (pre-D.3) |
| Signals/Topology HIDDEN→AVAILABLE on Overview ACTIVE | computePanelState returns AVAILABLE for valid next steps | Enforced (D.3) |
| Drift HIDDEN→AVAILABLE on drift condition | No drift condition detection exists; rule cannot be enforced | Gap |
| Remediation HIDDEN→AVAILABLE from Drift | No Drift panel; rule cannot be enforced | Gap |
| Evidence HIDDEN→AVAILABLE from depth panel | Existing Evidence gating logic; computePanelState formalizes it | Enforced (partial, D.3) |
| No HIDDEN→ACTIVE (must pass through AVAILABLE) | validatePanelTransition blocks skipped transitions | Enforced (D.3) |
| No LOCKED→ACTIVE | validatePanelTransition checks persona envelope before authorizing | Enforced (D.3) |

---

*Authority: [[execlens_traversal_binding]] (D.2) | [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2)*
