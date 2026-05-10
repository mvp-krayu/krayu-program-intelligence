# PATH B Handoff Model

PI.SQO.COCKPIT-UX-ARCHITECTURE.01

---

## Canonical Flow

```
SQO Cockpit
  → operator prepares handoff package
  → PATH B validates qualification envelope
  → PATH B emits governed projection object
  → LENS renders projection object
```

The cockpit NEVER emits directly into LENS.

---

## Handoff Package Contents

A PATH B handoff package contains:

| Content | Source | Purpose |
|---|---|---|
| Qualification state | `qualification_state.v1.json` | S-state, authorization tier |
| Maturity profile | `semantic_maturity_profile.v1.json` | Overall score, dimension breakdown |
| Gravity assessment | `semantic_gravity_assessment.v1.json` | Gravity classification |
| Stability assessment | `qualification_stability.v1.json` | Stability classification |
| Progression readiness | `progression_readiness.v1.json` | Target and readiness |
| Debt summary | `semantic_debt_inventory.v1.json` | Blocking count, total count |
| Certifications | `*_certification.v1.json` | CERTIFIED verdicts |
| Replay verifications | `*_replay_verification.v1.json` | PASS verdicts |
| Audit trail | Provenance from all artifacts | Traceability |

---

## Minimum Readiness Criteria

| Criterion | Requirement |
|---|---|
| S-state | >= S2 |
| All certifications | CERTIFIED |
| All replay verifications | PASS |
| Critical blocking debt | Zero |
| Maturity profile | Available |
| Governance disclosure | Complete |

If ANY criterion fails → HANDOFF_BLOCKED.

---

## Blocked Handoff Conditions

| Condition | Blocker | Resolution |
|---|---|---|
| S-state < S2 | Minimum not met | Progress to S2 via R2 pathway |
| Certification NOT_CERTIFIED | Governance gap | Resolve failing certification checks |
| Replay FAIL | Determinism gap | Re-run assessment, verify artifacts unchanged |
| Critical blocking debt > 0 | Unresolved critical gap | Address critical debt items |
| Maturity profile unavailable | Assessment not run | Run maturity scoring |

---

## Certification Requirements

Before handoff, ALL certification types must show CERTIFIED:

1. **Qualification state certification** — S-state detection is deterministic and replay-safe
2. **Debt certification** — Debt detection is deterministic and replay-safe
3. **Maturity certification** — Maturity scoring is deterministic and replay-safe

Each certification checks:
- `input_integrity`: Source artifact hashes match
- `deterministic_recomputation`: Same inputs produce same outputs
- `output_hash`: Output artifact hash matches
- `governance_boundary`: No governance violations

---

## Audit Trail

The handoff package includes an audit trail:

```
Source artifacts → input hashes → SQO engine computation → output artifacts → 
  certification → replay verification → handoff package assembly → 
  PATH B submission
```

Every step is traceable. No opaque steps. The governance reviewer can verify the entire chain.

---

## PATH B Processing (Post-Handoff)

After receiving the handoff package, PATH B:

1. **Validates** the qualification envelope against its own criteria
2. **Extracts** the qualification evidence needed for projection
3. **Transforms** SQO evidence into a governed projection object shape
4. **Applies** Q-class authorization gating
5. **Emits** the governed projection object
6. **LENS renders** the projection object through the standard binding flow

PATH B may reject the handoff if its criteria are not met. This is PATH B's authority. The cockpit does not override PATH B decisions.

---

## Governance Rules

1. Cockpit prepares — PATH B decides
2. No direct LENS emission from cockpit
3. No handoff without certification
4. No handoff below S2
5. Audit trail is mandatory
6. PATH B rejection must be respected
7. Re-submission allowed after addressing PATH B feedback
