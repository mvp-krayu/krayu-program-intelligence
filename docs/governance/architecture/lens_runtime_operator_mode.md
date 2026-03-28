# Lens — Runtime Operator Mode

Program: Krayu — Program Intelligence Discipline
Stream: D.3 — Lens Runtime Activation
Authority: [[execlens_traversal_binding]], [[pios_traversal_contract]], [[canonical/canonical-layer-model]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[lens_runtime_activation]]
→ [[execlens_entry_exit_contract]]
→ [[traversal_runtime_validation]]
→ [[lens_runtime_fail_closed]]

---

## 1. Purpose

This document defines the Operator mode behavior as it exists in the Lens runtime after D.3. It maps the Operator mode contract defined in [[execlens_entry_exit_contract]] §4–§5 and [[traversal_runtime_validation]] §6 to the concrete code implementation in index.js, confirms which contract requirements are already satisfied, and records any requirements that are not yet satisfied.

Operator mode is the explicit suspension of the traversal contract. The suspension is deliberate, governed, and visible to the user. The contract governing Operator mode is not a constraint to be designed around; it is the defined behavior for sessions where the user needs unrestricted access to panels outside the traversal sequence.

---

## 2. Existing Operator Mode Implementation

The Lens runtime implements Operator mode through the `freeMode` boolean state variable in index.js. freeMode is set to true by `handleDemoExit`, which is the handler for the user's explicit exit action from the guided traversal session. freeMode is set to false on `handleStartDemo` — the beginning of a new guided session.

When freeMode is true and demoActive is false, the runtime renders the operator-mode-badge component:

```
<div className="operator-mode-badge">OPERATOR MODE</div>
```

This badge is rendered outside the page-root div for positioning purposes and is visible to the user throughout the Operator mode session.

When freeMode is true, the handleToggle function permits unrestricted panel toggling. The openPanels constraint (maximum 2 panels) continues to apply to toggle behavior, but the traversal sequence constraints and persona depth gating do not. This is the runtime expression of [[execlens_entry_exit_contract]] §4: "all panel constraints are released" in Operator mode.

---

## 3. Contract Requirement Verification

The [[traversal_runtime_validation]] §6 defines two boundary requirements for Operator mode: the indicator must be visible before constraints are released, and the return from Operator mode must execute entry validation before restoring governed traversal.

The first requirement — indicator visible before constraints are released — is satisfied by the existing implementation. The freeMode state variable is set by handleDemoExit before any UI interaction can occur, and the operator-mode-badge renders synchronously on the next render cycle driven by the freeMode state update. The constraints are released (handleToggle becomes unrestricted) at the same state transition that surfaces the badge. No gap exists between the constraint release and the indicator surfacing.

The second requirement — return from Operator mode executes entry validation — is partially satisfied. When the user starts a new demo session from Operator mode (handleStartDemo is called), freeMode is set to false and the demo flow initializes fresh from the guided entry state for the selected persona. The traversalHistory is reset. The session returns to a governed entry configuration. However, the entry validation defined in [[traversal_runtime_validation]] §2 — the formal check that exactly one panel is ACTIVE, that the query selector is present, and that no downstream panel is EXPANDED — is not executed as a discrete validation pass. The entry configuration is correct because handleStartDemo enforces it through initialization, not through a validation function call. D.3 notes this as a compliance-by-construction situation: the contract is satisfied but not through an explicit validation gate.

---

## 4. traversalHistory Behavior at Operator Mode Boundaries

Per [[lens_runtime_state_mapping]] §5, traversalHistory is cleared on handleDemoExit (transition into Operator mode). The Operator mode session does not add to traversalHistory — the array remains empty throughout the Operator mode session. On return from Operator mode via handleStartDemo, traversalHistory remains empty and is populated fresh as the new governed session advances.

This behavior satisfies [[execlens_entry_exit_contract]] §5: "The Operator mode session is not recorded as a traversal history." The governed traversal history begins fresh from the validated entry point when the new session opens.

---

## 5. Operator Mode Content Governance

[[execlens_entry_exit_contract]] §4 states that Operator mode releases sequencing constraints but does not release content governance: "Operator mode releases the sequencing constraints and the ENL authorization requirement; it does not release the content governance that makes each panel's output trustworthy."

In the runtime, this principle is satisfied by the fact that panel content is not altered by freeMode. The NarrativePanel, SignalsPanel, SituationPanel, and EvidencePanel components receive the same queryData in Operator mode as in governed traversal. freeMode only changes which panels may be open; it does not change what any panel displays. The PiOS pipeline outputs rendered by each panel are unchanged.

---

## 6. Operator Mode and PERSONA_DEPTH_ENVELOPE

When computePanelState is called during an Operator mode session (freeMode=true), it does not apply LOCKED states based on persona depth. All implemented panels are treated as AVAILABLE in Operator mode regardless of the active persona or lack thereof. This is the correct behavior per [[execlens_entry_exit_contract]] §4: "All panels become accessible regardless of traversal path, persona depth, or traversal prerequisites."

The null-mapped panels (Drift, Remediation) remain inaccessible in Operator mode not because of persona gating but because they have no panel implementations. Operator mode releases traversal constraints; it does not create panel components that do not exist.

---

*Authority: [[execlens_traversal_binding]] (D.2) | [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2)*
