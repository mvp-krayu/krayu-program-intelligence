# Structural Overlay Projection Definition

Stream: 44.1 — Structural Overlay Projection Definition
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-22
Authority: Stream 43.3 — Binding Validation Envelope; Stream 43.2 — Binding Schema & Payload Contract; Stream 43.1 — Signal-to-Structure Binding Definition; Stream 00.2; krayu-knowledge canonical admission rule
Status: DEFINITION — ARCHITECTURAL / GOVERNANCE ONLY

────────────────────────────────────

## 1. Purpose

This document defines the Structural Overlay Projection Layer (44.1) and its canonical position within the Program Intelligence system.

44.1 exists to close a specific architectural gap: validated binding payloads produced by 43.3 carry confirmed signal-to-node attachments, but no governed mechanism currently exists to project those attachments onto the authoritative structural topology in a form that preserves evidence continuity and remains available to downstream consumers without semantic leakage. Without such a mechanism, downstream consumers would be left either to perform projection themselves — introducing consumer-layer compensation behavior — or to receive validated bindings disconnected from the structural context in which they are meaningful.

44.1 closes this gap by providing a deterministic projection mechanism. It attaches validated binding payloads to authoritative structural nodes, producing a structural overlay that represents signal presence within governed structure. It does not interpret signal states. It does not classify node conditions. It does not introduce derived constructs. It does not mutate topology.

44.1 does not compute. It projects.
44.1 does not assess. It attaches.
44.1 does not derive. It preserves.

────────────────────────────────────

## 2. Position in Canonical Layer Chain

44.1 occupies a defined position between the binding validation envelope (43.3) and the consumer execution layer (42.x).

The governed data flow is:

L3 — signal derivation (authoritative)
43.1 — binding rules
43.2 — payload structure
43.3 — validation envelope
44.1 — structural overlay projection (this layer)
42.x — consumer execution (ExecLens)

43.3 produces a payload of validated binding records — records that have passed all five validation dimensions. 44.1 receives that payload and projects it onto authoritative structural nodes, producing a structural overlay. 42.x receives the structural overlay and renders it.

44.1 holds projection authority only. It holds no derivation authority, no binding authority, no validation authority, no semantic shaping authority, and no rendering authority. Its responsibility is the governed attachment of validated bindings to authoritative structural nodes.

44.1 operates independently of any rendering or visualization concern. It produces projection output that is complete without 42.x interpretation. 42.x is a consumer of the structural overlay. It does not influence the overlay's definition, structure, or content. No reverse dependency from 42.x to 44.1 is permitted.

────────────────────────────────────

## 3. Structural Overlay Definition

A structural overlay is the governed representation of validated signal attachments projected onto an authoritative structural topology.

The structural overlay is not a new data structure invented by 44.1. It is the result of attaching validated binding records, as received from 43.3, to the authoritative structural nodes they reference. The overlay is the set of those attachments in their projected form.

The structural overlay does not represent the condition of structural nodes. It represents the presence of validated signal attachments at structural nodes. Presence is not condition. Presence does not imply health, risk, stress, or any other assessable state. Presence means only that a governed signal, validated through the upstream chain, is attached to a governed structural node.

The structural overlay is:

— A set of projected overlay elements (defined in Section 5), each representing one validated binding attachment at one structural node
— Deterministic: the same validated payload projected onto the same authoritative topology always produces the same overlay
— Refreshable: the overlay is replaced in full when a new validated payload is received
— Non-accumulative: the overlay does not accumulate semantic meaning across refresh cycles
— Evidence-preserving: every element in the overlay carries the full evidence lineage of the binding it projects

The structural overlay is not:

— A semantic summary of structural health
— A derived state of the topology
— A classified representation of node condition
— A persistent memory of prior signal presence
— An interpretation of what validated bindings mean for the structure

────────────────────────────────────

## 4. Projection Model

The projection model defines how a validated binding record is attached to an authoritative structural node to produce an overlay element.

A projection is a governed association between three already existing governed elements:

— A validated binding record, received from 43.3, which carries a signal reference, a node reference, and an evidence embedding
— An authoritative structural node, identified by the node reference within the validated binding record, as defined in the external topology
— The evidence provenance chain, carried intact from the validated binding record through the projection

The projection does not transform any of these elements. The signal reference is carried unchanged. The node reference is resolved against the authoritative topology without modification. The evidence provenance chain is preserved without abbreviation.

Projection is deterministic. Given the same validated binding record and the same authoritative topology, the projection always produces the same overlay element. No variation is introduced by the projection layer. No selection, weighting, or prioritization occurs.

Projection is passive with respect to topology. The authoritative structural topology is external and immutable. 44.1 resolves node references against it. It does not modify, extend, annotate, or reclassify topology nodes.

Projection is passive with respect to signals. The signal reference carried by a validated binding record is not altered, extended, or reinterpreted by the projection layer. The signal's governed identity and state enter the overlay in the same form they entered 44.1.

A projection fails if the node reference in the validated binding record cannot be resolved against the authoritative topology. A projection failure produces no overlay element. The failure is preserved as an unresolved upstream condition. It is not compensated.

────────────────────────────────────

## 5. Overlay Element Definition

A projected overlay element is the unit of output produced by a single projection of one validated binding record onto one authoritative structural node.

A projected overlay element contains exactly the following:

Node reference. The canonical identifier of the authoritative structural node, resolved from the node reference in the validated binding record. The identifier originates from the external topology. It is not modified by 44.1.

Signal reference. The canonical signal reference carried by the validated binding record. It includes the CKR identifier of the admitted signal, the signal's upstream state, and the provenance reference. It is carried unchanged from the validated binding record.

Evidence reference. The full evidence provenance chain from the validated binding record, preserved without abbreviation. This chain traces the signal's state through its upstream derivation and evidence sources.

Upstream validation basis. A reference confirming that this overlay element originates from a record that passed 43.3 validation. The basis establishes the governing validation chain.

A projected overlay element does not contain:

— Any field representing the condition, health, stress, or risk of the structural node
— Any field derived from the signal's state through transformation within 44.1
— Any field that aggregates or combines multiple signal attachments
— Any rendering instruction, visual weight, or display priority
— Any severity classification, threshold comparison, or risk score
— Any construct equivalent to SSZ, SSI, or any other non-admitted provisional construct
— Any field that does not originate from the validated binding record or the authoritative topology

The projected overlay element is a carrier. It preserves the governed association between a validated signal attachment and an authoritative structural node. It does not add meaning to either.

────────────────────────────────────

## 6. Multi-Binding Coexistence Rules

A structural node may be the target of multiple independent projections. The following rules govern the coexistence of multiple projected overlay elements at the same node.

Each binding remains independent. When multiple validated binding records reference the same structural node, each produces its own independent projected overlay element. The overlay elements are not merged, combined, collapsed, or ranked. The node carries a set of independent overlay elements, each preserving its own signal reference and evidence chain.

No aggregation is permitted. The coexistence of multiple overlay elements at a node does not produce a composite signal, an aggregate state, a fused representation, or any derived construct. The overlay is a set of independent attachments. It does not synthesize those attachments into a unified node condition.

No fusion is permitted. Two overlay elements at the same node are not combined into a single element representing their joint presence. Each element carries exactly one signal reference and one evidence chain. Multi-signal presence is represented as plurality of independent elements, not as a fused single element.

No ranking is permitted. 44.1 does not rank overlay elements at a node by signal identity, signal state, evidence recency, or any other criterion. The set of overlay elements at a node is unordered for projection purposes.

No prioritization is permitted. The projection layer does not assign priority, urgency, or significance to any overlay element relative to another. Prioritization is a semantic function. It belongs to upstream layers if it exists at all.

No composite state is permitted. The presence of multiple overlay elements at a node does not produce a node-level composite state — a stress index, a density score, a condition classification, or any equivalent construct. The node's state in the overlay is exactly the set of its overlay elements. Nothing more is derived from that set.

No interpreted node condition is permitted. The overlay does not characterize what the set of signal attachments at a node means for that node. Characterization belongs to upstream semantic layers. 44.1 projects. It does not assess.

Zero bindings is a valid state. A structural node for which no validated binding record exists in the received payload has no overlay elements. That is a governed state. It means no validated signal attachments were projected to that node from the received payload. It does not mean the node is healthy, unaffected, or in any other condition.

────────────────────────────────────

## 7. Projection Lifecycle

The projection lifecycle governs the creation, refresh, and removal of projected overlay elements.

Creation. A projected overlay element is created from a validated binding record received from 43.3. No overlay element may be created from any other source. A signal not present in the validated payload does not produce an overlay element. A node not referenced in the validated payload carries no overlay elements.

Refresh. When a new validated payload is received from 43.3, the overlay is replaced in full. The new overlay reflects only the validated binding records in the new payload. Prior overlay elements that are not represented in the new payload are removed. No prior overlay element is retained beyond the payload that produced it.

Removal. An overlay element is removed when the validated binding record that produced it is no longer present in a received payload. Removal is total: the element and its evidence linkage are removed together. No residue remains.

Statelessness with respect to semantic meaning. The overlay does not carry semantic memory between refresh cycles. The removal of an overlay element does not record what the signal state was before removal. The addition of a new overlay element does not record that the signal was absent before. The overlay reflects the current validated payload only.

Non-accumulation. The overlay does not accumulate an interpreted condition over time. A node that has carried a signal attachment for multiple refresh cycles is not classified as persistently stressed, persistently active, or in any other temporally derived condition. Each refresh cycle produces an independent overlay from the current validated payload.

No substitute overlays. When the validated payload is absent — because 43.3 emitted no validated payload — no overlay is produced. 44.1 does not substitute a prior overlay, a default overlay, or an approximated overlay in place of a current validated payload. Absence of validated input produces absence of overlay.

────────────────────────────────────

## 8. Evidence Continuity

Evidence continuity requires that every projected overlay element preserves, without reinterpretation, the full evidence lineage of the validated binding record it projects.

The following elements must be preserved intact through projection:

Signal reference. The CKR identifier of the admitted signal, its upstream state, and its provenance reference are carried from the validated binding record into the overlay element without modification.

Source reference. The reference to the upstream source from which the signal's state was derived is carried unchanged. 44.1 does not substitute, abbreviate, or reinterpret this reference.

Timestamp. The timestamp at which the signal state was established upstream is preserved. 44.1 does not modify, round, or omit the timestamp.

Provenance chain. The full evidence provenance chain from the validated binding record is preserved in the overlay element without abbreviation, summarization, or abstraction. The chain traces the signal's state through its upstream derivation inputs to their evidence sources. That trace is the governing evidence basis of the overlay element.

Upstream validation basis. The reference to the 43.3 validation that confirmed the binding record's compliance is carried into the overlay element. This reference establishes that the overlay element is grounded in the governed validation chain.

44.1 must not truncate evidence. The provenance chain exits 44.1 in the same form it entered. Evidence that is complete in the validated binding record must remain complete in the overlay element.

44.1 must not summarize evidence. A summarized provenance chain is not a governed provenance chain. Summarization loses traceability. If the full chain cannot be carried, the overlay element is not produced.

44.1 must not reinterpret provenance. The provenance chain is upstream-owned. Its meaning is established upstream. 44.1 carries it. It does not annotate, contextualize, or add overlay-local meaning to the chain.

44.1 must not replace provenance. An overlay element must not substitute a locally generated reference for a missing upstream provenance element. Absence of a required evidence element in the validated binding record produces a projection failure. The overlay element is not produced.

────────────────────────────────────

## 9. Boundary Enforcement

The following actions are strictly prohibited within 44.1.

Deriving signals. 44.1 receives governed signal references from the validated binding payload. It does not produce new signal definitions, new signal values, or new signal families. Any signal identity that appears in an overlay element must originate from the upstream validated payload.

Validating signals. Signal validation is owned by 43.3. 44.1 does not re-validate, re-examine, or independently assess the binding records it receives. Records that have passed 43.3 are consumed as certified input.

Reinterpreting evidence. The evidence provenance chain is upstream-owned. Its meaning is not reconsidered, re-assessed, or recontextualized by 44.1. The chain is preserved as received.

Classifying node condition. 44.1 does not assign a condition classification to any structural node based on the overlay elements attached to it. Classification belongs to upstream semantic and intelligence layers.

Assigning severity. 44.1 does not assign severity levels, risk ratings, urgency scores, or priority markers to overlay elements or to structural nodes. Severity is an upstream analytical determination. It is not produced in the projection layer.

Defining thresholds. 44.1 does not apply threshold logic to signal states or overlay element sets. Threshold evaluation belongs to upstream layers.

Aggregating bindings. 44.1 does not aggregate, combine, or summarize multiple overlay elements at the same node into a composite representation. Each overlay element remains independent.

Computing composite node state. The set of overlay elements at a node does not produce a computed state value. 44.1 does not compute density, intensity, stress, or any other node-level metric from the overlay.

Creating semantic overlay states. 44.1 does not define named semantic states for nodes — stressed, active, impacted, healthy, at risk — or any equivalent classification. The overlay is a set of attachments. It carries no semantic state vocabulary.

Mutating topology. The authoritative structural topology is external and immutable. 44.1 does not add nodes, remove nodes, create relationships, rename identifiers, or modify any attribute of the topology.

Introducing UI-specific fields. 44.1 does not add color values, display weights, icon references, visual priority markers, or any other field encoding rendering decisions. Rendering is a 42.x responsibility.

Embedding rendering logic. 44.1 does not determine how overlay elements are displayed, what visual form they take, or what rendering behavior is applied to them. Those decisions belong entirely to 42.x.

Creating SSZ, SSI, or equivalent constructs. SSZ (Structural Stress Zone) and SSI (Structural Stress Index) are PROVISIONAL — NOT ADMITTED under the canonical admission rule. No equivalent construct — whether named differently or defined through indirect means — may appear in any output of 44.1. The prohibition applies to the named constructs and to any construct that performs the same function under a different name.

────────────────────────────────────

## 10. Alignment with Upstream and Downstream Layers

44.1 is confirmed aligned with the upstream validation chain and the downstream consumer boundary as follows.

Alignment with 43.3. 44.1 receives only the validated payload produced by 43.3. The input to 44.1 is the certified output of the validation envelope. 44.1 does not bypass, re-run, or supplement 43.3 validation. Records that 43.3 rejected are not accessible to 44.1.

Alignment with 43.2. The overlay element definition in Section 5 is consistent with the payload contract in 43.2. The signal reference, node reference, and evidence embedding components of the validated binding record are preserved in the overlay element without modification. The three-component structure defined in 43.2 is the input basis for the overlay element.

Alignment with 43.1. The projection model in Section 4 is consistent with the binding definition in 43.1. The deterministic attachment principle, the evidence traceability rules, and the boundary enforcement constraints in 43.1 are honored in the projection layer. 44.1 does not introduce behaviors that 43.1 prohibits.

Upstream independence. 44.1 operates from the validated payload and the authoritative topology. It does not require input from 42.x. Its output is complete without consumer-layer interpretation. The completeness of the structural overlay is not conditional on downstream rendering decisions.

Downstream boundary with 42.x. 42.x is a consumer of the structural overlay. It receives projected overlay elements and renders them. 42.x does not influence the projection model, the overlay element definition, or the evidence continuity requirements. No requirement originating in 42.x may alter the definition of 44.1. No back-propagation from the consumer layer to the projection layer is permitted.

42.x consumer obligations. 42.x must consume the structural overlay as governed output. It must not reinterpret overlay elements, compensate for absent overlay elements, or derive meaning from the set of elements it receives beyond what the elements themselves carry. The 42.x consumer compliance enforcement defined in the 42.x governance lock applies to consumption of the structural overlay.

────────────────────────────────────

## 11. Canonical Prohibitions

The following is a consolidated statement of what 44.1 must not do. This section serves as the definitive prohibition registry for the Structural Overlay Projection Layer.

44.1 must not derive signals.
44.1 must not validate signals.
44.1 must not reinterpret evidence.
44.1 must not classify node condition.
44.1 must not assign severity.
44.1 must not define thresholds.
44.1 must not aggregate bindings.
44.1 must not compute composite node state.
44.1 must not create semantic overlay states.
44.1 must not mutate topology.
44.1 must not introduce UI-specific fields.
44.1 must not embed rendering logic.
44.1 must not create SSZ, SSI, or equivalent constructs.
44.1 must not receive input from 42.x.
44.1 must not produce output based on rendering requirements.
44.1 must not retain semantic memory between refresh cycles.
44.1 must not accumulate interpreted condition over time.
44.1 must not invent substitute overlays when validated input is absent.
44.1 must not truncate, summarize, or replace the evidence provenance chain.
44.1 must not introduce new signal classes, signal families, or signal concepts.

────────────────────────────────────

## 12. Validation

The Structural Overlay Projection Layer defined in this document is validated against the required governance gates as follows.

44.1 is defined strictly as projection, not interpretation. Section 4 defines the projection model as passive attachment of validated binding records to authoritative structural nodes. No assessment, classification, or interpretation is introduced. The overlay element carries presence, not condition. Confirmed.

No new signal construct is introduced. Section 5 defines the overlay element as a carrier of the signal reference received from the validated binding record. No new signal identity, signal family, or signal concept is introduced. Section 11 explicitly prohibits new signal classes. Confirmed.

No SSZ, SSI, or equivalent concept appears. Section 9 and Section 11 explicitly prohibit SSZ, SSI, and any equivalent construct by name and by function. No construct performing the same function under a different name is defined. Confirmed.

Structural topology remains external and immutable. Section 4 defines projection as passive with respect to topology. Section 9 prohibits topology mutation. The authoritative topology is resolved against but never modified. Confirmed.

Multi-binding coexistence is defined without aggregation. Section 6 defines coexistence rules for multiple overlay elements at a node. Independence is preserved. Aggregation, fusion, ranking, prioritization, composite state, and interpreted node condition are all explicitly prohibited. Confirmed.

Evidence continuity is preserved end-to-end. Section 8 defines evidence continuity requirements covering signal reference, source reference, timestamp, provenance chain, and upstream validation basis. Truncation, summarization, reinterpretation, and replacement are prohibited. Confirmed.

Lifecycle is refresh-based and non-semantic. Section 7 defines the overlay lifecycle as creation from validated payload, full replacement on refresh, and removal when no validated binding remains. Semantic memory, accumulation, and substitute overlays are prohibited. Confirmed.

No UI or rendering logic is introduced. Section 9 prohibits UI-specific fields and rendering logic. Section 5 excludes rendering instructions from overlay element content. Section 10 confirms that 42.x rendering requirements may not back-propagate into 44.1. Confirmed.

44.1 is aligned with 43.1, 43.2, and 43.3. Section 10 confirms alignment with each upstream layer by reference. The overlay element structure is consistent with 43.2 payload components. The projection model is consistent with 43.1 binding rules. The input basis is exclusively the certified output of 43.3. Confirmed.

44.1 is correctly positioned upstream of 42.x and downstream of 43.3. Section 2 defines the canonical layer position. Section 10 confirms the upstream and downstream boundaries. No reverse dependency from 42.x to 44.1 exists. 44.1 output is complete without consumer interpretation. Confirmed.
