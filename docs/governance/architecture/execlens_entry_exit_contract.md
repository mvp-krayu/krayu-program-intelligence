# Lens — Entry and Exit Contract

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
→ [[traversal_runtime_validation]]

---

## 1. Purpose

This document defines the entry state and exit contract for a Lens traversal session. The entry state governs the precise condition of the Lens surface on first load — which panels are visible, which are active, what the navigation spine shows, and what the user is presented with before any traversal step has been taken. The exit contract governs what happens when the session transitions out of governed traversal mode into Operator mode — what constraints are released, what is preserved, and what the explicit governance status of Operator mode is.

These two boundaries — entry and exit — are the outermost constraints on a governed traversal session. Every rule in [[execlens_navigation_contract]], [[execlens_panel_state_model]], and [[execlens_persona_binding]] applies within the session envelope that entry and exit define. Understanding the entry state is understanding what the governed session begins as. Understanding the exit contract is understanding when and how the governed session ends and what replaces it.

---

## 2. Entry State

The entry state is the governed condition of the Lens surface at the moment a traversal session begins — the state that exists before the user has taken any traversal step. The entry state is deterministic. It is the same regardless of which persona is active, which program is queried, or which traversal path the session will follow. The traversal sequence has not yet begun at entry; entry is the pre-traversal state from which the first traversal step will be taken.

At entry, the query selector is visible. The query selector is the mechanism through which the user scopes the traversal session to a specific program or program context. It is presented at entry because scope selection is the precondition for any governed traversal: a traversal that has not been scoped to a specific program has not yet established the evidence context from which traversal can proceed. The query selector is not a panel in the traversal sense — it does not belong to the traversal object class hierarchy defined in [[execlens_traversal_binding]] §2 — but it is the mechanism through which the traversal session acquires its subject.

At entry, the Overview panel is ACTIVE. It is the only panel in ACTIVE state at entry. Overview being ACTIVE at entry is the expression of the first rule of every traversal path: Overview is the entry surface and must be ACTIVE before any other panel may transition from HIDDEN to AVAILABLE. The Overview panel at entry displays the governed intelligence summary for the scoped program context, drawn from the PiOS pipeline output for that context. It does not compute anything at entry; it renders the most recent governed intelligence output available for the selected scope.

At entry, all panels other than Overview are in their default state per persona. For the Exec persona, Signals is AVAILABLE as the next traversal step, and all other panels are HIDDEN or LOCKED per the Exec traversal envelope. For the CTO persona, Signals and Topology are both AVAILABLE as the next traversal step from Overview — the user will choose which path to follow — and Drift and Remediation are HIDDEN pending traversal conditions. For the Analyst persona, the same AVAILABLE configuration as CTO applies at entry; the expanded Analyst envelope becomes visible as the traversal advances. The Topology panel may be visible in collapsed state at entry for CTO and Analyst personas — collapsed meaning that the structural graph is present in the surface but is not the ACTIVE panel and is not yet the user's traversal position. This is consistent with the 51.8.R baseline's treatment of topology as a persistent structural context rather than a panel that appears only when explicitly navigated to.

At entry, no panel other than Overview may be in EXPANDED state. The traversal has not advanced; no panel depth has been earned by traversal. A session that begins with Signals EXPANDED, Topology EXPANDED, or Evidence visible has not entered at the governed entry state — it has begun at an intermediate traversal position, which is a traversal contract violation.

---

## 3. Entry Validation

The entry state must be validated before the traversal session is considered open. Validation confirms that the surface is in the correct governed configuration before the user begins traversal. The specific validation rules are defined in [[traversal_runtime_validation]] §2; stated here as a summary, the entry validation must confirm that exactly one panel is ACTIVE (Overview), that the query selector is present, that no downstream panel is in ACTIVE or EXPANDED state, and that the panel states match the active persona's traversal envelope.

If entry validation fails, the session must not proceed. The runtime must surface the validation failure and return to a valid entry state. It must not allow traversal to begin from an invalid entry configuration, because traversal begun from an invalid entry state has no governed starting position and cannot produce a traversal history that is traceable to a canonical entry point.

---

## 4. Exit and Operator Mode

Operator mode is the explicit suspension of the traversal contract for a specific session purpose. It is entered by a deliberate user action — the Ctrl+K invocation or its equivalent explicit exit control — and it represents the user's acknowledgment that they are stepping outside the governed traversal envelope for operational purposes. Operator mode is a governed state, not an ungoverned state: the transition into it is explicit, the governance status during it is declared, and the rules that apply within it are defined here.

On entry to Operator mode, all panel constraints are released. The panel state model defined in [[execlens_panel_state_model]] no longer applies. All panels become accessible regardless of traversal path, persona depth, or traversal prerequisites. The navigation spine is no longer enforced by ENL as path authorization; it becomes a free-navigation structure that the user may traverse in any order. The traversal contract defined in [[pios_traversal_contract]] is explicitly suspended for the duration of the Operator mode session.

The release of panel constraints in Operator mode does not change what any panel contains. The Overview panel displays the same governed intelligence output in Operator mode as in governed traversal. The Signals panel displays the same derived signal set. The Drift panel displays the same drift records. Operator mode releases the sequencing constraints and the ENL authorization requirement; it does not release the content governance that makes each panel's output trustworthy. PiOS continues to produce governed outputs. Lens continues to render them. Operator mode changes how the user may navigate between those outputs, not what those outputs are.

The traversal contract suspension in Operator mode is explicit and must be surfaced to the user. The Lens surface must clearly indicate that the session is in Operator mode and that governed traversal constraints are not in effect. This is the application of the rule from [[pios_traversal_contract]] §9 that traversal cannot hide drift when drift is the reason for a boundary rule — extended to the Operator mode context: the runtime cannot allow the user to operate in a mode where traversal constraints are suspended without making that suspension visible. A user who does not know they are in Operator mode cannot make informed judgments about the authority of what they are viewing relative to the governed traversal sequence.

---

## 5. Exit from Operator Mode

Exit from Operator mode returns the session to the governed traversal envelope. The return is to the entry state, not to the traversal position the user was at when they entered Operator mode. This is because Operator mode may have resulted in a panel configuration — multiple panels visited out of sequence, Evidence viewed without Signals context — that does not correspond to a valid traversal position. Rather than attempt to reconstruct a valid traversal position from an Operator mode navigation history, the session returns to the entry state and traversal begins again from the canonical entry point.

The query selector is presented on return from Operator mode. The user may re-scope the session or confirm the existing scope before traversal begins. Overview is returned to ACTIVE state. All other panels return to the entry-state configuration for the active persona.

The Operator mode session is not recorded as a traversal history. A governed traversal session has a traversal history that ENL maintains as the sequence of ACTIVE panels through which the user has passed. An Operator mode session does not add to that history, because Operator mode navigation is unconstrained and its path is not a governed traversal path. When the session returns from Operator mode to governed traversal, the traversal history begins fresh from the new entry point.

---

## 6. Governing Principle

The entry state and exit contract together define the outer boundaries of a governed traversal session. Entry establishes the governed starting position from which traversal must begin. Exit to Operator mode explicitly suspends the traversal contract with full user visibility into that suspension. Return from Operator mode restores the governed starting position.

Everything between entry and exit is governed by the panel state model, the navigation contract, and the persona binding. Everything outside that boundary — before entry validation passes, after Operator mode is invoked — is the responsibility of entry validation and the Operator mode contract respectively. Neither entry nor exit is a gap in governance; both are governed states with defined rules, defined validation, and defined behavior.

---

*Authority: [[execlens_traversal_binding]] (D.2) | [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2)*
