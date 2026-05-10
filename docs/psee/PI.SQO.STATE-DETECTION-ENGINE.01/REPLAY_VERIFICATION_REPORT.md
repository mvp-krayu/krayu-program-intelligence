# Replay Verification Report

**Stream:** PI.SQO.STATE-DETECTION-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Verification results

### BlueEdge (run_blueedge_productized_01_fixed)

| Check | Result |
|-------|--------|
| Input integrity | PASS — all 6 required artifacts present and matching |
| Deterministic recomputation | PASS — re-run produces S2 / AUTHORIZED_WITH_QUALIFICATION |
| Output hash | PASS — sha256 self-hash verifies |
| **Overall verdict** | **PASS** |

### FastAPI (run_02_oss_fastapi_pipeline)

| Check | Result |
|-------|--------|
| Input integrity | PASS — present artifacts match stored hashes |
| Deterministic recomputation | PASS — re-run produces S1 / NOT_AUTHORIZED |
| Output hash | PASS — sha256 self-hash verifies |
| **Overall verdict** | **PASS** |

---

## 2. Verification method

The ReplayVerifier module performs three checks:

1. **Input integrity:** Verifies that each artifact listed in the provenance `input_hashes` is still present on disk. Detects if source artifacts were removed or added since the qualification state was emitted.

2. **Deterministic recomputation:** Re-runs `runFullDetection()` with the same client/run and compares the resulting S-state, authorization tier, boardroom readiness, and projection permission against the stored artifact values.

3. **Output hash:** Recomputes the sha256 hash of the artifact body (with `output_hash` set to null) and compares against the stored `output_hash`. Detects any post-emission modification of the artifact file.

---

## 3. Determinism evidence

Two consecutive runs of `runFullDetection()` for each client produce identical results:

| Property | BlueEdge run 1 | BlueEdge run 2 | Match |
|----------|---------------|----------------|-------|
| s_state | S2 | S2 | YES |
| authorization_tier | AUTHORIZED_WITH_QUALIFICATION | AUTHORIZED_WITH_QUALIFICATION | YES |
| q_class | Q-02 | Q-02 | YES |
| binding_status | LIVE | LIVE | YES |

| Property | FastAPI run 1 | FastAPI run 2 | Match |
|----------|-------------|--------------|-------|
| s_state | S1 | S1 | YES |
| authorization_tier | NOT_AUTHORIZED | NOT_AUTHORIZED | YES |
| loader_status | REQUIRED_ARTIFACT_MISSING | REQUIRED_ARTIFACT_MISSING | YES |

The detection function uses no timestamps, session state, or randomized values in its derivation logic. Timestamps appear only in metadata fields (provenance), not in derivation inputs.
