# Lens — Panel State Model

Program: Krayu — Program Intelligence Discipline
Stream: D.2 — Lens Traversal Binding
Authority: [[execlens_traversal_binding]], [[pios_traversal_contract]], [[canonical/canonical-layer-model]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[execlens_traversal_binding]]
→ [[execlens_navigation_contract]]
→ [[execlens_persona_binding]]
→ [[execlens_entry_exit_contract]]
→ [[traversal_runtime_validation]]

---

## 1. Purpose

This document defines the lifecycle state model for Lens panels under the D.2 traversal binding. A panel state is the governed condition of a panel at any point in a traversal session. State determines whether a panel is reachable, visible, interactive, or locked. State transitions are governed by traversal position, not by user preference, rendering convenience, or persona alone.

A panel that is in the wrong state — available when it should be locked, expanded when the traversal has not reached its entry condition, hidden when the traversal has legitimately reached it — represents a traversal violation. The panel state model is not a UX specification for how panels animate. It is a governance specification for which panels may be in which states under which traversal conditions.

---

## 2. Panel Inventory

The following panels constitute the Lens panel set under D.2. Each panel maps to a traversal object class per [[execlens_traversal_binding]] §2.

| Panel | Traversal Object Class | Traversal Position |
|---|---|---|
| Overview | Canonical node | Entry — primary path step 1 |
| Signals | Stack node | Primary path step 2 / Technical deepening step 2 |
| Topology | Stack node | Technical deepening step 2 / Product bridge step 2 |
| Drift | Drift node | Drift explanation path only |
| Remediation | Remediation node | Drift explanation path step 2 only |
| Evidence | Appendix / evidence node | Terminal — reachable from any depth panel |

No panel exists outside this inventory under the D.2 binding. Additional panels may be defined in future streams; they must be bound to a traversal object class and assigned a traversal position before they may be activated.

---

## 3. State Definitions

Each panel may be in one of five states at any point in a traversal session.

**HIDDEN** is the state in which a panel does not exist in the user's traversal context. A HIDDEN panel has not been reached by any active traversal path, is not visible, is not referenced in the navigation spine, and cannot be entered by any user action. HIDDEN is the default state for all panels except Overview at session entry.

**AVAILABLE** is the state in which a panel is reachable by the next valid traversal step from the current position. An AVAILABLE panel is acknowledged in the navigation spine — the user can see that it exists as the next step — but it is not yet active. It may not be entered by skipping the traversal step that leads to it. AVAILABLE does not mean visible; it means reachable.

**ACTIVE** is the state in which a panel is the current traversal position. Exactly one panel is ACTIVE at any point in a governed traversal session. The ACTIVE panel is the panel the user is currently at in the traversal sequence. It is fully visible and fully interactive within its governed scope. An ACTIVE panel may become EXPANDED if the user invokes deeper interaction within it, or it may yield ACTIVE status to the next traversal step panel, at which point it transitions to a collapsed-but-accessible state.

**EXPANDED** is the state in which a panel has been opened to its full depth by the user while remaining the current traversal position. EXPANDED is a sub-state of ACTIVE. A panel that is EXPANDED is being read at full depth. It may return to ACTIVE (non-expanded) state, or it may yield ACTIVE status to the next traversal step, at which point it collapses. EXPANDED does not alter which panel is ACTIVE; it alters the display depth of the ACTIVE panel.

**LOCKED** is the state in which a panel exists in the system but cannot be reached under the current traversal configuration. LOCKED differs from HIDDEN in that the user may be aware a LOCKED panel exists — it may be visible in the navigation structure as unavailable — but it cannot be entered. Panels are LOCKED when the persona restriction prohibits their traversal depth, when the traversal path does not reach them, or when a prerequisite panel has not been passed. A LOCKED panel must never display a misleading indicator; if it is visible, it must be clearly marked as outside the current traversal scope.

---

## 4. State Transition Rules

State transitions are governed by traversal position and must follow these rules without exception.

Overview transitions from HIDDEN to ACTIVE on session entry. This is the only transition that does not require a prior traversal step. Overview is always the ACTIVE panel at session start; no other panel may be ACTIVE before Overview has been ACTIVE.

Signals and Topology transition from HIDDEN to AVAILABLE when Overview becomes ACTIVE. They transition from AVAILABLE to ACTIVE when the user takes the next valid traversal step from Overview. Signals becomes ACTIVE on the primary path and technical deepening path; Topology becomes ACTIVE on the technical deepening path and product bridge path. The two panels may not both be simultaneously ACTIVE; the traversal path determines which one the current traversal step leads to.

Drift transitions from HIDDEN to AVAILABLE only when the active traversal has reached Signals and a drift explanation condition is active — that is, when the displayed signal or boundary rule has a recorded drift case in [[drift_register]]. Drift does not become AVAILABLE on entry to Signals by default; it becomes AVAILABLE only when the traversal's current context has a drift explanation need. If no drift explanation condition is active, Drift remains HIDDEN.

Remediation transitions from HIDDEN to AVAILABLE only from Drift ACTIVE state. Remediation does not become AVAILABLE from any other panel or traversal state. If the user is at Drift ACTIVE and a remediation chain is relevant to the active drift case, Remediation transitions to AVAILABLE. Otherwise, it remains HIDDEN.

Evidence transitions from HIDDEN to AVAILABLE from any depth panel — Signals, Topology, or Drift — when the traversal has established sufficient context for evidence lineage to be meaningful. Evidence transitions from AVAILABLE to ACTIVE on the user's explicit traversal step to it. Evidence is the terminal panel; no panel transitions from HIDDEN to AVAILABLE as a consequence of Evidence becoming ACTIVE.

No panel may transition directly from HIDDEN to ACTIVE. The transition must pass through AVAILABLE. This rule enforces the traversal sequence: a panel cannot be entered without first being reachable, and it cannot be reachable without the prior traversal step having been taken.

No panel may transition from LOCKED to ACTIVE under any traversal condition. LOCKED panels are outside the current traversal envelope. They may only become AVAILABLE if the traversal condition that locked them changes — typically a persona change or a path change — and then only after transitioning through AVAILABLE.

---

## 5. Parallel State Prohibition

No two panels may both be in ACTIVE or EXPANDED state simultaneously. A traversal session has exactly one ACTIVE panel at any moment. This rule enforces the sequential nature of governed traversal: the user is always at one traversal position, not at two positions simultaneously.

Prior traversal steps — panels that have been passed through — may remain visible in a collapsed state as traversal history. They are not ACTIVE. They are in a completed traversal state that is not defined in the five-state model above, but they do not compete with the ACTIVE panel for the user's analytical focus. They are navigational breadcrumbs, not co-equal surfaces.

The prohibition on parallel active states is the mechanism that binds the governed 51.8.R experience to formal traversal contract logic. A traversal engine presents one panel as the current governed position, with prior steps accessible as history and future steps accessible only when the traversal sequence reaches them. This panel sequencing model formalizes the controlled exposure behavior that the 51.8.R baseline established through scripting; D.2 makes that behavior contract-bound rather than only scripted.

---

## 6. State and Persona Interaction

Persona interacts with panel state by determining which panels are LOCKED versus AVAILABLE for a given traversal session. The persona interaction with state is defined in full in [[execlens_persona_binding]]; the key principle stated here is that persona determines the maximum depth of the traversal, not the content of any panel.

An Exec persona session will have Drift and Remediation LOCKED throughout the session — not because those panels contain hidden truth, but because the Exec traversal path does not reach the depth at which drift explanation is relevant. If an Exec persona user needs to understand drift, the correct resolution is a persona change to CTO or Analyst, not a runtime bypass of the LOCKED state.

An Analyst persona session will have all panels AVAILABLE as the traversal advances. Evidence is never HIDDEN for an Analyst; it transitions from HIDDEN to AVAILABLE when the traversal reaches a depth panel, and it transitions from AVAILABLE to ACTIVE when the user takes the explicit traversal step to it. Even for Analyst, Evidence is never the first ACTIVE panel — the traversal sequence must be followed.

---

*Authority: [[execlens_traversal_binding]] (D.2) | [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2)*
