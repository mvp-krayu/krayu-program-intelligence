# Lens — Persona Binding

Program: Krayu — Program Intelligence Discipline
Stream: D.2 — Lens Traversal Binding
Authority: [[execlens_traversal_binding]], [[pios_traversal_contract]], [[canonical/canonical-layer-model]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[execlens_traversal_binding]]
→ [[execlens_panel_state_model]]
→ [[execlens_navigation_contract]]
→ [[execlens_entry_exit_contract]]
→ [[traversal_runtime_validation]]

---

## 1. Purpose

This document defines the persona binding model for Lens under the D.2 traversal contract. It specifies how the three defined personas — Exec, CTO, and Analyst — map to traversal depth, which panels each persona may reach, and the enforcement rules that govern persona-depth interaction. It operationalizes the principle established in [[pios_traversal_contract]] §4: persona affects how far a user descends into the governed graph; persona does not alter what is true.

Persona is a runtime configuration that modifies the traversal envelope available to a given session. It does not change the content of any panel. It does not alter signal values, structural states, evidence lineage, or drift records. It does not filter out governance truth. What persona does is establish the maximum traversal depth for the session — the furthest panel that ENL will authorize the active persona to reach — and restrict certain traversal paths to those appropriate to the persona's analytical scope.

The 51.8.R baseline established persona-sensitive controlled exposure as part of its scripted traversal model. This document formalizes the persona depth rules that underlie that exposure so that persona behavior is contract-bound across all traversal sessions, not only those executing the scripted sequence.

---

## 2. The Non-Alteration Principle

Before defining the three personas, the non-alteration principle must be stated precisely, because it governs every persona binding rule that follows. Persona determines the maximum depth of traversal. Persona does not determine what any panel contains. This means that the Overview panel displays the same governed intelligence output to an Exec, a CTO, and an Analyst. The Signals panel, when reached, displays the same derived signal set to all personas that can reach it. The Drift panel, when reached, displays the same drift records to all personas that can reach it.

Persona does not produce a filtered view of the truth for convenient audiences. It produces a bounded view — one that extends as far as the persona's analytical scope requires and no further. The difference between filtering and bounding is the difference between hiding truth and deferring depth. Filtering hides content from a panel a persona can see. Bounding prevents a persona from reaching a panel where deeper content lives. D.2 permits bounding. D.2 prohibits filtering.

If an Exec persona user needs to see the Drift panel, the correct response is to change the persona to CTO or Analyst. The correct response is not to surface a summary of drift content within the Overview or Signals panel on behalf of the Exec persona. Surfacing drift content outside the Drift panel would mean that the panel from which it is surfaced is performing drift-node work — and no panel may perform the work of another traversal object class without a governed boundary violation.

---

## 3. Exec Persona

The Exec persona defines the traversal envelope for an executive reader whose analytical scope is the program's overall intelligence output — the signal summary, the condition state, and the boundary between what PiOS has determined and what the surface presents.

The Exec persona has access to the primary path and may traverse Overview → Signals → Evidence. The Overview panel is fully available. The Signals panel is available as the next traversal step from Overview. Evidence is available as the terminal step from Signals, scoped to the lineage of the signals currently active in the Exec session.

The Topology panel is not available to the Exec persona by default. Topology requires structural depth that is outside the Exec traversal scope. If Topology were available by default on the Exec path, the traversal would require the user to engage with program structural detail that is not within the analytical purpose of the Exec persona. ENL will not authorize a transition from Overview to Topology on an Exec session; Topology remains HIDDEN and LOCKED throughout an Exec traversal.

The Drift panel and the Remediation panel are not available to the Exec persona. Both panels require technical depth to interpret correctly — the specific boundary violations, their canonical authority basis, and their correction chain are not within the analytical scope of an executive reader. Drift and Remediation remain HIDDEN and LOCKED throughout an Exec traversal. This is depth bounding, not truth filtering: the Drift panel exists, its content is not hidden from the world, and an Exec who needs to engage with it may do so by moving to the CTO persona.

The Exec traversal path is compressed and complete. Compressed means that it does not reach Topology, Drift, or Remediation. Complete means that it is not a degraded or incomplete view of program intelligence; it is the full executive-appropriate view of the PiOS outputs that the primary path produces.

---

## 4. CTO Persona

The CTO persona defines the traversal envelope for a technical leader whose analytical scope extends to the structural composition of the program, the signal-to-structure mapping, and the governed deviations that affect the architecture the surface is presenting.

The CTO persona has access to the primary path, the technical deepening path, and the drift explanation path. The full panel set — Overview, Signals, Topology, Drift, and Evidence — is available to the CTO traversal, subject to the traversal path rules defined in [[execlens_navigation_contract]]. Overview is the entry panel. Signals is available from Overview on the primary path. Topology is available from Overview on the technical deepening path. Drift is available from Signals when an active drift condition is present. Evidence is available from any depth panel as the terminal step.

The Remediation panel is available to the CTO persona, but only through the drift explanation path and only when the active drift case has a correction chain whose details are specifically required. Remediation does not become generally available on the CTO traversal; it remains available only on the condition that the drift explanation path has been entered and the active drift case makes it relevant.

The CTO traversal envelope is structurally complete. It reaches the full depth of governed program intelligence — signals, structural topology, deviation records, remediation chains, and evidence lineage — without requiring any of those depth layers to be accessible from the primary path entry point. Depth is earned through traversal: each step from Overview outward establishes the context that makes the next step meaningful.

---

## 5. Analyst Persona

The Analyst persona defines the traversal envelope for a reader whose analytical scope is the full depth of the governed intelligence system — including all traversal paths, all panels, full ENL expansion, and the complete evidence lineage at every panel where it is available.

The Analyst persona has access to all four traversal paths defined in [[execlens_navigation_contract]] and all six panels in the Lens panel set. No panel is LOCKED for the Analyst persona. All panels are reachable subject to the traversal sequence rules: Overview is always the entry panel, panels do not become AVAILABLE until their traversal prerequisite is met, and Evidence remains the terminal panel that is reached only after the depth context has been established. The Analyst's traversal envelope is the maximum traversal envelope defined by the D.2 contract.

Full ENL expansion for the Analyst persona means that the ENL navigation spine is fully visible and navigable. The Analyst can see the full traversal history and the full set of AVAILABLE next steps at each position, subject to the path constraints. The Analyst's visibility into the ENL state does not grant the ability to bypass path constraints — ENL still authorizes each transition, and no transition is authorized that would violate the traversal sequence. What full ENL expansion provides is complete traversal transparency: the Analyst can see exactly where in the governed path they are, where they have been, and what paths are available from the current position.

Even for the Analyst persona, Evidence is never the first ACTIVE panel. Even for the Analyst, Drift is not entered without an active drift explanation condition. Even for the Analyst, Remediation is not entered directly from Overview. The traversal sequence must be followed regardless of persona depth. Persona expands the envelope of what can be reached; it does not permit any path to be taken out of sequence.

---

## 6. Persona Transition Rules

Persona may change during a session. When a persona changes, the panel state model is re-evaluated against the new persona's traversal envelope. Panels that are LOCKED under the prior persona may become AVAILABLE under the new persona, subject to the traversal sequence rules. Panels that are AVAILABLE under the prior persona and are outside the new persona's envelope become LOCKED.

A persona downgrade — moving from Analyst to CTO, or from CTO to Exec — while at a panel that is outside the new persona's envelope must fail closed. The runtime must not allow the session to remain at a panel that the new persona cannot reach. It must transition the session back to the deepest panel permitted by the new persona's traversal envelope, which is the Overview panel if the current position is above the new persona's maximum depth.

A persona upgrade — moving from Exec to CTO, or from CTO to Analyst — does not retroactively make bypassed panels ACTIVE. The traversal history is not rewritten. The session continues from the current position under the new persona's expanded envelope. If the Analyst envelope makes Topology available and the session is currently at Signals on the primary path, the Analyst session may now transition to Topology as an alternative depth step. It cannot jump to Topology without first returning to the Overview and re-entering the technical deepening path, because the primary path step from Overview was to Signals, not to Topology.

Persona transitions are a runtime mechanism for expanding or contracting traversal depth. They are not a mechanism for bypassing traversal sequence.

---

## 7. Enforcement Rule

The enforcement rule for the persona binding model is stated once and governs all cases without exception.

Persona filters traversal depth. Persona does not filter traversal truth. No runtime implementation of persona-sensitive behavior may alter the content of any panel based on persona. No runtime implementation may surface content from a deeper panel within a shallower panel on behalf of a persona that cannot reach the deeper panel. No runtime implementation may LOCK a panel in a way that prevents the panel from becoming AVAILABLE if the persona changes to one that permits it. And no runtime implementation may use persona as the justification for altering panel sequence — presenting a panel earlier than its traversal prerequisite position because a particular persona would find that sequencing convenient.

---

*Authority: [[execlens_traversal_binding]] (D.2) | [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2)*
