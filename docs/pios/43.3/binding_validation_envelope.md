# Binding Validation Envelope

Stream: 43.3 — Binding Validation Envelope
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-22
Authority: Stream 43.2 — Binding Schema & Payload Contract; Stream 43.1 — Signal-to-Structure Binding Definition; Stream 00.2; krayu-knowledge canonical admission rule
Status: DEFINITION — RUNTIME GUARD / NON-IMPLEMENTABLE

────────────────────────────────────

## 1. Purpose

This document defines the validation envelope that governs whether a binding payload produced under 43.2 is permitted to pass to the consumer execution layer (42.x).

43.3 is a pure validation gate. It accepts a binding payload, evaluates each bound projection record against a defined set of validation rules, and passes only those records that satisfy all rules. It does not transform records. It does not repair records. It does not produce records. It does not interpret the content of records.

The validation envelope enforces fail-closed behavior: a record that fails validation is dropped. If all records fail validation, no validated binding payload is emitted. The absence of validated records must remain observable downstream and must not be compensated, inferred, or replaced by any synthetic representation. There is no degraded mode, no partial acceptance, and no fallback generation.

43.3 does not alter the governed shape of a bound projection record as defined in 43.2. Validation confirms conformance with that shape. It does not extend it.

────────────────────────────────────

## 2. Position in Architecture

43.3 occupies a defined position between the payload contract layer (43.2) and the consumer execution layer (42.x).

43.1 defines binding rules — when and how a valid binding is produced.
43.2 defines the payload contract — what a bound projection record must contain.
43.3 defines the validation envelope — whether a produced record may proceed to 42.x.
42.x consumes the validated output — it does not validate, repair, or supplement it.

No bound projection record may reach 42.x without passing 43.3. This is not a conditional requirement. It is an architectural constraint. 42.x has no visibility into the records that 43.3 rejected. 42.x receives only what 43.3 has confirmed compliant.

43.3 is downstream of 43.2 and upstream of 42.x. It holds validation authority only. It holds no derivation authority, no semantic shaping authority, no binding authority, and no rendering authority.

────────────────────────────────────

## 3. Validation Scope

The validation envelope evaluates each bound projection record independently across five validation dimensions. No dimension is optional. No dimension may be deferred. All five must be satisfied for a record to pass.

The five dimensions are:

— Structure Validity (Section 4)
— Signal Integrity (Section 5)
— Evidence Completeness (Section 6)
— Derivation Compliance (Section 7)
— Boundary Compliance (Section 8)

Each dimension applies to a single bound projection record. A record does not inherit validity from other records. A set of records does not aggregate into a composite validity determination.

────────────────────────────────────

## 4. Structure Validity

Structure validity confirms that the bound projection record correctly references a governed structural node.

The following must hold for a record to satisfy structure validity:

Structure reference present. The bound projection record must contain a node reference component. A record without a node reference is structurally incomplete and must be rejected.

Structure reference resolvable. The node reference must identify a structural node that originates from the governed external topology. A node reference that cannot be matched to a governed topology entry is unresolvable and the record must be rejected.

Node identifier valid. The node identifier within the node reference must be a well-formed canonical identifier as defined by the external topology. A malformed, absent, or unrecognized node identifier renders the record invalid and the record must be rejected.

A record that fails any structure validity check is rejected. The rejection is final. The record is not held, repaired, or resubmitted.

────────────────────────────────────

## 5. Signal Integrity

Signal integrity confirms that the bound projection record references a signal that is canonically admitted, upstream-produced, and unmodified by the binding layer.

The following must hold for a record to satisfy signal integrity:

Signal identity canonical. The signal reference must carry a CKR identifier confirmed present in krayu-knowledge. A signal identity that does not correspond to an admitted CKR entry is non-canonical. The record must be rejected.

Signal upstream-produced. The signal's state must have originated upstream of 43.x — at L3 or shaped at L4 — and must have been received by 43.x as an immutable input. A signal whose state was produced within 43.x, modified within 43.x, or inferred by 43.x is not upstream-produced. The record must be rejected.

Signal not computed in 43.x. The binding layer does not compute signal values. A record whose signal state reflects any transformation, normalization, derivation, or reclassification applied within 43.x has violated the non-computation constraint. The record must be rejected.

A record that fails any signal integrity check is rejected.

────────────────────────────────────

## 6. Evidence Completeness

Evidence completeness confirms that the bound projection record carries the full, intact evidence provenance chain required by 43.2.

The following elements must be present and resolvable within the evidence embedding for a record to satisfy evidence completeness:

Source reference. The evidence embedding must include a reference to the upstream source from which the signal's state was derived. A record without a source reference carries no traceable evidence anchor and must be rejected.

Timestamp. The evidence embedding must include the timestamp at which the signal state was established upstream. A record without a timestamp cannot be placed in time relative to the execution evidence it represents and must be rejected.

Signal identifier. The evidence embedding must carry the CKR identifier of the signal whose provenance it traces. A provenance chain that cannot be attributed to a specific admitted signal is not a governed provenance chain. The record must be rejected.

Association basis. The association basis must be evidenced and reconstructible from the provenance chain. An association basis that is absent or not reconstructible renders the record invalid and the record must be rejected.

Provenance chain intact. The full provenance chain must be present and unbroken. An abbreviated, summarized, inferred, or reconstructed provenance chain does not satisfy evidence completeness. The record must be rejected.

If any evidence completeness element is missing, incomplete, or unresolvable, the record is rejected. There is no partial evidence acceptance. There is no inference of missing provenance.

────────────────────────────────────

## 7. Derivation Compliance

Derivation compliance confirms that the bound projection record does not carry any construct that requires derivation authority 43.x does not hold.

The following must hold for a record to satisfy derivation compliance:

No SSZ or SSI. SSZ (Structural Stress Zone) and SSI (Structural Stress Index) are PROVISIONAL — NOT ADMITTED under the canonical admission rule. They may not appear in any bound projection record as signal identities, node designations, association basis references, or in any other capacity. A record containing SSZ or SSI in any field must be rejected.

No derived signals. A bound projection record may not carry a signal whose state was derived within the binding layer or produced by any construct not admitted through krayu-knowledge. Only signals with confirmed CKR identifiers whose derivation occurred upstream at L3 are permitted. Any other signal presence constitutes a derivation compliance violation. The record must be rejected.

No computed metrics. A bound projection record may not carry a field whose value is a computed metric — a value produced through calculation, aggregation, transformation, or synthesis within 43.x or below. Computed metrics have no canonical upstream source and violate the non-derivation constraint. The record must be rejected.

Derivation belongs to L3. 43.x is not a derivation layer. No record produced under this architecture may carry content that implies derivation authority at the binding layer.

────────────────────────────────────

## 8. Boundary Compliance

Boundary compliance confirms that the bound projection record does not carry content that exceeds the scope of a projection layer.

The following must hold for a record to satisfy boundary compliance:

No interpretation content. A bound projection record must not contain any field that expresses what the signal-to-node attachment means, characterizes the node's condition, or asserts a claim beyond the evidence relationship. Interpretation fields — labels, assessments, condition characterizations, qualitative statements — are boundary violations. The record must be rejected.

No narrative constructs. A bound projection record must not contain text, descriptions, or language that constructs a narrative about the signal, the node, or their relationship. The binding layer projects attachment; it does not explain it. A record containing narrative constructs must be rejected.

No inferred meaning. A bound projection record must not contain any field that represents a conclusion drawn by the binding layer about the significance, severity, or implication of the attachment. Meaning inference is a function of upstream semantic layers. It has no place in a binding record. The record must be rejected.

No aggregation or fusion. A bound projection record must not carry content that is derived from or represents a combination of multiple signal attachments. Aggregation and fusion violate the indivisibility of the bound projection record. The record must be rejected.

No rendering instructions. A bound projection record must not carry color values, display weights, visual priority markers, or any other field that encodes rendering decisions. Rendering is a 42.x responsibility. The record must be rejected.

────────────────────────────────────

## 9. Validation Outcome Model

43.3 produces one of two outcomes for each bound projection record: VALID or INVALID. No intermediate outcome exists.

VALID. The record has satisfied all five validation dimensions — structure validity, signal integrity, evidence completeness, derivation compliance, and boundary compliance. The record passes to 42.x unchanged. 43.3 does not modify a valid record. 43.3 does not annotate, enrich, or augment a valid record. The record exits 43.3 in identical form to how it entered.

INVALID. The record has failed at least one validation check in any dimension. The record is dropped. It does not pass to 42.x. 43.3 does not attempt to repair the record. 43.3 does not hold the record for later resubmission. 43.3 does not produce a substitute record. Validation failure must remain observable as an upstream condition and must not be suppressed, compensated for, or converted into a valid binding payload downstream.

A record that was rejected by validation represents a different upstream condition from a node that produced no binding records. These two conditions must be distinguishable. Neither may be suppressed.

────────────────────────────────────

## 10. Fail-Closed Behavior

43.3 enforces fail-closed behavior at both the record level and the payload level.

At the record level. A record that fails any validation check is dropped. There is no partial pass. A record that fails one check is not passed with the failed dimension noted. It is dropped entirely.

At the payload level. If all records in a binding payload are rejected by 43.3, no validated binding payload is emitted. This condition must be preserved without substitution, inference, or synthetic representation. There is no fallback payload. There is no degraded mode in which partially valid records are passed. There is no mechanism by which 43.3 produces synthetic or approximated records to fill a gap left by rejected records.

────────────────────────────────────

## 11. 42.x Interface Contract

43.3 presents a confirmed-compliant payload to 42.x. The payload contains only records that have passed all five validation dimensions. 42.x may consume this payload as governed output.

The following obligations bind 42.x upon receipt of the validated payload:

Accept payload as-is. 42.x must not re-validate, re-examine, or independently assess the records it receives. 43.3 has certified their compliance. 42.x consumes certified output.

Render absence as absence. Where a structural node is absent from the validated payload — because it produced no binding records or because all its records were rejected — 42.x must represent that node's state as absence. 42.x must not infer, substitute, or construct a state for an absent node.

No compensation or inference. 42.x must not compensate for missing records by recomputing signals, inferring binding relationships, or producing representations not grounded in the validated payload. Consumer-layer compensation is a boundary violation.

No signal recomputation. 42.x must not regenerate or recompute any signal value that is absent from or incomplete in the validated payload. If a signal is absent, that absence is governed. It is not a gap to be filled.

Validation failure visibility. Where a record has been rejected by 43.3, validation failure must remain observable as an upstream condition and must not be suppressed, compensated for, or absorbed into a clean consumer representation.

────────────────────────────────────

## 12. Prohibited Behaviors

The following behaviors are strictly prohibited within 43.3.

Payload modification. 43.3 must not alter the content of any bound projection record that passes validation. A record exits 43.3 in the same form it entered.

Evidence repair. 43.3 must not supplement, reconstruct, or infer any missing element of the evidence embedding. A missing source reference, timestamp, or signal identifier is a validation failure. It is not a gap to be filled.

Missing data inference. 43.3 must not infer what a missing field would have contained, use surrounding context to approximate an absent value, or produce any output that substitutes for missing governed content.

Signal recomputation. 43.3 must not recompute, re-derive, or regenerate any signal value. 43.3 has no derivation authority. Signal values are upstream-owned.

Record aggregation. 43.3 must not merge, combine, or aggregate records during the validation process. Each record is validated independently. Validation does not produce new records from existing ones.

Partial acceptance. 43.3 must not pass a record that has failed any validation check, even if only a single check failed. The pass/fail determination is total.

────────────────────────────────────

## 13. Validation Against 43.2 and 43.1

The validation envelope defined in this document is confirmed aligned with the payload contract (43.2) and the binding definition (43.1) as follows.

Validation scope matches payload contract. The five validation dimensions in 43.3 — structure validity, signal integrity, evidence completeness, derivation compliance, boundary compliance — correspond directly to the three-component model in 43.2 (signal reference, node reference, evidence embedding) and the boundary enforcement rules in Sections 9 of both 43.1 and 43.2. Confirmed.

Evidence requirements aligned. The evidence completeness requirements in 43.3 (source reference, timestamp, signal identifier, association basis, intact provenance chain) are consistent with the evidence embedding model in 43.2 Section 6 and the evidence traceability rules in 43.1 Section 8. The timestamp requirement added in 43.2 is enforced here. Confirmed.

Derivation prohibitions consistent. The derivation compliance dimension in 43.3 enforces the same prohibitions established in 43.2 Section 9 (payload scope, no derivation at 43.x) and 43.1 Section 9 (no signal creation, no SSZ/SSI). Confirmed.

Boundary compliance consistent. The boundary compliance dimension in 43.3 enforces the boundary constraints in 43.2 Section 9 (no interpretation fields, no aggregation, no rendering) and 43.1 Section 9 (no interpretation, no narrative, no aggregation). Confirmed.

Fail-closed model consistent. 43.3 enforces the fail-closed evidence model required by 43.1 Section 8 Rule 1 and the validity conditions in 43.2 Section 3. An incomplete or invalid record produces no output. Confirmed.

42.x interface consistent. The 42.x obligations defined in 43.3 Section 11 are consistent with the downstream consumer boundary established in 43.1 Section 9 (consumer-side compensation prohibited) and 43.2 Section 8 (consumer must not reconstruct or infer). Confirmed.
