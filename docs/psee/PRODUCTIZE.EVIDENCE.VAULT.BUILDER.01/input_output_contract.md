# Input/Output Contract
# PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01

- Version: 1.0
- Stream: PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01
- Date: 2026-04-15

---

## SECTION 1 — REQUIRED INPUTS

Located in `clients/<client_id>/psee/runs/<run_id>/package/`:

| artifact | fields consumed | used by |
|----------|----------------|---------|
| `gauge_state.json` | state.execution_status, state.execution_layer_evaluated, state.execution_mode, dimensions.DIM-01..06, score.canonical/projected/band_label/derivation/components, confidence.lower/upper/status | CLM-01..13, CLM-25, all score claims |
| `coverage_state.json` | schema validation only (values sourced from gauge_state.json DIM-01) | TRN-01 |
| `reconstruction_state.json` | axis_results (authoritative), state, validated_units | CLM-03, CLM-04, TRN-02 |
| `canonical_topology.json` | counts.domains/capabilities/components/total_nodes, domains[].domain_name, domains[].cross_domain | CLM-14..17, CLM-27, topology entities |
| `signal_registry.json` | total_signals, signals[].signal_id/title/statement/evidence_confidence/business_impact/risk/domain_name/capability_name/component_names/source_refs | CLM-18..24, ENT-signals |

---

## SECTION 2 — OPTIONAL INPUTS

| artifact | discovery | fields consumed | default if absent |
|----------|-----------|----------------|-------------------|
| `admissibility_log.json` | Searched: package/, ig/, run root | summary.admitted/excluded | Unit count from gauge_state.json DIM-01 |
| `binding_envelope.json` | Explicit `--binding-envelope` flag only | edges[].cross_domain, usp_records[], nodes[] | ART-06 notes "not loaded" |

---

## SECTION 3 — OUTPUTS

**57 vault files** written to `--output-dir`:

| category | count | naming |
|----------|-------|--------|
| Root | 2 | `EVIDENCE VAULT V2.md`, `VAULT ENTRY — <ClientName>.md` |
| Meta | 3 | `00 — Meta/*.md` |
| Navigation | 3 | `00 — Navigation/*.md` |
| Claims | 27 | `claims/CLM-XX <Label>.md` |
| Entities | 5 | `entities/ENT-*.md` |
| Artifacts | 7 | `artifacts/ART-0X <name>.md` |
| Transformations | 6 | `transformations/TRN-0X <name>.md` |
| Client Lineage | 1 | `client-lineage/<ClientName> — Evidence Path.md` |
| Governance | 3 | `governance/*.md` |

---

## SECTION 4 — FIELD MAPPING TABLE

| vault claim | source file | source field path |
|-------------|-------------|------------------|
| CLM-01 value | gauge_state.json | dimensions.DIM-01.coverage_percent |
| CLM-02 value | gauge_state.json | dimensions.DIM-01.admissible_units |
| CLM-03 value | reconstruction_state.json | state |
| CLM-04 value | reconstruction_state.json | axis_results |
| CLM-05 value | gauge_state.json | dimensions.DIM-03.state_label |
| CLM-06 value | gauge_state.json | dimensions.DIM-04.total_count |
| CLM-07 value | gauge_state.json | dimensions.DIM-05.state |
| CLM-08 value | gauge_state.json | dimensions.DIM-06.state |
| CLM-09 value | gauge_state.json | score.canonical |
| CLM-10 value | gauge_state.json | score.projected |
| CLM-11 value | gauge_state.json | score.band_label |
| CLM-12 value | gauge_state.json | confidence.lower, confidence.upper |
| CLM-13 value | gauge_state.json | state.execution_status |
| CLM-14 value | canonical_topology.json | counts.domains |
| CLM-15 value | canonical_topology.json | counts.capabilities |
| CLM-16 value | canonical_topology.json | counts.components |
| CLM-17 value | canonical_topology.json | cross_domain domain count |
| CLM-18 value | signal_registry.json | total_signals |
| CLM-19 value | signal_registry.json | per-signal evidence_confidence |
| CLM-20..24 values | signal_registry.json | signals[SIG-001..005] |
| CLM-25 value | derived | structure_verdict/complexity_verdict/execution_verdict |
| CLM-26 value | GAUGE runtime | not in execution artifacts |
| CLM-27 value | canonical_topology.json | counts.total_nodes |

---

## SECTION 5 — EXIT CODES

| code | meaning |
|------|---------|
| 0 | COMPLETE — all nodes written, 0 broken links |
| 1 | COMPLETE WITH WARNINGS — nodes written, broken links detected |
| non-zero (sys.exit) | FAIL — missing required artifact, invalid JSON, or reference vault protection |

**Authority:** PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01
