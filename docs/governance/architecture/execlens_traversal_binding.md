# Lens — Traversal Binding Contract

Program: Krayu — Program Intelligence Discipline
Stream: D.2 — Lens Traversal Binding
Authority: [[pios_traversal_contract]], [[canonical/canonical-layer-model]], [[program_intelligence_stack]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[pios_traversal_contract]]
→ [[execlens_navigation_contract]]
→ [[execlens_panel_state_model]]
→ [[execlens_persona_binding]]
→ [[execlens_entry_exit_contract]]
→ [[traversal_runtime_validation]]

---

## 1. Purpose and Position

This document is the master binding contract for Stream D.2. It defines how the traversal model established in [[pios_traversal_contract]] (D.1) binds into the Lens runtime. It does not alter the traversal contract. It does not modify any PiOS computation layer, semantic layer, or derivation specification. It binds an existing, governed traversal model to an existing governed runtime surface — enforcing, at that surface, the rules that the traversal contract establishes.

Lens is the current governed module surface within Signäl, positioned at L6 in the canonical layer model. Its canonical role is that of a runtime consumer layer: it may render, navigate, and stage PiOS outputs. It may not originate canonical signals, define evidence truth, or make architectural decisions. The historical runtime lineage of Lens descends from the 42.x ExecLens streams; when this document references ExecLens specifically, it refers to that 42.x lineage. References to "Lens" refer to the current governed surface.

Stream 51.8.R established a governed and scripted baseline for controlled exposure within Lens. D.2 does not replace that baseline. D.2 formalizes how the existing governed experience binds to the traversal contract, ENL pathing model, persona depth rules, and panel lifecycle under canonical architecture. The gap this stream closes is the absence of a formal traversal binding — the absence of an explicit runtime contract mapping that connects the scripted 51.8.R experience to the traversal object classes, traversal paths, and runtime consumption rules defined in D.1. D.2 provides that mapping.

D.2 translates D.1 constraints into a concrete binding: which traversal object class maps to which Lens panel, which traversal path maps to which navigation sequence, how ENL controls panel activation, how persona gates depth, how entry and exit states are governed, and what constitutes a validation failure at the runtime layer.

---

## 2. Traversal Object → Panel Binding

The five traversal object classes defined in [[pios_traversal_contract]] §2 bind to Lens panels as follows. This binding is the structural foundation of the traversal-governed experience. No panel may be activated except through the traversal path that reaches it.

**Canonical nodes bind to the Overview panel.** The Overview panel is the primary entry panel and the canonical authority surface within Lens. It surfaces the discipline framing — the evidence-first principle, the system boundary between PiOS and Signäl — and the high-level program intelligence summary derived from the full pipeline. It is the panel that corresponds to the primary traversal path's entry point and must be the first panel in an active state on any governed traversal. The Overview panel does not compute what it displays; it renders the governed intelligence output from the PiOS pipeline as its canonical entry surface.

**Stack nodes bind to the Signals and Topology panels.** The Signals panel surfaces the derived signal set — the measurable outputs produced at L3 and shaped at L4 — as the structural representation of the program's execution state. The Topology panel surfaces the structural composition of the program — its components, domains, and the relationships between them — as the navigable graph over which signals are anchored. These panels correspond to the technical deepening traversal path's early depth: they are reached after the Overview and before Evidence.

**Drift nodes bind to the Drift panel.** The Drift panel is a subordinate panel. It is not available on any primary traversal path. It becomes available only when the active traversal has reached a point where drift explanation is required — specifically, when the traversal has surfaced a signal or boundary rule whose origin requires reference to a known governed violation. The Drift panel renders the relevant drift record entries, anchored to the specific boundary rule that triggered their exposure. It does not render all drift cases indiscriminately. It does not appear on the primary traversal path as a co-equal surface with Signals or Topology.

**Remediation nodes bind to the Remediation panel.** The Remediation panel is the most subordinate panel in the traversal model. It is reachable only from the Drift panel, and only when the active traversal specifically requires explanation of a correction chain. It renders the relevant remediation corpus artifacts for the active drift case. It does not render the full remediation corpus. It may not be entered directly from any primary traversal path step.

**Appendix and evidence nodes bind to the Evidence panel.** The Evidence panel is the terminal depth panel. It surfaces the evidence lineage for the active traversal position — the source-linked records, normalized evidence structures, and derivation lineage that underlie the signals and conditions displayed in the Signals and Topology panels. Evidence is always the terminus of traversal, not the entry point. No traversal path begins at Evidence. A traversal that reaches Evidence has passed through Overview, then Signals or Topology, establishing the governed context within which the evidence can be meaningfully read.

The visibility hierarchy is strict: Overview is the entry surface; Signals and Topology are depth surfaces reachable from Overview; Drift is a subordinate surface reachable from Signals when drift explanation is active; Remediation is the most subordinate surface reachable only from Drift; Evidence is the terminal surface reachable from any depth panel when evidence lineage is the active question. No panel may expose deeper truth before shallower truth has been established.

---

## 3. Binding Scope

This document is the master binding contract. The five companion documents produced by this stream each govern a specific dimension of the binding:

[[execlens_panel_state_model]] defines the lifecycle states for each panel — HIDDEN, AVAILABLE, ACTIVE, EXPANDED, LOCKED — and the valid state transitions between them.

[[execlens_navigation_contract]] defines the four traversal paths as concrete navigation sequences within Lens, with the allowed panel transitions for each path and the enforcement rules that prevent path violation.

[[execlens_persona_binding]] defines how the three defined personas — Exec, CTO, Analyst — map to traversal depth, which panels each persona may reach, and the enforcement rule that persona filters depth and never filters truth.

[[execlens_entry_exit_contract]] defines the entry state on first load and the exit contract for Operator mode, including the explicit suspension of traversal constraints in Operator mode.

[[traversal_runtime_validation]] defines the validation rules that govern traversal compliance at the runtime layer, the failure modes that constitute a traversal violation, and the fail-closed behavior required when the traversal contract cannot be satisfied.

The D.2 binding is complete only when all six documents are produced. This master contract provides the structural foundation; the companion documents provide the operational specifications.

---

## 4. Non-Modification Boundary

D.2 is a binding layer. It does not modify the following, and no implementation of D.2 may modify the following:

The PiOS computation layer (40.x streams) remains unchanged. Signal derivation continues to happen at L3. Evidence normalization continues to happen at L1. Evidence navigation continues to happen at L2 through ENL. No signal value, derivation rule, or computation result is altered by the traversal binding.

The semantic and PIE layer (41.x streams) remains unchanged. Semantic shaping continues to happen at L4. The meaning of signals and structural states is not altered by the traversal binding. The traversal binding determines the order in which governed outputs are exposed; it does not determine what those outputs mean.

The signal logic and diagnosis logic remain unchanged. D.2 does not introduce new signal types, new condition states, or new diagnostic conclusions. The traversal binding presents what PiOS has produced; it does not produce anything itself.

The traversal contract (D.1) remains unchanged. D.2 operationalizes D.1; it does not supersede, extend, or reinterpret it. Where D.2 and D.1 appear to conflict, D.1 governs.

---

## 5. Authority Chain

The authority chain for D.2 is as follows, in descending order:

[[canonical/canonical-layer-model]] (Stream 00.2) — defines the canonical layer model including L2 (ENL), L6 (runtime consumer layer; ExecLens in 42.x lineage, Lens as current governed surface), and all forbidden behaviors at each layer.

[[program_intelligence_stack]] (Stream B.1) — defines the Krayu → PiOS → Signäl → Lens hierarchy and the boundary enforcement rules that govern the product surface.

[[pios_traversal_contract]] (Stream D.1) — defines traversal as governed movement through architecture truth, the four traversal paths, persona as depth control, ENL as pathing mechanism, and the runtime consumption rules.

[[execlens_traversal_binding]] (this document, Stream D.2) — binds traversal to Lens as a concrete runtime contract, mapping traversal objects to panels, traversal paths to navigation sequences, and D.1 control rules to runtime enforcement.

Nothing in this document or its companions overrides any document above it in this chain. The binding is an operationalization of governance, not a redefinition of it.

---

*Authority: [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2) | [[program_intelligence_stack]] | [[drift_register]]*
