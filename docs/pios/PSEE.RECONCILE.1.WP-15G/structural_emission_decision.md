# Structural Emission Decision — WP-15G

stream:      PSEE.RECONCILE.1.WP-15G
evidence:    WP-15E execution log · WP-15F structure_source_report · telemetry_baseline.json · authoritative_state.json
commit:      ceca05f15602

---

## CURRENT_STATE

| Dimension | Observed Value |
|---|---|
| intake provides | metrics only — 20 VAR_* scalar key-value pairs (int / null) |
| structure provides | NONE — WP-15F confirmed zero structural keys across 30 CE2 40.5–40.11 artifacts |
| pipeline behavior | CONSTRUCTION_COMPLETE — all stages pass; topology containers receive empty arrays |
| resulting topology | EMPTY — domains=0, nodes=0, relationships=0 (confirmed in authoritative_state.json) |
| signals | 8 signals emitted, all CRITICAL (bound_count=0 — no topology to bind against) |
| structural_metrics | structural_density=0.0, dependency_load=0.0, coordination_pressure=1.0, visibility_deficit=0.0 |
| bounded_conditions | 0 — pipeline does not flag empty topology as a bounded condition |

---

## OPTION ENUMERATION

### OPTION_A — METRICS_ONLY_MODEL

Topology remains empty. Pipeline is authoritative as-is.
Gauge renders metrics and signals; structural panels suppressed or marked UNAVAILABLE.
No new ingestion stage. No mutation of current artifacts.
System remains fully deterministic from current intake.

### OPTION_B — DERIVED_STRUCTURE (REJECTED BY DEFAULT)

Structure inferred from VAR_* prefixes (VAR_AT, VAR_DT, VAR_ST) or signal states.
Classification: NON-AUTHORITATIVE.
Violates Evidence-First principle — no explicit structural source exists.
MUST NOT be selected unless explicitly declared NON-AUTHORITATIVE by contract authority.

### OPTION_C — EXPLICIT_STRUCTURE_EMISSION

A new executable stage (STRUCTURE_EMITTER) is introduced.
It produces domains/entities/relationships from an explicit, governed source.
Output becomes part of AUTHORITATIVE_INTAKE before authoritative_state construction.
Required if structural topology is needed for future clients or runtime surface.

---

## EVALUATION

| Criterion | OPTION_A | OPTION_B | OPTION_C |
|---|---|---|---|
| Evidence compliance | YES — no evidence of structure exists; empty is correct | NO — inference without explicit source | YES — requires new governed source |
| Determinism | YES | NO — inferred values are heuristic | YES — if emitter is deterministic |
| Replay fidelity vs BlueEdge | LOW — BlueEdge run produced topology; this run cannot | LOW — derived topology ≠ authoritative | HIGH — if emitter receives equivalent source |
| Governance risk | LOW | HIGH — non-authoritative injection into governed pipeline | MED — new stage requires contract and validation |

---

## DECISION

**DECISION = OPTION_C**

### Justification

1. OPTION_A is immediately valid but closes replay fidelity permanently — the existing BlueEdge run produced topology from structural data that pre-dates this intake chain.
2. OPTION_B is excluded — no explicit structural source exists; inference would produce non-authoritative output in a governed pipeline.
3. OPTION_C is the only path to topology that preserves evidence-first discipline and enables replay equivalence.
4. Empty topology produces CRITICAL signals with bound_count=0 across all 8 signals — this is a structurally degraded state that does not represent the program's actual structural health.
5. A governed STRUCTURE_EMITTER stage can be introduced without modifying any existing pipeline logic.

### Consequences

- Current authoritative_state.json (empty topology) is structurally valid but informationally incomplete.
- Pipeline must not be re-run until STRUCTURE_EMITTER stage is in place.
- Until OPTION_C is delivered, OPTION_A behavior applies: topology panels render as UNAVAILABLE.

---

## FORWARD CONTRACT REQUIREMENT (OPTION_C)

### New Stage: STRUCTURE_EMITTER

| Field | Value |
|---|---|
| stage name | STRUCTURE_EMITTER |
| required inputs | An explicit, governed structural source file delivered as part of AUTHORITATIVE_INTAKE (e.g. `structure_manifest.json` under `clients/<uuid>/input/intake/`) |
| contract authority | New stream contract required — cannot be inferred from existing artifacts |
| pipeline insertion point | After INTAKE_SCHEMA_ADAPT, before STRUCTURE_EXTRACTION (replaces current empty-return behavior of adapt_intake_structure.py) |

### Required Output Schema

```json
{
  "domains": ["<string>", "..."],
  "entities": [
    { "name": "<string>", "domain": "<string>" }
  ],
  "relationships": [
    { "from": "<string>", "to": "<string>", "type": "<string>" }
  ]
}
```

### Constraints

- Source file must classify as AUTHORITATIVE_INTAKE
- No inference from VAR_* keys permitted
- All domains must be explicitly declared in source
- All entity names must be explicitly declared in source
- All relationship types must be explicitly declared in source
- Provenance hash must cover both telemetry_baseline.json AND structure source file
