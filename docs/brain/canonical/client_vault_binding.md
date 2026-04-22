# client_vault_binding.md
# Canonical Brain Node — Client Vault Binding

- Stream: PRODUCTIZE.GAUGE.CLIENT.VAULT.BINDING.01
- Authority: brain/canonical
- Date: 2026-04-22

---

## CANONICAL TRUTH

There is one Evidence Vault per client per run. It is produced by a governed deterministic process. It is the only correct evidence destination for runtime navigation. It must not be duplicated.

---

## VAULT IDENTITY (LOCKED BASELINE)

| Field | Value |
|---|---|
| Client | blueedge |
| Authoritative run | run_authoritative_recomputed_01 |
| Vault root | `clients/blueedge/vaults/run_01_authoritative_generated/` |
| Vault stream | PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01 |
| Claims | 27 (CLM-01..CLM-27) |
| Artifacts | 7 (ART-01..ART-07) |
| Entities | 5 (ENT-signals, ENT-topology-nodes, ENT-structural-units, ENT-dimensions, ENT-score-components) |
| Transformations | 6 (TRN-01..TRN-06) |

---

## DETERMINISTIC ID-TO-PATH MAPPING

### Artifact nodes

| Runtime ID | Vault file path |
|---|---|
| ART-01 | `artifacts/ART-01 gauge_state.json.md` |
| ART-02 | `artifacts/ART-02 coverage_state.json.md` |
| ART-03 | `artifacts/ART-03 reconstruction_state.json.md` |
| ART-04 | `artifacts/ART-04 canonical_topology.json.md` |
| ART-05 | `artifacts/ART-05 signal_registry.json.md` |
| ART-06 | `artifacts/ART-06 binding_envelope.json.md` |
| ART-07 | `artifacts/ART-07 admissibility_log.json.md` |

### Signal → claim node mapping

Each signal in signal_registry.json has exactly one dedicated claim node.

| Signal ID | Signal title (abbreviated) | Vault claim file |
|---|---|---|
| SIG-001 | Sensor Bridge Throughput | `claims/CLM-20 SIG-001 Sensor Bridge Throughput.md` |
| SIG-002 | Platform Runtime State (7 Unknown) | `claims/CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions.md` |
| SIG-003 | Dependency Load 68% | `claims/CLM-22 SIG-003 Dependency Load 68 Percent.md` |
| SIG-004 | Structural Volatility Edge Density | `claims/CLM-23 SIG-004 Structural Volatility Edge Density.md` |
| SIG-005 | Coordination Pressure Partial | `claims/CLM-24 SIG-005 Coordination Pressure Partial.md` |

This mapping is structurally fixed: signal claim nodes occupy CLM-20..CLM-24 by vault construction order.

### Domain → entity node

No per-domain vault nodes exist. All domain navigation resolves to:

`entities/ENT-topology-nodes.md`

This is the canonical landing point for any domain or zone scope query.

### Claim fallback (not materialized)

`governance/Known Gaps.md`

### Navigation entry points (for zone-scope and general access)

| Purpose | Vault path |
|---|---|
| All artifacts | `00 — Navigation/Core Artifacts.md` |
| Top claims | `00 — Navigation/Top Claims.md` |
| Value creation path | `00 — Navigation/Value Creation Path.md` |
| All signals (entity) | `entities/ENT-signals.md` |
| All topology (entity) | `entities/ENT-topology-nodes.md` |
| Evidence gaps | `governance/Known Gaps.md` |
| Claim index | `00 — Meta/Claim Index.md` |

---

## VAULT INDEX CONTRACT

A `vault_index.json` file must be produced by the vault builder alongside each vault. It encodes the ID-to-path mapping in a machine-readable format consumable by runtime.

Location: `clients/<client>/vaults/<run_id>/vault_index.json`

This file is the single resolution authority for runtime vault navigation. Once it exists, all runtime vault links must use it. Hardcoded fallback registries are pre-index state only.

---

## INVARIANTS

1. Vault is produced once per client per run. It is immutable after production.
2. Signal-to-claim mapping is stable within a run: same signal registry → same claim files.
3. Artifact-to-file mapping is stable: ART-NN is always in the `artifacts/` directory.
4. Domain nodes do not exist in the vault — ENT-topology-nodes is always the domain entry.
5. Zone constructs have no vault node — they navigate via their primary domain.
6. vault_index.json is deterministic: same canonical inputs → same index.

---

## GROUNDING REFERENCE

Confirmed by file survey:
- `clients/blueedge/vaults/run_01_authoritative_generated/claims/` — 27 files
- `clients/blueedge/vaults/run_01_authoritative_generated/artifacts/` — 7 files
- Signal-to-claim frontmatter: `claim_id: CLM-20..CLM-24` mapped to SIG-001..SIG-005
