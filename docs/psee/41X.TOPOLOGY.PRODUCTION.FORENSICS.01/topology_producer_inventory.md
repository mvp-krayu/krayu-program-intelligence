# Topology Producer Inventory
# 41X.TOPOLOGY.PRODUCTION.FORENSICS.01 — Deliverable 2

## Identity

- Contract: 41X.TOPOLOGY.PRODUCTION.FORENSICS.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT FORENSICS — NO CODE CHANGES

---

## Producer Discovery Summary

All scripts under `scripts/pios/` searched. All references to "41.1", "41.2", "semantic_domain_model", "capability_map", "pie_vault", "node_inventory" searched.

---

## Identified Producers

### PRODUCER-01 — build_semantic_layer.py (41.1)

| attribute | value |
|-----------|-------|
| producer_id | PRODUCER-01 |
| script_path | scripts/pios/41.1/build_semantic_layer.py |
| contract_label | PIOS-41.1-ADDENDUM-SCRIPT-RECOVERY-v1 |
| first_committed | c6d69c9 ("Recover and harden PiOS 41.1-41.5 deterministic scripts") |
| commit_date | 2026-03-20 16:48 +0400 |
| entry_point | `main()` — argparse-driven, `--output-dir` |
| canonical_output_path | docs/pios/41.1/ |
| input_source | Embedded Python dicts (DOMAINS, CAPABILITIES, COMPONENTS, DIRECTIVES) — no external file reads |
| output_generation_mode | STRUCTURED — renders MD from embedded dicts via generator functions |
| produces_domains | YES — build_semantic_domain_model() loops over DOMAINS (17) |
| produces_capabilities | YES — build_capability_map() loops over CAPABILITIES (42) |
| produces_components | YES — build_semantic_traceability_map() loops over COMPONENTS (89) |
| produces_relationships | YES — embedded in COMPONENTS[*].cross and in prose sections |
| produces_vault_files | NO |
| label_type | ADDENDUM-SCRIPT-RECOVERY |

**Generator functions in PRODUCER-01:**
```
build_semantic_domain_model()     → semantic_domain_model.md
build_capability_map()            → capability_map.md
build_semantic_traceability_map() → semantic_traceability_map.md
build_semantic_elevation_report() → semantic_elevation_report.md
build_pie_render_manifest()       → pie_render_manifest.md (includes 148-node table)
build_semantic_feedback_directives() → semantic_feedback_directives.md
build_executive_readability_map() → executive_readability_map.md
```

**ARTIFACTS list (line 1083):**
```python
ARTIFACTS = [
    ("semantic_domain_model.md",        build_semantic_domain_model),
    ("capability_map.md",               build_capability_map),
    ("semantic_traceability_map.md",    build_semantic_traceability_map),
    ("semantic_elevation_report.md",    build_semantic_elevation_report),
    ("pie_render_manifest.md",          build_pie_render_manifest),
    ("semantic_feedback_directives.md", build_semantic_feedback_directives),
    ("executive_readability_map.md",    build_executive_readability_map),
]
```

**Parity verification:** `scripts/pios/41.1/parity_check.py` performs structural equivalence checks (not byte-level) against canonical docs/pios/41.1/. Checks presence of all DOMAIN-NN, CAP-NN, COMP-NN IDs, section headers, metadata tokens, directive IDs.

---

### PRODUCER-02 — build_pie_vault.py (41.2) — COPY-ONLY, NOT A GENERATOR

| attribute | value |
|-----------|-------|
| producer_id | PRODUCER-02 |
| script_path | scripts/pios/41.2/build_pie_vault.py |
| contract_label | PIOS-41.2-ADDENDUM-SCRIPT-RECOVERY-v1 |
| first_committed | c6d69c9 ("Recover and harden PiOS 41.1-41.5 deterministic scripts") |
| commit_date | 2026-03-20 16:48 +0400 |
| entry_point | `main()` — `build_vault(canonical, output)` |
| canonical_source | docs/pios/41.2/pie_vault/ (TREATED AS SOURCE — not generated from here) |
| output_generation_mode | COPY — `shutil.copy2()` per file in vault tree |
| produces_domains | NO — copies existing domain files |
| produces_capabilities | NO — copies existing capability files |
| produces_components | NO — copies existing component files |
| produces_relationships | NO |
| produces_vault_files | COPY ONLY — not original generation |
| label_type | ADDENDUM-SCRIPT-RECOVERY |

**Critical note:** This script explicitly declares the vault as canonical:
```python
CANONICAL_SOURCE = "docs/pios/41.2/pie_vault"
```
And the build function is:
```python
for src_file in sorted(canonical.rglob("*")):
    shutil.copy2(src_file, dst_file)
```
This is a file copy operation. There is no content generation logic.

---

### PRODUCER-03 — build_link_normalization.py (41.3) — COPY-ONLY

| attribute | value |
|-----------|-------|
| script_path | scripts/pios/41.3/build_link_normalization.py |
| contract_label | PIOS-41.3-ADDENDUM-SCRIPT-RECOVERY-v1 |
| output_generation_mode | COPY — copies `docs/pios/41.3/semantic_consolidation_report.md` |
| produces_domains | NO |
| label_type | ADDENDUM-SCRIPT-RECOVERY |

---

### PRODUCER-04 — build_signals.py (41.4)

| attribute | value |
|-----------|-------|
| script_path | scripts/pios/41.4/build_signals.py |
| contract_label | PIOS-41.4-RUN01-ADDENDUM-SCRIPT-RECOVERY-v1 |
| output_generation_mode | STRUCTURED — embedded SIGNALS list (5 entries) → JSON artifacts |
| input_source | Embedded SIGNALS dicts + reads from docs/pios/40.5/, 40.6/, 40.7/, 41.2/pie_vault/ |
| produces_domains | NO (references domain_id in signals) |

---

## Producers NOT Found

The following patterns were searched with NO matches:

| search_pattern | result |
|---------------|--------|
| `generate.*pie`, `pie.*generate` | NOT FOUND |
| `materialize.*vault`, `vault.*materialize` | NOT FOUND |
| `generate_vault`, `write_vault`, `build_vault` functions | NOT FOUND |
| Scripts writing to `pie_vault/01_Domains/` | NOT FOUND |
| Scripts writing to `pie_vault/02_Capabilities/` | NOT FOUND |
| Scripts writing to `pie_vault/03_Components/` | NOT FOUND |
| `open(.*pie_vault` write mode | NOT FOUND (build_pie_vault.py uses shutil.copy2, not open write) |

**Conclusion: No vault generation script exists in the repository.**

---

## Vault Production Provenance

| question | finding |
|----------|---------|
| Script that GENERATED vault from data? | NOT FOUND in repository |
| Script that COPIES vault? | build_pie_vault.py — confirmed copy only |
| First commit of canonical vault files? | c36f4ea — "PIOS 42.x complete" |
| Pre-recovery baseline? | fb8574e — vault files existed before canonical commit |
| Parity check type (41.2) | Byte-level hash equality (different from 41.1 structural check) |

---

## Summary Table

| producer | script | type | produces | structural_data |
|----------|--------|------|----------|-----------------|
| PRODUCER-01 | scripts/pios/41.1/build_semantic_layer.py | GENERATOR (embedded dicts → MD) | 41.1 artifacts (7 files) | YES — DOMAINS, CAPABILITIES, COMPONENTS dicts embedded |
| PRODUCER-02 | scripts/pios/41.2/build_pie_vault.py | COPY | 41.2 vault copy | NO — treats vault as canonical |
| (ORIGINAL 41.2) | UNKNOWN — not in repository | DIRECT_MD_ASSEMBLY | 41.2 vault (148 files) | UNRESOLVED — see structured_representation_evidence.md |
