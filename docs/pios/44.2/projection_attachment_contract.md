# Projection Attachment Contract

Stream: 44.2 — Projection Attachment Contract
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-22
Authority: Stream 44.1 — Structural Overlay Projection Definition; Stream 43.3 — Binding Validation Envelope; Stream 43.2 — Binding Schema & Payload Contract; Stream 43.1 — Signal-to-Structure Binding Definition; Stream 00.2
Status: DEFINITION — ARCHITECTURAL / GOVERNANCE ONLY

────────────────────────────────────

## 1. Purpose

This document defines the Projection Attachment Contract for Stream 44.2. It governs how validated binding records are deterministically attached to authoritative structural nodes within the Structural Overlay Projection Layer defined in 44.1.

44.1 established what projection is: a governed, non-semantic attachment of validated binding payloads to authoritative structural nodes. 44.2 establishes how attachment occurs: through deterministic node resolution governed by explicit rules, with fail-closed behavior when resolution cannot be completed without ambiguity or inference.

44.2 does not redefine projection. It does not introduce new concepts. It tightens the attachment contract so that projection cannot drift toward heuristic mapping, implicit fallback, or silent failure. Attachment precision is a governance requirement, not an implementation choice.

────────────────────────────────────

## 2. Position in Canonical Layer Chain

44.2 refines the projection layer established in 44.1. It occupies the same position in the canonical layer chain and introduces no new layer boundary.

L3 — signal derivation (authoritative)
43.1 — binding rules
43.2 — payload structure
43.3 — validation envelope
44.1 — structural overlay projection definition
44.2 — projection attachment contract (this document)
42.x — consumer execution

44.2 is subordinate to 44.1. Where 44.1 establishes a principle, 44.2 enforces its contractual precision. Where 44.1 permits a behavior, 44.2 governs the exact conditions under which that behavior occurs. 44.2 does not introduce behaviors that 44.1 prohibits. 44.2 does not extend the scope of 44.1 beyond projection.

────────────────────────────────────

## 3. Node Resolution Definition

Node resolution is the process by which a node reference carried in a validated binding record is matched to an authoritative structural node in the external topology.

Node resolution has one outcome: it either succeeds or it fails. There is no partial resolution. There is no approximate resolution. There is no provisional resolution pending later confirmation.

### 3.1 Node Reference Origin

The node reference used for resolution originates exclusively from the validated binding record received from 43.3. It is the same node reference that was confirmed present and valid during the 43.3 validation process. It is not supplemented, transformed, or replaced by 44.2.

The node reference carries a canonical node identifier as defined by the external topology. That identifier is the sole basis for resolution. No alternative identifier, alias, label, shorthand, or approximation may be substituted for it.

### 3.2 Resolution Rule

Resolution is direct. The canonical node identifier in the node reference must match exactly one entry in the authoritative structural topology. The match is exact: the identifier as carried in the validated binding record must correspond to the identifier as defined in the external topology without transformation, normalization, or inference.

Resolution is not a search. It is not a lookup across approximate candidates. It is a single exact match against an authoritative identifier set. Either the identifier exists in the authoritative topology exactly as carried, or it does not. No intermediate determination is permitted.

### 3.3 Invalid Resolution Cases

The following cases constitute resolution failure. In all cases, projection is rejected and no overlay element is produced.

Missing node reference. The validated binding record carries no node reference. Resolution cannot be attempted. Projection is rejected.

Non-existent node. The canonical node identifier in the node reference does not correspond to any entry in the authoritative structural topology. The node does not exist in the governed topology from which resolution draws. Projection is rejected.

Ambiguous node reference. The canonical node identifier in the node reference corresponds to more than one entry in the authoritative structural topology, or the topology is in a state where the identifier cannot be matched to exactly one node without inference. Projection is rejected.

Unresolvable reference. The node reference is present and well-formed but cannot be matched to the authoritative topology for any other reason that requires inference, approximation, or assumption to resolve. Projection is rejected.

### 3.4 No Heuristic Mapping

44.2 does not permit fuzzy matching, partial identifier matching, similarity-based selection, pattern inference, or any other form of heuristic resolution. Node identity is external and authoritative. The attachment contract does not approximate it.

Where a node reference cannot be resolved exactly, the resolution fails. The system does not select the nearest match. It does not select the most likely match. It does not infer what node was intended. Projection is rejected.

────────────────────────────────────

## 4. Attachment Contract Definition

Attachment is the act of associating a validated binding record with an authoritative structural node following successful resolution. Attachment occurs only after resolution succeeds. Attachment does not occur before resolution. Attachment does not occur as part of resolution.

### 4.1 One Binding to One Node

Each validated binding record attaches to exactly one structural node: the node identified by the node reference it carries. A validated binding record does not attach to multiple nodes. It does not attach to a parent node in place of a resolved child node. It does not attach to a related node when the intended node is unavailable. The attachment is one validated binding record to one resolved authoritative node, and that association is fixed.

### 4.2 Binding Identity Preserved

The attachment does not modify the validated binding record. The signal reference, the node reference, the evidence embedding, and the upstream validation basis are carried from the validated binding record into the overlay element unchanged. The act of attachment does not transform, normalize, annotate, or extend the content of the binding record.

### 4.3 Evidence Linkage Preserved

The full evidence provenance chain carried by the validated binding record is preserved through attachment. The association between the overlay element and its originating signal, source reference, timestamp, and provenance chain is not weakened, abbreviated, or replaced by the attachment process. The overlay element that results from attachment is traceable to its validated binding record through intact evidence linkage.

### 4.4 No Duplication

A validated binding record does not produce multiple overlay elements through attachment. Each binding record produces exactly one overlay element attached to exactly one resolved node. Duplication of a binding record across multiple nodes is not permitted.

### 4.5 No Splitting

A validated binding record is not split into component parts for separate attachment. The record is indivisible. Its signal reference, node reference, and evidence embedding attach together as a unit. Partial attachment of one component without the others is not permitted.

### 4.6 No Merging

Two validated binding records are not merged into a single overlay element during attachment. Each record attaches independently. The fact that two records resolve to the same node does not cause them to merge. Their independent attachments coexist at the node as separate overlay elements.

### 4.7 No Content Transformation

The attachment process introduces no transformation of binding content. The signal state carried by a validated binding record enters the overlay element in the same form it entered 44.2. The node reference is resolved, not transformed. Evidence is preserved, not reprocessed.

────────────────────────────────────

## 5. Failure Handling Rules

Failure in the attachment process is explicit, terminal at the projection level, and non-compensated.

### 5.1 Failure Is Terminal

When node resolution fails, projection of the affected binding record does not occur. The failure is the final outcome for that record at the projection stage. There is no retry mechanism. There is no alternate resolution path. The record does not produce an overlay element.

### 5.2 No Alternate Node Selection

When resolution fails because a node is non-existent, ambiguous, or unresolvable, 44.2 does not select an alternate node in place of the failed resolution. There is no fallback node. There is no parent node substitution. There is no inferred nearest match. The attachment does not occur.

### 5.3 No Inferred Mapping

When a node reference cannot be exactly resolved, 44.2 does not infer what node the attachment was intended for. Inference about topology from binding content, signal identity, or provenance context is not permitted. The attachment contract does not permit mapping to be completed through reasoning about what the attachment should have been.

### 5.4 No Partial Attachment

A binding record either attaches fully to a resolved node or does not attach. There is no partial attachment in which some components of the binding record are associated with a node while others remain unattached. The attachment is atomic. It succeeds in full or it does not occur.

### 5.5 No Degraded Mode

There is no degraded mode in which projection proceeds with reduced fidelity when full attachment cannot be completed. The projection of a binding record either meets the full requirements of this contract or it does not occur. Reduced fidelity is not a valid projection outcome.

### 5.6 Failure Observability

A projection failure for a specific binding record must remain observable as an upstream condition. The failure must not be suppressed, converted into a silent absence, or absorbed into a clean overlay representation. A binding record that failed to project is a different condition from a node that received no binding records. These two conditions must be distinguishable.

────────────────────────────────────

## 6. Multi-Binding Alignment

This section reinforces the multi-binding coexistence rules established in 44.1 Section 6 within the precise terms of the attachment contract.

### 6.1 Independent Attachment

When multiple validated binding records carry node references that resolve to the same structural node, each binding record undergoes independent resolution and independent attachment. The resolution of one binding record at a node does not influence the resolution of another. The attachment of one binding record at a node does not modify or condition the attachment of another.

### 6.2 No Ordering Introduced by Attachment

The attachment process does not produce an ordered set of overlay elements at a node. The sequence in which binding records are processed through attachment does not become a property of the resulting overlay elements. The set of overlay elements at a node is unordered with respect to the attachment contract.

### 6.3 No Prioritization Introduced by Attachment

The attachment process does not assign relative priority, significance, or urgency to overlay elements based on their signal content, their order of attachment, or any other criterion. Prioritization is not a property of the attachment contract.

### 6.4 No Aggregation Introduced by Attachment

The attachment process does not combine the signal references or evidence chains of multiple overlay elements at the same node. Each overlay element carries its own signal reference and its own evidence chain. The attachment contract does not produce a combined representation of multiple attachments.

────────────────────────────────────

## 7. Boundary Enforcement

The following actions are strictly prohibited within 44.2.

Introducing interpretation. 44.2 does not produce any claim about the meaning, significance, condition, or implication of an attachment. Attachment is association only.

Modifying the projection model. 44.2 does not redefine the projection model established in 44.1. It enforces the contractual precision of attachment within that model.

Validating signals. Signal validation is owned by 43.3. 44.2 does not re-examine, re-validate, or independently assess the binding records it receives. The certified output of 43.3 is the governing input.

Deriving signals. 44.2 does not produce new signal values, new signal identities, or new signal constructs. Signal content enters 44.2 from the validated payload and exits unchanged.

Aggregating bindings. 44.2 does not aggregate, combine, or synthesize multiple binding records into a composite overlay element. Each record attaches independently.

Creating composite states. The attachment process does not produce a node-level composite state from the set of attachments at a node. The overlay at a node is the set of independent overlay elements. Nothing is derived from that set within 44.2.

Mutating topology. The authoritative structural topology is external and immutable. 44.2 resolves node references against it. It does not modify it.

Introducing UI logic. 44.2 does not introduce fields, values, or directives that encode rendering behavior. Rendering is a 42.x responsibility.

Introducing fallback logic. 44.2 does not define or permit fallback mechanisms. When resolution fails, projection does not occur. No fallback path exists.

Introducing heuristics. 44.2 does not permit approximate, inferred, or probabilistic resolution. Attachment is exact and deterministic or it does not occur.

────────────────────────────────────

## 8. Validation

The Projection Attachment Contract defined in this document is validated against the governing requirements as follows.

Deterministic node resolution defined. Section 3 defines resolution as a single exact match of a canonical node identifier against the authoritative topology. No heuristic, approximation, or inference is permitted. Confirmed.

Fail-closed behavior enforced. Section 3.3 and Section 5 define all invalid resolution cases as terminal projection rejections. No fallback node, no alternate selection, no partial attachment, and no degraded mode is permitted. Confirmed.

One binding to one node. Section 4.1 defines the attachment relationship as exactly one validated binding record to exactly one resolved authoritative node. Duplication, splitting, and merging are prohibited. Confirmed.

Binding identity and evidence preserved. Sections 4.2 and 4.3 confirm that binding content and evidence linkage are carried unchanged through attachment. Transformation, abbreviation, and replacement are prohibited. Confirmed.

Failure observability preserved. Section 5.6 requires that projection failure remain observable as an upstream condition distinguishable from the absence of binding records. Suppression is prohibited. Confirmed.

Multi-binding independence preserved. Section 6 confirms that multiple bindings at the same node attach independently without ordering, prioritization, or aggregation. Alignment with 44.1 Section 6 is confirmed.

No interpretation introduced. Section 7 explicitly prohibits interpretation. Attachment is association only. The attachment contract does not produce claims about node condition, signal meaning, or structural state. Confirmed.

No new constructs introduced. 44.2 does not define new signal classes, new overlay state types, new node classifications, or new derived constructs. It tightens the attachment rules within the scope established by 44.1. Confirmed.

Alignment with 43.3. 44.2 receives only the certified output of 43.3. It does not bypass or supplement the validation envelope. Section 2 and Section 3.1 confirm this input contract. Confirmed.

Alignment with 44.1. 44.2 enforces the attachment precision of the projection model defined in 44.1 without modifying that model. All prohibitions in 44.1 remain in force. 44.2 adds no behavior that 44.1 prohibits. Confirmed.
