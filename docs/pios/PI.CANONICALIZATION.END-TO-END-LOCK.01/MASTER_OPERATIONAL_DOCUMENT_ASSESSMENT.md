# Master Operational Document Assessment

> **Should the project now create ONE canonical master operational document? Is it mature enough?**

---

## Verdict: YES — the project is mature enough. With conditions.

---

## Maturity Assessment

| Criterion | Status | Evidence |
|---|---|---|
| Dual-path ontology understood | YES | Recovery stream: SEMANTIC_ONTOLOGY_VALIDATION.md — Hypothesis A validated, B falsified |
| All operational layers identified | YES | END_TO_END_TRACEABILITY_STATUS.md — complete chain mapped |
| Runtime transitions documented | MOSTLY | Code + psee docs cover all transitions. run_end_to_end.py internals are code-only. |
| Bridge artifacts identified | YES | Crosswalk (v2.0), reconciliation correspondence, reconciliation lifecycle, enriched correspondence |
| Qualification semantics locked | YES | Q-class locked (Q02_GOVERNANCE_AMENDMENT.md). S-state locked (SQO_EVOLUTION.md). |
| Runtime consumption semantics understood | YES | LENS traceback: GenericSemanticPayloadResolver → SemanticActorHydrator → zone derive functions |
| Projection semantics locked | YES | 4-persona projection, 36-query lattice, 5B.3 PI Runtime Layer |
| AMOps load requirements defined | YES | CLAUDE_RUNTIME_LOAD_PROTOCOL.md, ARCHITECTURE_MEMORY_PREFLIGHT.md |
| Rediscovery risk assessed | YES | AMOPS_VAULT_SUFFICIENCY_ASSESSMENT.md — specific weak points identified |

**All prerequisite criteria are met.** The project understands its own architecture well enough to write it down definitively.

---

## What Should Be Included

### Section 1: System Identity and Hierarchy

Already canonical in `PIOS_CURRENT_CANONICAL_STATE.md`. Reference, don't duplicate.

Content:
- Program Intelligence → GEIOS → PiOS → LENS → SQO → Marketplace hierarchy
- L0-L8 layer model reference
- Governance model (CLAUDE.md, git_structure_contract.md, Q02_GOVERNANCE_AMENDMENT.md)

### Section 2: The Dual-Path Operational Ontology

**NEW — this is the primary reason the document needs to exist.**

Content:
- Upstream evidence as common source for both paths
- PATH A: structural topology derivation (source_intake → structural_scanner → CEU grounding → DOM generation → binding → 75.x → 41.x → vault → selector)
- PATH B: semantic topology construction (evidence artifacts → COMP → CAP → DOMAIN via 41.1 build_semantic_layer.py)
- Why these are INDEPENDENT paths from the SAME evidence using DIFFERENT methods producing DIFFERENT outputs at DIFFERENT granularities
- The complete chain diagram (from END_TO_END_TRACEABILITY_STATUS.md)

### Section 3: The Crosswalk Bridge

Content:
- What the crosswalk IS (bridge translation table, DOM→DOMAIN mapping)
- What it IS NOT (not a reconciliation engine, not a domain generator)
- Crosswalk v2.0 coverage (9/13 DOMs mapped, DOM-09 irresolvable)
- Derivation chain (COMP→CAP→DOMAIN via build_semantic_layer.py)
- 5 consumers

### Section 4: Reconciliation Correspondence

Content:
- ReconciliationCorrespondenceCompiler: 5 inputs, graduated confidence model (Level 1-5)
- Reconciliation is purely assessment — never creates or mutates domains
- Current state: 4 reconciled, 13 unreconciled, ratio 0.2353
- DOM-09 irresolvability as root cause of 10/13 unreconciled
- Reconciliation loop: lifecycle states, rerun modes, propagation chain

### Section 5: Grounding and Qualification

Content:
- Grounding ratio computation (SemanticActorHydrator: EXACT/STRONG = backed, NONE/WEAK = semantic-only)
- Q-class derivation (grounding_ratio → Q-01/Q-02/Q-03/Q-04)
- S-state qualification (S0→S3 with 18 engines)
- CRITICAL: distinction between 41.1 evidence-boundary grounding and reconciliation crosswalk grounding

### Section 6: LENS Projection Chain

Content:
- Two LENS pathways (manifest-driven vs selector-driven)
- GenericSemanticPayloadResolver → SemanticActorHydrator → zone derive functions
- LensReconciliationConsumptionLayer (SQO→LENS bridge)
- 4 cognitive personas, 10 zones, 36 queries, decision posture
- Evidence Record Export

### Section 7: The 17/4/13 Reference

Content:
- What "17" means (semantic domains from 41.1)
- What "4" means (crosswalk lineage EXACT/STRONG)
- What "13" means (crosswalk lineage NONE/WEAK)
- The 4 grounded domains with structural evidence chain
- The 13 semantic-only domains with root cause analysis
- BlueEdge-specific note: "17 domains is BlueEdge-specific; varies by client"

### Section 8: PATH A.5 Participation Architecture

Content:
- 945→35→13 compression chain
- CEU grounding as participation filter
- A.5a (raw replay-safe substrate, 48 domains) vs A.5b (grounded executive topology, 13 domains)
- CEU registry evolution warning
- Reference to `PATH_A5_PARTICIPATION_ARCHITECTURE.md`

---

## What Should Explicitly NOT Be Included

| Excluded | Why |
|---|---|
| BlueEdge-specific artifact paths | The document should be client-agnostic where possible. BlueEdge paths belong in client-specific reference, not in the master operational document. |
| Code-level implementation details | The document is architectural, not implementational. "SemanticActorHydrator computes grounding" yes. Lines 142-147 exact code — no. |
| Stream history and chronology | The document captures the CURRENT operational truth. How it was discovered is in stream artifacts and STREAM_EVOLUTION_CHRONOLOGY.md. |
| Marketplace strategy | Already frozen in PIOS_CURRENT_CANONICAL_STATE.md. Referencing it is sufficient. |
| LENS UI details | Zone components, CSS, interaction patterns — these belong in runtime documentation, not operational ontology. |
| Recovery stream forensics | The recovery streams (provenance, crosswalk, reconciliation) are evidence. The master document is the conclusion drawn from that evidence. |
| Future roadmap | What exists now. Not what will exist. |
| Commercial language | "Execution Blindness," "Structural Execution Visibility" — these are marketplace terms. The operational document uses architectural terms. |

---

## Where It Should Live in Vault

**Recommended location:** `docs/pios/vault/00_START_HERE/OPERATIONAL_ONTOLOGY.md`

**Rationale:**
- Section 00 is the bootstrap zone — loaded first, read before anything else
- The document IS the start-here for understanding the system's operational chain
- It complements `PIOS_CURRENT_CANONICAL_STATE.md` (which covers identity and status) with operational mechanics

**Alternative:** `docs/pios/vault/03_PATH_SPLIT_EVOLUTION/DUAL_PATH_OPERATIONAL_ONTOLOGY.md`

This is defensible since the dual-path model is the core of what needs to be documented. But it would be one vault page among many in section 03, not elevated to start-here authority.

**Recommendation:** 00_START_HERE. This document is architecturally fundamental. It should be loaded by every G1 and G2 stream as part of Phase 2 (Canonical State) or as a new Phase 2b.

---

## Should It Supersede Fragmented Stream Cognition?

**PARTIALLY.**

The master document should become the **authoritative operational reference** that supersedes the need to load individual recovery stream artifacts for operational understanding.

However, it should NOT supersede:
- The recovery streams themselves (they remain evidence)
- Individual vault pages that cover specific concerns in depth (SQO_EVOLUTION, PATH_A5_PARTICIPATION_ARCHITECTURE, etc.)
- Governance documents (Q02_GOVERNANCE_AMENDMENT, git_structure_contract)

**The relationship is:**

```
MASTER OPERATIONAL DOCUMENT (new)
  = the complete picture, read first
  → references vault pages for depth
  → references governance for rules
  → does NOT re-state what vault pages already cover

INDIVIDUAL VAULT PAGES (existing)
  = deep treatment of specific concerns
  → continue to exist and be maintained
  → loaded when streams touch their specific domain

RECOVERY STREAM ARTIFACTS (existing)
  = forensic evidence and analysis
  → remain as historical record
  → no longer need to be loaded for operational understanding
```

**The test:** After the master document exists, a new session should be able to load:
1. CLAUDE.md
2. git_structure_contract.md
3. PIOS_CURRENT_CANONICAL_STATE.md
4. TERMINOLOGY_LOCK.md
5. **OPERATIONAL_ONTOLOGY.md** (new)

...and have sufficient operational understanding to execute any G1 or G2 stream without rediscovery loops.

---

## Prerequisite Before Creating It

**Fix the stale vault page first.**

`CROSSWALK_AND_RECONCILIATION.md` says the reconciliation compiler is "NOT IMPLEMENTED." The master document would reference this vault page. If the vault page is stale, the master document either contradicts it (bad) or inherits the staleness (worse).

**Sequence:**
1. Fix `CROSSWALK_AND_RECONCILIATION.md` (separate G1 stream — updates vault page with operational state)
2. Create master operational document (references the corrected vault page)
3. Update `CLAUDE_RUNTIME_LOAD_PROTOCOL.md` to include master document in Phase 2 loads

---

## Estimated Scope

The master operational document would be approximately 200-300 lines — enough to cover the complete chain without duplicating vault page depth. Each section would be 20-40 lines with a diagram and cross-references.

This is NOT a massive undertaking. The knowledge exists. The document assembles it.
