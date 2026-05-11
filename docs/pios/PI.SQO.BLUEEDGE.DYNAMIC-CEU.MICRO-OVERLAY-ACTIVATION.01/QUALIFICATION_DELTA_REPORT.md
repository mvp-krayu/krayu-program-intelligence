# Qualification Delta Report

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.MICRO-OVERLAY-ACTIVATION.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Wave:** 6 — First Controlled Semantic Execution

---

## 1. Purpose

This document records the exact qualification delta produced by the
micro-overlay activation — the precise before/during/after state
of every affected qualification metric.

---

## 2. Qualification States

### 2.1 State T0 — Certified Baseline (Pre-Sandbox)

| Metric | Value | Source |
|--------|-------|--------|
| S-state | S2 | Pipeline-certified |
| Q-class | Q-02 | Pipeline-certified |
| backed_count | 4/17 | Pipeline-certified |
| grounding_ratio | 0.235 | Computed from backed/total |
| DOMAIN-11 lineage | PARTIAL | Pipeline-certified (confidence 0.65) |
| Static backed | 4 | Pipeline-certified |
| Overlay backed | N/A | No sandbox |
| Overlay % | N/A | No sandbox |

### 2.2 State T1 — Post-Activation (Overlay Mounted)

| Metric | Value | Source |
|--------|-------|--------|
| S-state | S2 | Sandbox composite |
| Q-class | Q-02 | Sandbox composite |
| backed_count | 5/17 | Sandbox composite |
| grounding_ratio | 0.294 | Computed from composite |
| DOMAIN-11 lineage | STRONG | Overlay contribution |
| Static backed | 4 | Unchanged (pipeline-certified) |
| Overlay backed | 1 | From SEP-blueedge-run01-001 |
| Overlay % | 20% | 1 overlay / 5 composite |

### 2.3 State T2 — Post-Revocation (Overlay Unmounted)

| Metric | Value | Source |
|--------|-------|--------|
| S-state | S2 | Sandbox composite (= baseline) |
| Q-class | Q-02 | Sandbox composite (= baseline) |
| backed_count | 4/17 | Sandbox composite (= baseline) |
| grounding_ratio | 0.235 | Computed (= baseline) |
| DOMAIN-11 lineage | PARTIAL | Restored to baseline |
| Static backed | 4 | Unchanged |
| Overlay backed | 0 | All overlays revoked |
| Overlay % | 0% | No overlays |

---

## 3. Delta Analysis

### 3.1 Activation Delta (T0 → T1)

| Change | From | To | Delta |
|--------|------|-----|-------|
| backed_count | 4 | 5 | +1 |
| grounding_ratio | 0.235 | 0.294 | +0.059 |
| DOMAIN-11 lineage | PARTIAL | STRONG | Upgraded |
| Overlay backed | 0 | 1 | +1 |
| S-state | S2 | S2 | No change |
| Q-class | Q-02 | Q-02 | No change |

**Delta characterization:** Exactly 1 domain lineage upgrade. No
S-state or Q-class change (expected — S3 requires 17/17, Q-01
requires full grounding). The delta is the minimum possible
qualification-affecting change.

### 3.2 Revocation Delta (T1 → T2)

| Change | From | To | Delta |
|--------|------|-----|-------|
| backed_count | 5 | 4 | -1 |
| grounding_ratio | 0.294 | 0.235 | -0.059 |
| DOMAIN-11 lineage | STRONG | PARTIAL | Restored |
| Overlay backed | 1 | 0 | -1 |
| S-state | S2 | S2 | No change |
| Q-class | Q-02 | Q-02 | No change |

**Revocation characterization:** Exact inverse of activation delta.
All metrics restored to baseline values.

### 3.3 Round-Trip Proof (T0 = T2)

| Metric | T0 | T2 | Match |
|--------|-----|-----|-------|
| S-state | S2 | S2 | YES |
| Q-class | Q-02 | Q-02 | YES |
| backed_count | 4/17 | 4/17 | YES |
| grounding_ratio | 0.235 | 0.235 | YES |
| DOMAIN-11 lineage | PARTIAL | PARTIAL | YES |
| Composite hash | e7fd21c4... | e7fd21c4... | YES |

**Round-trip proof:** T2 state is byte-identical to T0 state.
The overlay activation and revocation are a perfect round-trip.
Independent removability: CONFIRMED.

---

## 4. Determinism Verification

The qualification delta was computed twice from the same inputs:

| Computation | backed_count | grounding_ratio | Hash |
|-------------|-------------|-----------------|------|
| Original computation | 5 | 0.294 | sha256:composite_with_domain11_strong |
| Independent reconstruction | 5 | 0.294 | sha256:composite_with_domain11_strong |
| Match | YES | YES | YES |

**Determinism: CONFIRMED.** Same inputs produce same delta.

---

## 5. Attribution

| Metric | Certified Contribution | Overlay Contribution |
|--------|----------------------|---------------------|
| backed_count = 5 | 4 (80%) | 1 (20%) |
| EXACT domains | 3 (DOMAIN-01, 14, 16) | 0 |
| STRONG domains | 1 (DOMAIN-10) | 1 (DOMAIN-11, during activation) |
| PARTIAL domains | 1 (DOMAIN-11, baseline) | 0 (upgraded during activation) |
| NONE domains | 12 | 0 (no change) |

---

## 6. Governance

- Delta is additive-only (lineage upgrade, not downgrade)
- Delta is reversible (revocation restores exactly)
- Delta is deterministic (same inputs → same output)
- Delta is attributed (overlay vs certified always distinguished)
- Delta is disclosed (20% overlay-derived during activation)
- No S-state or Q-class change (expected for +1 domain)
