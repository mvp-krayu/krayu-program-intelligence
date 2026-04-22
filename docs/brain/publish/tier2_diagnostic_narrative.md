# Brain Node — Publish
# Tier-2 Diagnostic Narrative

**Authority:** TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01
**Brain:** PUBLISH
**Status:** PUBLISH-SAFE VARIANT REQUIRED
**Alignment date:** 2026-04-22
**Product link:** docs/brain/product/TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01.md

---

## PUBLISH SAFETY STATUS

**PUBLISH-SAFE VARIANT REQUIRED**

The Tier-2 Diagnostic Narrative exposes client-specific structural data. A publish-safe variant is mandatory before any external use.

---

## PUBLISH-SAFE RULES

Publish-safe variant applies the same obfuscation model established in Tier-1:

### Client identifiers

| Internal | Publish-safe |
|---|---|
| "BlueEdge Fleet Management Platform" | "Client Environment" |
| "Fleet Core Operations" | "Core Operations" |
| "Fleet Vertical Extensions" | "Vertical Extensions" |
| "Extended Operations & Driver Services" | "Extended Operations" |
| Domain-specific program names | Generic structural terms |

### Zone content
- Zone structural conditions: language MUST be genericised
- Signal IDs: MUST NOT appear in publish output
- Domain IDs (`DOMAIN-{NN}`): MAY appear if no client-identifying name is adjacent
- Capability IDs and component IDs: MUST NOT expose client-specific naming

### Structural claims
- Score and confidence band values: MAY appear (structural, not identifying)
- `evidence_gap` references: MAY appear
- `inference_prohibition: ACTIVE`: MUST appear in publish variant unchanged

---

## SAFE / DRIFT CLASSIFICATIONS

| Element | Classification |
|---|---|
| `inference_prohibition: ACTIVE` marker | SAFE |
| `evidence_completeness_summary` (factual) | SAFE |
| Zone type vocabulary (`evidence_gap`, etc.) | SAFE |
| Domain IDs without client names | SAFE |
| Obfuscated client names | SAFE |
| Raw `signal_id` values | DRIFT RISK |
| Client program names | VIOLATION if unobfuscated |
| Advisory language (forbidden anyway) | VIOLATION |
| Internal run IDs with client context | DRIFT RISK — genericise |

---

## OUTPUT FILES

```
Internal:    clients/blueedge/reports/tier2/lens_tier2_diagnostic_narrative.html
Publish:     clients/blueedge/reports/tier2/publish/lens_tier2_diagnostic_narrative_pub.html
```

Served via:
```
/api/report-file?name=lens_tier2_diagnostic_narrative.html
/api/report-file?name=lens_tier2_diagnostic_narrative_pub.html
```

---

## PUBLISH GATE

Publish-safe variant MUST NOT be served without:
1. Generator `publish_safe=True` flag confirmed active
2. All client identifiers obfuscated per rules above
3. No signal IDs in rendered body text
4. Governance note rendered in footer: "SAMPLE — Illustrative client environment..."
