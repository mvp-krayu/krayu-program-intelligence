# Family: PSEE — Program Surface Extraction

**Status:** REGISTERED
**Registered:** 2026-04-05
**Authority:** FAMILY_DISCOVERY — PSEE Registration

---

## PURPOSE

Program Surface Extraction (PSEE) reverse-compiles the transformation logic between raw program evidence (manual corpus, source file structures) and governed PiOS 40.2 intake artifacts. PSEE formalizes the extraction methodology into a deterministic, auditable rule catalog and schema that is repeatable across repositories and client engagements.

PSEE does not compute intelligence — it formalizes how intelligence preparation (40.2 intake formation) is derived from raw evidence.

---

## LAYER HIERARCHY

```
PSEE.0  Reverse-Compilation Baseline    — corpus → rule catalog + extraction schema
  └─► PSEE.1  Extraction Engine         — rule application → deterministic transformation
        └─► PSEE.n  Engine Refinements  — incremental rule coverage expansion
              └─► 40.2                  — target intake layer (READ-ONLY from PSEE)
```

No phase may be skipped. PSEE.0 must complete before any PSEE.1+ stream opens.

---

## SCOPE

**In scope:**
- Reverse-compilation of intake transformation logic from manual corpus → 40.2
- Extraction rule formalization (grouping, filtering, normalization, abstraction, naming)
- Program surface reconstruction and reconstruction validation
- Preparation of canonical intake structure for PiOS 40.2 consumption
- Billable advisory documentation of extraction methodology

**Out of scope:**
- Signal computation (40.3 / 40.4 domain)
- Semantic delivery, narrative generation, demo surface work
- Downstream 40.4+ interpretation or telemetry
- UI or runtime exposure (51.x / 42.x domain)
- Category authority (CAT domain)
- Live source mutation — PSEE is READ-ONLY with respect to Phase A corpus and 40.2 baseline

---

## UPSTREAM / DOWNSTREAM RELATIONS

| Direction | Relation |
|---|---|
| Upstream | Raw repository, manual corpus, extracted source structures (Phase A) |
| Downstream | 40.2 Evidence Layer (Phase B) — READ-ONLY target |
| Adjacent | IG (governs ingestion pipeline from source → 40.x; PSEE governs the extraction rule system) |

PSEE and IG are complementary: IG verifies that the ingestion pipeline deterministically produces 40.x from a governed source. PSEE formalizes the rules by which the 40.2 intake structure was derived from the underlying corpus.

---

## STANDARD INVARIANTS

- **Corpus-grounded:** every rule must trace to Phase A evidence; no structural element may be inferred without explicit source reference
- **No-invention:** PSEE describes observed transformations; no redesign of PiOS concepts or new abstractions allowed
- **READ-ONLY target:** 40.2 baseline artifacts are never mutated; PSEE produces extraction spec, not 40.2 output
- **Dual-anchor:** each rule must have both a theoretical basis (structural/architectural principle) and a grounded application (exact Phase A → Phase B mapping)
- **Deterministic schema:** same corpus input → same rule catalog output; no stochastic behavior
- **No-reinterpretation:** phase B structure is given; PSEE traces the path back, not forward
- **Billable-grade documentation:** all artifacts must be self-contained for advisory, audit, and commercial delivery

---

## NORMALIZATION RULES

Applied before any corpus comparison or rule derivation:

| Rule | Target |
|---|---|
| N-01 | Path duplication (e.g., `/backend/backend/`) — classify before use |
| N-02 | Tool-generated suffixes in filenames (`_v2`, `_old`, `_draft`) — flag, do not strip without justification |
| N-03 | Non-architectural packaging boundaries — collapse after documented classification |
| N-04 | Date and run-id fields in extracted artifacts — strip for structural comparison |
| N-05 | Empty or placeholder sections — exclude from coverage counts |

---

## STATE VOCABULARIES

| Object | States |
|---|---|
| `extraction_state` | `COMPLETE` \| `PARTIAL` \| `BLOCKED` |
| `mapping_coverage` | `FULL` \| `PARTIAL` \| `NONE` |
| `rule_confidence` | `VERIFIED` \| `INFERRED` \| `FLAGGED` |
| `reconstruction_result` | `PASS` \| `PARTIAL` \| `FAIL` |
| `path_classification` | `ARCHITECTURAL` \| `PACKAGING_BOUNDARY` \| `EXTRACTION_ARTIFACT` \| `AMBIGUOUS` |
| `corpus_coverage` | `COMPLETE` \| `PARTIAL` \| `INSUFFICIENT` |

---

## STANDARD ARTIFACT SLOTS (7-PACK)

| Slot | Function |
|---|---|
| 1 | Context validation and corpus binding confirmation |
| 2 | Source normalization log (path classification, duplication resolution) |
| 3 | Phase A inventory (classified file enumeration) |
| 4 | Phase B decomposition (atomic unit breakdown of 40.2 artifacts) |
| 5 | Transformation mapping (Phase A contributors → Phase B units) |
| 6 | Rule catalog (typed rules with dual-anchor) |
| 7 | Schema + execution spec + reconstruction validation report |

---

## VALIDATION PROFILES

| Profile | Purpose |
|---|---|
| `corpus_binding` | Phase A source directory present; file count logged; no unresolved path ambiguity |
| `transformation_coverage` | Mapping completeness ≥90%; no unmapped Phase B entities without documented exclusion |
| `rule_catalog` | All rules have: rule_id, input pattern, transformation logic, output structure, evidence refs, dual-anchor |
| `reconstruction_equivalence` | Simulated reconstruction achieves structural equivalence with actual 40.2 |

---

## HANDOVER EXPECTATIONS

- Corpus binding confirmed (Phase A root, file count, classification distribution)
- Transformation mapping coverage percentage
- Rule catalog completeness (typed rules: R-GRP, R-FLT, R-NRM, R-ABS, R-NAM)
- Reconstruction validation result (PASS / PARTIAL / FAIL)
- Any FLAGGED rules or unresolved ambiguities

---

## KNOWN EXCLUSIONS

- PSEE does not own the 40.2 computation logic — that belongs to the 40 family
- PSEE does not validate ingestion pipeline integrity — that belongs to IG
- No category or semantic interpretation of extracted entities
- No UI, runtime, or demo surface work
- Path normalization collapses packaging artifacts only — architectural structures are preserved

---

## COMPRESSION ELIGIBILITY

REGISTERED. Compressed contracts permitted.

Compressed PSEE contracts must declare only:
- which phase or rule type is being extended or refined
- Phase A corpus binding (source root, scope of files in scope)
- target rule set or schema increment
- any deviations from dual-anchor requirement
