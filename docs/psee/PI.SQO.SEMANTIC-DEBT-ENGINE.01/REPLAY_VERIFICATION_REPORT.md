# Replay Verification Report

**Stream:** PI.SQO.SEMANTIC-DEBT-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. BlueEdge debt replay verification

| Check | Method | Result |
|-------|--------|--------|
| Input integrity | Compare stored input_hashes against current artifact presence | PASS |
| Deterministic recomputation | Re-run debt detection, compare total_debt_items and summary | PASS |
| Output hash | Recompute sha256 over artifact body (output_hash nulled), compare | PASS |
| **Overall** | All 3 checks pass | **PASS** |

BlueEdge debt inventory: 15 items (0 CRITICAL, 13 HIGH, 0 MEDIUM-HIGH, 2 MEDIUM). Replay produces identical inventory on re-run.

---

## 2. FastAPI debt replay verification

| Check | Method | Result |
|-------|--------|--------|
| Input integrity | Compare stored input_hashes against current artifact presence | PASS |
| Deterministic recomputation | Re-run debt detection, compare total_debt_items and summary | PASS |
| Output hash | Recompute sha256 over artifact body (output_hash nulled), compare | PASS |
| **Overall** | All 3 checks pass | **PASS** |

FastAPI debt inventory: 25 items (3 CRITICAL, 10 HIGH, 1 MEDIUM-HIGH, 11 MEDIUM). Replay produces identical inventory on re-run.

---

## 3. Determinism confirmation

Two consecutive runs for each client produce:
- Identical total_debt_items
- Identical summary counts
- Identical debt item IDs, categories, severities
- Identical priority scores and ranking

No stochastic behavior. Same input → same output.
