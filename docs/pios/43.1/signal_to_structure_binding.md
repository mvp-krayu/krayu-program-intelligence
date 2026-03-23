# Signal-to-Structure Binding Definition

Stream: 43.1 — Signal-to-Structure Binding Definition
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-22
Authority: Stream 00.2; Stream 00.4; Stream 00.5; Stream 41.x semantic boundary; Stream 42.x consumer boundary
Status: DEFINITION — ARCHITECTURAL / GOVERNANCE ONLY

────────────────────────────────────

## 1. Purpose

This document defines the canonical Signal-to-Structure Binding Layer (43.x) and its architectural position within the Program Intelligence system.

The binding layer exists to close a specific architectural gap: governed signals produced upstream carry analytical truth about program execution, and governed structural nodes represent the organizational topology through which that execution occurs, but no deterministic mechanism currently exists to attach one governed domain to the other. Without such a mechanism, structural representations carry no signal context and signal outputs carry no structural anchor. Downstream consumers are left either to invent the attachment themselves — introducing interpretation — or to present signals and structure as disconnected artifacts.

The binding layer closes this gap by providing a deterministic projection mechanism. It attaches governed signal outputs to governed structural nodes without creating new truth, altering signal meaning, mutating structural definitions, or introducing interpretation at the attachment point.

43.x does not compute. It binds. It does not shape. It projects. It does not invent. It attaches what already exists.

────────────────────────────────────

## 2. Position in Layer Model

43.x occupies a defined position between the semantic shaping layer (41.x) and the consumer execution layer (42.x).

41.x prepares admissible semantic outputs from governed signals. 41.x shapes meaning representation. It does not bind signals to structure. Its outputs are governed semantic payloads that 43.x may receive as inputs.

43.x receives governed signal outputs (directly from canonical sources or via 41.x semantic payloads) and governed structural node definitions (from the external topology layer). It produces binding artifacts — deterministic attachments of signal outputs to structural nodes. It does not originate signals. It does not originate structural definitions. It does not interpret the meaning of either domain.

42.x consumes binding artifacts produced by 43.x. 42.x does not produce bindings. 42.x does not repair incomplete bindings. 42.x does not infer what a binding would have been if the upstream attachment had not been made.

Within the canonical layer model established in Stream 00.2, 43.x operates as a deterministic projection layer. It is non-interpretive and non-mutative. It does not hold derivation ownership. It does not hold semantic shaping authority. It does not hold rendering authority. It holds binding responsibility only.

43.x must be able to perform binding using governed signal outputs and governed structural nodes independently of any semantic shaping artifacts produced by 41.x. Semantic payloads may be received but are not required for binding execution. Binding determinism must not depend on semantic shaping.

────────────────────────────────────

## 3. Binding Problem Definition

The architectural problem 43.x addresses is the absence of a deterministic mechanism for attaching governed signal outputs to governed structural nodes.

Governed signals exist. They are canonically defined through the GOV → CKR → CAT → SCI → RES → INT admission chain in krayu-knowledge. Their outputs are produced at L3 and shaped at L4. Their truth is upstream-owned and upstream-verified.

Governed structural nodes exist. They are defined in the external topology layer of the system. They represent programs, domains, capabilities, components, and their relationships. Their structural truth is external and authoritative. It is not produced by the program intelligence pipeline.

These two governed domains are currently not connected through a formal mechanism. Without such a mechanism, any connection that appears downstream — in a consumer interface, demonstration, or analytical output — is either invented by the consumer layer (compensation behavior, prohibited under the canonical model) or absent entirely.

The binding problem is therefore not a data problem and not a signal problem. It is an attachment problem. The governed domains exist. The attachment between them does not exist in a governed form.

43.x resolves this by defining a formal binding model that connects the two governed domains through a deterministic, evidence-anchored, non-interpretive projection mechanism.

────────────────────────────────────

## 4. Canonical Binding Model

A binding is the formal attachment of a governed signal output to a governed structural node, producing a bound projection record that downstream consumers may receive and render.

The canonical binding model comprises four components:

The governed signal output is the upstream analytical result produced by an admitted signal (CKR-identified, L3-derived, canonically shaped at L4). It carries a signal identity, a computed value or state, and an evidence provenance chain. It is received by 43.x as an immutable input. 43.x does not alter it.

The governed structural node is an element from the external topology layer — a program, domain, capability, component, or relationship node. It carries a node identity and its structural position within the topology. It is received by 43.x as an immutable input. 43.x does not alter it.

The deterministic attachment is the association rule that establishes which governed signal output is attached to which governed structural node, on what evidential basis, and through which traceability path. The attachment rule is defined by the binding model, not inferred by the binding layer at runtime. Attachment is deterministic: given the same governed inputs, the same binding is produced. No variation is permitted unless a governed input has changed.

The bound projection record is the output of a successful attachment. It contains the signal identity, the node identity, the signal state or value as received (unmodified), and the evidence provenance chain connecting the signal output to its upstream derivation. It does not contain interpretation, narrative, or rendering instructions. It is a structured attachment record, not a semantic statement.

A binding is valid only when all four components are present and the evidence provenance chain is intact. A binding without a governing signal output is invalid. A binding without a governed structural node is invalid. A binding whose evidence chain is broken is invalid. Invalid bindings must not be transmitted to downstream consumers.

────────────────────────────────────

## 5. Signal-to-Node Association Rules

The following rules govern when and how a governed signal output may be attached to a governed structural node.

Rule 1 — Signal admission is prerequisite. A signal may participate in a binding only if it holds a confirmed CKR identifier and has completed canonical admission through krayu-knowledge. A provisional construct may not be bound. A construct present only in implementation code does not qualify as an admitted signal for binding purposes.

Rule 2 — Node identity is external. The structural node to which a signal is bound must originate from the external topology layer. 43.x does not define, extend, or modify nodes. If a node does not exist in the governed topology, no binding may be created for it.

Rule 3 — Association is evidence-driven. A signal may be attached to a structural node only when there is a traceable evidential relationship between the signal's derivation inputs and the node's structural reality. The signal's evidence chain must include a reference to the topological evidence from which the node is drawn. Association that cannot be traced to shared evidence is not a valid binding and must not be created.

Rule 4 — Association is deterministic. The same governed signal output and the same governed structural node, combined under the same association rule, must always produce the same binding. 43.x does not weigh, rank, select, or prioritize among alternative attachment possibilities. If the association rule produces an attachment, the attachment is made. If it does not, no attachment is made.

Rule 5 — Association does not infer meaning. Attaching a signal to a node does not produce a claim about the node beyond the signal's own governed definition. The binding does not assert that the node is stressed, at risk, unstable, or noteworthy. It asserts only that the governed signal output is attached to the governed node on the basis of the documented evidence relationship. Interpretation of what the attachment means belongs to the semantic layer (41.x) and must not be reproduced at 43.x.

Rule 6 — A signal may bind to multiple nodes. If the evidence relationship between a signal's derivation inputs and multiple structural nodes is traceable and meets the association criteria in Rules 1 through 5, the signal may be attached to each qualifying node. Each attachment is an independent bound projection record. They do not aggregate into a composite claim.

────────────────────────────────────

## 6. Multi-Signal Coexistence Rules

Multiple governed signals may be attached to the same structural node. The following rules govern coexistence.

Rule 1 — Coexistence is not aggregation. When multiple governed signals are attached to the same node, each attachment remains an independent bound projection record. The coexistence of multiple signals on the same node does not produce a composite signal, a derived index, or a synthesized state. The signals exist at the same node simultaneously. They do not merge.

Rule 2 — Coexistence does not produce new meaning. The simultaneous presence of two or more governed signals on a single node does not imply a relationship between those signals beyond their independent evidence associations. 43.x does not infer that two signals on the same node are correlated, reinforcing, conflicting, or compounding. That inference belongs to the intelligence synthesis layer (40.7). 43.x is upstream of that layer in the binding flow and must not anticipate it.

Rule 3 — Each signal's evidence chain remains independent. When multiple signals are attached to the same node, each binding carries its own evidence provenance chain. The chains do not merge. A consumer receiving a node with multiple bindings receives multiple independent provenance chains, not a unified one.

Rule 4 — Ordering of coexistent signals is not meaningful. 43.x does not produce an ordered list of signals on a node that implies priority, severity ranking, or sequence of importance. The set of signals on a node is unordered for purposes of the binding layer. If downstream consumers require ordering, they must apply their own governed ordering logic. 43.x does not supply it.

Rule 5 — Absence is not a coexistence state. If a node has no signal attachments, that is an absence state, not a coexistence state. Absence must be represented as absence. A consumer may not infer that a node with no bindings is in a neutral or healthy state. Absence means the binding layer has no governed signal output to attach. It does not mean the node is unaffected.

────────────────────────────────────

## 7. Severity Projection Principles

Governed signals carry state or value outputs that represent the intensity or condition of the execution system at a point in time. When such a signal is bound to a structural node, its state or value is projected onto the node as part of the bound projection record. The following principles govern that projection.

Principle 1 — State is carried, not computed. The state or value projected onto a node is the signal's governed output as received from upstream. 43.x does not compute a new state, normalize a value, or reclassify an output. The projected state is identical to the signal's upstream output.

Principle 2 — Projection does not imply threshold. Projecting a signal's state onto a node does not imply that a threshold has been crossed, a condition has been triggered, or an action is warranted. Threshold evaluation belongs to the condition and diagnosis layer (40.6). 43.x is not that layer and must not reproduce its logic.

Principle 3 — Projection is not severity assignment. The binding layer does not assign severity levels, risk classifications, or priority scores to nodes on the basis of the signals attached to them. A node with a high-value signal projection is not classified as high-severity by 43.x. That classification, if it exists at all, belongs to the upstream condition layer.

Principle 4 — Projection preserves signal resolution. The signal's state or value is projected at the resolution at which it was produced. 43.x does not round, truncate, compress, or expand signal values. The bound projection record carries the signal output at its governed resolution.

Principle 5 — Projection is not visual. The binding layer does not define colors, visual weights, graphical encodings, or display attributes for projected states. Those decisions belong to the consumer execution layer (42.x) and must not be anticipated by 43.x. A projection that includes rendering instructions has exceeded its boundary.

────────────────────────────────────

## 8. Evidence Traceability Rules

The Evidence First doctrine requires that every analytical output in the Program Intelligence system can be traced to observable execution evidence. The binding layer is not exempt from this doctrine. The following rules govern evidence traceability within 43.x.

Rule 1 — No evidence means no valid binding. A binding may not be created if the governed signal output does not carry an intact evidence provenance chain traceable to its upstream derivation inputs. A signal output with a broken or absent provenance chain is not a valid binding input. Attempting to bind such an output must fail, and the failure must be visible rather than silently suppressed.

Rule 2 — The bound projection record carries full provenance. The evidence provenance chain of the signal output is transmitted into the bound projection record without modification. The consumer receives the full provenance. 43.x does not abbreviate, summarize, or abstract the provenance chain. If the full provenance is too verbose for a particular consumer's needs, that is a consumer-layer rendering concern, not a binding-layer truncation responsibility.

Rule 3 — The node's topology origin is part of the record. The bound projection record records the identity of the governed structural node and the topology source from which it originates. This record establishes that the node is externally governed and was not produced or modified by the binding layer.

Rule 4 — The association basis is documented. The binding must be traceable to an explicit evidence relationship that justifies attaching the signal to the structural node. This traceability must be reconstructible from the provenance chain. If the evidence relationship cannot be established, the binding is invalid.

Rule 5 — Traceability failure must not be repaired downstream. If a bound projection record reaches a consumer with an incomplete or broken provenance chain, the consumer must not attempt to reconstruct or infer the missing provenance. The provenance gap is an upstream failure. The correct consumer response is to treat the binding as invalid and not render it as governed output. Consumer-side provenance repair is a form of compensation behavior and is prohibited under the canonical model.

────────────────────────────────────

## 9. Boundary Enforcement

The following actions are strictly prohibited within the 43.x binding layer.

Creating new signals. 43.x receives governed signals as inputs. It does not produce new signal definitions, new signal identifiers, or new signal families. Any signal that appears in a binding output must originate from the upstream canonical signal set.

Reintroducing SSZ or SSI. SSZ (Structural Stress Zone) and SSI (Structural Stress Index) are formally classified as PROVISIONAL — NOT ADMITTED per the canonical admission rule established in docs/governance/canonical_admission_rule.md. These constructs may not be used as binding inputs, node designations, projection values, or in any capacity within 43.x until they complete the full canonical admission workflow. Their prior presence in implementation code does not qualify them for use in this layer.

Mutating structural topology. 43.x receives structural nodes as external governed inputs. It does not add nodes, remove nodes, rename nodes, create relationships, or otherwise modify the topology. The topology is external truth. It enters 43.x unchanged and is referenced in binding records only by identity.

Interpreting signal meaning. 43.x does not produce claims about what a signal's attachment to a node means for that node's health, risk, status, or priority. Interpretation belongs to upstream layers. 43.x is a projection mechanism. Interpretive language in a binding output is a boundary violation.

Aggregating signals into synthetic constructs. Multi-signal coexistence on a node does not produce a composite index, a weighted severity, a summary state, or any other derived construct. Aggregation at the binding layer is a form of signal creation and is prohibited.

Inferring narrative. 43.x does not produce text, labels, or descriptions that characterize a node's condition based on its bindings. Narrative construction belongs to the semantic shaping layer (41.x) and the intelligence synthesis layer (40.7). 43.x produces attachment records, not interpretive text.

Repairing invalid upstream outputs. If a governed signal output is absent, incomplete, or invalid, 43.x does not substitute a fallback value, infer what the signal would have been, or produce a binding based on approximated input. Absence must be represented as absence. The binding is not created.

Consumer-side compensation. 42.x must not produce bindings that 43.x has not produced. 42.x must not infer signal-to-node relationships from its own knowledge of topology and signals. 42.x consumes binding artifacts. It does not generate them.

Hiding aggregation within projection. A projection that combines signal states from multiple attachments into a single projected value before transmitting to the consumer is hidden aggregation regardless of how it is described. Projections are per-binding. They do not combine across bindings.

────────────────────────────────────

## 10. Validation Against Canonical Governance

The Signal-to-Structure Binding Layer is confirmed aligned with the following canonical governance positions.

Stream 00.2 — Canonical Layer Model Restoration. 43.x does not introduce a new layer in the canonical L0–L8 model. It operates as a defined projection mechanism between existing layers. It holds no derivation ownership (L3), no semantic shaping authority (L4), no presentation assembly responsibility (L5), and no runtime rendering responsibility (L6). Its position between 41.x and 42.x is consistent with the canonical forward flow.

Stream 00.4 and 00.5 — Post-Remediation Validation and Canonical Handover. The architectural freeze declared in 00.5 is not violated by 43.x. The binding layer does not alter the canonical model. It operates within the frozen architecture. It does not reopen any remediation decision. It does not reintroduce any voided construct.

Streams 40.x — Remediation Closure. The remediation phase corrected derivation ownership placement and boundary violations. 43.x does not reintroduce those violations. 43.x does not hold derivation ownership. 43.x does not produce signals at a consumer layer. 43.x does not enable compensatory behavior.

Evidence First Doctrine. The binding layer is fail-closed on evidence. A binding cannot exist without a traceable evidence provenance chain. An absent or broken chain produces no binding. The Evidence First doctrine is enforced at the binding layer, not deferred to consumers.

41.x Upstream Semantic Boundary. 43.x receives semantic outputs from 41.x as governed inputs. It does not extend those outputs, introduce new semantic claims, or shape signal meaning. The semantic boundary of 41.x is respected: what enters 43.x from 41.x does not change in meaning within 43.x.

42.x Downstream Consumer Boundary. 42.x is a consumer of binding artifacts. It is not a producer. The consumer boundary is enforced: 42.x does not generate, infer, approximate, or repair bindings. It receives governed binding outputs and renders them within its consumer execution scope.

krayu-knowledge Admission Rule. No construct used in 43.x bindings may be provisional. Signal inputs must be CKR-admitted. Node inputs must be topology-governed. The canonical admission rule (docs/governance/canonical_admission_rule.md) applies to all signal participants in the binding layer.
