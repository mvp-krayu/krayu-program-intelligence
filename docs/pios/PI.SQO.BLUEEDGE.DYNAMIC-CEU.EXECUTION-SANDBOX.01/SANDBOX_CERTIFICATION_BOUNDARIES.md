# Sandbox Certification Boundaries

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.EXECUTION-SANDBOX.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization (Execution Isolation)

---

## 1. Purpose

This document defines the certification boundaries of the sandbox —
what the sandbox architecture certifies, what it does not certify,
and the relationship between sandbox-produced state and pipeline-certified
state.

---

## 2. Certification Taxonomy

### 2.1 Pipeline-Certified (External to Sandbox)

State certified by the structural pipeline, immutable from the
sandbox perspective:

| Certification | Source | Sandbox Relationship |
|--------------|--------|---------------------|
| Structural topology | PATH A pipeline | READ-ONLY reference |
| DPSIG signals | Lane D pipeline | READ-ONLY reference |
| Static CEU grounding (4/17) | CEU pipeline | Baseline for composite computation |
| Decision validation (14/14) | Pipeline validation | Immutable precondition |
| Reproducibility verdict (FULL) | Pipeline verification | Immutable precondition |
| S-state S2 (certified) | State detection engine | Baseline S-state (pre-overlay) |
| Q-class Q-02 (certified) | Q-class resolver | Baseline Q-class (pre-overlay) |

### 2.2 Sandbox-Certified (Sandbox-Internal)

State certified by the sandbox execution process:

| Certification | Source | Scope |
|--------------|--------|-------|
| Overlay package integrity | Hash verification (Phase 1) | Within sandbox namespace |
| Overlay provenance chain | Phase 1 validation | Within sandbox namespace |
| Semantic class authorization | Phase 2 verification | Within sandbox namespace |
| Overlay eligibility | Phase 3 resolution | Within sandbox namespace |
| Governance authorization | Phase 4 authorization | Within sandbox namespace |
| Composite state computation | Re-evaluation (Phase 5) | Sandbox-internal composite |
| Replay reconstruction | Replay verification | Sandbox-internal replay |
| Audit trail integrity | Hash chain verification | Sandbox-internal audit |

### 2.3 NOT Certified (Never by Sandbox)

| Item | Why Not Certifiable by Sandbox |
|------|-------------------------------|
| Structural truth (topology) | Owned by PATH A pipeline, not SQO |
| Signal truth (DPSIG) | Owned by Lane D, sovereign |
| Source material validity | Owned by ingestion pipeline (L1) |
| Pipeline reproducibility | Owned by pipeline replay, not overlay |
| Evidence quality | Sandbox verifies structure, not semantic truth |
| Business domain accuracy | Sandbox verifies provenance, not domain expertise |

---

## 3. Certification Boundary Matrix

| Operation | Sandbox Certifies | Sandbox Does NOT Certify |
|-----------|------------------|-------------------------|
| Overlay registration | Package structure, hash integrity | Evidence semantic accuracy |
| Overlay validation | Provenance chain completeness, confidence basis | Source material truth |
| Overlay authorization | Class authorization correctness | Class taxonomy validity |
| Overlay activation | Governance authorization chain | Governance decision quality |
| Composite computation | Computation correctness, attribution | Composite state meaning |
| Replay reconstruction | Deterministic reproducibility | Prior state correctness |
| Rollback | State restoration correctness | Rollback decision appropriateness |
| S-state assessment | Gate formula application | Gate definition adequacy |
| Q-class resolution | Formula application | Formula design |

---

## 4. Composite State Certification Status

### 4.1 Composite Is NOT Pipeline-Certified

The composite qualification state produced by the sandbox is:

- COMPUTED (not pipeline-certified)
- ATTRIBUTED (overlay vs certified contributions explicitly separated)
- REPLAYABLE (deterministically reconstructable)
- REVOCABLE (removing overlays restores certified state)

The composite state MUST NEVER be represented as pipeline-certified.

### 4.2 Composite Certification Disclosure

Every composite state output includes:

```json
{
  "certification_status": {
    "pipeline_certified_component": {
      "s_state": "S2",
      "q_class": "Q-02",
      "backed_count": 4,
      "certification_source": "PIPELINE",
      "certification_hash": "<hash>"
    },
    "overlay_component": {
      "overlay_backed_count": N,
      "certification_source": "SANDBOX",
      "certification_level": "OVERLAY_VERIFIED",
      "packages_contributing": M
    },
    "composite": {
      "s_state": "<computed>",
      "q_class": "<computed>",
      "backed_count": "<4 + N>",
      "certification_source": "COMPOSITE",
      "certification_level": "SANDBOX_COMPUTED",
      "disclosure": "Composite includes overlay-derived contributions"
    }
  }
}
```

### 4.3 Certification Level Hierarchy

```
PIPELINE_CERTIFIED  (highest — immutable, pipeline-verified)
    │
    ▼
OVERLAY_VERIFIED    (sandbox-verified overlay contribution)
    │
    ▼
SANDBOX_COMPUTED    (composite of certified + overlay)
    │
    ▼
UNVERIFIED          (not yet processed through sandbox lifecycle)
```

Downstream consumers MUST distinguish between certification levels.
No downstream system may treat SANDBOX_COMPUTED as PIPELINE_CERTIFIED.

---

## 5. Certification Promotion Rules

### 5.1 No In-Sandbox Promotion

Overlay contributions CANNOT be promoted to PIPELINE_CERTIFIED status
within the sandbox. The sandbox is not a certification authority for
pipeline-level truth.

### 5.2 Pipeline Re-execution Promotion (Future)

If BlueEdge's pipeline is re-executed with evidence that was originally
contributed by overlays, the new pipeline output would be
PIPELINE_CERTIFIED at that point:

```
Current:  4/17 pipeline-certified + overlay for remaining domains
Future:   Pipeline re-executed with enhanced evidence
Result:   New pipeline-certified state (possibly > 4/17)
          New sandbox created against new certified baseline
          Prior overlays re-evaluated against new baseline
```

This is a pipeline event, not a sandbox event. The sandbox does not
trigger or control pipeline re-execution.

### 5.3 Certification Boundary Between Sandbox and Pipeline

| Boundary | Direction | What Crosses |
|----------|-----------|-------------|
| Pipeline → Sandbox | Certified baseline enters sandbox as read-only reference | Structural truth, qualification baseline |
| Sandbox → Pipeline | NOTHING crosses this boundary | Overlays do not promote to pipeline |
| Sandbox → Downstream (LENS, cockpit) | Composite state with attribution disclosure | Clearly marked as SANDBOX_COMPUTED |

---

## 6. BlueEdge Certification Specifics

| Metric | Pipeline-Certified Value | Sandbox-Computed Range | Disclosure |
|--------|------------------------|----------------------|-----------|
| S-state | S2 | S2 → S3 (if 17/17 backed) | "S3 via composite" |
| Q-class | Q-02 | Q-02 → Q-01 (if 17/17 backed) | "Q-01 via composite" |
| backed_count | 4/17 | 4/17 → 17/17 (with overlays) | "4 certified + N overlay = M composite" |
| Decision validation | 14/14 PASS | 14/14 PASS (unchanged) | Pipeline-certified |
| Reproducibility | FULL | FULL (unchanged) | Pipeline-certified |
| Crosswalk | 13 entities | 13+ (overlay may extend) | "13 certified + K overlay-extended" |

---

## 7. Governance Rules

1. Pipeline-certified state is the highest certification level.
2. Sandbox-computed state is explicitly labeled as such.
3. No sandbox operation promotes overlay state to pipeline-certified.
4. Composite state always discloses certification level breakdown.
5. Downstream consumers must distinguish certification levels.
6. Only pipeline re-execution can produce new pipeline-certified state.
7. Certification boundaries are immutable — sandbox cannot modify them.
