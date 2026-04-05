# PSEE.F1 — Transitional Assumptions

**Stream:** PSEE.F1
**Family:** PSEE
**Position:** INTERMEDIATE — NON-CANONICAL
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This document catalogs assumptions present in the Phase A manual corpus and early IG framework that are specific to the BlueEdge context rather than generalizable principles. These are transitional assumptions — they enabled the first instantiation of the extraction model but would not hold for arbitrary repositories. Separating them from the generalizable PSEE.0 principles is essential before PSEE.1 is executed against a new corpus.

**Value:** A rule or approach that was appropriate for BlueEdge may fail silently when applied to a new repository if the underlying assumptions are not made explicit. This document makes those assumptions observable.

---

#### METHODOLOGY LAYER

1. For each assumption identified: state the assumed fact, identify where it appears in the Phase A / IG corpus, assess whether it is BlueEdge-specific or generalizable, and state the PSEE.0 treatment.
2. Assumptions are classified: CONTEXT-BOUND (BlueEdge-specific) or GENERALIZABLE (holds for equivalent repository structures).
3. Evidence: phase_a_inventory.md, PSEE.0 rule catalog grounded applications, IG.1B_INPUT_BOUNDARY.md, IG.1B_BASELINE_BINDING.md.

---

#### TECHNICAL LAYER

---

### TA-01 — 3-Archive Extraction Pattern

| Attribute | Value |
|---|---|
| **Assumption ID** | TA-01 |
| **Classification** | CONTEXT-BOUND |
| **Assumed fact** | The source repository was delivered as exactly 3 archives: backend, frontend, platform. The extraction produced exactly 3 directories under extracted/. |
| **Where used** | R-NRM-01 (path collapse): outer extraction container matches the archive root name, producing backend/backend/ and frontend/frontend/ doubling. R-GRP-01 (domain grouping): 3 primary extracted directories map to 3 primary evidence domains (Domains 3, 4, 5). |
| **BlueEdge-specific** | YES — the 3-archive split is a delivery decision for this project. Another repository might have 1 integrated archive, or 7 separate component archives. |
| **Generalizability** | R-NRM-01 is generalizable (path doubling can occur with any archive extracted into a same-named container). R-GRP-01 is generalizable (group by top-level domain regardless of count). The 3-archive assumption is a specific instance, not a structural requirement. |
| **PSEE.0 treatment** | rule_catalog_v0.md R-NRM-01 states: "scan for repeated path segments" (not: "look for /backend/backend/ specifically"). Correctly abstracted. |

---

### TA-02 — NestJS Module File Pattern (63 Modules × 5 File Types)

| Attribute | Value |
|---|---|
| **Assumption ID** | TA-02 |
| **Classification** | CONTEXT-BOUND |
| **Assumed fact** | The backend component uses the NestJS framework, which mandates a specific file-per-module structure: controller, module, service, spec, entity. All 63 domain modules follow this pattern without exception. |
| **Where used** | R-ABS-02 (pattern rows): 63 × 5 = 315 individual file rows are represented as 5 pattern rows. The pattern is {name}.controller.ts, {name}.module.ts, {name}.service.ts, {name}.spec.ts, entities/{name}.entity.ts. |
| **BlueEdge-specific** | YES — NestJS framework choice and 100% pattern adherence across 63 modules are BlueEdge-specific. A new repository using Express (no framework-mandated module structure) or Spring (different file pattern) would require different pattern rows or none at all. |
| **Generalizability** | R-ABS-02 is generalizable: "identify the repeated structural pattern; represent as typed pattern rows." The specific NestJS pattern is a BlueEdge instantiation. |
| **PSEE.0 treatment** | rule_catalog_v0.md R-ABS-02 states: "identify the repeated structural pattern (e.g., NestJS module structure)" — correctly uses NestJS as an example, not as a requirement. |

---

### TA-03 — Docker + Nginx Infrastructure Baseline

| Attribute | Value |
|---|---|
| **Assumption ID** | TA-03 |
| **Classification** | CONTEXT-BOUND |
| **Assumed fact** | Infrastructure root files for backend and frontend include Dockerfile (containerization) and nginx.conf (frontend reverse proxy). These serve as the top-level infrastructure markers for each component's infra sub-group. |
| **Where used** | R-GRP-02 (sub-grouping): the "Infrastructure Artifacts" sub-table for each component is populated by Dockerfile, package.json, and related config files. ECM-U04/U06 (classification): Dockerfile → configuration/structural; nginx.conf → configuration. |
| **BlueEdge-specific** | PARTIALLY — Docker is now near-universal for containerized services, but nginx as the frontend proxy is a specific architectural choice. The specific infra file set (Dockerfile, package.json, .dockerignore, .eslintrc, tsconfig, vite.config, etc.) is BlueEdge-specific. |
| **Generalizability** | R-GRP-02 is generalizable: "identify structural layers: infrastructure root files, source entry points, utility subsystems, domain modules." The specific files are BlueEdge-specific. |
| **PSEE.0 treatment** | rule_catalog_v0.md R-GRP-02 grounded application cites the specific BlueEdge file set; the rule definition uses generic layer names. Correctly separated. |

---

### TA-04 — Platform-Unique: SVG-Agents / HASI Bridge

| Attribute | Value |
|---|---|
| **Assumption ID** | TA-04 |
| **Classification** | CONTEXT-BOUND |
| **Assumed fact** | The platform repository contains a platform-unique component called svg-agents (7 YAML files) + hasi_bridge.py implementing a sensor/IoT bridge architecture specific to BlueEdge's edge computing domain. |
| **Where used** | R-GRP-03 (platform-unique separation): svg-agents is listed as a platform-unique artifact. ECM-U08 (platform-unique classification): YAML files → configuration; hasi_bridge.py → code/Python. |
| **BlueEdge-specific** | YES — svg-agents and HASI are proper nouns specific to the BlueEdge edge/IoT platform. No general repository would have this component. |
| **Generalizability** | R-GRP-03 is generalizable: "separate platform-unique artifacts from embedded components." The principle is: any platform-unique artifact not in standalone archives should be enumerated separately. The specific component names are BlueEdge-specific. |
| **PSEE.0 treatment** | rule_catalog_v0.md R-GRP-03 grounded application names svg-agents explicitly; the rule definition is context-free. Correctly separated. |

---

### TA-05 — Grafana/Prometheus/k6 Observability Stack

| Attribute | Value |
|---|---|
| **Assumption ID** | TA-05 |
| **Classification** | CONTEXT-BOUND |
| **Assumed fact** | The platform contains a monitoring stack (Grafana + Prometheus, 4 JSON/YAML files) and load testing harness (k6, 3 JS files). These are platform-unique and classified accordingly. |
| **Where used** | ECM-U08 (platform-unique classification): monitoring/*.json/yaml → configuration; load-tests/*.js → code/k6. ESI-U05 platform-unique artifact table. |
| **BlueEdge-specific** | PARTIALLY — Grafana/Prometheus and k6 are popular tools but their presence in the platform repository (rather than a separate infra repo) is BlueEdge-specific. The file type classifications (JSON/YAML → configuration, JS → code) are generalizable. |
| **Generalizability** | ECM-U08 classification logic is generalizable: any .json/.yaml in a monitoring/ directory → configuration. The specific tool names are contextual labels only. |
| **PSEE.0 treatment** | Not a separate rule; handled by R-GRP-03 + ECM classification. Correctly treated as a specific grounded application, not a general rule. |

---

### TA-06 — Diff -qr as Overlap Verification Method

| Attribute | Value |
|---|---|
| **Assumption ID** | TA-06 |
| **Classification** | CONTEXT-BOUND (method) / GENERALIZABLE (principle) |
| **Assumed fact** | Overlap between standalone and platform-embedded components was verified using `diff -qr` at the directory level. The result "no differences detected" was used to classify the overlap as PACKAGING_BOUNDARY. |
| **Where used** | R-NRM-02 (overlap declaration): file_level_parity classified based on diff result. source_normalization_log.md DUP-03/DUP-04. |
| **BlueEdge-specific** | The specific diff command is Phase A method. The diff result (identical) is a BlueEdge-specific finding. |
| **Generalizability** | R-NRM-02 states: "check whether a diff was performed and if so, the result" — method-agnostic. The rule handles all cases: diff confirms identical (KNOWN), diff not available (UNKNOWN), diff confirms different (KNOWN DIFFERENT). |
| **PSEE.0 treatment** | CORRECTLY HANDLED: Despite diff returning "no differences," PSEE.0 still declares US-01/02/03 (unknown-space for file-level parity). The diff method did not override the unknown-space preservation principle. TA-06 is a validation of R-NRM-03's independence from R-NRM-02. |

---

### TA-07 — evidence_boundary.md as Mandatory Phase A Artifact

| Attribute | Value |
|---|---|
| **Assumption ID** | TA-07 |
| **Classification** | CONTEXT-BOUND (assumption) / GENERALIZABLE (requirement) |
| **Assumed fact** | An explicit `evidence_boundary.md` document exists and is accessible, declaring primary_evidence_origin_paths, provenance_only_paths, explicitly_excluded_paths, accepted_evidence_classes, and intake_assumptions. |
| **Where used** | R-FLT-01/02/03 (all filtering rules): provenance_only_paths, excluded_paths, and source_materials annotations are read from evidence_boundary.md. psee_v0_execution_spec.md Phase 0 prerequisite: "Evidence boundary document present." |
| **BlueEdge-specific** | The existence and completeness of the BlueEdge evidence_boundary.md is a BlueEdge-specific fact. For a new engagement, this document may not exist. |
| **Generalizability** | PSEE.0 execution spec explicitly addresses this: "If it does not exist, create it before beginning Phase 2." The boundary document is not assumed to exist — it is declared as a Phase 0 prerequisite and a creation requirement if absent. |
| **PSEE.0 treatment** | psee_v0_execution_spec.md Phase 0 check P0-02: "Evidence boundary document present — stop condition: SOURCE_RESOLUTION_FAIL if absent." The assumption is surfaced as an explicit precondition, not hidden. |

---

### TA-08 — 40.2 as the Authoritative Output Layer

| Attribute | Value |
|---|---|
| **Assumption ID** | TA-08 |
| **Classification** | CONTEXT-BOUND |
| **Assumed fact** | The Phase B target is specifically the 40.2 layer (4 artifacts: evidence_surface_inventory, normalized_evidence_map, evidence_classification_map, intake_validation_log). These 4 artifacts are the complete and sole output surface. |
| **Where used** | PSEE.0 reconstruction_validation_report.md — 53 atomic units across 4 artifacts. phase_b_decomposition.md — 4 artifacts defined as Phase B. |
| **BlueEdge-specific** | YES — 40.2 is the PiOS layer designation for evidence intake. A different program management framework might have a different intake layer structure with more or fewer artifact types. |
| **Generalizability** | The principle (produce a structured evidence surface from a raw corpus) is generalizable. The specific 4-artifact structure and their schemas are PiOS-specific. |
| **PSEE.0 treatment** | PSEE.0 execution spec Phase 0 check P0-03: "All required Phase B artifacts present." The 4-artifact target is stated as a Phase 0 input requirement, not as a universal. For a new engagement, the equivalent Phase B target would need to be specified in the stream contract. |

---

### Transitional Assumption Summary

| TA ID | Description | Classification | PSEE.0 Treatment |
|---|---|---|---|
| TA-01 | 3-archive extraction pattern | CONTEXT-BOUND | Correctly abstracted in R-NRM-01 |
| TA-02 | NestJS module pattern (63 × 5) | CONTEXT-BOUND | Correctly instantiated in R-ABS-02 example |
| TA-03 | Docker + nginx infrastructure baseline | PARTIALLY CONTEXT-BOUND | Correctly separated: file types generalizable, names contextual |
| TA-04 | SVG-agents / HASI bridge | CONTEXT-BOUND | Correctly in R-GRP-03 grounded application only |
| TA-05 | Grafana / Prometheus / k6 stack | PARTIALLY CONTEXT-BOUND | Tool names contextual; classification logic generalizable |
| TA-06 | diff -qr overlap verification | CONTEXT-BOUND (method) | Method-agnostic in R-NRM-02; US-01/02/03 preserved regardless |
| TA-07 | evidence_boundary.md exists | CONTEXT-BOUND (assumption) | Surfaced as Phase 0 prerequisite; creation required if absent |
| TA-08 | 40.2 as authoritative output | CONTEXT-BOUND | Stated as Phase 0 input, not a universal |

**Total: 8 transitional assumptions — all surfaced in PSEE.0 rules or execution spec**

---

#### EVIDENCE LAYER

| Assumption | Evidence source |
|---|---|
| TA-01 (3-archive) | PSEE.0/source_normalization_log.md DUP-01/02; IG.1B_BASELINE_BINDING.md primary evidence paths (3 entries) |
| TA-02 (NestJS 63 modules) | PSEE.0/rule_catalog_v0.md R-ABS-02 grounded application; phase_a_inventory.md backend_module_inventory.md |
| TA-03 (Docker/nginx) | PSEE.0/reconstruction_validation_report.md ECM-U04/U06 simulation; IG.1B_INPUT_BOUNDARY.md |
| TA-04 (SVG-agents/HASI) | PSEE.0/rule_catalog_v0.md R-GRP-03 grounded application; phase_a_inventory.md |
| TA-05 (Grafana/k6) | PSEE.0/reconstruction_validation_report.md ECM-U08; phase_a_inventory.md |
| TA-06 (diff -qr) | PSEE.0/source_normalization_log.md evidence chain; PSEE.0/rule_catalog_v0.md R-NRM-02/03 |
| TA-07 (evidence_boundary.md) | IG.1B_INPUT_BOUNDARY.md Section 2.2; PSEE.0/psee_v0_execution_spec.md Phase 0 |
| TA-08 (40.2 target) | PSEE.0/phase_b_decomposition.md; PSEE.0/psee_v0_execution_spec.md Phase 0 check P0-03 |

---

#### LIMITATIONS & BOUNDARIES

- TA-03 and TA-05 are classified "PARTIALLY CONTEXT-BOUND" because the tool names are contextual but the file type classification logic is general. The boundary between these categories is an assessment, not a measured property.
- TA-06 is classified as CONTEXT-BOUND for the diff method but GENERALIZABLE for the principle. PSEE.0 correctly separated these.
- TA-07 and TA-08 are transitional in the sense that they were assumed in the BlueEdge instantiation but explicitly surfaced in PSEE.0 as contingent inputs. They are not encoding errors — they are explicit dependency declarations.

---

#### STATUS

| Check | Result |
|---|---|
| Transitional assumptions identified | 8 (TA-01 through TA-08) |
| All evidence-backed | CONFIRMED |
| PSEE.0 treatment documented for each | CONFIRMED |
| No canonical mutation | CONFIRMED |

**TRANSITIONAL ASSUMPTIONS: COMPLETE — 8 assumptions cataloged; all surfaced in PSEE.0**
