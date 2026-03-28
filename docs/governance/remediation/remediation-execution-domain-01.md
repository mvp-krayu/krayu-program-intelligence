# Remediation Execution Domain 01 — Derivation Ownership & Boundary Correction

Stream: 40.16 — Remediation Execution Domain 01
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-22
Authority: Stream 00.2; Stream 40.12; Stream 40.14; Stream 40.15; Stream 00.3
Status: REMEDIATION EXECUTION — DOMAIN A

────────────────────────────────────

## 1. Purpose

This artifact executes the first remediation domain as defined in Stream 40.15.

Domain A addresses the foundational violation: derivation ownership placed outside L3. Resolution of this domain is the pre-condition for all subsequent remediation work.

This stream produces execution-level governance instructions for Domain A remediation. It does not redesign architecture, introduce formulas, or change system behavior beyond what is required to correct derivation ownership placement.

────────────────────────────────────

## 2. Domain Scope Definition

Domain: A — L3 Derivation Specification

This domain addresses all violations and ungoverned states where derivation ownership is absent at L3 or incorrectly placed at a consumer layer.

Constructs in scope: SSZ (Structural Stress Zone), SSI (Structural Stress Index).

Layer owning this domain: L3.

Boundary of this domain: derivation ownership begins and ends at L3. Consumer layers (L4 through L8) do not participate in this domain's remediation actions. L6 is the layer from which derivation ownership must be vacated. L6 does not produce the remedy; it receives the corrected output once L3 specification is in place.

This domain does not include ESI specification, which is governed under a separate Domain A allocation (as per Stream 40.14, Finding F4). ESI is not addressed in this execution stream. This stream addresses only SSZ and SSI.

────────────────────────────────────

## 3. Source Violations (from 40.14)

The following findings from Stream 40.13, as dispositioned in Stream 40.14, are addressed by this domain.

Finding F1 — SSZ/SSI Derivation Placed at L6
Disposition: OPEN — VIOLATION
SSZ and SSI derivation ownership is incorrectly placed at L6. Resolution requires a formal L3 derivation specification and removal of derivation ownership from L6.

Finding F2 — L6 Consumer Layer Holds Derivation Ownership
Disposition: OPEN — VIOLATION
L6 holds derivation ownership for SSZ and SSI in the absence of L3 specification. Resolution requires that L3 specification be in place and that L6 no longer acts as the derivation owner for these constructs.

Finding F6 — Absence of Formal L3 Derivation Artifacts
Disposition: OPEN — VIOLATION
No formal L3 derivation artifact exists for SSZ or SSI. This is the root cause behind F1 and F2. Resolution requires formal L3 derivation artifacts to be produced for both constructs.

Finding F3 — L7 Downstream Dependency on Unresolved L6 Ownership
Disposition: OPEN — TOLERATED DEVIATION
This deviation resolves as a downstream consequence of closing F1. It is addressed by this domain through that resolution path. No independent action is required from L7.

────────────────────────────────────

## 4. Ownership Confirmation

Remediation ownership for Domain A (SSZ and SSI) is confirmed as:

Owning layer: L3
Assignment source: Stream 40.14, Remediation Ownership Allocation, Findings F1 and F2
Designation status: Stream designation for the L3 execution stream is now initiated by this artifact.

No other layer holds ownership for this domain. L6 does not own the correction. L6 vacates derivation ownership as a consequence of this domain completing. L4, L5, L7, and L8 have no execution role in this domain.

42.x (ExecLens, L6) is confirmed non-participatory in this domain.
Stream 51 (L7) is confirmed non-participatory in this domain.

────────────────────────────────────

## 5. Remediation Actions (Execution-Level, No Redesign)

The following actions constitute Domain A remediation. Each action is bounded by the L3 execution envelope defined in Stream 40.15.

Action 01 — Produce Formal L3 Derivation Specification for SSZ

A formal governance artifact defining SSZ as a governed L3 derivation output must be produced. This artifact must define the evidence inputs required to produce SSZ, establish SSZ as a structural state marker owned and emitted by L3, and specify the output contract that consumer layers (L5, L6) must consume. The artifact must not define computational formulas beyond evidence input and output boundary. Formula and threshold specification remains out of scope for this domain and is governed by a separate future stream.

Action 02 — Produce Formal L3 Derivation Specification for SSI

A formal governance artifact defining SSI as a governed L3 derivation output must be produced. SSI is the numerical expression of SSZ. The artifact must define SSI as owned and emitted by L3, specify the output contract for consumer layers, and establish that SSI derivation belongs to L3 and may not be reproduced at any consumer layer. Formula specification remains out of scope.

Action 03 — Vacate Derivation Ownership from L6

Following the production of formal L3 specifications for SSZ and SSI, the derivation ownership held by L6 must be vacated. L6 must transition from holding derivation ownership to receiving pre-derived SSZ and SSI outputs from L3 via L5 presentation payloads. The mechanism of this transition is defined within the L6 execution envelope (Stream 40.15, Section 5). L6 may not retain a local derivation fallback.

Action 04 — Confirm L3 Output Contract Is Receivable by L5

Before Domain A is closed, L5 must confirm it can receive SSZ and SSI as pre-derived outputs from L3 and assemble them into presentation payloads. L5 does not produce derivation. L5 confirms the downstream transmission path is viable. This action is a readiness confirmation, not a derivation action.

────────────────────────────────────

## 6. Boundary Enforcement During Execution

The following boundary rules are enforced throughout the execution of this domain.

L3 is the only layer performing remediation for derivation ownership. All specification artifacts for SSZ and SSI are produced as L3 artifacts.

L6 does not initiate or perform any derivation correction through self-modification of derivation logic. L6 waits for L3 specification completion and L5 payload delivery before transitioning its consumption behavior.

L4 does not participate in Domain A. L4 execution (Domain B) may not begin until Domain A is complete for the relevant constructs, as per Stream 40.15, Constraint S4.

L7 (Stream 51) does not participate. No SSZ derivation logic is produced by or for L7. F3 resolves as a downstream consequence of Actions 01 and 03. No action is required from L7.

L8 does not define derivation logic during this execution. L8 may produce validation artifacts confirming Domain A completion after Actions 01 through 04 are complete.

42.x must not initiate any modification to derivation behavior during the execution of this domain unless it is confined strictly to vacating the L6 derivation ownership state as part of Action 03. 42.x may not introduce any substitute derivation, fallback computation, or workaround behavior.

────────────────────────────────────

## 7. Non-Allowed Actions (Strict)

The following actions are strictly prohibited during the execution of this domain.

Defining derivation formulas for SSZ or SSI. Derivation formulas remain out of scope for this domain. The specification artifacts produced in Actions 01 and 02 define evidence input requirements and output contracts only.

Introducing any new signal-like constructs. This domain addresses SSZ and SSI as already classified. No new constructs may be introduced.

Redesigning the canonical layer model. Layer placement, ownership, and boundaries are authoritative from Stream 00.2 and may not be modified.

Allowing L6 to retain derivation ownership as a temporary extension while awaiting L3 specification. Tolerated deviation F1/F2 is classified as a violation, not as an accepted state. L6 derivation ownership must be vacated as part of Action 03, not deferred beyond this domain.

Allowing L7 or Stream 51 to produce any SSZ or SSI derivation logic as a bridging measure.

Reopening audit classifications, ownership allocations, or governance decisions from Streams 40.12 through 40.15.

────────────────────────────────────

## 8. Execution Validation Criteria

Domain A execution is valid only when all of the following criteria are satisfied.

Criterion V1: A formal L3 derivation specification artifact for SSZ exists at a governed path within docs/architecture/ or an equivalent L3-governed artifact location. The artifact defines evidence inputs and output contract. It does not define formulas.

Criterion V2: A formal L3 derivation specification artifact for SSI exists at a governed path. The artifact defines evidence inputs, SSI as a derivative of SSZ scope, and output contract.

Criterion V3: The SSZ and SSI derivation ownership placement at L6 has been vacated. No component of L6 holds primary derivation ownership for SSZ or SSI.

Criterion V4: L6 receives SSZ and SSI as pre-derived outputs delivered via L5 presentation payloads. L6 does not reproduce derivation to compensate for a missing upstream source.

Criterion V5: L7 (Stream 51) references SSZ from the L3-specified source via L5/L6 delivery path, not from the prior L6 derivation location.

Criterion V6: Findings F1, F2, and F6 from Stream 40.13 are resolvable as CLOSED — COMPLIANT against the produced artifacts. Tolerated deviation F3 resolves as a consequence.

Criterion V7: No new violation has been introduced during the execution of this domain. L6 remains consumer-only. 42.x has not absorbed derivation responsibility. Stream 51 has not produced derivation logic.

────────────────────────────────────

## 9. Completion Criteria

Domain A is complete when all of the following conditions are confirmed.

Actions 01, 02, 03, and 04 are executed as defined in Section 5.

All validation criteria V1 through V7 are satisfied.

An L8 validation artifact is produced confirming Domain A closure. That artifact must reference the completed L3 specifications for SSZ and SSI and confirm that L6 derivation ownership has been vacated.

Findings F1, F2, F6, and F3 are formally closed in the governance record.

Domain A completion is the pre-condition for Domain B to begin, as per Stream 40.15, Constraint S1 and Constraint S4.

────────────────────────────────────

## 10. Final Position

This stream has executed the governance instructions for Domain A remediation.

Derivation ownership correction for SSZ and SSI is the foundational remediation action. It resolves the root violations (F1, F2, F6) and the downstream tolerated deviation (F3). It does not address ESI (separate Domain A allocation), Executive Interpretation semantic shaping (Domain B), or consumer layer alignment beyond the vacating of L6 derivation ownership (Domain C).

The system moves from governance-structured remediation into executed remediation with this stream.

Domain A governs derivation ownership.
Domain A belongs to L3.
Domain A does not belong to any consumer layer.
