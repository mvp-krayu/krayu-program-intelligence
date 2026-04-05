# PSEE.0 — Reconstruction Validation Report

**Stream:** PSEE.0
**Family:** PSEE
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This report validates the rule system by simulating reconstruction of the 40.2 intake layer from Phase A inputs using the 13 rules in rule_catalog_v0.md. The simulated output is compared against the actual 40.2 artifacts on three dimensions: structural equivalence, entity coverage, and mapping completeness. This is the final quality gate before the PSEE.0 rule system is accepted as a canonical extraction baseline.

**Value:** If the rule system cannot reproduce the 40.2 structure from Phase A, the rules are incomplete or incorrect. This check prevents a defective rule catalog from being promoted to the PSEE engine baseline.

---

#### METHODOLOGY LAYER

1. Apply the 13 rules in execution order from psee_v0_execution_spec.md.
2. For each Phase B artifact, compare the simulated output (what the rules would produce) against the actual artifact (what 40.2 contains).
3. Record match result per artifact: EQUIVALENT | PARTIAL | DIVERGENT.
4. Compute entity coverage (simulated entities / actual entities) and mapping completeness (mapped rules / required rules).
5. Issue overall verdict.

---

#### TECHNICAL LAYER

---

### Reconstruction Simulation: evidence_surface_inventory.md

**Rules applied in order:** R-NRM-01 → R-FLT-01/02/03 → R-GRP-01/02/03

**Simulated output:**

Starting from Phase A:
- R-NRM-01: Collapse `extracted/backend/backend/` (inner path canonical). Collapse frontend/frontend/ same pattern. Confirm standalone ≡ platform (OVL flagged).
- R-FLT-01: `raw/` archives → NOT INGESTED.
- R-FLT-02: `analysis/` files → ACCEPTED-SUPPORT-ONLY.
- R-FLT-03: `docs/reverse_engineering/`, `docs/program-charter/`, `docs/execution-telemetry/`, `docs/signal-layer/`, `docs/case-study/`, `weekly/` → excluded from ingestion.
- R-GRP-01: Form 6 domains: HTML docs (source-v3.23/ root), analysis/ (support), extracted/backend/backend/ (primary), extracted/frontend/frontend/ (primary), platform/blueedge-platform/ (primary), raw/ (NOT INGESTED).
- R-GRP-02: Within Domain 3 (backend): form sub-tables for infrastructure, source root, subsystems, modules (63). Within Domain 4 (frontend): form sub-tables for infra, entry, api, components, pages, contexts, hooks, utils, router, pwa, styles, public, tests, storybook.
- R-GRP-03: Within Domain 5 (platform): separate platform-unique (svg-agents/7 files, monitoring/4 files, load-tests/3 files, CI/CD/2 files) from embedded backend+frontend (reference to Domains 3/4).

**Comparison against actual evidence_surface_inventory.md:**

| Unit | Simulated | Actual | Match |
|---|---|---|---|
| ESI-U01: Domain 1 HTML (path, class, status, 3 files, count=3) | PRODUCED | PRESENT | EQUIVALENT |
| ESI-U02: Domain 2 Analysis (support restriction, 4 files, count=4) | PRODUCED | PRESENT | EQUIVALENT |
| ESI-U03: Domain 3 Backend (infra 7 files, src root 2 files, subsystems 12 patterns, modules 63) | PRODUCED | PRESENT | EQUIVALENT |
| ESI-U04: Domain 4 Frontend (infra 15, src subsystems 20 patterns, ~324 total) | PRODUCED | PRESENT | EQUIVALENT |
| ESI-U05: Domain 5 Platform (platform-unique 18 + embedded 2 references, ~741 total) | PRODUCED | PRESENT | EQUIVALENT |
| ESI-U06: Domain 6 Raw archives (3 files, NOT INGESTED, sizes) | PRODUCED | PRESENT | EQUIVALENT |
| ESI-U07: Summary table | PRODUCED by aggregation | PRESENT | EQUIVALENT |
| ESI-U08: Overlap observation | PRODUCED by R-NRM-02 signal | PRESENT | EQUIVALENT |
| ESI-U09: Prohibited path compliance | PRODUCED by R-FLT-03 | PRESENT | EQUIVALENT |
| ESI-U10: Status block | PRODUCED | PRESENT | EQUIVALENT |

**ESI structural match: 10/10 = 100% EQUIVALENT**

---

### Reconstruction Simulation: normalized_evidence_map.md

**Additional rules applied:** R-ABS-01, R-ABS-02, R-NRM-02, R-NRM-03, R-NAM-01, R-NAM-02

**Simulated output:**

- R-ABS-01 applied to all 6 domain outputs → 10 CEU entities (CEU-01 through CEU-10: HTML docs ×3, analysis ×4, source trees ×3).
- R-FLT-01 output → 3 additional CEU entities (CEU-11/12/13: NOT INGESTED archives).
- R-NAM-01: order by priority tier → Documentation (CEU-01/02/03), Analysis (CEU-04/05/06/07), Source trees (CEU-08/09/10), Archives (CEU-11/12/13). Total: 13 CEUs.
- R-ABS-02 + R-NAM-02: CEU-08 → 10 sub-units (INFRA, SQL, SRC-ROOT, COMMON, CONFIG, EVENTS, GATEWAYS, HEALTH, MIGRATIONS, MODULES). CEU-09 → 14 sub-units. CEU-10 → 7 sub-units.
- R-NRM-02: OVL-01 (backend standalone vs platform), OVL-02 (frontend standalone vs platform). Canonical preferences assigned.
- R-NRM-03: US-01 (backend parity), US-02 (frontend parity), US-03 (platform content completeness).

**Comparison against actual normalized_evidence_map.md:**

| Unit | Simulated | Actual | Match |
|---|---|---|---|
| NEM-U01 to NEM-U13: 13 CEU records with all required fields | PRODUCED | PRESENT | EQUIVALENT |
| NEM-U14/U15: OVL-01 and OVL-02 with correct unit references | PRODUCED | PRESENT | EQUIVALENT |
| NEM-U16/U17/U18: US-01/02/03 | PRODUCED | PRESENT | EQUIVALENT |
| NEM-U19: Evidence priority hierarchy | PRODUCED by priority-tier rule | PRESENT | EQUIVALENT |
| NEM-U20: CEU summary table | PRODUCED by aggregation | PRESENT | EQUIVALENT |

**NEM structural match: 20/20 = 100% EQUIVALENT**

---

### Reconstruction Simulation: evidence_classification_map.md

**Rules applied:** R-GRP-01/02/03 outputs + accepted_evidence_classes from boundary + R-ABS-02 pattern abstraction

**Simulated output:**

- R-NRM-01 boundary: accepted_evidence_classes = [documentation, code, configuration, structural artifact, interface artifact, extraction metadata].
- For each domain group and sub-unit: assign class and subclass by file type and functional role.
- ECM-U02 (HTML docs): documentation, subclass = system architecture / competitive intelligence / PMO dashboard, priority = PRIMARY.
- ECM-U03 (Analysis): extraction metadata, support-only annotation, priority = SUPPORT ONLY.
- ECM-U04 (Backend infra): Dockerfile → configuration/structural; package.json → structural; *.sql → code (DDL + seed). Priority = PRIMARY.
- ECM-U05 (Backend src): pattern rows — controller.ts → REST API controller; module.ts → NestJS module; service.ts → business logic; spec.ts → unit test; entity.ts → TypeORM entity.
- ECM-U06 (Frontend infra): Dockerfile → configuration/structural; nginx.conf → configuration; tsconfig/vite/postcss/tailwind → configuration; index.html → interface artifact.
- ECM-U07 (Frontend src): api/*.ts → code/REST API client; components/*.tsx → code/UI components; pages/*.tsx → code/page components; styles/*.css → interface artifact.
- ECM-U08 (Platform-unique): svg-agents *.yaml → configuration; hasi_bridge.py → code/Python; monitoring *.json/yaml → configuration; load-tests *.js → code/k6.
- ECM-U09 (Platform embedded): OVERLAP-NOTED, canonical reference to ECM-U04/U05/U06/U07.
- ECM-U10 (Raw archives): provenance only, NOT INGESTED.

**Comparison against actual evidence_classification_map.md:**

| Unit | Simulated | Actual | Match |
|---|---|---|---|
| ECM-U01: Classification basis (6 classes) | PRODUCED from boundary | PRESENT | EQUIVALENT |
| ECM-U02: HTML docs table (3 rows, correct class/subclass/priority) | PRODUCED | PRESENT | EQUIVALENT |
| ECM-U03: Analysis table (4 rows, support-only annotation) | PRODUCED | PRESENT | EQUIVALENT |
| ECM-U04: Backend infra table (7 rows, correct type assignments) | PRODUCED | PRESENT | EQUIVALENT |
| ECM-U05: Backend src patterns (14 pattern rows) | PRODUCED | PRESENT | EQUIVALENT |
| ECM-U06: Frontend infra table (15 rows) | PRODUCED | PRESENT | EQUIVALENT |
| ECM-U07: Frontend src patterns (19 pattern rows) | PRODUCED | PRESENT | EQUIVALENT |
| ECM-U08: Platform-unique table (18 rows) | PRODUCED | PRESENT | EQUIVALENT |
| ECM-U09: Overlap zone (2 rows, OVERLAP-NOTED) | PRODUCED | PRESENT | EQUIVALENT |
| ECM-U10: Raw archives (3 rows, NOT INGESTED) | PRODUCED | PRESENT | EQUIVALENT |
| ECM-U11/12: Summary table + status block | PRODUCED | PRESENT | EQUIVALENT |

**ECM structural match: 12/12 = 100% EQUIVALENT**

---

### Reconstruction Simulation: intake_validation_log.md

**Rules applied:** Derived from evidence_boundary.md fields (primary_paths, provenance_paths, excluded_paths, accepted_types, intake_assumptions, completeness_position) + R-NRM-03

**Simulated output:**

8 validation checks derived directly from evidence_boundary.md sections:
- Check 1: origin root existence → verify source root path accessible → PASS
- Check 2: primary path availability → verify all primary_evidence_origin_paths present → PASS (all 7 paths confirmed)
- Check 3: provenance handling → verify archives NOT INGESTED, existence confirmed → PASS
- Check 4: excluded paths → verify explicitly_excluded_paths NOT ACCESSED → PASS (6 paths)
- Check 5: file type compliance → match ingested extensions against explicit_inclusions; non-listed types assessed against accepted_evidence_classes → PASS (.sql as code, .css as interface, .cjs as configuration)
- Check 6: intake assumptions → verify each assumption in evidence_boundary.md honored → PASS (6 assumptions)
- Check 7: completeness position → acknowledge unknown-space positions declared in boundary → PASS with US-01/02/03 preserved
- Check 8: no inferred evidence → confirm all 13 CEUs are observed, not synthesized → PASS

**Comparison against actual intake_validation_log.md:**

| Unit | Simulated | Actual | Match |
|---|---|---|---|
| IVL-U01 through IVL-U08: 8 checks with correct findings and PASS verdict | PRODUCED | PRESENT — all 8 PASS | EQUIVALENT |
| IVL-U09: Validation summary table (8×3) | PRODUCED | PRESENT | EQUIVALENT |
| IVL-U10: Completeness statement with US-01/02/03 | PRODUCED | PRESENT | EQUIVALENT |
| IVL-U11: Status block | PRODUCED | PRESENT | EQUIVALENT |

**IVL structural match: 11/11 = 100% EQUIVALENT**

---

### Reconstruction Validation Summary

| Artifact | Phase B units | Simulated | Structural match | Coverage |
|---|---|---|---|---|
| evidence_surface_inventory.md | 10 | 10 | EQUIVALENT | 100% |
| normalized_evidence_map.md | 20 | 20 | EQUIVALENT | 100% |
| evidence_classification_map.md | 12 | 12 | EQUIVALENT | 100% |
| intake_validation_log.md | 11 | 11 | EQUIVALENT | 100% |
| **Total** | **53** | **53** | **EQUIVALENT** | **100%** |

**Mapping completeness:** 13/13 rules applied. All 13 rules produced output traceable to actual Phase B units.

**Entity coverage:** 53/53 Phase B entities reproduced by simulation.

**Overall reconstruction verdict:** PASS

---

### Rule-to-Output Traceability

| Rule | Produced Phase B units |
|---|---|
| R-NRM-01 | Canonical paths in all CEU records; NEM-U08/09/10 inner paths |
| R-FLT-01 | ESI-U06, NEM-U11/12/13, IVL-U03 |
| R-FLT-02 | ESI-U02, NEM-U04/05/06/07, ECM-U03, IVL-U06 |
| R-FLT-03 | ESI-U09, IVL-U04 |
| R-GRP-01 | ESI-U01/02/03/04/05/06, NEM structure |
| R-GRP-02 | ESI-U03/04 sub-tables, NEM-U08/09 sub-units |
| R-GRP-03 | ESI-U05 platform split, NEM-U10 sub-units |
| R-ABS-01 | NEM-U01 through NEM-U10 |
| R-ABS-02 | ECM-U05/07 pattern rows, CEU-08/09/10 sub-unit patterns |
| R-NRM-02 | NEM-U14/15 (OVL-01/02) |
| R-NRM-03 | NEM-U16/17/18 (US-01/02/03), IVL-U07/08 |
| R-NAM-01 | CEU-NN identifiers across all NEM entities |
| R-NAM-02 | CEU-NN-ROLE sub-unit identifiers |

---

#### EVIDENCE LAYER

All simulation steps above are derived from Phase A evidence (analysis/ files + evidence_boundary.md + direct source tree structure) and produce outputs that match the actual Phase B artifacts as read in full during this stream. No simulated entity required inference beyond the documented rules.

---

#### LIMITATIONS & BOUNDARIES

- This reconstruction is a logical simulation — it demonstrates that the rules are sufficient to produce the Phase B structure from Phase A inputs. It does not guarantee that an automated execution would produce byte-identical output files (formatting, ordering of table rows may differ).
- The 100% coverage result is specific to the BlueEdge v3.23.0 instantiation. When applied to a new repository, coverage will depend on the new repository's structural similarity to the BlueEdge corpus. The minimum threshold (90%) allows for minor variations.
- Three unknown-space positions (US-01/02/03) remain unresolved in the actual 40.2 artifacts. The rule system correctly replicates this unresolved state — it does not produce false resolution.

---

#### REUSABILITY STATEMENT

To validate the rule system for a new repository:
1. Produce the simulated output by applying all 13 rules in execution order to the new Phase A corpus.
2. Compare the simulated evidence_surface_inventory, normalized_evidence_map, evidence_classification_map, and intake_validation_log against the actual 40.2 artifacts produced for the new repository.
3. Compute coverage: (matched units) / (total Phase B units) × 100.
4. If coverage ≥ 90%: PASS. If below 90%: identify unmapped units and extend the rule catalog before promoting.
5. Record any new rule types required for the new repository — these become PSEE.1+ candidates.

---

#### STATUS

| Check | Result |
|---|---|
| Structural equivalence — ESI | EQUIVALENT (10/10) |
| Structural equivalence — NEM | EQUIVALENT (20/20) |
| Structural equivalence — ECM | EQUIVALENT (12/12) |
| Structural equivalence — IVL | EQUIVALENT (11/11) |
| Entity coverage | 100% (53/53) |
| Mapping completeness | 100% (13/13 rules) |
| Unknown-space preserved | CONFIRMED (US-01/02/03 replicated) |
| Implicit reasoning used | NONE |

**RECONSTRUCTION VERDICT: PASS — 100% structural equivalence, 100% entity coverage**
