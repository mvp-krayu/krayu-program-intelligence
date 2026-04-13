# Topology Production Trace
# 41X.TOPOLOGY.PRODUCTION.FORENSICS.01 — Deliverable 1

## Identity

- Contract: 41X.TOPOLOGY.PRODUCTION.FORENSICS.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT FORENSICS — NO CODE CHANGES

---

## Artifact Backtracking — 41.2 PIE Vault Files

### Observed Structure of Representative Vault Files

**Domain file: `docs/pios/41.2/pie_vault/01_Domains/D_01_Edge_Data_Acquisition.md`**

Fields observed:
```
# Domain: Edge Data Acquisition

**domain_id:** DOMAIN-01
**domain_type:** FUNCTIONAL
**grounding_status:** GROUNDED (1 component WEAKLY GROUNDED)

## Description
[prose — verbatim from semantic_domain_model.md]

## Capabilities
[MD table: capability_id | capability_name | type | grounding | link to C_NN_*.md]

## Components
[MD table: component_id | component_name | tier | capability | link to CMP_NN_*.md]

## Execution Path Participation
[EP references from pie_render_manifest.md]

## Traceability Reference
[component_anchors, relationship_anchors]

## Navigation
[↓ Capabilities: links | ← Explorer Map]
```

**Capability file: `docs/pios/41.2/pie_vault/02_Capabilities/C_01_Vehicle_Sensor_Collection.md`**

Fields observed:
```
# Capability: Vehicle Sensor Collection

**capability_id:** CAP-01
**parent_domain:** DOMAIN-01 — Edge Data Acquisition
**capability_type:** CORE
**grounding_status:** GROUNDED

## Description
[prose — verbatim from capability_map.md CAP-01]

## Component Members
[MD table: component_id | component_name | tier | evidence | link to CMP_NN_*.md]

## Execution Contribution
[EP references]

## Relationships
[R-NNN references]

## Traceability Reference
[Source anchors: capability_map.md CAP-01]

## Navigation
[↑ Domain | ↓ Components | ← Explorer Map]
```

**Component file: `docs/pios/41.2/pie_vault/03_Components/CMP_73_sensor_collector_py.md`**

Fields observed:
```
# Component: sensor_collector.py

**component_id:** COMP-73
**tier:** BACKEND
**semantic_capability:** CAP-01 — Vehicle Sensor Collection
**semantic_domain:** DOMAIN-01 — Edge Data Acquisition

## Source Anchor
[evidence_type, source_ref]

## Description
[prose]

## Relationships
[R-NNN triples]

## Traceability Reference
[semantic_traceability_map.md entry]

## Parent Capability
[link to capability]

## Navigation
[↑ Capability | ↑ Domain | ← Explorer Map]
```

---

## Generation Pattern Assessment

### Validation report evidence (pie_render_validation_report.md, lines 138–143)

```
| All domain descriptions copied verbatim from semantic_domain_model.md | VERIFIED |
| All capability descriptions copied verbatim from capability_map.md | VERIFIED |
| All component traceability entries match semantic_traceability_map.md | VERIFIED |
| No invented domain names | VERIFIED — 0 invented |
| No invented capability names | VERIFIED — 0 invented |
| No invented component names | VERIFIED — 0 invented |
```

This is direct documentation evidence that vault content was derived from 41.1 artifacts — not independently authored.

---

## Script Search for Vault Writers

### Search 1: Scripts referencing pie_vault paths

Files found in `scripts/pios/` with `pie_vault`, `01_Domains`, `02_Capabilities`, `03_Components` references:
- `scripts/pios/41.2/build_pie_vault.py` — copies from canonical; does NOT generate
- `scripts/pios/41.2/validate_pie_vault.py` — validates structure; does NOT generate
- `scripts/pios/41.2/parity_check.py` — byte-level parity check; does NOT generate
- `scripts/pios/42.1/run_execlens_query.py` — reads vault at runtime; does NOT generate
- `scripts/pios/42.7/execlens_topology_adapter.py` — reads vault at runtime; does NOT generate
- Others: validators and query adapters only — all read-only

**No script found that writes vault files.**

### Search 2: Scripts using `open(` with vault path

Only `scripts/pios/41.2/build_pie_vault.py` — confirmed copy operation only.

### Search 3: Functions named `generate_vault`, `build_vault`, `write_vault`

No matches in any Python script in the repository.

---

## Generation Mechanism Conclusion

| vault_section | generation_pattern | producer_script |
|---------------|-------------------|-----------------|
| 01_Domains/ (17 files) | Content derived from semantic_domain_model.md; assembled as MD | NO GENERATOR SCRIPT |
| 02_Capabilities/ (42 files) | Content derived from capability_map.md; assembled as MD | NO GENERATOR SCRIPT |
| 03_Components/ (89 files) | Content derived from semantic_traceability_map.md; assembled as MD | NO GENERATOR SCRIPT |
| 04_Traceability/ | Content derived from 41.1 traceability map | NO GENERATOR SCRIPT |
| 05_Insights/ | Copied from 41.1 insights artifacts | NO GENERATOR SCRIPT |

**Suspected generation pattern:** DIRECT_MD_ASSEMBLY — vault files authored directly by the 41.2 execution, drawing content from 41.1 artifacts. No programmatic generator script committed to repository.

---

## Git Commit Trace for Vault Files

| file | first_add_commit | commit_message |
|------|-----------------|----------------|
| `docs/pios/41.2/pie_vault/01_Domains/D_01_Edge_Data_Acquisition.md` | `c36f4ea` | "PIOS 42.x complete — ExecLens demo baseline" |
| `docs/pios/41.2/pie_vault/03_Components/CMP_73_sensor_collector_py.md` | `c36f4ea` | "PIOS 42.x complete — ExecLens demo baseline" |
| `docs/pios/41.2/pie_index.md` | `c36f4ea` | "PIOS 42.x complete — ExecLens demo baseline" |
| `docs/pios/41.2/pie_render_validation_report.md` | `c36f4ea` | "PIOS 42.x complete — ExecLens demo baseline" |

Pre-recovery baseline copies committed in `fb8574e` ("Freeze PiOS 41.1-41.5 pre-recovery baseline") to `docs/baselines/41x_pre_recovery/41.2/` path — establishing that vault files existed before `c36f4ea`.

**Vault files existed in the pre-recovery baseline before being placed at their canonical path.**

---

## 41.1 Artifact Trace

| file | first_add_commit | commit_message |
|------|-----------------|----------------|
| `docs/pios/41.1/semantic_domain_model.md` | `e8fe19f` | "PIOS baseline: 40.3–40.11 pipeline + 41.1 semantic layer" |
| `docs/pios/41.1/capability_map.md` | `e8fe19f` | (same) |
| `docs/pios/41.1/semantic_traceability_map.md` | `e8fe19f` | (same) |

The 41.1 artifacts were committed in `e8fe19f` — BEFORE the recovery scripts were added in `c6d69c9`.
Recovery scripts added in `c6d69c9` ("Recover and harden PiOS 41.1-41.5 deterministic scripts").
