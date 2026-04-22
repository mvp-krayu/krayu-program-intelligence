# Brain Node — Publish
# Tier-2 Runtime MVP

**Authority:** TIER2.RUNTIME.MINIMUM.VIABLE.SURFACE.01
**Brain:** PUBLISH
**Status:** PUBLISH-SAFE VARIANT REQUIRED
**Alignment date:** 2026-04-22
**Product link:** docs/brain/product/TIER2.RUNTIME.MINIMUM.VIABLE.SURFACE.01.md

---

## PUBLISH SAFETY STATUS

**PUBLISH-SAFE VARIANT REQUIRED**

Phase 1 produces two output files. The internal variant is for client use. The publish-safe variant is for outward use and requires obfuscation per the rules below.

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

## PUBLISH-SAFE RULES

Same obfuscation model as Tier-1. Applied via `publish_safe=True` flag in `_build_tier2_diagnostic_narrative()`.

### Section 0 — Header
- `run_id`: replace with generic run reference (e.g., "Assessment Run — April 2026")
- Client name fields: obfuscate per table below

### Section 2 — Zone Inventory and Section 3 — Per-zone blocks

| Internal | Publish-safe |
|---|---|
| "BlueEdge Fleet Management Platform" | "Client Environment" |
| "Fleet Core Operations" | "Core Operations" |
| "Fleet Vertical Extensions" | "Vertical Extensions" |
| "Extended Operations & Driver Services" | "Extended Operations" |
| Signal IDs (`SIG-{NNN}`) | MUST NOT appear |
| Artifact references | Omit or replace with "Evidence artifact" |
| Domain-specific program names | Generic structural terms |

### Section 3E — Uncertainty Declaration
- `inference_prohibition: ACTIVE` — present unchanged in all variants
- `unresolved_elements` descriptions — generic structural language required

### Section 3F — Query Hooks
- `hook_id` values — may appear (structural identifiers, not client-identifying)
- `query_surface` text — genericise any client-specific language

---

## SAFE / DRIFT CLASSIFICATIONS

| Element | Classification |
|---|---|
| `inference_prohibition: ACTIVE` | SAFE |
| Zone type vocabulary | SAFE |
| Domain IDs (`DOMAIN-{NN}`) without client names | SAFE |
| Generic structural zone conditions | SAFE |
| Obfuscated client names | SAFE |
| Signal IDs | VIOLATION if exposed |
| Artifact IDs or artifact references | DRIFT RISK — omit or genericise |
| Client program names (unobfuscated) | VIOLATION |
| Advisory language (forbidden in all variants) | VIOLATION |

---

## PUBLISH GATE

Publish-safe variant MUST NOT be served without:
1. `publish_safe=True` flag active in generator
2. All client-identifying names replaced per rules above
3. Signal IDs absent from all rendered sections
4. `inference_prohibition: ACTIVE` present in every zone's Section 3E
5. Governance footer note present: "SAMPLE — Illustrative client environment. All structural values represent actual assessment outputs."
