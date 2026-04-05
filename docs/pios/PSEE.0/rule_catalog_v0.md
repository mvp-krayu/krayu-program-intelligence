# PSEE.0 — Rule Catalog v0

**Stream:** PSEE.0
**Family:** PSEE
**Catalog version:** v0
**Date:** 2026-04-05

---

#### EXECUTIVE LAYER

This catalog formalizes the explicit transformation rules that convert Phase A evidence (BlueEdge source corpus + analysis MDs) into Phase B structured intake (40.2). Each rule is typed, dual-anchored (theoretical basis + grounded application), and assigned a unique rule_id. Together, these rules constitute the first instantiation of the PSEE extraction engine.

**Value:** A client or analyst using this catalog can reproduce the 40.2 intake structure from any equivalent source corpus without relying on tacit knowledge. The rules are auditable, named, and directly traceable to Phase A evidence.

---

#### METHODOLOGY LAYER

Rule derivation process:
1. For each transformation type identified in transformation_mapping.md (ABSTRACTION, GROUPING, FILTER, NORMALIZATION, MERGE, NAMING), extract the generalizable input-output pattern.
2. State each rule with: rule_id | input pattern | transformation logic | output structure | evidence references | theoretical basis | grounded application.
3. Group rules by type: R-GRP (grouping) | R-FLT (filtering) | R-NRM (normalization) | R-ABS (abstraction) | R-NAM (naming).
4. Order rules by execution dependency (earlier rules feed later ones).

---

## RULE CATALOG

---

### R-GRP — Grouping Rules

---

#### R-GRP-01: Group evidence by top-level source domain

```
rule_id:            R-GRP-01
version:            v0
rule_type:          R-GRP (grouping)

input_pattern:
  A set of evidence files reachable under a declared evidence root,
  where each file belongs to exactly one top-level source directory
  (e.g., /analysis/, /extracted/backend/, /extracted/frontend/).

transformation_logic:
  1. Enumerate the top-level directories immediately under the evidence root.
  2. For each directory that contains ingested evidence, create one Domain record.
  3. Assign a sequential Domain N label.
  4. Populate the domain with: path, evidence class (most specific class applicable
     to files in the directory), intake status, and file enumeration.
  5. If a directory's files span multiple evidence classes, record the union
     (e.g., "code / configuration / structural artifact").

output_structure:
  Evidence Domain N
    path: <top-level directory path>
    evidence_class: <class or class1 / class2>
    intake_status: <ACCEPTED | ACCEPTED-SUPPORT-ONLY | NOT-INGESTED>
    [file table or sub-tables]
    file_count: <N>

evidence_references:
  - analysis/02_top_level_component_inventory.md (component labels)
  - evidence_boundary.md (primary_evidence_origin_paths)
  - ESI-U01 through ESI-U06 in Phase B
```

**THEORETICAL BASIS:**
Domain grouping reflects the evidence boundary design principle: evidence is managed at the source-directory level, not the individual-file level. Each directory represents a distinct evidence provenance (archive origin, extraction type, or access restriction). Grouping by provenance is the correct first-order structural decomposition for intake management.

**GROUNDED APPLICATION:**
`analysis/02_top_level_component_inventory.md` enumerates 6 components (backend, frontend, svg-agents, monitoring, load-tests, .github). `analysis/00_extraction_log.md` declares 3 extraction paths (extracted/backend, extracted/frontend, extracted/platform). These directly produce the 6 domains in `evidence_surface_inventory.md` (HTML docs → Domain 1, analysis/ → Domain 2, extracted/backend/backend/ → Domain 3, extracted/frontend/frontend/ → Domain 4, platform/ → Domain 5, raw/ → Domain 6).

---

#### R-GRP-02: Group within-component files by architectural sub-unit

```
rule_id:            R-GRP-02
version:            v0
rule_type:          R-GRP (grouping)

input_pattern:
  A large source directory (e.g., backend/src/) containing files
  organized by functional role (infrastructure vs. business modules).

transformation_logic:
  1. Within each domain, identify natural sub-groupings by directory structure
     (e.g., src/common/, src/modules/, infrastructure files at root).
  2. Create typed sub-tables: one per functional group.
  3. For repeated structural patterns (e.g., 63 module directories each
     following the same file pattern), represent as a single pattern row
     with count, not 63 individual rows.
  4. Label sub-groups by architectural role: Infrastructure, Source Root,
     Sub-systems, Domain Modules.

output_structure:
  Within Domain record:
    ### <Sub-group name>
    | File/Pattern | Type |
    Total file count: <N>

evidence_references:
  - analysis/02_top_level_component_inventory.md (backend/frontend component descriptions)
  - Direct source tree structure (extracted/backend/backend/src/ directory layout)
  - ESI-U03/U04 and NEM-U08/U09 in Phase B
```

**THEORETICAL BASIS:**
Large monorepos have multiple layers of structural organization: repository root (infra), application root (entry points), subsystem directories (utilities, common code), and domain modules (business logic). Grouping by these layers within a domain makes the intake structure navigable and prevents flat-list overflow that obscures architectural shape.

**GROUNDED APPLICATION:**
The backend source in `extracted/backend/backend/` has: root-level infrastructure (Dockerfile, package.json), src/main.ts (entry point), src/common/ (shared utilities), src/config/, src/events/, src/gateways/, src/health/, src/migrations/, and src/modules/ (63 business domain modules). This 4-level structure is directly reflected in `evidence_surface_inventory.md` Domain 3 sub-tables (Infrastructure Artifacts, Source Root, Source Subsystems, Domain Modules).

---

#### R-GRP-03: Group platform components by platform-unique vs embedded

```
rule_id:            R-GRP-03
version:            v0
rule_type:          R-GRP (grouping)

input_pattern:
  An integrated platform repository containing some components that
  are duplicated from standalone archives AND some that exist only
  in the integrated context.

transformation_logic:
  1. Separate platform-unique artifacts from embedded (duplicated) components.
  2. For embedded components, reference their overlap declaration (OVL-NN)
     rather than re-enumerating them.
  3. Document platform-unique artifacts with full file-by-file enumeration.
  4. Record total file count including embedded components.

output_structure:
  Domain record with:
  - Platform Root Artifacts (platform-unique metadata files)
  - Platform Backend (embedded, referenced to standalone domain)
  - Platform Frontend (embedded, referenced to standalone domain)
  - Platform-unique artifact tables (svg-agents, monitoring, load-tests, CI/CD)

evidence_references:
  - analysis/02_top_level_component_inventory.md (top-level structure)
  - analysis/03_overlap_validation.md (overlap classification)
  - ESI-U05 in Phase B
```

**THEORETICAL BASIS:**
Platform monorepos that include standalone component copies create a structural ambiguity: are the embedded components independent or identical copies? The correct intake design separates the question of "what files exist" (enumeration) from "what is the canonical source" (normalization). Platform-unique artifacts must be separately documented because they have no standalone equivalent.

**GROUNDED APPLICATION:**
`blueedge-platform/` contains backend/ and frontend/ (shown identical to standalones by `analysis/03_overlap_validation.md`) PLUS platform-unique: svg-agents/ (sensor/HASI bridge), monitoring/ (Grafana/Prometheus), load-tests/ (k6). These unique artifacts are explicitly tabulated in `evidence_surface_inventory.md` Domain 5 "Platform-Unique Artifacts" section (18 files). The embedded components are noted as OVERLAP-NOTED rather than re-enumerated.

---

### R-FLT — Filtering Rules

---

#### R-FLT-01: Exclude provenance-only archives from ingestion

```
rule_id:            R-FLT-01
version:            v0
rule_type:          R-FLT (filtering)

input_pattern:
  Source archives (tar, zip, etc.) present in the evidence corpus
  that were the origin of extracted source trees.

transformation_logic:
  1. Identify archives in the provenance_only_paths list (or by inference
     from an extraction log that documents their role).
  2. Verify archive existence (size check, not content inspection).
  3. Set intake_status = NOT INGESTED.
  4. Record: canonical_path, size, purpose (provenance reference).
  5. Do NOT create sub-units or classify archive content.

output_structure:
  CEU record with intake_status: NOT INGESTED + size + purpose
  OR Domain record with intake_status: EXISTENCE CONFIRMED — NOT INGESTED

evidence_references:
  - evidence_boundary.md provenance_only_paths
  - analysis/00_extraction_log.md (archive names and location)
  - ESI-U06, CEU-11/12/13 in Phase B
```

**THEORETICAL BASIS:**
Extracted source trees are the primary evidence surface; their originating archives are provenance artifacts, not evidence. Including archive content directly would be redundant with the extracted trees and introduce binary content (tar headers, etc.) that has no analytical value. Existence confirmation without ingestion is the correct treatment for provenance-reference materials.

**GROUNDED APPLICATION:**
`evidence_boundary.md` declares: `raw/blueedge-backend-v3_23_0-COMPLETE.tar`, `raw/blueedge-frontend-v3_23_0-COMPLETE.tar`, `raw/blueedge-platform-v3_23_0-COMPLETE.tar` as provenance_only_paths. `analysis/00_extraction_log.md` confirms "Location of raw archives: .../source-v3.23/raw". In `normalized_evidence_map.md`, these become CEU-11/12/13 with intake_status=NOT INGESTED and size recorded (1.8 MB, 2.4 MB, 4.3 MB).

---

#### R-FLT-02: Downgrade extraction analysis files to support-only authority

```
rule_id:            R-FLT-02
version:            v0
rule_type:          R-FLT (filtering)

input_pattern:
  Analysis or metadata files produced during the source extraction
  process (e.g., extraction logs, classification notes, overlap
  validation reports) that were not part of the original repository.

transformation_logic:
  1. Identify files as extraction-generated (not from the source codebase itself).
  2. Accept their presence as supporting context evidence.
  3. Apply a restriction annotation: "support evidence only; not analytical conclusion."
  4. Exclude from primary evidence count.
  5. Document what these files ARE (extraction metadata) vs. what they are NOT
     (analytical conclusions, primary code evidence).

output_structure:
  Domain record with:
    intake_status: ACCEPTED AS EXTRACTION-SUPPORT EVIDENCE ONLY
    restriction: <reason — e.g., "Content may inform extraction context
                  but does not constitute primary evidence.">
  CEU record with:
    intake_status: ACCEPTED — support evidence only
    authority: extraction context only; not analytical conclusion

evidence_references:
  - evidence_boundary.md source_materials field ("lightweight extraction analysis notes")
  - analysis/ directory files (00 through 03)
  - ESI-U02, CEU-04 through CEU-07 in Phase B
```

**THEORETICAL BASIS:**
Extraction process artifacts are epistemically different from raw source evidence. They represent an analyst's initial classification pass, not the underlying system facts. Using them as primary evidence would introduce circular reasoning — the intake structure would partly reflect the extractor's initial framing rather than the source system's actual structure.

**GROUNDED APPLICATION:**
`evidence_boundary.md` lists `source-v3.23/analysis/` in primary_evidence_origin_paths but the source_materials field notes "lightweight extraction analysis notes" — signaling reduced authority. The 4 analysis/ files in `evidence_surface_inventory.md` Domain 2 carry the restriction: "Accepted only as extraction-support evidence per evidence_boundary.md. Not treated as analytical conclusions."

---

#### R-FLT-03: Apply boundary exclusion list to prior analytical outputs

```
rule_id:            R-FLT-03
version:            v0
rule_type:          R-FLT (filtering)

input_pattern:
  A corpus containing documents that were produced as outputs of
  prior analytical work (reverse engineering, signal analysis,
  case studies) rather than as direct source evidence.

transformation_logic:
  1. Identify paths explicitly listed in evidence_boundary.md
     explicitly_excluded_paths.
  2. Record each excluded path with NOT ACCESSED status.
  3. Do not read or classify excluded file content.
  4. Include an explicit compliance record in the intake validation log.

output_structure:
  In evidence_surface_inventory.md:
    Prohibited Path Compliance section:
      | Excluded Path | Accessed |
      | ...           | NOT ACCESSED |
  In intake_validation_log.md Check 4:
    Findings: confirmed NOT ACCESSED for each path

evidence_references:
  - evidence_boundary.md explicitly_excluded_paths
  - ESI-U09, IVL-U04 in Phase B
```

**THEORETICAL BASIS:**
Prior analytical outputs represent derived knowledge, not raw evidence. Ingesting them would conflate the "what exists in the source" question with the "what was previously concluded about the source" question, undermining the clean evidence boundary needed for reproducible intake.

**GROUNDED APPLICATION:**
`evidence_boundary.md` explicitly excludes: `docs/reverse_engineering/`, `docs/program-charter/`, `docs/execution-telemetry/`, `docs/signal-layer/`, `docs/case-study/`, `weekly/`. These 83 MD files (from phase_a_inventory.md) were excluded from 40.2 intake. `intake_validation_log.md` Check 4 confirms: each path — NOT ACCESSED.

---

### R-NRM — Normalization Rules

---

#### R-NRM-01: Classify and collapse packaging boundary path duplication

```
rule_id:            R-NRM-01
version:            v0
rule_type:          R-NRM (normalization)

input_pattern:
  A file path where the same directory name appears in immediate
  succession (e.g., .../extracted/backend/backend/), caused by
  tar archive extraction into a same-named container directory.

transformation_logic:
  1. Detect repeated path segment.
  2. Retrieve extraction log evidence for the archive root directory name.
  3. Classify: if the outer directory is an extraction container and the
     inner directory is the archive root, classify as PACKAGING_BOUNDARY.
  4. Declare the inner path as canonical.
  5. Do NOT treat the outer directory as a distinct system layer.

output_structure:
  In all references: use the canonical inner path.
  In normalization log: document the collapse with evidence citation.

evidence_references:
  - analysis/00_extraction_log.md (extraction structure)
  - analysis/01_repository_classification.md (root folder confirmation)
  - analysis/03_overlap_validation.md (diff path usage)
  - source_normalization_log.md DUP-01/DUP-02 in this stream
```

**THEORETICAL BASIS:**
Extraction tools preserve archive directory structure inside the extraction target directory. This produces systematic path duplication that reflects the extraction process, not the underlying repository topology. Treating this as architectural layering would misrepresent the system structure and inflate component counts.

**GROUNDED APPLICATION:**
`analysis/00_extraction_log.md`: "Archives were extracted into isolated folders: extracted/backend, extracted/frontend, extracted/platform." `analysis/01_repository_classification.md`: "Root folder: backend/ — Confidence: High." This confirms `extracted/backend/backend/` is a packaging artifact. `analysis/03_overlap_validation.md` uses `diff -qr extracted/backend/backend` (inner path) — confirming that the inner path is the canonical reference. In `normalized_evidence_map.md`, CEU-08 canonical_path = `source-v3.23/extracted/backend/backend/` (inner path used directly).

---

#### R-NRM-02: Declare overlap pairs with canonical preference, preserve unknown-space

```
rule_id:            R-NRM-02
version:            v0
rule_type:          R-NRM (normalization)

input_pattern:
  Two or more evidence sources with observed structural similarity
  (same directory organization, same module names) that may represent
  the same underlying content from different extraction contexts.

transformation_logic:
  1. Confirm whether file-level diff was performed (and if so, the result).
  2. If diff confirms identical: create OVL record with
     file_level_parity = KNOWN + resolution_status = RESOLVED.
  3. If diff result was structural only (not file-by-file): create OVL record
     with file_level_parity = UNKNOWN + resolution_status = UNRESOLVED.
  4. In either case, assign canonical preference:
     - standalone = canonical for isolated module-level evidence
     - integrated = canonical for system-context evidence
  5. Note pipeline impact for downstream consumers.

output_structure:
  OVL-NN record with:
    overlap_id, unit_a, unit_b, observed_similarity,
    file_level_parity (KNOWN|UNKNOWN), canonical preferences,
    resolution_status, pipeline_impact

evidence_references:
  - analysis/03_overlap_validation.md
  - NEM-U14/U15 in Phase B
```

**THEORETICAL BASIS:**
Overlap between standalone and integrated components is a common pattern in platform repositories. The correct intake design is to declare the overlap explicitly rather than silently eliminating one source or double-counting them. Assigning canonical preference by context (isolated vs. integrated) prevents ambiguity without forcing premature resolution of structural unknowns.

**GROUNDED APPLICATION:**
`analysis/03_overlap_validation.md` ran `diff -qr extracted/backend/backend extracted/platform/blueedge-platform/backend` and found "No differences detected." Despite this, `normalized_evidence_map.md` declares OVL-01 with `file_level_parity: UNKNOWN` because the diff compared directory structure, not guaranteed byte-level identity. Canonical preference: CEU-08 (standalone) for isolated, CEU-10-BACKEND (platform) for integrated context.

---

#### R-NRM-03: Preserve unknown-space — no inference from absence of evidence

```
rule_id:            R-NRM-03
version:            v0
rule_type:          R-NRM (normalization)

input_pattern:
  Any position in the intake where information is absent but could
  theoretically be inferred (e.g., whether two structurally similar
  components are byte-for-byte identical; whether a platform repository
  contains files beyond its standalone equivalent).

transformation_logic:
  1. Identify the specific unknown position.
  2. Assign a US-NN identifier.
  3. State the unknown position explicitly: what is not known and why.
  4. Do NOT synthesize or infer the unknown position.
  5. Document the pipeline impact: which downstream decisions require
     resolution of this unknown.

output_structure:
  US-NN record:
    | US-ID | Description |
  Referenced in: OVL records, intake_validation_log completeness statement

evidence_references:
  - NEM-U16/U17/U18 in Phase B
  - IVL-U07 completeness position
```

**THEORETICAL BASIS:**
Evidence-first intake methodology requires explicit epistemological boundaries. Recording unknown-space positions maintains the integrity of the downstream evidence chain — downstream consumers know exactly where they are operating on incomplete information rather than falsely assuming completeness.

**GROUNDED APPLICATION:**
Despite `diff -qr` showing no differences, the 40.2 `normalized_evidence_map.md` declares: US-01 (backend parity unknown), US-02 (frontend parity unknown), US-03 (whether platform contains files beyond standalone is unknown). The intake_validation_log Check 7 states: "completeness unknown until 40.2 intake validation... unknown-space must be preserved." Three US records formalize this without inferring equivalence.

---

### R-ABS — Abstraction Rules

---

#### R-ABS-01: Abstract collections of files into named canonical evidence units

```
rule_id:            R-ABS-01
version:            v0
rule_type:          R-ABS (abstraction)

input_pattern:
  A set of files in a source directory that collectively represent
  one logical evidence source (e.g., a complete extracted repository
  comprising hundreds of files).

transformation_logic:
  1. Assign a single canonical_id (CEU-NN) to the collection.
  2. Record the canonical_path as the directory root.
  3. Characterize the scope (file count, technology, role).
  4. Internal structure may be represented as sub-units (R-ABS-02)
     but the collection is treated as one entity in the CEU index.

output_structure:
  CEU-NN record:
    canonical_id: CEU-NN
    canonical_path: <directory root>
    evidence_class: <class(es)>
    scope: <N files; technology; role>
    intake_status: ACCEPTED

evidence_references:
  - NEM-U01 through NEM-U10 in Phase B
  - analysis/01_repository_classification.md (canonical target identification)
```

**THEORETICAL BASIS:**
A collection of files that share a common evidence provenance (same extraction origin, same repository, same access authority) should be treated as one evidence unit at the intake level. This prevents the intake index from becoming an unwieldy file-level list while maintaining traceable granularity through sub-units.

**GROUNDED APPLICATION:**
The 397-file backend source tree (`extracted/backend/backend/`) is abstracted into CEU-08 with `scope: 397 files; 63 domain modules; NestJS/TypeScript`. The 324-file frontend becomes CEU-09. The 741-file platform becomes CEU-10. This reduces 1,462 individual file entries to 3 CEU entities in the NEM index, each with scope metadata.

---

#### R-ABS-02: Represent repeated structural patterns as typed pattern rows

```
rule_id:            R-ABS-02
version:            v0
rule_type:          R-ABS (abstraction)

input_pattern:
  A large source directory where many files follow the same structural
  pattern (e.g., N domain modules each containing controller, module,
  service, spec, and entity files).

transformation_logic:
  1. Identify the repeated structural pattern (e.g., NestJS module structure).
  2. Create one classification row per file role using a pattern template
     (e.g., "src/modules/{name}/{name}.controller.ts").
  3. Record the count of instances (N = 63 for backend modules).
  4. Do NOT create one row per instance.

output_structure:
  Within CEU sub-unit table or classification table:
  | src/modules/{name}/{name}.controller.ts | backend modules | code | REST API controller | PRIMARY |
  [one row per pattern, not one row per module]

evidence_references:
  - analysis/02_top_level_component_inventory.md (Domain Modules: 63 total)
  - ECM-U05/U07 in Phase B
  - CEU-08-MODULES sub-unit
```

**THEORETICAL BASIS:**
Domain modules in NestJS and similar frameworks follow rigidly defined file patterns per module. Enumerating each module individually would produce 315 rows (63 modules × 5 file types) with no additional information over 5 pattern rows plus a count. The abstraction preserves structural completeness while ensuring navigability.

**GROUNDED APPLICATION:**
The 63 backend modules (auth, billing, fleet, vehicles, etc.) each follow the pattern: `{name}.controller.ts`, `{name}.module.ts`, `{name}.service.ts`, `{name}.spec.ts`, `entities/*.entity.ts`. In `evidence_classification_map.md` ECM-U05, these are represented as 5 pattern rows: "{name}.controller.ts → REST API controller", "{name}.module.ts → NestJS module definition", etc. In `normalized_evidence_map.md`, CEU-08 sub-unit CEU-08-MODULES covers all 63 modules as one sub-unit with pattern documentation.

---

### R-NAM — Naming Rules

---

#### R-NAM-01: Assign CEU identifiers sequentially by evidence priority tier

```
rule_id:            R-NAM-01
version:            v0
rule_type:          R-NAM (naming)

input_pattern:
  A set of canonical evidence units requiring unique, stable identifiers
  across multiple artifacts.

transformation_logic:
  1. Order units by evidence priority tier:
     - Tier 1: Documentation (HTML, README) → CEU-01 to CEU-03
     - Tier 2: Extraction metadata (analysis/ files) → CEU-04 to CEU-07
     - Tier 3: Primary source trees → CEU-08 to CEU-10
     - Tier 4: Provenance-only → CEU-11 to CEU-13
  2. Within each tier, assign sequential integers.
  3. CEU-NN identifiers are stable across all 40.2 artifacts — cross-reference
     from ESI, ECM, and IVL back to NEM uses the same identifier.

output_structure:
  CEU-NN (two-digit, zero-padded)

evidence_references:
  - NEM-U01 through NEM-U13 in Phase B
  - Evidence Priority Hierarchy table (NEM-U19)
```

**THEORETICAL BASIS:**
Canonical identifiers that reflect priority ordering make the intake model readable to anyone familiar with the evidence tier structure — higher-priority evidence has lower numerical IDs. This is a navigability convention that also serves as an implicit priority declaration at the point of reference.

**GROUNDED APPLICATION:**
`normalized_evidence_map.md` CEU ordering: CEU-01/02/03 = HTML documentation (highest non-code priority), CEU-04/05/06/07 = extraction analysis (support-only), CEU-08/09/10 = source trees (highest priority), CEU-11/12/13 = raw archives (not ingested). The Evidence Priority Hierarchy table (§6 of NEM) makes this ordering explicit: "1. Extracted source trees — HIGHEST; 2. HTML documentation — PRIMARY; 3. Extraction analysis — SUPPORT ONLY; 4. Raw archives — PROVENANCE ONLY."

---

#### R-NAM-02: Name CEU sub-units with parent ID and functional role suffix

```
rule_id:            R-NAM-02
version:            v0
rule_type:          R-NAM (naming)

input_pattern:
  A large CEU containing multiple functionally distinct sub-components
  that need individually referenceable identifiers.

transformation_logic:
  1. Prefix the sub-unit ID with the parent CEU ID.
  2. Append a short uppercase functional role label.
  3. Labels should reflect architectural roles, not file types.
  4. Apply consistently across all CEUs with sub-units.

output_structure:
  <CEU-ID>-<ROLE>  e.g.:
    CEU-08-INFRA, CEU-08-SQL, CEU-08-SRC-ROOT,
    CEU-08-COMMON, CEU-08-CONFIG, CEU-08-EVENTS,
    CEU-08-GATEWAYS, CEU-08-HEALTH, CEU-08-MIGRATIONS, CEU-08-MODULES

evidence_references:
  - NEM-U08/U09/U10 in Phase B
```

**THEORETICAL BASIS:**
Parent-prefixed sub-unit identifiers maintain hierarchical traceability — any reference to CEU-08-MODULES is immediately locatable within CEU-08 and communicates its architectural role (domain business logic modules). Flat sequential IDs across sub-units would lose the parent-child relationship.

**GROUNDED APPLICATION:**
`normalized_evidence_map.md` CEU-08 sub-unit table uses: CEU-08-INFRA (container/config), CEU-08-SQL (migrations), CEU-08-SRC-ROOT (entry points), CEU-08-COMMON through CEU-08-MIGRATIONS (specialized subsystems), CEU-08-MODULES (63 business domain modules). Same pattern for CEU-09 (14 sub-units) and CEU-10 (7 sub-units).

---

## STANDARD ALIGNMENT (Optional — Section K)

| Rule | Alignment observation |
|---|---|
| R-GRP-01/02/03 | Consistent with ISO/IEC 15939 evidence classification principles (grouping by source provenance and type) |
| R-FLT-01/02/03 | Consistent with evidence management practices in ISO/IEC 27001 (explicit exclusion records; provenance documentation) |
| R-NRM-01 | Standard practice in artifact extraction from monorepo archives (see also OCI layer normalization) |
| R-NRM-02/03 | Consistent with unknown-space preservation principles in audit methodology (ISACA COBIT 5 — document what is unknown, do not assume) |
| R-ABS-01/02 | Consistent with enterprise architecture meta-modeling (ArchiMate: abstract multiple elements into an artifact node) |
| R-NAM-01/02 | Consistent with systematic identifier schemes in evidence management (PROV-DM, W3C provenance data model) |

*Annotations only — rules are not modified by alignment observations.*

---

## RULE CATALOG SUMMARY

| Rule ID | Type | Description | Phase B units covered |
|---|---|---|---|
| R-GRP-01 | Grouping | Group evidence by top-level source domain | ESI-U01→06, NEM domains |
| R-GRP-02 | Grouping | Sub-group within component by architectural role | ESI-U03/04, NEM-U08/09 sub-units |
| R-GRP-03 | Grouping | Separate platform-unique from embedded components | ESI-U05, NEM-U10 |
| R-FLT-01 | Filtering | Exclude provenance archives from ingestion | ESI-U06, NEM-U11→13 |
| R-FLT-02 | Filtering | Downgrade extraction analysis to support-only | ESI-U02, NEM-U04→07, ECM-U03 |
| R-FLT-03 | Filtering | Apply boundary exclusion list | ESI-U09, IVL-U04 |
| R-NRM-01 | Normalization | Collapse packaging-boundary path duplication | NEM canonical paths, source_normalization_log |
| R-NRM-02 | Normalization | Declare overlap pairs with canonical preference | NEM-U14/15, OVL-01/02 |
| R-NRM-03 | Normalization | Preserve unknown-space, no inference | NEM-U16→18, IVL-U07/08 |
| R-ABS-01 | Abstraction | Abstract file collections into CEU entities | NEM-U01→10 |
| R-ABS-02 | Abstraction | Represent repeated patterns as typed pattern rows | ECM-U05/07, NEM sub-units |
| R-NAM-01 | Naming | Sequential CEU IDs by evidence priority tier | NEM-U01→13 |
| R-NAM-02 | Naming | CEU sub-unit IDs = parent ID + role suffix | NEM-U08→10 sub-units |

**Total rules: 13**
**Rule type distribution:** R-GRP: 3 | R-FLT: 3 | R-NRM: 3 | R-ABS: 2 | R-NAM: 2

---

#### EVIDENCE LAYER

Every rule above is dual-anchored: each has a Phase A source citation (specific file + content) and a Phase B output citation (specific unit ID in phase_b_decomposition.md). No rule was derived from inference alone.

---

#### LIMITATIONS & BOUNDARIES

- This is v0 of the rule catalog. Some rules may require refinement when applied to a second repository (particularly R-NRM-01 which handles platform-specific extraction patterns).
- R-GRP-01 assumes a well-structured evidence_boundary.md exists as a Phase A artifact. For repositories without an explicit boundary document, the rule requires adaptation to use directory-level convention inference.
- R-NRM-03 (unknown-space preservation) is a discipline rule rather than a transformation rule — it prevents incorrect action rather than prescribing a transformation output.

---

#### REUSABILITY STATEMENT

To apply this rule catalog to another repository:
1. Execute rules in dependency order: R-NRM-01 → R-FLT-* → R-GRP-* → R-ABS-* → R-NAM-* (normalization first, then grouping, then abstraction, then naming).
2. For each rule, substitute the Phase A source citation with the equivalent artifact from the new repository.
3. If a new repository lacks an extraction log, R-NRM-01 requires manual path inspection to detect packaging boundaries.
4. If a new repository has no overlap between standalone and integrated exports, R-NRM-02 produces no OVL records — this is a valid zero-OVL result, not a failure.

---

#### STATUS

| Check | Result |
|---|---|
| All rule types represented (R-GRP, R-FLT, R-NRM, R-ABS, R-NAM) | COMPLETE |
| All rules dual-anchored (theoretical + grounded) | COMPLETE |
| Phase B coverage | 53/53 units covered |
| Implicit reasoning used | NONE |

**RULE CATALOG v0: COMPLETE — 13 rules, 100% coverage**
