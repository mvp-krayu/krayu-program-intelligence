# Implementation Semantics — PI.LENS.V2.PHASE5B1.GUIDED-QUERY-LAYER.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| GUIDED_QUERY_ANSWERS | IntelligenceField.jsx | 12 path-level derive functions producing structured answers from fullReport | REUSABLE — 5B.2 will extend with interpretive layer |
| activeQueryKey | IntelligenceField.jsx | State model for query selection ("zone:pathIndex" format) | REUSABLE — 5B.2/5B.3 will extend with deeper interaction |
| exploredQueries | IntelligenceField.jsx | Set-based session tracking of clicked queries | REUSABLE — 5B.2 may extend with engagement analytics |
| handleQuerySelect | IntelligenceField.jsx | Callback to activate a query by zone and path index | REUSABLE — stable interface |
| handleQueryDismiss | IntelligenceField.jsx | Callback to clear active query and return to zone interpretation | REUSABLE — stable interface |
| handleZoneChange | IntelligenceField.jsx | Zone transition callback that auto-clears active query | REUSABLE — replaces direct setActiveZoneKey |
| Answer Panel | ExecutiveInterpretation | Query-aware rendering branch in left column | REUSABLE — 5B.2 will extend with narrative response surface |

## 2. Input Contracts

### GUIDED_QUERY_ANSWERS derive functions

Each derive function accepts a single argument:

```
fullReport: {
  topology_summary: { structurally_backed_count, semantic_domain_count },
  topology_scope: { clusters: Array<{ cluster_name, domain, node_count, structural_mass }>, nodes: Array },
  evidence_blocks: Array<{ pass_through_classification, evidence_type, domain, structural_evidence_block }>,
  signal_interpretations: Array<{ signal_code, severity, description, domain_attribution }>,
  propagation_summary: { chain: Array<{ role, domain, grounding, node_count }> },
  sqo_binding: { debt_items: Array, qualification_friction },
  pressure_zone: { primary_domain, signal_count, elevated_count }
}
```

Not all fields are consumed by every derive function. Each function documents which fields it reads.

### activeQueryKey

Format: `"zoneKey:pathIndex"` where:
- `zoneKey` ∈ `{ semanticTopology, clusterConcentration, absorptionLoad, signalAssessment, propagationFlow, pressureZoneFocus }`
- `pathIndex` ∈ `{ 0, 1 }` (2 paths per zone)

Example: `"signalAssessment:1"` = second query in signal assessment zone.

## 3. Output Contracts

### Derive function output

```
{
  summary: string,              // Direct textual answer to the question
  evidence: Array<{
    label: string,              // Evidence item label
    value: string,              // Evidence item value (always string)
    severity: 'nominal' | 'elevated' | 'critical' | null
  }>,
  structuralContext: string|null  // How this was structurally derived
}
```

### Answer Panel rendering

The answer panel renders exactly:
1. Zone badge (from DENSE_ZONE_REGISTRY)
2. "GUIDED QUERY" header label
3. Dismiss button (✕)
4. Question text (from DENSE_ZONE_PATHS[zone][path].answers)
5. Summary (from derive output)
6. Evidence rows (from derive output, color-coded by severity)
7. Structural context (from derive output, if non-null)
8. Governance boundary (from DENSE_ZONE_PATHS[zone][path].boundary)

## 4. Calibration Assumptions

| Constant | Value | Governed vs Tuned |
|----------|-------|-------------------|
| Grounding ratio thresholds | <50% critical, <80% elevated, ≥80% nominal | TUNED — severity thresholds for grounding display |
| Absorption percentage thresholds | >50% critical, >25% elevated | TUNED — pass-through absorption severity |
| Signal severity mapping | Mirrors signal_interpretations.severity | GOVERNED — derived from structural assessment |
| Evidence block severity | Based on evidence_type presence | GOVERNED — derived from evidence rebase corridor |

## 5. Extension Points

| Extension Point | Current State | 5B.2 Consumption |
|-----------------|---------------|-------------------|
| GUIDED_QUERY_ANSWERS registry | 12 derive functions (deterministic) | 5B.2 adds interpretive layer atop deterministic base |
| Answer Panel rendering | Fixed layout: question/summary/evidence/context/boundary | 5B.2 extends with narrative response surface |
| activeQueryKey state model | Null or "zone:pathIndex" | 5B.3 may extend to support freeform queries |
| exploredQueries tracking | Set of query keys | 5B.2 may add engagement depth (time spent, follow-up) |
| Evidence row severity | 3-tier: nominal/elevated/critical | Stable — no extension anticipated |

## 6. Module Responsibility Map

| File | Concern |
|------|---------|
| IntelligenceField.jsx | Query state management, derive function registry, answer panel rendering, query chip interaction, keyboard handlers |
| pages/lens-v2-flagship.js | CSS for query chips, answer panel, evidence rows, explored indicators |
| LensDisclosureShell.jsx | Governance envelope detail row for guided queries |

### Responsibility boundaries:

- **IntelligenceField** owns the full query lifecycle: selection → derivation → rendering → dismissal
- **lens-v2-flagship.js** owns all visual presentation (CSS only, no logic)
- **LensDisclosureShell** owns only the governance envelope claim

## 7. Architectural Decision Record

| Decision | Rationale |
|----------|-----------|
| activeQueryKey as string, not object | Simpler state model; parsing is trivial and predictable |
| exploredQueries as Set, not Map | Only need membership check, not metadata per query |
| Derive functions co-located with zone interpretations | Same data source (fullReport), same file responsibility; avoids artificial separation |
| Answer panel replaces zone interpretation (not overlays) | Clean cognitive model: you're either exploring a zone or answering a question, not both |
| Zone change clears query | Zone context is fundamental; stale answers from wrong zone would confuse |
| BOARDROOM/INVESTIGATION isolation | Query interaction is a DENSE cognitive model; other modes have different primary concerns |

## 8. Dependency Graph

```
DENSE_ZONE_PATHS (5A.8)          → question text, boundary text
DENSE_ZONE_REGISTRY (5A.8)       → zone badge codes
DENSE_ZONE_INTERPRETATIONS (5A.8) → fallback when no query active
GUIDED_QUERY_ANSWERS (5B.1)      → derive functions
activeQueryKey (5B.1)             → state coordination
ExecutiveInterpretation (5A.8)    → rendering host (query-aware branch added)
SupportRail (5A.8)                → interaction host (query chips added)
```

## 9. 5B Consumption Surface

5B.2 (Narrative Response Surface) will consume:
- `GUIDED_QUERY_ANSWERS` registry pattern — extend with interpretive derive functions under 75.x
- Answer Panel rendering pattern — extend with narrative response layout
- `activeQueryKey` state model — reuse for deeper interaction states
- `exploredQueries` tracking — extend with engagement metadata

5B.3 (Open Copilot Layer) will consume:
- Query interaction model — extend from guided to freeform
- Answer Panel rendering — extend to accommodate open-ended responses
- Governance boundary pattern — enforce on copilot outputs
