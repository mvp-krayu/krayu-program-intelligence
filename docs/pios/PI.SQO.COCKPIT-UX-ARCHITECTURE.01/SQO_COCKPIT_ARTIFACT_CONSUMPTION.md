# SQO Cockpit Artifact Consumption Model

PI.SQO.COCKPIT-UX-ARCHITECTURE.01

---

## Consumption Model

The SQO Cockpit reads SQO artifacts in read-only mode. It does NOT:
- Mutate any artifact
- Recompute any artifact values
- Create new SQO artifacts (except additive cockpit-level tracking records)
- Delete or archive artifacts

---

## Consumed Artifacts

### qualification_state.v1.json

**Cockpit sections:** Overview, Handoff
**Fields consumed:**
- `qualification_state.s_state` — current S-state
- `qualification_state.detection_reason` — why this S-state was detected
- `qualification_state.required_artifacts` — which artifacts are required
- `qualification_state.present_artifacts` — which are present
- `qualification_state.missing_artifacts` — which are missing

**Read-only governance:** Values displayed as-is. No interpretation. No reclassification.

---

### qualification_history.v1.json

**Cockpit sections:** History
**Fields consumed:**
- `transitions[]` — S-state transitions with timestamps
- `enrichment_events[]` — source material additions and pipeline re-runs

**Read-only governance:** Historical data displayed chronologically. No extrapolation.

---

### semantic_debt_inventory.v1.json

**Cockpit sections:** Debt, Remediation, Overview
**Fields consumed:**
- `total_debt_items` — total count
- `debt_items[]` — full debt item array
- `debt_items[].category` — grouping
- `debt_items[].severity` — priority input
- `debt_items[].blocks_s_state` — progression impact
- `debt_items[].remediation` — action guidance
- `debt_items[].priority_score` — ordering
- `summary` — aggregated counts

**Read-only governance:** Debt items displayed from artifact. Priority from documented model. No manual re-ordering.

---

### continuity_assessment.v1.json

**Cockpit sections:** Continuity
**Fields consumed:**
- `overall_status` — FULL / PARTIAL / NO_ASSESSMENT
- `coverage_ratio` — entity coverage
- `label_fidelity_ratio` — business label coverage
- `lineage_strength` — grounding ratio
- `metrics` — entity counts, domain counts
- `gaps[]` — individual continuity gaps

**Read-only governance:** Metrics displayed as-is. Gaps from artifact, not computed.

---

### semantic_maturity_profile.v1.json

**Cockpit sections:** Maturity, Overview
**Fields consumed:**
- `overall_maturity_score` — composite score
- `overall_classification` — LOW / PARTIAL / STABLE / STRONG
- `dimensions` — per-dimension scores and classifications (D1-D8)

**Read-only governance:** Scores from artifact. Classification from documented thresholds.

---

### semantic_gravity_assessment.v1.json

**Cockpit sections:** Maturity, Overview
**Fields consumed:**
- `semantic_gravity_score` — composite gravity score
- `classification` — FRAGMENTED / EMERGING / STABILIZING / GRAVITATIONAL

**Read-only governance:** Score and classification from artifact.

---

### qualification_stability.v1.json

**Cockpit sections:** Maturity, Overview
**Fields consumed:**
- `qualification_stability_score` — stability score
- `classification` — UNSTABLE / CONDITIONAL / STABLE / RESILIENT

**Read-only governance:** Score and classification from artifact.

---

### progression_readiness.v1.json

**Cockpit sections:** Overview, Remediation, Handoff
**Fields consumed:**
- `current_s_state` — current state
- `next_s_state_target` — target state
- `progression_readiness` — readiness score (0.0-1.0)
- `blocking_debt_count` — number of blocking items
- `blocking_debts[]` — blocking debt item references

**Read-only governance:** Values from artifact. Progression target deterministic from S-state model.

---

### Replay verification artifacts

**Files:**
- `qualification_state_replay_verification.v1.json`
- `debt_replay_verification.v1.json`
- `maturity_replay_verification.v1.json`

**Cockpit sections:** Replay
**Fields consumed:**
- `checks[]` — input_integrity, deterministic_recomputation, output_hash
- `overall_verdict` — PASS / FAIL

**Read-only governance:** Verification results displayed. Failed checks prominently shown.

---

### Certification artifacts

**Files:**
- `qualification_state_certification.v1.json`
- `debt_certification.v1.json`
- `maturity_certification.v1.json`

**Cockpit sections:** Replay, Handoff
**Fields consumed:**
- `certification_cases[]` — case name, status, details
- `overall_verdict` — CERTIFIED / NOT_CERTIFIED

**Read-only governance:** Certification results displayed. NOT_CERTIFIED blocks handoff.

---

### maturity_dimension_breakdown.v1.json

**Cockpit sections:** Maturity (drill-down)
**Fields consumed:**
- Per-dimension formula inputs and contributing factors

**Read-only governance:** Breakdown from artifact. Formula inputs traceable to source data.

---

## Additive-Only Cockpit Artifacts

The cockpit may create its own tracking artifacts:

- **Source material tracking:** IDENTIFIED → REQUESTED → RECEIVED → PROCESSED status per requirement
- **Re-run checklist exports:** Planning artifacts for pipeline re-run preparation
- **Handoff package exports:** Assembled qualification evidence for PATH B

These artifacts:
- Live in a cockpit-specific namespace (e.g., `artifacts/sqo-cockpit/`)
- Are additive-only (never overwrite SQO engine artifacts)
- Have no authority over SQO engine computation
- Are advisory tracking records, not governance artifacts
