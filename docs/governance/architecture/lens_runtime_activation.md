# Lens — Runtime Activation Contract

Program: Krayu — Program Intelligence Discipline
Stream: D.3 — Lens Runtime Activation
Authority: [[execlens_traversal_binding]], [[pios_traversal_contract]], [[canonical/canonical-layer-model]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[execlens_traversal_binding]]
→ [[pios_traversal_contract]]
→ [[lens_runtime_state_mapping]]
→ [[lens_runtime_path_enforcement]]
→ [[lens_runtime_persona_activation]]
→ [[lens_runtime_operator_mode]]
→ [[lens_runtime_fail_closed]]
→ [[lens_runtime_activation_validation]]

---

## 1. Purpose

This document is the activation contract for Stream D.3. It states what D.3 activates, what it preserves, what it cannot activate in the current codebase, and the governance standing of each condition. It is the authoritative record of the D.3 stream's scope and the decisions made during its execution.

D.3 activates the D.2 traversal binding inside the live Lens runtime by introducing formal constants, state computation functions, and traversal validation logic into the two primary runtime files: `app/execlens-demo/components/TraversalEngine.js` and `app/execlens-demo/pages/index.js`. The activation is additive: it introduces no changes to existing behavior, introduces no new panel components, and does not alter the 51.8.R governed baseline. What it does is make the contract formal in code — naming the states the runtime already implicitly enforces, making the persona depth rules explicit in constants, and introducing the traversal history that grounds the validation logic.

---

## 2. Activation Scope

D.3 activates the following contract elements in the Lens runtime.

**PANEL_STATES constants** — The five canonical panel states defined in [[execlens_panel_state_model]] §3 (HIDDEN, AVAILABLE, ACTIVE, EXPANDED, LOCKED) are introduced as exported constants in TraversalEngine.js. These constants make the state model formally present in code such that runtime logic can reference contract-named states rather than ad hoc string comparisons.

**D2_PANEL_MAP** — A canonical mapping from D.2 panel names (Overview, Signals, Topology, Drift, Remediation, Evidence) to the corresponding code-level panel IDs ('narrative', 'signals', 'situation', null, null, 'evidence') is introduced in TraversalEngine.js. This mapping is the authoritative translation between governance documentation and runtime identifiers. Drift and Remediation map to null because no panel components exist for them in the current codebase; the null mapping is the governed record of that gap.

**PERSONA_DEPTH_ENVELOPE** — The persona traversal envelopes defined in [[execlens_persona_binding]] §3–§5 are introduced as constants in TraversalEngine.js. Each persona is associated with the set of code panel IDs it may reach and the maximum traversal depth it authorizes.

**computePanelState** — A pure function that derives the D.2 canonical state of any panel given the current session context (openPanels, traversalHistory, persona, demoActive, freeMode). This function makes the state model computable from the runtime state rather than implied by rendering logic alone.

**validatePanelTransition** — A pure function that evaluates whether a proposed panel transition is permitted given the current traversal history, the active persona, and the D.2 path rules. This function is the runtime expression of the fail-closed principle: if the transition is not authorized, the function returns a governed failure reason rather than permitting the transition.

**traversalHistory state** — A new state variable in index.js that records the ordered sequence of panels the user has visited in the current governed session. traversalHistory is the runtime equivalent of the traversal history concept defined in [[execlens_entry_exit_contract]] §5. It enables computePanelState and validatePanelTransition to ground their outputs in an actual traversal sequence.

---

## 3. Preservation Commitment

D.3 makes the following preservation commitments with respect to the 51.8.R governed baseline.

The existing PERSONA_GUIDED_FLOWS, TRAVERSAL_FLOWS, NODE_TO_PANEL, PERSONA_AUTO_OPEN, and all existing flow logic in index.js are not modified. The scripted traversal experience that the 51.8.R baseline established continues to operate as it did before D.3. The new constants and functions introduced by D.3 operate alongside the existing scripted logic, not in place of it.

The existing Operator mode implementation — the freeMode state variable and the operator-mode-badge rendering in index.js — is not modified. D.3 documents this implementation in [[lens_runtime_operator_mode]] and confirms that it already satisfies the contract requirement that Operator mode status be surfaced to the user before constraints are released.

The existing Evidence panel gating — the pre-demo and no-persona blocking logic — is not modified. D.3 documents this in [[lens_runtime_fail_closed]] and confirms that it already constitutes a partial implementation of the fail-closed principle.

---

## 4. Acknowledged Gaps

D.3 identifies the following gaps between the D.2 contract and the current runtime implementation. Each gap is documented as a governed condition — a known, recorded state of the system — not a failure. The gaps are not resolved by D.3; their resolution belongs to future streams.

Drift and Remediation panels have no runtime implementation. The D2_PANEL_MAP introduced by D.3 records a null mapping for both. No traversal path can reach these panels. This means the Drift Explanation Path defined in [[execlens_navigation_contract]] §5 is structurally unactivatable in the current runtime. All CTO and Analyst persona sessions that encounter drift conditions cannot surface those conditions through the traversal contract; they can access them only in Operator mode.

The PERSONA_GUIDED_FLOWS in index.js define traversal sequences that partially diverge from D.2 path ordering. The CTO flow begins at Signals rather than Overview. The Analyst flow begins at Evidence, which contradicts the D.2 rule that Evidence is never the first ACTIVE panel. These divergences are features of the 51.8.R scripted baseline and are preserved by D.3. They are recorded here as divergences for future resolution, not corrected by D.3, because correcting them would alter the scripted baseline in ways that fall outside D.3's scope.

No panel state transition animation or visual state indicator is introduced by D.3. The PANEL_STATES constants are available for rendering use but the rendering layer is not modified to display state indicators.

---

## 5. Authority

This stream executes under the authority of the D.2 binding set ([[execlens_traversal_binding]], [[execlens_panel_state_model]], [[execlens_navigation_contract]], [[execlens_persona_binding]], [[execlens_entry_exit_contract]], [[traversal_runtime_validation]]) and the root traversal contract ([[pios_traversal_contract]]). The runtime files modified are `app/execlens-demo/components/TraversalEngine.js` and `app/execlens-demo/pages/index.js`. No other files are modified.

---

*Authority: [[execlens_traversal_binding]] (D.2) | [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2)*
