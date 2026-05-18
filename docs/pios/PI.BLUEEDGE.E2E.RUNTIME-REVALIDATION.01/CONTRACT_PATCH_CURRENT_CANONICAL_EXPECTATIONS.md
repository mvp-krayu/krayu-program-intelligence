# Contract Patch — Current Canonical Replay Expectations

**Stream:** PI.BLUEEDGE.E2E.RUNTIME-REVALIDATION.01
**Patch date:** 2026-05-18
**Reason:** Pre-execution correction. Original contract imported stale certification GAP-001 as current expected behavior.

---

## 1. What Was Wrong

The original STREAM_CONTRACT.md stated:

- "generic pipeline produces 1 domain (DOM-01 ROOT)" as current expected behavior
- GAP-001 pre-classified as EXPECTED deviation in §9.3
- Phase A.2a expected "945 nodes, 1 cluster per GAP-001"
- V-03 checked for "consistency with certification (GAP-001 expected)"

This imported the OLD certification failure (2026-05-17) as current canonical truth.

## 2. Why It Was Wrong

GAP-001 was found BEFORE:

- Wrapper normalization
- A5a replay-safe substrate (PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01)
- PATH_A5_PARTICIPATION_ARCHITECTURE.md vault canonicalization
- OPERATIONAL_ONTOLOGY.md canonicalization
- CROSSWALK_AND_RECONCILIATION.md staleness fix

The current canonical state, as documented in the vault, is:

```
945 raw nodes
→ 48 A5a replay-safe structural domains (full-node path-prefix grouping)
→ 35 CEU-grounded participation nodes
→ 13 executive structural DOM groups (CEU-grounded path-prefix grouping)
```

The 1-ROOT-domain failure was the symptom. The A.5 canonicalization was the fix.

## 3. Current Replay Expectations

| Layer | Expected | If different → classification |
|---|---|---|
| A. Raw structural scan | ~945 nodes from BlueEdge source archive | Source evidence change |
| B. Wrapper normalization | Non-root-collapsed topology, wrapper prefix handled | CRITICAL REGRESSION if collapses to ROOT |
| C. A5a raw structural substrate | 48 replay-safe structural domains from full-node path-prefix grouping | A5a substrate drift |
| D. CEU participation | 35 CEU-grounded nodes (historical). Different count → CEU_REGISTRY_DRIFT | CEU_REGISTRY_DRIFT (explain) |
| E. Executive structural DOM layer | 13 structural DOM groups | Deviation if not 13 — classify severity |
| F. PATH B | 17 semantic DOMAINs (89 COMP → 42 CAP → 17 DOMAIN) | PATH B drift |
| G. Crosswalk | v2.0, 9/1/3 mapping, DOM-09 irresolvable | Crosswalk drift |
| H. Reconciliation | 4/17 backed, 13 semantic-only, Q-02 | Reconciliation drift |
| I. LENS | Currently served projection unchanged, selector on run_be_orchestrated_fixup_01 | PROJECTION DRIFT |

## 4. Deviation Reclassification

| Scenario | OLD classification | CORRECTED classification |
|---|---|---|
| Pipeline produces 1 ROOT domain | EXPECTED (GAP-001) | **CRITICAL REGRESSION** |
| Pipeline produces 48 A5a domains but not 13 CEU-grounded DOMs | Not addressed | **PARTIAL REPLAY** |
| Pipeline produces 13 DOMs but fails to align with PATH B/crosswalk/reconciliation | Not addressed | **SEMANTIC BRIDGE DRIFT** |
| Pipeline reproduces PATH A and PATH B but differs from current LENS projection | Not addressed | **PROJECTION DRIFT** |

## 5. GAP-001 Status

The old certification GAP-001 may be referenced ONLY as:

> "Historical failure mode now expected to be resolved by A.5 canonicalization, or explicitly reclassified as CRITICAL REGRESSION if still present."

GAP-001 is NOT a current expected deviation. It is a historical finding. The revalidation stream validates whether the fix holds.

## 6. Unchanged Rules

- Current selector MUST remain untouched
- Current LENS projection is the semantic truth anchor
- All replay outputs go to isolated `run_blueedge_revalidation_01/`
- No mutations to production state
