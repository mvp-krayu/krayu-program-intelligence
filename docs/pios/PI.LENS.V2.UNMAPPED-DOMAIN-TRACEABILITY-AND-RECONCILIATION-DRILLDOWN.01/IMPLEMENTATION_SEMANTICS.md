# Implementation Semantics

**Stream:** PI.LENS.V2.UNMAPPED-DOMAIN-TRACEABILITY-AND-RECONCILIATION-DRILLDOWN.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `loadDomainEnrichmentRationale` | LensReconciliationConsumptionLayer.js | Load enrichment rationale map from enriched topology model | Reusable — any client with enriched topology |
| `buildDomainTraceability` | LensReconciliationConsumptionLayer.js | Merge per-domain correspondence with enrichment rationale | Reusable — produces traceability entries for any surface |
| `buildDomainDrilldown` | LensReconciliationConsumptionLayer.js | Build drilldown data for a specific domain by ID | Reusable — can be consumed by any drilldown-capable surface |
| `UNMAPPED_RESOLUTION_HINTS` | LensReconciliationConsumptionLayer.js | Resolution hints for known unmapped domains | Reusable — client-agnostic structural resolution hints |
| `UNMAPPED_CLASSIFICATIONS` | LensReconciliationConsumptionLayer.js | Classifications for unmapped domain types | Reusable — CONCEPTUAL_INFRASTRUCTURE, DISTRIBUTED_CONCERN, BUSINESS_VERTICAL |
| `ReconDebtDrilldown` | pages/lens-v2-flagship.js | Interactive unresolved domain disclosure with expand/collapse drilldown | Page-specific component |
| `DomainDrilldownPanel` | pages/lens-v2-flagship.js | Drilldown detail panel showing why unmapped, classification, resolution hint | Page-specific component |
| `ReconDomainDrilldownTable` | pages/lens-v2-flagship.js | Interactive per-domain correspondence table with enrichment drilldown | Page-specific component |

## 2. Input Contracts

### loadDomainEnrichmentRationale(client, runId)
- **Artifact path:** `clients/{client}/psee/runs/{runId}/semantic/topology/semantic_topology_model.enriched.json`
- **Consumed fields:** `domains[].domain_id`, `domains[].domain_name`, `domains[].domain_type`, `domains[].cluster_id`, `domains[].enrichment_status`, `domains[].enrichment_reason`, `domains[].dominant_dom_id`, `domains[].confidence`, `domains[].lineage_status`, `domains[].pre_enrichment`
- **Returns:** Map of domain_id to rationale object, or null if unavailable

### buildDomainTraceability(perDomain, rationaleMap)
- **perDomain:** Array from `reconciliationAwareness.per_domain` (from payload reconciliation_summary)
- **rationaleMap:** Output of `loadDomainEnrichmentRationale`
- **Returns:** Array of traceability entries with merged correspondence + enrichment fields

### buildDomainDrilldown(domainId, traceabilityEntries)
- **domainId:** String domain identifier (e.g., "DOMAIN-02")
- **traceabilityEntries:** Output of `buildDomainTraceability`
- **Returns:** Single drilldown object with resolution_hint, unmapped_classification, is_unmapped, is_enriched, was_previously_unmapped

## 3. Output Contracts

### Domain Traceability Entry Shape
```
{
  domain_id, domain_name, confidence_level, confidence_label,
  reconciliation_status, structural_dom_id, correspondence_basis,
  enrichment_status, enrichment_reason, domain_type, cluster_id,
  enrichment_confidence, lineage_status, pre_enrichment
}
```

### Domain Drilldown Shape
```
{
  ...traceability_entry,
  resolution_hint: string|null,
  unmapped_classification: string|null,
  is_unmapped: boolean,
  is_enriched: boolean,
  was_previously_unmapped: boolean
}
```

### SSR Props Extension
- `domainTraceability`: Array of traceability entries or null (added to flagship binding props)

## 4. Calibration Assumptions

| Constant | Value | Nature |
|----------|-------|--------|
| UNMAPPED_RESOLUTION_HINTS | 4 entries (DOMAIN-02, -08, -13, -15) | BlueEdge-specific but extensible |
| UNMAPPED_CLASSIFICATIONS | 3 types: CONCEPTUAL_INFRASTRUCTURE, DISTRIBUTED_CONCERN, BUSINESS_VERTICAL | Governed classification vocabulary |

## 5. Extension Points

- `UNMAPPED_RESOLUTION_HINTS`: Add entries for new unmapped domains per client
- `UNMAPPED_CLASSIFICATIONS`: Extend with new classification types if governance introduces them
- `loadDomainEnrichmentRationale`: Works for any client with enriched topology model
- `buildDomainTraceability`: Client-agnostic; works with any per_domain array + rationale map

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| LensReconciliationConsumptionLayer.js | Data transformation: load rationale, build traceability, build drilldown |
| flagshipBinding.js | SSR binding: load rationale, build traceability, inject as prop |
| pages/lens-v2-flagship.js | Rendering: interactive drilldown components with mode-reactive behavior |
