# Governance Trace — Workspace Semantic Presentation
## PI.41X.WORKSPACE-SEMANTIC-PRESENTATION.01

**Program:** second-client-kill-plan-01  
**Contract:** PI.41X.WORKSPACE-SEMANTIC-PRESENTATION.01  
**Branch:** work/psee-runtime  
**Date:** 2026-04-25  
**Status:** COMPLETE

---

## Phase A — Fields Inspected

### 41.x/pressure_zone_projection.json

| Field | Values found | Usable for presentation |
|---|---|---|
| `zone_id` | PZ-001, PZ-002, PZ-003 | Yes — primary trace ID |
| `zone_type` | DOMAIN_ZONE | Yes — map to readable label |
| `zone_class` | COMPOUND_ZONE | Yes — more specific than zone_type; use as primary badge |
| `anchor_name` | backend_isolated, frontend_isolated, platform_monorepo | Yes — use as zone title |
| `attribution_profile` | secondary, primary | Yes — show in zone overview |
| `condition_count` | 3 (all zones) | Yes — replace blank capability/signal stats |
| `embedded_pair_rules` | COUPLING_ZONE, PROPAGATION_ZONE, RESPONSIBILITY_ZONE | Yes — map to readable pair rule labels |
| `member_entity_ids` | NODE-008/9/10, DOM-03/4/5 | Keep as trace IDs only |
| `candidate_ids` | PC-001 through PC-006 | Keep as trace IDs only |

### 41.x/signal_projection.json

| Field | Values found | Usable for presentation |
|---|---|---|
| `condition_id` | COND-PSIG-001-01, etc. | Yes — show as trace chip alongside signal_id |
| `signal_id` | PSIG-001, PSIG-002, PSIG-004 | Yes — primary trace ID, keep visible |
| `activation_state` | HIGH, ACTIVATED | Yes — use as evidence badge fallback when `evidence_confidence` absent |
| `signal_value` | 9.43, 9.43, 4.33, 0.20 | Yes — show as value display when `title` absent |
| `activation_method` | RUN_RELATIVE_OUTLIER, THEORETICAL_BASELINE | Yes — show as method label |
| `signal_authority` | PROVISIONAL_CKR_CANDIDATE | Not surfaced — not a presentation label |

**No `title`, `description`, or `label` fields present in projection signals — PSIG IDs are the only signal identifiers.**

---

## Phase B — Mapping Rules Applied

### Files modified

- `app/gauge-product/pages/tier2/workspace.js` — all changes
- `scripts/pios/tier2_query_engine.py` — no changes needed (all required fields already present in responses)

### Mapping rules

**1. Zone type readable labels — `zoneTypeMeta()` extended**

| Input | Output label | CSS class reused |
|---|---|---|
| `DOMAIN_ZONE` | domain zone | ws-type-pressure |
| `COMPOUND_ZONE` | compound pressure zone | ws-type-pressure |
| `COUPLING_ZONE` | coupling zone | ws-type-conflict |
| `PROPAGATION_ZONE` | propagation zone | ws-type-inconsistency |
| `RESPONSIBILITY_ZONE` | responsibility zone | ws-type-gap |
| `FRAGMENTATION_ZONE` | fragmentation zone | ws-type-gap |
| fallback | lowercased/unscored string | '' |

**2. ZoneCard toggle title**

`zone.domain_name` → `zone.anchor_name || zone.domain_name || zone.zone_id`

Projection zones: title renders as `backend_isolated`, `frontend_isolated`, `platform_monorepo`.  
BlueEdge canonical zones: `domain_name` used unchanged.

**3. ZoneCard overview stats — conditional block by `zone.condition_count !== undefined`**

Projection zones (have `condition_count`):
- `N conditions` stat (from `zone.condition_count`)
- `attribution_profile` badge (primary / secondary)
- `zone_class` badge via `zoneTypeMeta()` (compound pressure zone)

BlueEdge canonical zones (no `condition_count`):
- capability count and signal count — unchanged

**4. ZoneCard toggle severity badge**

`{zone.severity}` → `{zone.severity && <span>...}` — blank badges suppressed for projection zones.

**5. ZoneCard type badge (toggle header)**

`zoneTypeMeta(zone.zone_type)` → `zoneTypeMeta(zone.zone_class || zone.zone_type)` — uses zone_class (COMPOUND_ZONE) as the more specific descriptor.

**6. WHY — zone class as primary badge**

`zoneTypeMeta(r.zone_type)` → `zoneTypeMeta(r.zone_class || r.zone_type)` in `WhyResult`.

**7. WHY — severity/confidence badge guard**

Already applied in PI.41X.WORKSPACE-QUERY-SCHEMA-COMPAT.01 (commit aa74444).

**8. WHY — rationale value rendering**

| Value type | Before | After |
|---|---|---|
| Array (embedded_pair_rules) | `JSON.stringify(["COUPLING_ZONE",...])` | `coupling zone · propagation zone · responsibility zone` |
| Object (condition value) | `{"signal_id":"PSIG-001","activation_state":"HIGH","signal_value":9.43}` | `PSIG-001 · HIGH · 9.43` |
| String/number | unchanged | unchanged |

Mapping uses `PAIR_RULE_LABELS` constant for array items.

**9. EVIDENCE — signal block improvements**

| Before | After |
|---|---|
| `signal_id` only in header | `signal_id` + `condition_id` chip |
| `evidence_confidence` badge (blank) | `evidence_confidence || activation_state` badge |
| `title` div (blank) | `title` or `value: {signal_value}` if no title |
| No activation_method | `activation_method.replace(/_/g,' ').toLowerCase()` line |
| "No trace links." always shown | "No trace links." shown only when `trace_links` field is present but empty (BlueEdge); suppressed for projection (field absent) |

**10. EVID_CLS extended** — added `HIGH: 'ws-conf-partial'` and `ACTIVATED: 'ws-conf-weak'` so TRACE path activation state badges receive CSS.

**11. Unresolved block label**

`data.evidence_basis?.canonical_topology_used === false` → label becomes `'Scope — not yet resolved'` in all three result panels (WHY / EVIDENCE / TRACE).

BlueEdge responses: `canonical_topology_used` is not false → label stays `'Unresolved Elements'` unchanged.

---

## Phase C — Validation

### Projection zones

| Check | Result |
|---|---|
| PZ-001 / PZ-002 / PZ-003 visible | PASS |
| Zone titles show anchor names (backend_isolated, etc.) | PASS — via anchor_name fallback |
| Zone toggle badge shows "compound pressure zone" | PASS — via zone_class lookup |
| Attribution profile badge visible in overview | PASS — "primary" / "secondary" |
| Condition count shows "3 conditions" | PASS — from zone.condition_count |
| WHY / EVIDENCE / TRACE return status:ok | PASS — 9/9 CLI combinations |
| WHY rationale values human-readable | PASS — pair rules as labels, conditions as "PSIG · HIGH · value" |
| EVIDENCE badge shows activation_state (HIGH) | PASS — fallback to activation_state |
| EVIDENCE condition_id chip visible | PASS |
| EVIDENCE "value: 9.43" shown instead of blank title | PASS |
| EVIDENCE method "run relative outlier" shown | PASS |
| TRACE badge HIGH styled (ws-conf-partial) | PASS — via EVID_CLS extension |
| Scope boundary label "Scope — not yet resolved" | PASS — detection via canonical_topology_used:false |
| No BlueEdge strings | PASS — no fleet/driver/vehicle/domain strings in projection response |
| No synthetic values | PASS — all labels derived from existing 41.x fields |

### BlueEdge regression

| Check | Result |
|---|---|
| ZONE-01/WHY: status=ok, severity=HIGH | PASS |
| BlueEdge zone type badges unchanged | PASS — lowercase keys unchanged in zoneTypeMeta |
| BlueEdge domain_name in toggle title | PASS — anchor_name undefined → domain_name used |
| BlueEdge overview stats unchanged (caps, sig count) | PASS — condition_count undefined → original block rendered |
| BlueEdge rationale string/number values unchanged | PASS — String() path unchanged |
| BlueEdge trace_links display unchanged | PASS — trace_links present → "No trace links." shown when empty |
| BlueEdge unresolved block label unchanged | PASS — canonical_topology_used not false → "Unresolved Elements" |

---

## Remaining Presentation Gaps

1. **PSIG IDs have no semantic labels** — `PSIG-001`, `PSIG-002`, `PSIG-004` have no title or description in 41.x artifacts. IDs are kept as trace identifiers. Readable labels require 75.x authority (not in scope).

2. **Loading state text** — "Loading canonical zone data…" is displayed briefly during load; for second-client this is slightly inaccurate. Deferred — transient and not user-facing during normal operation.

3. **Context lock Score / Confidence blank** — Projection zone responses carry no score or confidence band; context lock displays `'—'` / `'Not available'`. These are factual states. No synthetic values to be added.

4. **attribution_profile semantics** — "primary" / "secondary" render as text badges but carry no tooltip or explanation. Semantic enrichment requires 75.x interpretation authority.

5. **Graph VaultGraph** — renders from BlueEdge vault structure; projection zones will not resolve to vault nodes. Graph panel shows but node highlighting may be incomplete. Separate concern from workspace text presentation.

---

## Governance Confirmation

- 41.x artifacts not modified
- 75.x artifacts not modified
- tier2_query_engine.py not modified
- No new signals or IDs introduced
- No causal language added
- No synthetic values
- All labels derived from existing 41.x projection fields
- Files modified: `app/gauge-product/pages/tier2/workspace.js` only
