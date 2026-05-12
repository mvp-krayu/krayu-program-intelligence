# Architecture Load Protocol

> **How to load architecture context for streams that touch architectural concepts.**

---

## When This Protocol Applies

Any stream that:
- References layer boundaries (L0-L8)
- Touches PATH A or PATH B concepts
- Involves SQO state or Q-class
- Creates or modifies semantic domain structures
- Touches evidence corridors
- Involves crosswalk or reconciliation

## Load Sequence

### Step 1 — Core Architecture

Load vault pages:
- [[../01_FOUNDATIONAL_GOVERNANCE/L0_L8_MODEL]] — layer definitions
- [[../10_CANONICAL_RUNTIME_STATE/CURRENT_CANONICAL_BOUNDARIES]] — current boundaries

### Step 2 — Terminology

Load vault pages:
- [[../06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK]] — locked definitions
- [[../06_CANONICAL_TERMINOLOGY/SEMANTIC_COLLISIONS]] — collision awareness

### Step 3 — Concept-Specific

Load relevant concept pages based on stream scope:

| If stream touches | Load |
|---|---|
| LENS/rendering | [[../02_EXECLENS_LINEAGE/EXECLENS_RUNTIME_EVOLUTION]] |
| PATH A/grounding | [[../03_PATH_SPLIT_EVOLUTION/PATH_A_EMERGENCE]] |
| PATH B/semantic | [[../03_PATH_SPLIT_EVOLUTION/PATH_B_EMERGENCE]] |
| SQO/qualification | [[../04_SQO_AND_QUALIFICATION/SQO_EVOLUTION]] |
| Evidence/extraction | [[../05_RUNTIME_AND_CORRIDOR/EVIDENCE_CORRIDOR_EVOLUTION]] |
| Corridors/replay | [[../05_RUNTIME_AND_CORRIDOR/RUNTIME_CORRIDOR_EVOLUTION]] |
| HYDRATED/Q-class | [[../04_SQO_AND_QUALIFICATION/HYDRATED_AND_QSTATE_EVOLUTION]] |

### Step 4 — Lineage (if creating or modifying)

If the stream creates or modifies architectural concepts:
- [[../07_CANONICAL_LINEAGE/STREAM_EVOLUTION_CHRONOLOGY]] — where this fits
- Relevant lineage page for the concept being modified

## Cross-References

- [[STREAM_START_PROTOCOL]] — full start sequence
- [[CLAUDE_LOAD_REQUIREMENTS]] — load requirements
