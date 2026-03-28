# Traversal Runtime Validation

Program: Krayu — Program Intelligence Discipline
Stream: D.2 — Lens Traversal Binding
Authority: [[execlens_traversal_binding]], [[pios_traversal_contract]], [[canonical/canonical-layer-model]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[execlens_traversal_binding]]
→ [[execlens_panel_state_model]]
→ [[execlens_navigation_contract]]
→ [[execlens_persona_binding]]
→ [[execlens_entry_exit_contract]]

---

## 1. Purpose

This document defines the validation model that governs traversal compliance at the runtime layer within Lens. It specifies the validation rules that must be satisfied at each stage of a traversal session, the failure modes that constitute a traversal contract violation, and the fail-closed behavior that the runtime must execute when a validation rule cannot be satisfied. It is the enforcement specification for the D.2 binding set, downstream of the panel state model, the navigation contract, the persona binding, and the entry and exit contract.

Traversal validation is not logging. It is not audit-trail generation. It is the active, session-time verification that the current traversal state conforms to the contract. Validation runs continuously throughout the session — at entry, at each traversal step, at panel state transitions, at persona changes, and at Operator mode boundaries. A validation failure at any of these points is a governed event that requires a defined response. The runtime may not proceed past a validation failure by treating it as a warning; all validation failures are blocking events that require resolution before the traversal state may advance.

The fail-closed principle is the foundation of this model. Where the traversal contract cannot be satisfied — because an upstream output is absent, because a panel transition is not authorized, because the entry state is invalid, because a persona boundary would be violated — the session surfaces the failure condition and holds at a valid state. It does not attempt to satisfy the contract through approximation, synthesis, or workaround. The absence, the blocked transition, or the invalid configuration is the governed output. Surfacing it accurately is compliance.

---

## 2. Entry Validation Rules

Entry validation must pass before a traversal session is considered open. The following conditions must all be true for entry validation to pass.

The query selector must be present and a scope must have been selected or confirmed. A session without a defined program scope has no evidence context to navigate. ENL cannot authorize any traversal step without knowing the evidence boundary from which navigation proceeds. If the query selector is absent or no scope has been confirmed, the entry state is invalid and the session must not open.

Exactly one panel must be in ACTIVE state, and that panel must be Overview. If any other panel is ACTIVE at entry — if Signals, Topology, Drift, Remediation, or Evidence is in ACTIVE state before the traversal session has begun — the entry state is invalid. The runtime must return to a valid entry state before proceeding.

No panel may be in EXPANDED state at entry. EXPANDED is a traversal-depth sub-state that requires the panel to have been ACTIVE first. A panel that is EXPANDED at entry has not been reached through traversal; it has been placed in a depth state without having earned that state through a governed traversal step.

The panel states for all panels other than Overview must match the active persona's traversal envelope per [[execlens_persona_binding]]. If a panel that is LOCKED for the active persona is in AVAILABLE state at entry, the entry configuration does not match the persona contract. The runtime must correct the panel states before the session opens.

If any entry validation rule fails, the session must not open. The runtime must surface the specific validation failure, return all panels to their correct entry-state configuration, and present the entry state to the user for confirmation before traversal begins.

---

## 3. Step Validation Rules

Step validation runs at every proposed traversal step — every moment when a user attempts to advance from the current panel to a next panel. The following conditions must all be true for a traversal step to be authorized.

The proposed destination panel must be in AVAILABLE state. A panel that is HIDDEN, LOCKED, or ACTIVE cannot be the destination of a traversal step. If the proposed destination panel is not in AVAILABLE state, ENL does not authorize the transition. The runtime must not perform the transition. The current panel remains ACTIVE.

The proposed transition must be a valid next step on the active traversal path. [[execlens_navigation_contract]] defines the permitted panel transitions for each traversal path. A transition that is not listed as a valid next step from the current position on the active path is not a permitted step, even if the destination panel is in AVAILABLE state. For example, if the active traversal path is the primary path and the current position is Signals, the valid next step is Evidence. A proposed transition from Signals to Topology is not a valid next step on the primary path; it would require switching to the technical deepening path, which has its own entry sequence. ENL does not authorize cross-path transitions without a governed path change.

The upstream evidence context must be sufficient to make the destination panel meaningful. ENL cannot authorize a transition to Evidence if the evidence lineage for the active traversal position is absent — if the signals currently active in the Signals panel have no traceable evidence in the governed pipeline. In that case, the absence must be surfaced at the Signals panel before the transition to Evidence is attempted. The runtime must not proceed to Evidence and then surface the absence there; the absence is surfaced at the point in the traversal where it is discovered.

If any step validation rule fails, the proposed transition is blocked. The runtime surfaces the specific reason for the blocked transition — absent evidence, prohibited path step, invalid destination state — and holds the session at the current ACTIVE panel. The user may take a valid alternative step from the current position, change path, change persona, or enter Operator mode. The runtime does not resolve the validation failure by making an unauthorized transition.

---

## 4. State Transition Validation Rules

State transition validation runs at every panel state change, independently of step validation. State changes occur not only on traversal steps but also on persona changes, drift condition evaluations, and Operator mode boundary transitions. The following conditions must be true for any panel state transition to be valid.

A panel may not transition from HIDDEN to ACTIVE. The state model requires HIDDEN → AVAILABLE → ACTIVE. Any transition that skips AVAILABLE is invalid. The runtime must not execute it.

A panel may not transition from LOCKED to AVAILABLE without a governing cause. A LOCKED panel becomes AVAILABLE only when the traversal condition that locked it changes — a persona upgrade that expands the traversal envelope, or a traversal step that fulfills the prerequisite for a previously locked panel. A LOCKED panel that transitions to AVAILABLE without a governing cause has been unlocked by something other than the traversal contract, which is a validation failure.

Exactly one panel may be in ACTIVE state at any moment. If a state transition would result in two panels simultaneously in ACTIVE state, the transition is invalid. The runtime must resolve the conflict by determining which panel should hold ACTIVE status per the traversal sequence and returning the other to the appropriate prior state.

A panel in LOCKED state may not display content to the user. A LOCKED panel may be visible in the navigation structure as unavailable, but its content must not be rendered. If a LOCKED panel is rendering content, the state model has been violated — the panel is in LOCKED state but is behaving as though it is ACTIVE or AVAILABLE.

---

## 5. Persona Change Validation Rules

Persona changes trigger a re-evaluation of the full panel state model against the new persona's traversal envelope. The following conditions govern persona change validation.

If the current ACTIVE panel is outside the new persona's traversal envelope — for example, a persona downgrade from Analyst to Exec while the session is at the Drift panel — the session must transition back to the deepest panel within the new persona's envelope. For an Exec persona, that is the Signals panel if Signals has been passed through, or the Overview panel if it has not. The transition back is not a governed traversal step forward; it is a session recovery to a valid state within the new envelope.

Panels that are AVAILABLE or EXPANDED under the prior persona and are outside the new persona's envelope must transition to LOCKED. They may not retain AVAILABLE or EXPANDED status under a persona that cannot reach them.

Panels that are LOCKED under the prior persona and are within the new persona's envelope do not automatically become AVAILABLE. They become AVAILABLE only when the traversal sequence reaches the point at which they would normally become AVAILABLE — the completion of their prerequisite traversal step. A persona upgrade opens the traversal envelope; it does not automatically advance the traversal to the newly accessible depth.

---

## 6. Operator Mode Boundary Validation Rules

The Operator mode boundary is governed at both edges — the transition into Operator mode and the return from it.

On transition into Operator mode, the runtime must confirm that the Operator mode indicator is visible to the user before releasing panel constraints. A session that releases panel constraints without surfacing the Operator mode status has suspended the traversal contract without informing the user, which is a validation failure. The Operator mode indicator must remain visible throughout the Operator mode session.

On return from Operator mode, the runtime must execute entry validation before restoring the governed traversal session. The return from Operator mode is treated as a new session entry; entry validation must pass before traversal resumes. If the session state on return from Operator mode does not satisfy the entry validation rules, the runtime must correct the state to a valid entry configuration before the governed session opens.

The Operator mode session state — which panels were visited, in what order, at what depth — must not be carried into the governed traversal history. The governed traversal history begins fresh from the validated entry state after Operator mode ends.

---

## 7. Absent Upstream Output Rules

The fail-closed behavior of the D.2 binding is most precisely defined in the rules governing absent upstream outputs. An absent upstream output is any PiOS pipeline output that a traversal step requires but that does not exist in the current governed state of the pipeline.

When a traversal step requires an upstream output that is absent, the absence is surfaced at the current traversal position. The runtime must not advance to the next panel and render a partial or synthesized output in place of the absent one. The absence is surfaced in the current panel — in Signals if a signal is absent, in Topology if a structural node has no derived state, in Evidence if an evidence lineage does not exist for the active selection — and the traversal is held at that position.

The surfaced absence must accurately represent what is absent and why, to the extent that the governance record provides that information. If a signal is absent because its L3 derivation specification has not been executed, the absence message identifies the upstream dependency. If evidence lineage is absent because the source system did not provide the record, the absence message identifies the source gap. The runtime does not present a generic "data unavailable" message if a more specific governance-grounded explanation is available.

The runtime must never synthesize a plausible value for an absent upstream output. A synthesized value is not a governed output. It is an ungoverned approximation that severs the evidence lineage of the panel that displays it — and severing evidence lineage is the defining failure mode that the Program Intelligence discipline and the PiOS architecture exist to prevent.

---

## 8. Validation Failure Classification

Validation failures are classified by the severity of the governance violation they represent.

A blocking failure is a validation failure that prevents the traversal from proceeding. All step validation failures are blocking. Entry validation failures are blocking. Persona change failures that place the session at an invalid traversal position are blocking. A blocking failure must be resolved — by returning to a valid state, by surfacing the absence, or by confirming the Operator mode transition — before any traversal action may be taken.

A configuration failure is a validation failure in the panel state model that does not prevent the current panel from being viewed but does prevent the session from advancing until the configuration is corrected. A panel in an incorrect state — AVAILABLE when it should be LOCKED, HIDDEN when it should be AVAILABLE — is a configuration failure. The runtime must correct the configuration before the next traversal step.

A boundary failure is a validation failure at the Operator mode boundary — Operator mode entered without surfacing the indicator, Operator mode session state carried into governed traversal history. A boundary failure is blocking at the boundary where it occurs and must be resolved before the boundary transition is complete.

No failure class permits the runtime to proceed through the failure by substituting a plausible output or by treating the failure as a non-blocking warning. Every validation failure is a governed event with a governed response.

---

*Authority: [[execlens_traversal_binding]] (D.2) | [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2) | [[execlens_entry_exit_contract]] | [[execlens_panel_state_model]]*
