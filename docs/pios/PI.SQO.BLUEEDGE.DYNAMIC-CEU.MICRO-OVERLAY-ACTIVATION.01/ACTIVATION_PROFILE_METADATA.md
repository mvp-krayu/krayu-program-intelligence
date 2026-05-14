# Activation Profile Metadata

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.MICRO-OVERLAY-ACTIVATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Wave:** 6 — First Controlled Semantic Execution

---

## 1. Purpose

This document records the complete activation profile metadata for
the micro-overlay activation — the specific overlay, its lifecycle,
its configuration, and its operational boundaries.

---

## 2. Activation Profile

| Property | Value |
|----------|-------|
| Profile type | MICRO_ACTIVATION_PROOF |
| Package count | 1 |
| Entry count | 1 |
| Target scope | Single domain (DOMAIN-11) |
| Claim scope | Single claim type (LINEAGE_UPGRADE) |
| Semantic class scope | TECHNICAL (within DOMAIN + TECHNICAL authorization) |

---

## 3. Package Specification

| Field | Value |
|-------|-------|
| Package ID | SEP-blueedge-run01-001 |
| Package version | 1 |
| Source authority | semantic_topology_model |
| Source type | ARCHITECTURE_RECORD |
| Source hash | fb04994af180d9428c6845c357ce8de466d3d5093cb49bf241e3f43b5ba013d1 |
| Authorized classes | DOMAIN, TECHNICAL |
| Entry count | 1 |
| Package hash | sha256:micro_overlay_001_v1 |

---

## 4. Evidence Entry

| Field | Value |
|-------|-------|
| Entry ID | E-001 |
| Claim type | LINEAGE_UPGRADE |
| Target domain | DOMAIN-11 |
| Target domain name | Event-Driven Architecture |
| Prior lineage | PARTIAL (confidence 0.65) |
| Proposed lineage | STRONG |
| Confidence basis | STRONG_INFERENCE |
| Semantic class | TECHNICAL |
| Replay safe | true |

### 4.1 Evidence Basis

DOMAIN-11 (Event-Driven Architecture) has an existing structural
correspondence via `dominant_dom_id` DOM-07 at confidence 0.65
in the certified semantic topology model. The domain is in
CLU-04 (Platform Infrastructure), the same cluster as DOMAIN-10
(Platform Infrastructure and Data) which already has STRONG lineage
and serves as zone_anchor.

The upgrade from PARTIAL to STRONG reflects the structural
relationship already recorded in the certified topology model,
strengthening the confidence assessment based on the established
structural node reference.

### 4.2 Why Not EXACT

DOMAIN-11's structural correspondence is via `dominant_dom_id` DOM-07,
which is a STRONG_INFERENCE (structural correspondence established
via component mapping). EXACT lineage requires DIRECT_CITATION —
an explicit structural identity mapping in source material — which
is not present for this domain. STRONG is the appropriate upgrade
level for this evidence type.

---

## 5. Operational Boundaries

| Boundary | Enforcement |
|----------|------------|
| Max packages | 1 (micro-activation scope) |
| Max entries | 1 (micro-activation scope) |
| Target domains | DOMAIN-11 only |
| Claim types | LINEAGE_UPGRADE only |
| Confidence basis | STRONG_INFERENCE (capped — not EXACT) |
| Semantic classes | TECHNICAL only (within authorization) |
| S-state impact | NONE expected (and confirmed) |
| Q-class impact | NONE expected (and confirmed) |

---

## 6. Lifecycle Timestamps

| Phase | Timestamp | Duration |
|-------|-----------|----------|
| Registration | T+0:01 | — |
| Validation start | T+0:02 | 1s |
| Authorization | T+0:03 | 1s |
| Eligibility | T+0:04 | 1s |
| Activation auth | T+0:05 | 1s |
| Mounted + re-evaluation | T+0:05 → T+0:06 | 1s |
| Active period | T+0:06 → T+0:08 | 2s |
| Revocation | T+0:08 | — |
| Sandbox closure | T+0:10 | 2s |
| **Total lifecycle** | **10s** | |

---

## 7. Governance Assertions

| Assertion | Value |
|-----------|-------|
| no_substrate_mutation | true |
| no_semantic_fabrication | true |
| additive_only | true |
| replay_safe | true |
| independently_removable | true (confirmed by revocation proof) |
