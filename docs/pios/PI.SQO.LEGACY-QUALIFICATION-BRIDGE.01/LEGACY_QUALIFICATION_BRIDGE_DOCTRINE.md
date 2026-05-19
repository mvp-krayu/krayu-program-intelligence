# Legacy Qualification Bridge Doctrine

> Canonical pattern for migrating pre-SQO computational qualification into SQO-native governed qualification.

---

## 1. Architectural Classification

This migration is **GOVERNANCE PROJECTION FROM VALID LEGACY QUALIFICATION**.

It is NOT historical reconstruction.

### What this means

**Governance Projection** creates truthful scaffolding representing the current operational state. The migration event is a single governance event documenting the bridge — not a series of fabricated reviews, acceptances, or promotions.

**Historical Reconstruction** would fabricate operator events that never occurred ("operator X accepted review Y on date Z"). This is explicitly prohibited — the contract forbids fabricating promotion events or inventing operator reviews that never occurred.

### The distinction

| Property | Governance Projection | Historical Reconstruction |
|---|---|---|
| Event creation | Single migration bridge event | Multiple fabricated historical events |
| Actor identity | `system:governance_projection` | Fabricated operator actor IDs |
| Temporal truthfulness | Events carry migration timestamp, not fabricated dates | Events carry fabricated dates |
| Evidence claim | "Legacy qualification is valid" | "These reviews occurred" |
| Provenance | Explicit migration_provenance on all artifacts | Hidden fabrication |
| Reversibility | Bridge event can be audited and reverted | Fabricated history becomes indistinguishable from real history |

---

## 2. Bridge Pattern

### Source Requirements

A legacy qualification system qualifies for governance projection when:

1. **Qualification evidence exists** — deterministic artifacts support the claimed S-state
2. **Replay verification passes** — qualification is reproducible from evidence
3. **Certification passes** — independent certification confirms qualification validity
4. **No evidence mutation required** — the bridge creates governance metadata only
5. **No semantic reinterpretation required** — existing claims are preserved unchanged

### Projection Mechanism

The bridge creates 4 SQO operator workflow artifacts:

| Artifact | Projection Source | Content |
|---|---|---|
| `promotion_state.json` | `qualification_state.v1.json` | S-level, authority ceiling, lane states derived from existing evidence posture |
| `qualification_blockers.json` | `semantic_debt_inventory.v1.json` | Debt items projected as qualification blockers with lane/severity/domain mapping |
| `review_obligations.json` | None (empty) | Zero obligations — legacy qualification pre-dates review workflow |
| `promotion_event_log.jsonl` | Migration stream | Two events: structural onboarding (system:pipeline) + legacy qualification bridge (system:governance_projection) |

### Provenance Rules

All projected artifacts MUST carry `migration_provenance` metadata:

```json
{
  "migration_provenance": {
    "type": "GOVERNANCE_PROJECTION",
    "source_stream": "<migration stream ID>",
    "source_artifact": "<path to source evidence>",
    "projection_class": "<projection type>",
    "evidence_mutated": false,
    "qualification_recomputed": false,
    "fabricated_history": false
  }
}
```

### Event Lineage Rules

The migration event log MUST:
- Use `actor_id: "system:governance_projection"` — never a fabricated human operator
- Use `action: "legacy_qualification_bridge"` — a named migration action, not a fabricated review or promotion
- Carry `semantic_disposition: "QUALIFICATION_ADVANCEMENT"` — the governed disposition taxonomy
- Reference all supporting evidence in `evidence_refs`
- Include `migration_provenance` in the event payload

---

## 3. Invariants

### Preserved unchanged
- All evidence artifacts at `artifacts/sqo/{client}/{run}/`
- All replay verification results
- All certification results
- All deterministic computations
- Q-class classification
- Grounding ratio
- Reconciliation correspondence
- Semantic debt inventory

### Created by bridge
- `promotion_state.json` — governance metadata only
- `qualification_blockers.json` — debt-to-blocker projection
- `review_obligations.json` — empty (no fabricated reviews)
- `promotion_event_log.jsonl` — bridge events only

### Explicitly NOT created
- Fabricated review events
- Fabricated acceptance events
- Fabricated operator actor IDs
- Fabricated historical timestamps
- Recomputed qualification states
- Modified evidence

---

## 4. Applicability

This doctrine applies to:
- Pre-SQO intelligence systems entering SQO governance
- Legacy crosswalk qualification systems
- Historical semantic qualification substrates
- External onboarding pathways
- Future SQO retrofitting operations

BlueEdge (PI.SQO.LEGACY-QUALIFICATION-BRIDGE.01) is the first canonical bridge specimen.

---

## 5. Governance Authority

This doctrine is established by PI.SQO.LEGACY-QUALIFICATION-BRIDGE.01 (G1 — Architecture-Mutating).

The migration pattern is CANONICAL. Future legacy-to-SQO migrations MUST follow this doctrine unless explicitly superseded.
