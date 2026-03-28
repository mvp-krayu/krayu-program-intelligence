# Lens — Navigation Contract

Program: Krayu — Program Intelligence Discipline
Stream: D.2 — Lens Traversal Binding
Authority: [[execlens_traversal_binding]], [[pios_traversal_contract]], [[canonical/canonical-layer-model]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[execlens_traversal_binding]]
→ [[execlens_panel_state_model]]
→ [[execlens_persona_binding]]
→ [[execlens_entry_exit_contract]]
→ [[traversal_runtime_validation]]

---

## 1. Purpose

This document defines the four traversal paths as concrete navigation sequences within Lens, specifying the exact panel transitions permitted on each path, the enforcement rules that prevent path violation, and the role of ENL as the governing navigation spine. It translates the abstract traversal paths defined in [[pios_traversal_contract]] §3 into deterministic runtime behavior for the Lens panel set defined in [[execlens_panel_state_model]] §2.

A navigation contract is not a suggestion about how users should move through the system. It is the formal definition of which movements are valid, which movements are not permitted, and what the runtime must do when a movement would violate the contract. The 51.8.R baseline established a governed and scripted traversal experience; this contract formalizes the path logic underlying that experience so that it is reproducible, auditable, and contract-bound rather than dependent on scripting alone.

---

## 2. ENL as Navigation Spine

ENL — the Evidence Navigation Layer, defined at L2 in [[canonical/canonical-layer-model]] §4 — is the governing navigation spine within Lens. Every panel transition in a governed traversal session is mediated by ENL. This means that movement from one panel to the next is not a UI state change driven by a button click in isolation; it is a traversal step that ENL authorizes by confirming that the destination panel has a governed path from the current position and that the evidence lineage required to make the destination panel meaningful is available.

ENL controls panel activation. A panel transitions from AVAILABLE to ACTIVE only when ENL has confirmed that the current traversal position has a valid next step reaching that panel. ENL controls navigation state — the traversal session's current position in the path is held by ENL, not by the presentation layer. And ENL exposes the current traversal position so that the Lens surface can accurately represent where in the governed path the user is located.

ENL does not interpret what any panel means. It does not rank panels by importance. It does not make semantic decisions about what should be shown next. Its function is path authorization — confirming that the proposed movement from the current node to the next node is a permitted step in the active traversal path. If the proposed movement is not a permitted step, ENL does not authorize it, and the panel does not become ACTIVE. This is the fail-closed behavior that keeps traversal governed regardless of user intent.

A traversal step without ENL authorization is not a valid traversal step. Any navigation implementation that bypasses ENL — advancing a panel by directly manipulating state rather than by requesting an ENL-authorized transition — is a traversal contract violation, not an implementation optimization.

---

## 3. Primary Path

The primary path is the sequence that governs a first traversal of the program intelligence output for a user who has not specified a structural or deviation-specific question. It proceeds in the following sequence: Overview is the entry panel and must be ACTIVE before any other panel transitions from HIDDEN to AVAILABLE. From Overview, ENL authorizes the transition to Signals as the next step. Signals surfaces the derived signal set — the evidence-bound, L3-derived, L4-shaped outputs that represent the program's current execution state. From Signals, ENL authorizes the transition to Evidence as the terminal step. Evidence surfaces the lineage underlying the active signal set: the source records, normalized structures, and derivation chain that ground the signals in the evidence from which they were produced.

The sequence is Overview → Signals → Evidence. Each step is deterministic. The user cannot move from Overview to Evidence without first passing through Signals, because Evidence without the signal context that makes it meaningful is raw lineage without interpretive anchor. The user cannot move from Signals back to a prior state as though the Overview context had not been established. The path flows in one direction: from the canonical entry surface through the signal representation to the evidence terminus.

No step in the primary path may be skipped. No step may be reordered. If a user's query does not require the full depth of the primary path — if the signal layer fully answers the question without requiring evidence lineage inspection — the traversal may terminate at Signals. But if Evidence is to be reached, it must be reached through Signals, not directly from Overview.

---

## 4. Technical Deepening Path

The technical deepening path is the sequence for a user whose question is structural — concerned with the program's component topology, the relationships between structural nodes, and how the signal set maps onto the program's composition. It proceeds as follows: Overview is the entry panel, as on every path. From Overview, ENL authorizes the transition to Topology as the next step. Topology surfaces the structural composition of the program — its components, domains, capability clusters, and the adjacency relationships between them — as the navigable graph over which signals are anchored and execution state is localized. From Topology, ENL authorizes the transition to Evidence as the terminal step, where the evidence lineage for the active structural selection is available.

The sequence is Overview → Topology → Evidence. The distinction from the primary path is that the depth step is Topology rather than Signals. Topology and Signals are not co-active on this path; the technical deepening path reaches Topology as the primary depth surface, and from Topology the user may inspect the signal values anchored to specific structural nodes. Evidence is the same terminal panel as on the primary path, but its content is scoped to the structural selection active in Topology rather than to the full signal set active in Signals.

Topology does not become AVAILABLE on the primary path. On the primary path, the depth step is Signals and Topology remains HIDDEN unless the active traversal transitions to the technical deepening path. The two paths share Overview as their entry point and Evidence as their terminal point, but they reach different depth panels and the content of Evidence at the terminus reflects the active depth context.

---

## 5. Drift Explanation Path

The drift explanation path is entered when the active traversal has surfaced a signal or boundary rule whose origin requires reference to a known governed deviation. It is not a primary path. It is not entered by default. ENL authorizes entry to the Drift panel only when the active traversal context — typically the Signals panel displaying a signal or rule that has a drift case in [[drift_register]] — has an active drift explanation condition. When that condition is present, ENL transitions Drift from HIDDEN to AVAILABLE as a conditional next step alongside Evidence.

The sequence from that point is Overview → Signals → Drift → Remediation (conditional) → Evidence. The first two steps are identical to the primary path. The departure occurs at Signals, where the drift explanation condition activates the Drift panel as an available extension. Drift surfaces the relevant drift record — the classification, the violation type, the canonical authority that was violated, and the governance disposition. From Drift, if the active drift case has a correction chain whose details are specifically needed, ENL may authorize the transition to Remediation. Remediation is not entered by default from Drift; it is entered only when the active drift case's correction chain is the subject of the traversal. Evidence remains the terminal panel and may be reached from either Drift or Remediation when the deviation explanation is complete.

The drift explanation path must never be entered as a primary path entry point. A traversal that begins at Drift rather than Overview has started from a deviation record rather than from canonical authority. The authority direction runs from the canonical model through the stack to the product surface; it does not run from deviation records toward architectural claims. Entering at Drift and concluding anything about canonical architecture from what is found there is a traversal contract violation regardless of the accuracy of the drift record's content.

---

## 6. Product Bridge Path

The product bridge path is the sequence for a user whose question concerns the relationship between PiOS outputs and the Lens surface — specifically, what the surface exposes, what governs its scope, and how the boundary between the intelligence system and the intelligence surface is enforced. It proceeds as follows: Overview is the entry panel. From Overview, ENL authorizes the transition to Topology, where the structural boundary of the program — the composition the surface is presenting — is visible. From Topology, the user may inspect the specific signal-to-structure bindings that express how PiOS intelligence is anchored in the program's structural nodes. From Topology, ENL authorizes the transition to Evidence as the terminal step, where the source lineage underlying the active structural selection is available.

The sequence is Overview → Topology → Evidence. The product bridge path shares its panel sequence with the technical deepening path. The distinction is in the question the traversal is answering and, correspondingly, the content of each panel that is relevant. On the technical deepening path, the depth question is architectural: what do the signals say about structural health? On the product bridge path, the depth question is boundary-oriented: what does the surface expose versus what does PiOS own? The panel sequence is the same because the structural surface (Topology) and the evidence terminus (Evidence) are the correct panels for both questions. The difference is the traversal intent, which determines what the user is reading in each panel.

The product bridge path does not have a dedicated panel beyond the existing panel inventory. It does not require Drift or Remediation unless the boundary question involves a known deviation. If a user on the product bridge path encounters a boundary rule and needs to understand why it exists, the drift explanation path may be entered as an extension.

---

## 7. Path Enforcement Rules

Path enforcement is the set of rules that the Lens runtime must apply to prevent traversal violations. These rules derive from [[pios_traversal_contract]] §9 and are restated here as concrete runtime requirements.

No path may be skipped. If the active traversal path requires a user to pass through a specific panel before reaching the next panel, the runtime must enforce that requirement. ENL will not authorize the transition to a downstream panel if the intermediate panel has not been ACTIVE. The runtime may not implement workarounds — keyboard shortcuts, URL parameters, direct state injections — that bypass an intermediate traversal step, because doing so would produce a traversal position without a complete traversal history, which is equivalent to producing intelligence without evidence lineage.

No path may be reordered. The sequence of panels on each path is fixed by the traversal contract. The runtime may not present Topology before Overview, may not present Evidence before Signals or Topology, and may not present Drift before Signals. If a presentation preference would benefit from a different order, the correct response is to amend the traversal contract through the governed architectural stream, not to reorder panels at the runtime level.

No upstream panel may be bypassed for a downstream panel's convenience. A user who is viewing Evidence and wants to return to an earlier traversal position may do so by traversing back through the path history. The runtime may support backward navigation in the traversal sequence. What the runtime may not do is allow a user to jump from Evidence to Drift without having been at Signals with an active drift condition, or to jump from Overview to Remediation without having passed through Signals and Drift. Forward jumps that skip intermediate panels are path violations. They produce a traversal position that cannot be grounded in a complete traversal history.

Absent upstream output must be surfaced, not substituted. If ENL cannot authorize a transition because a required upstream output does not exist — a signal has not been derived, a structural node has no evidence lineage, a drift case has no remediation record — the runtime must surface that absence. It must not synthesize a plausible output to fill the gap. The absence is the governed output in that condition. The user receives the absence as accurate information about the system's current state.

---

*Authority: [[execlens_traversal_binding]] (D.2) | [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2) | [[drift_register]]*
