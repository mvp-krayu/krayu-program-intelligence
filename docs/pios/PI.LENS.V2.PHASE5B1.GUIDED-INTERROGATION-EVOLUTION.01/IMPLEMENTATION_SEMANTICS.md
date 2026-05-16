# IMPLEMENTATION_SEMANTICS.md

## Stream: PI.LENS.V2.PHASE5B1.GUIDED-INTERROGATION-EVOLUTION.01

Updates IMPLEMENTATION_SEMANTICS from parent stream PI.LENS.V2.PHASE5B1.GUIDED-QUERY-LAYER.01.

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|-------------|
| TONE_PALETTE | IntelligenceField.jsx | Maps 8 tonal registers to glyph identifiers | REUSABLE — future orchestration infrastructure |
| DENSE_ZONE_PATHS | IntelligenceField.jsx | 36 query path entries (6 per zone) with metadata | REUSABLE — consumed by SupportRail + ExecutiveInterpretation |
| GUIDED_QUERY_ANSWERS | IntelligenceField.jsx | 36 derive functions producing structured answers | REUSABLE — consumed by ExecutiveInterpretation query panel |

## 2. Input Contracts

### DENSE_ZONE_PATHS Entry Shape (extended from 5B.1)

```javascript
{
  label: string,          // query label
  icon: string,           // glyph character (now derived from TONE_PALETTE)
  narrative: string,      // hover explanation
  answers: string,        // question text
  boundary: string,       // governance boundary statement
  tone: string,           // NEW — one of: operational, forensic, executive, architectural, quiet, alarming, reflective, containment
  archetype: string,      // NEW — one of: SCAN, TRACE, INTERPRET, BOUNDARY, ESCALATION
  depth: string,          // NEW — one of: micro, standard, deep
}
```

### GUIDED_QUERY_ANSWERS Derive Function Contract

```javascript
{
  derive: (fullReport) => ({
    summary: string,                   // 1 sentence (micro), 1-2 (standard), 2-3 (deep)
    evidence: Array<{
      label: string,
      value: string,
      severity: 'critical' | 'elevated' | 'nominal' | null,
    }>,                                // 1-3 items (micro), 3-5 (standard/deep)
    structuralContext: string | null,   // always null for micro
  })
}
```

### fullReport Fields Consumed

| Field | Consumed By |
|-------|-------------|
| semantic_domain_registry | ST:0-5, PZ:5 |
| semantic_cluster_registry | CC:0-5 |
| semantic_topology_edges | CC:5 |
| reconciliation_summary | ST:5 |
| evidence_blocks | AL:0-5, PF:0-5, PZ:2-3, SA:2 |
| signal_interpretations | SA:0-5, AL:3, PZ:0,2 |
| propagation_summary | AL:1,3, PF:2, PZ:0-4 |
| readiness_summary | SA:2, PZ:4 |
| qualifier_summary | SA:5, PZ:4 |
| topology_summary | ST:3, CC:2,4, PF:0-1, PZ:1 |

## 3. Output Contracts

### Answer Panel Rendering (depth-aware)

| Depth | Summary | Evidence | Structural Context | Boundary |
|-------|---------|----------|--------------------|----------|
| micro | 1 sentence | inline chips | hidden | hidden |
| standard | 1-2 sentences | evidence rows | shown if present | shown |
| deep | 2-3 sentences | evidence rows | shown (extended) | shown |

### SupportRail Chip Rendering

Each chip carries:
- `data-tone` — tonal register for CSS targeting
- `data-depth` — response density for visual hint
- `data-explored` — true after first selection
- `aria-pressed` — true when active
- Separator div between index 1 and 2 (foundational / higher-order divide)

## 4. Calibration Assumptions

| Constant | Value | Type |
|----------|-------|------|
| Queries per zone | 6 (indices 0-5) | GOVERNED (extends 5B.1 contract of 2) |
| Foundational queries | indices 0-1 | GOVERNED (below separator) |
| Higher-order queries | indices 2-5 | GOVERNED (above separator) |
| Tonal registers | 8 | TUNED (can extend without breaking) |
| Archetypes | 5 (SCAN, TRACE, INTERPRET, BOUNDARY, ESCALATION) | GOVERNED |
| Depth levels | 3 (micro, standard, deep) | GOVERNED |
| Max path list height | 280px | TUNED |
| Alarming border opacity | 0.35 | TUNED |
| Quiet chip opacity | 0.75 | TUNED |

## 5. Extension Points

- **TONE_PALETTE**: Additional tonal registers can be added without modifying existing entries
- **Query archetype**: Drives future orchestration (pacing, animation, panel depth, typography adaptation) — metadata is in place, behavior deferred to future streams
- **Response depth**: MICRO/STANDARD/DEEP rendering established — depth selection is metadata-driven, not hardcoded
- **Per-zone query count**: Currently 6 per zone — extensible by adding entries to DENSE_ZONE_PATHS and GUIDED_QUERY_ANSWERS at matching indices

## 6. Module Responsibility Map

| File | Concern |
|------|---------|
| IntelligenceField.jsx | TONE_PALETTE, DENSE_ZONE_PATHS, GUIDED_QUERY_ANSWERS, depth-aware answer rendering, tonal chip rendering |
| lens-v2-flagship.js | CSS for separator, tonal accents, depth panel variants, scroll handling |
