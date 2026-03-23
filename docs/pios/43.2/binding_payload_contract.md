# Binding Schema & Payload Contract

Stream: 43.2 — Binding Schema & Payload Contract
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-22
Authority: Stream 43.1 — Signal-to-Structure Binding Definition; Stream 00.2; krayu-knowledge canonical admission rule
Status: DEFINITION — SCHEMA-LEVEL, NON-IMPLEMENTABLE

────────────────────────────────────

## 1. Purpose

This document defines the canonical payload contract for a bound projection record as produced by the Signal-to-Structure Binding Layer (43.x).

A bound projection record is the formal output of a single deterministic attachment between one governed signal output and one governed structural node. This contract specifies what a bound projection record must contain, what it must not contain, and what conditions govern its validity.

This contract does not define binding logic. Binding logic is owned by 43.1. This contract does not define signal semantics. Signal semantics are owned by 41.x. This contract does not define structural topology. Topology is external governed truth. This contract defines the canonical shape of the record that results from a valid binding event.

The contract is conceptual. It describes the composition and constraints of a bound projection record in governance terms. It is not a technical schema, a serialization format, an API definition, or an implementation guide.

────────────────────────────────────

## 2. Position in Binding Architecture

43.2 defines the payload contract for the bound projection record — the unit of output produced by 43.x and consumed by 42.x.

43.1 defines when and how a binding is produced, what makes it valid, and what rules govern its creation. 43.2 specifies what the resulting record contains.

The bound projection record is the interface artifact between 43.x and 42.x. 43.x produces it. 42.x consumes it. Neither layer defines its shape independently. The shape is governed here, by 43.2, and is binding on both layers.

The payload contract must be consistent with the binding rules established in 43.1. Where 43.1 prohibits a behavior, 43.2 must not define a record field that enables or implies that behavior. No field in the contract may introduce interpretation, aggregation, or mutation that 43.1 prohibits.

────────────────────────────────────

## 3. Binding Record Definition

A bound projection record is a single, indivisible unit representing one attachment of one governed signal output to one governed structural node.

The record is indivisible: it represents exactly one signal-to-node attachment. It does not represent a summary, a collection, or a state synthesized from multiple attachments. A node with multiple signal attachments produces multiple independent bound projection records — not a single record with multiple signals.

The record is immutable with respect to its inputs: the signal state and node identity it carries are received from upstream unchanged. The record does not transform, normalize, reclassify, or augment its inputs.

The record is valid or invalid — no intermediate state exists. A record that cannot satisfy the evidence traceability requirements defined in Section 6 is invalid and must not be transmitted to downstream consumers.

A bound projection record contains exactly the following conceptual components, each defined in the sections below:

— A signal reference (Section 4)
— A node reference (Section 5)
— An evidence embedding (Section 6)

No component other than these three may appear in a bound projection record. Any additional field — whether it adds metadata, annotation, ordering, priority, severity classification, or rendering guidance — is a boundary violation.

────────────────────────────────────

## 4. Signal Reference Model

The signal reference component of a bound projection record identifies the governed signal and carries its state as produced upstream.

The signal reference contains:

Signal identity. The CKR identifier of the admitted signal. This is the canonical identity assigned through the krayu-knowledge admission workflow. It is not a label, a shorthand, or an implementation name. It is the governed identifier that uniquely identifies the signal within the canonical registry. A signal without a confirmed CKR identifier may not appear in a bound projection record.

Signal state. The signal's output value or state as received from its upstream governed source. The state is the signal's own governed output — produced at L3, shaped at L4, and received at 43.x without modification. The signal reference does not alter, normalize, round, or reclassify the state. What the signal produced upstream is what the record carries.

Signal provenance reference. A reference to the evidence provenance chain that established the signal's state. This reference is carried from the upstream signal output into the binding record. It is not regenerated, summarized, or abbreviated by 43.x. The full provenance chain is available through this reference. The provenance chain must include the signal's upstream source reference and the timestamp at which the signal state was established. A signal whose provenance chain lacks either element is not eligible for binding.

The signal reference does not contain:

— A derived or computed extension of the signal state
— A severity classification applied to the state
— An assessment of whether the state exceeds any threshold
— A label or narrative description of what the state means
— Any field that qualifies, ranks, or contextualizes the signal output

The signal reference is a carrier. It holds the signal's governed identity and unmodified output. It does not add meaning to either.

────────────────────────────────────

## 5. Node Reference Model

The node reference component of a bound projection record identifies the governed structural node to which the signal has been attached.

The node reference contains:

Node identity. The canonical identifier of the structural node as defined in the external topology layer. This identifier originates outside the program intelligence pipeline. It is received by 43.x as an external governed fact. It is not assigned, modified, or extended by 43.x. The node reference carries the identifier as received.

Node topology reference. A reference to the node's position within the external topology as defined by the topology source. This reference is carried without interpretation, classification, or redefinition by the binding layer.

Topology source reference. A reference confirming that the node originates from a governed external topology source. This reference establishes that the node was not created or modified by the binding layer and that its structural definition is externally authoritative.

The node reference does not contain:

— A redefinition or extension of the node's structural role
— A classification of the node based on the signals attached to it
— A label, description, or characterization of the node's condition
— Any field derived from the signal attachment rather than from the topology definition
— Any field that is absent from the external topology definition

The node reference is a pointer. It identifies the governed structural node by its external identity. It does not annotate or assess the node.

────────────────────────────────────

## 6. Evidence Embedding Model

The evidence embedding component of a bound projection record establishes the traceable basis for the binding — the evidence relationship that justifies attaching this specific signal to this specific structural node.

The evidence embedding contains:

Association basis. The explicit evidence relationship between the signal's derivation inputs and the structural node's topology membership. This is the evidence-grounded basis for the signal-to-node attachment, expressed as a traceable relationship, not as a narrative or interpretive claim. The association basis must be reconstructible from the provenance chain. It must not be an assertion without evidential grounding.

Signal provenance chain. The full evidence provenance chain of the signal output, carried from upstream into the binding record. The chain traces the signal's state to its derivation inputs and from those inputs to their upstream evidence sources. The chain is transmitted without abbreviation, summarization, or abstraction. If the chain is incomplete at the point of binding, the binding is invalid and the record must not be produced.

Topology evidence reference. A reference to the topological evidence from which the structural node is drawn. The signal's derivation inputs must share an evidential relationship with this topological evidence — that shared evidence relationship is the basis for the binding.

The evidence embedding does not contain:

— An interpretation of what the evidence relationship implies
— An inference about the node's condition drawn from the evidence
— A summary of the provenance chain that loses traceability
— A reconstructed or inferred provenance chain that substitutes for a missing one
— Any assertion about the meaning of the association beyond the evidence relationship itself

Evidence embedding is the mechanism by which Evidence First is enforced at the binding record level. If the evidence embedding cannot be completed — because the provenance chain is broken, because the association basis cannot be stated, or because the topology evidence reference is absent — the binding is invalid. The record is not produced. The failure is surfaced, not suppressed.

────────────────────────────────────

## 7. Multi-Binding Representation

A structural node may be the target of multiple independent bindings. When multiple governed signals have valid evidence relationships to the same node, each produces its own independent bound projection record.

The following principles govern how multiple bound projection records relating to the same node are represented.

Independence is preserved. Each bound projection record for a given node is produced independently and remains independent. Records relating to the same node are not merged, combined, or collapsed. Each record contains its own signal reference, its own node reference, and its own evidence embedding. The fact that multiple records share the same node identity does not create a relationship between the records beyond that shared reference.

No composite record exists. There is no higher-order record type that aggregates multiple bound projection records for the same node into a summary, index, or synthesized state. If a consumer requires a view of all signals attached to a node, that view is assembled by the consumer from the set of independent records it receives. The binding layer does not pre-assemble such views.

No ordering is implied. The set of bound projection records produced for a given node is not ordered by signal identity, signal state, severity, or any other criterion by the binding layer. Records for the same node are an unordered set for binding purposes. If consumer-layer ordering is required, the consumer applies its own governed ordering logic.

Signal states do not combine. The coexistence of multiple bound projection records at the same node does not imply that the signals' states are additive, correlated, compounding, or in conflict. Each record carries its signal's state independently. The binding layer makes no claim about the relationship between those states.

────────────────────────────────────

## 8. Absence & Invalid Binding Representation

Two conditions must be represented explicitly and may not be suppressed, inferred, or repaired: absence and invalidity.

Absence. A structural node for which no governed signal output produces a valid evidence relationship has no bound projection records. That is its governed state: no bindings. Absence does not imply that the node is neutral, healthy, unaffected, or in any other condition. Absence means the binding layer received no valid signal-to-node attachment for that node. Absence must be surfaced to consumers as absence. A consumer may not infer or substitute a state for an absent node.

Invalidity. A binding event that fails to satisfy the conditions established in 43.1 — because the signal lacks a CKR identifier, because the evidence provenance chain is incomplete, because the node is not from a governed external topology, or because the association basis cannot be stated — produces no bound projection record. The binding attempt fails. The failure must be visible as a distinct failure state and must not be suppressed or converted into a valid binding record. The difference between a genuine absence (no qualifying signal-to-node relationship exists) and a binding failure (a qualifying relationship existed but the record could not be produced due to a governance gap) must be distinguishable.

Downstream handling of invalidity. A consumer that encounters a distinct failure state must not attempt to reconstruct the missing record, infer what the record would have contained, or produce a substitute representation. The binding failure is an upstream governance gap. It must be visible in downstream output as an unresolved upstream condition, not hidden through consumer-layer substitution.

────────────────────────────────────

## 9. Boundary Enforcement

The following constraints are binding on the payload contract and on any artifact that produces or consumes bound projection records.

No interpretation fields. A bound projection record may not contain any field that expresses what the signal-to-node attachment means, characterizes the node's condition, or asserts a claim beyond the evidence relationship. Fields that carry labels, descriptions, assessments, or qualifications of the signal state or node condition are interpretation fields and are prohibited.

No aggregation fields. A bound projection record may not contain any field that represents a combined, weighted, or synthesized state derived from multiple signal attachments. No summary field, composite index, or aggregate severity indicator may appear in a record.

No computed extensions. A bound projection record may not contain any field whose value is derived from the signal's state through transformation, normalization, or reclassification within the binding layer. The signal state field carries only what was received from upstream.

No rendering fields. A bound projection record may not contain color values, visual weight indicators, display priority markers, icon references, or any other field that encodes rendering decisions. Rendering belongs to 42.x. The binding record carries no rendering instructions.

No topology redefinition. The node reference component may not add structural classification, structural relationships, or structural attributes to the node beyond what originates from the external topology. If a field about a node does not originate from the governed external topology, it does not belong in the node reference component.

No provisional constructs. SSZ and SSI are classified as PROVISIONAL — NOT ADMITTED. They may not appear as signal identities, node designations, or association basis references in any bound projection record. Their prior presence in implementation code does not constitute canonical admission.

Payload scope. The bound projection record carries structure references, signal references, and the signal's upstream state only. No derived signal, computed metric, or analytical construct of any kind may appear in a bound projection record. The binding layer is a projection layer, not a derivation layer. No derivation occurs within 43.x or within the payload contract it governs.

No derivation at 43.x. Derivation authority belongs exclusively to L3. 43.x receives governed signal outputs from upstream; it does not produce them. SSZ, SSI, and all constructs not admitted through krayu-knowledge are excluded not only because they are provisional, but because 43.x holds no derivation authority to produce them in any form.

42.x consumer constraint. 42.x consumes bound projection records produced by 43.x. 42.x must not recompute signals, compensate for missing binding records, or infer meaning from the records it receives. A consumer that receives an incomplete or absent binding set must represent that state as-is. Signal recomputation and meaning inference at the consumer layer are boundary violations.

43.1 boundary supremacy. Where a behavior is prohibited by 43.1, no field in this payload contract may be defined in a way that enables, implies, or invites that behavior. This contract is subordinate to 43.1 in all boundary matters.

────────────────────────────────────

## 10. Validation Against 43.1

The payload contract defined in this document is validated against the binding layer definition established in 43.1 as follows.

Binding record represents binding only. The record contains signal reference, node reference, and evidence embedding — nothing beyond what constitutes the attachment of one governed signal to one governed structural node. Confirmed.

No new signal concepts introduced. The signal reference component identifies admitted signals by CKR identifier only. No new signal class, signal family, or signal concept is introduced. Confirmed.

Signal state is unchanged. The signal reference carries the upstream signal state without modification, normalization, or reclassification. No transformation is applied. Confirmed.

Node is external reference only. The node reference carries the topology-originated node identity and a reference to its external source. The binding layer does not define, extend, or annotate the node. Confirmed.

Evidence chain is intact and complete. The evidence embedding model requires the full provenance chain and prohibits abbreviation or substitution. An incomplete chain produces an invalid binding. Confirmed.

Multi-binding remains independent. Each signal-to-node attachment produces an independent bound projection record. No composite record type exists. Records for the same node share a node identity reference but remain structurally independent. Confirmed.

No aggregation or synthesis. No field in the payload contract represents a combined or derived state from multiple attachments. Signal states do not combine. Ordering is not imposed. Confirmed.

Absence handled explicitly. Absence and binding failure are distinguished from each other and from valid absence. Neither may be suppressed or inferred by downstream consumers. Confirmed.

No interpretation fields exist. No field in the payload contract encodes meaning beyond the evidence relationship, the signal's governed state, and the node's external identity. No label, assessment, condition characterization, or qualitative claim is present. Confirmed.

Fully aligned with 43.1. All constraints established in 43.1 — Evidence First fail-closure, no signal creation, no topology mutation, no interpretation, no consumer-side repair, no provisional constructs — are preserved and reflected in the payload contract structure and boundary enforcement. Confirmed.
