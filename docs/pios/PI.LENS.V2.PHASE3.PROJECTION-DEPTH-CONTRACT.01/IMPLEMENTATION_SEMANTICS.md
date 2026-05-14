# Implementation Semantics

**Stream:** PI.LENS.V2.PHASE3.PROJECTION-DEPTH-CONTRACT.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `KNOWN_SECTIONS` | ProjectionDepthContract.js | Canonical section inventory (16 sections) | Shared — consumed by WS-8, WS-2, binding plumbing |
| `KNOWN_DEPTHS` | ProjectionDepthContract.js | Canonical depth inventory (EXECUTIVE, OPERATOR) | Shared |
| `PROJECTION_DEPTHS` | ProjectionDepthContract.js | Per-depth field specifications for all sections | Shared — keystone data structure |
| `SECTION_METADATA` | ProjectionDepthContract.js | Per-section source/description documentation | Reference |
| `getProjectionFields` | ProjectionDepthContract.js | Retrieve field list for section/depth pair | Shared |
| `isSectionSuppressed` | ProjectionDepthContract.js | Check if section is suppressed at depth | Shared |
| `isSectionFullExposure` | ProjectionDepthContract.js | Check if section uses wildcard at depth | Shared |
| `projectSection` | ProjectionDepthContract.js | Apply depth filtering to source object | Shared — consumed by binding plumbing |
| `getExecutiveFieldCount` | ProjectionDepthContract.js | Retrieve executive field count for section | Reference |
| `validateSectionCoverage` | ProjectionDepthContract.js | Verify all sections assigned in all depths | Validation |
| `getCompressionSummary` | ProjectionDepthContract.js | Summary of compression ratios | Reference |

## 2. Input Contracts

### ProjectionDepthContract

This module has NO runtime inputs. It is a static data structure.

It does NOT consume:
- Substrate bindings
- Payload data
- Filesystem artifacts
- API responses
- AI outputs

## 3. Output Contracts

### getProjectionFields(section, depth)

```
Input:  section: string (one of KNOWN_SECTIONS), depth: string ('EXECUTIVE' | 'OPERATOR')
Output: string[] | '*' | null
  - string[]: explicit field list (may be empty [] for suppressed)
  - '*': wildcard, all fields exposed
  - null: unknown section or depth
```

### isSectionSuppressed(section, depth)

```
Input:  section: string, depth: string
Output: boolean — true if field list is []
```

### isSectionFullExposure(section, depth)

```
Input:  section: string, depth: string
Output: boolean — true if field list is '*'
```

### projectSection(section, depth, source)

```
Input:  section: string, depth: string, source: object
Output: object | null
  - object: projected fields from source (wildcard returns source unchanged)
  - null: section suppressed, unknown, or source null
```

### getExecutiveFieldCount(section)

```
Input:  section: string
Output: number | null — count of EXECUTIVE fields, null for wildcard/suppressed
```

### validateSectionCoverage()

```
Input:  none
Output: {
  valid: boolean,
  depths: {
    [depth]: {
      assigned: number,
      total: number,
      complete: boolean,
      missing: string[],
      unknown: string[],
    }
  }
}
```

### getCompressionSummary()

```
Input:  none
Output: Array<{
  section: string,
  total_fields: number | null,
  executive_fields: number | string,
  compression: string,
}>
```

## 4. Depth Semantics

| Depth | Principle | Field Selection |
|-------|-----------|-----------------|
| EXECUTIVE | Consequence-first compression | Labels, classifications, visual indicators, headline metrics, boolean flags |
| OPERATOR | Full exposure | Wildcard '*' — all fields from source resolvers |

### EXECUTIVE Compression Rules

- Include classifications, exclude raw scores (e.g., maturity_classification yes, maturity_score no)
- Include percentages, exclude raw ratios (e.g., grounding_pct yes, grounding_ratio no)
- Include boolean flags (has_blocking_debt, all_valid, ready, degradation_detected)
- Include visual indicators (colors)
- Include headline counts (total_items, blocking_count)
- Suppress array-type investigation data (per_domain, domainTraceability)
- Pass through metadata sections unchanged (envelope, operationalHealth, provenance)

### Suppression Semantics

Suppression is depth-specific. A suppressed section returns null from `projectSection` — it is architecturally excluded from that depth's data contract.

Currently, EXECUTIVE suppresses 2 sections:
- `reconciliationAwareness.per_domain` — per-domain array too granular for executive
- `domainTraceability` — investigation-depth enrichment rationale

## 5. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| ProjectionDepthContract.js | Static declarative specification of per-depth field exposure, section metadata, accessor functions, projection filtering, and coverage validation |

Consumers (future streams):
- WS-8 (ConditionDrivenLayoutResolver) — reads depth constraints to determine layout adjustments
- WS-2 (ProgressiveDisclosureShell) — reads depth to determine field exposure within zones
- Binding plumbing (flagshipBinding.js / LensSQOSubstrateConsumer.js) — optional depth parameter for server-side field filtering
