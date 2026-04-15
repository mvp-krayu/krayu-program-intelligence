---
node_class: claim
claim_id: CLM-24
claim_label: SIG-005 Coordination Pressure Partial
claim_type: signal
exposure: ZONE-2
lens_admissible: YES
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

## Explanation

Signal SIG-005: Coordination Pressure: Static Interface Sharing at 87.5%; Runtime State Unresolved. Confidence: WEAK. This signal was derived from the four-layer evidence chain (condition → diagnosis → intelligence → signal) and is grounded in the Operational Engineering domain, capability: Delivery and Quality Infrastructure.

**WEAK confidence:** Must be surfaced with explicit caveat. May not be presented as a fully established claim.

## Authoritative Value

WEAK confidence

## Business Impact

A static interface sharing ratio of 0.875 means virtually all observable interfaces are coordinated across multiple components, elevating the coordination cost of any platform change; when combined with dependency load (0.682) and structural volatility (1.273), the compounding coordination burden across the delivery pipeline is materially elevated.

## Risk

Without the runtime component (AT-005 and AT-007), it is unknown whether validation gates are operating at a frequency sufficient to manage the high static coordination pressure; absent runtime confirmation, the 0.875 ratio represents an unvalidated coordination risk that could manifest as integration failures in the delivery pipeline.

## Source Fields

- `signal_registry.json` → `signals[SIG-005]`
- Source refs: `COND-003`, `SIG-001`

## Upstream Artifacts

- [[ART-05 signal_registry.json]]

## Transformation Chain

- S3 signal emission — four-layer chain: COND → DIAG → INTEL → SIG

## Exposure

- ZONE: ZONE-2 (business_impact + risk + evidence_confidence label)
- LENS admissible: CONDITIONAL — WEAK confidence must be surfaced
- Reason: statement and confidence_rationale are ZONE-1/3 only; business_impact and risk are ZONE-2

## Traceability

- Status: FULL
- Caveats: WEAK confidence — static component only; runtime component blocked

## Surfaces

- SignalAvailability panel (title + business_impact + evidence_confidence)
