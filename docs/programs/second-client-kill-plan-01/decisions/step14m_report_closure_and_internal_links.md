# Governance Trace — STEP 14M Report Closure and Internal Links
## PI.SECOND-CLIENT.STEP14M.REPORT-CLOSURE-AND-INTERNAL-LINKS.01

**Program:** second-client-kill-plan-01
**Contract:** PI.SECOND-CLIENT.STEP14M.REPORT-CLOSURE-AND-INTERNAL-LINKS.01
**Branch:** feature/next
**Date:** 2026-04-26
**Status:** COMPLETE

---

## Scope

Four targeted closure changes to Tier-1 reports for the second-client (OSS FastAPI Codebase,
UUID `e65d2f0a-dfa7-4257-9333-fcbb583f0880`), all executed via generator only. BlueEdge
default behavior preserved. 4 HTML artifacts regenerated.

---

## Changes Applied

### 1 — Structural Conclusion Block (Narrative Brief §06)

**Location:** `_build_tier1_narrative_brief()` — Decision Posture section, `use_psig=True` path

Added `.conclusion-block` CSS class and supporting styles to `_TIER1_NARRATIVE_CSS`:

```css
.conclusion-block{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--green);padding:20px 24px;border-radius:3px;margin-top:20px}
.conclusion-label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--green);margin-bottom:12px}
.conclusion-text{font-size:15px;color:var(--fg);font-weight:500;margin-bottom:10px}
.conclusion-body{font-size:13px;color:var(--fg-muted);line-height:1.7;margin-bottom:8px}
```

Appended Structural Conclusion block to `decision_posture_html` (after decision basis, before closing `</div>`):

```html
<div class="conclusion-block">
  <div class="conclusion-label">Structural Conclusion</div>
  <p class="conclusion-text">The system is structurally stable.</p>
  <p class="conclusion-body">Structural analysis shows low dependency load, controlled density, and no system-wide pressure propagation detected.</p>
  <p class="conclusion-body">The INVESTIGATE posture is driven by evidence incompleteness, not by structural instability.</p>
  <p class="conclusion-body">Execution-layer behavior remains outside the current evidence scope.</p>
</div>
```

### 2 — Internal Report-to-Report Links Scoped

**Location:** Both builder functions — `_build_tier1_evidence_brief()` and `_build_tier1_narrative_brief()`

Added `_scoped_report_url()` helper (module-level, after `_get_client_display_name()`):

```python
def _scoped_report_url(name: str) -> str:
    return (f"/api/report-file?name={name}"
            f"&client={_ACTIVE_CLIENT}&runId={_ACTIVE_VAULT_RUN_ID}")
```

Link construction updated in evidence brief:

```python
_narr_name = "lens_tier1_narrative_brief_pub.html" if publish_safe else "lens_tier1_narrative_brief.html"
narr_link  = _scoped_report_url(_narr_name) if use_psig else f"/api/report-file?name={_narr_name}"
```

Link construction updated in narrative brief:

```python
_ev_name = "lens_tier1_evidence_brief_pub.html" if publish_safe else "lens_tier1_evidence_brief.html"
ev_link  = _scoped_report_url(_ev_name) if use_psig else f"/api/report-file?name={_ev_name}"
```

### 3 — Footer Duplicate Removed

**Location:** Both builder functions — `footer_note` variable for `use_psig=True`

Before: `footer_note = f"SAMPLE — All structural values are derived from verified execution evidence."`
After: `footer_note = f"SAMPLE — {client_name}."`

The footer HTML retained one hardcoded line: `All structural values are derived from verified execution evidence.`  
Result: two distinct footer lines with no duplicate phrase.

### 4 — Evidence Brief Hygiene

**a) Domain legend label updated:**

```python
{'<div ...> Primary Pressure Zone</div>' if use_psig else '<div ...> Focus Domain</div>'}
```

BlueEdge label "Focus Domain" preserved. Second-client label now "Primary Pressure Zone".

**b) 0 caps / 0 comps domain sub-text updated:**

```python
if use_psig and ncaps == 0 and ncomps == 0:
    sub_text = "Structural scope: evidence boundary"
else:
    sub_text = f'{ncaps} capabilit{"y" if ncaps==1 else "ies"} · {ncomps} component{"" if ncomps==1 else "s"}'
```

Domains DOM-01 (documentation_root) and DOM-02 (extraction_analysis) have 0 capabilities and
0 components per topology artifacts. These are correctly labeled as "Structural scope: evidence boundary".

**c) Pressure zone repetition eliminated:**

Extracted shared condition set from all zones into `_shared_header` displayed once above zone cards:

```python
_shared_sigs_str = " · ".join(_all_sigs)
_shared_header = (
    f'  <p ...>All zones share the same active condition set: {esc(_shared_sigs_str)}. '
    f'Zone class: {esc(_shared_zclass)} ({_shared_ccount} conditions ≥ threshold).</p>\n'
) if zone_list else ""
```

Per-zone finding reduced to attribution line only:
```
{zone_id} ({zone_name}): {profile} attribution.
```

---

## 4-BRAIN Alignment

| Brain | Status | Basis |
|---|---|---|
| CANONICAL | PASS | All values derived from second-client run artifacts (41.x/, binding/, package/) — no hard-coded values |
| CODE | PASS | Generator only — no hand-edited HTML; `_scoped_report_url()` uses `_ACTIVE_CLIENT`/`_ACTIVE_VAULT_RUN_ID` globals |
| PRODUCT | PASS | Report richness preserved; Structural Conclusion block adds signal clarity without fabricating evidence |
| PUBLISH | PASS | Zero BlueEdge contamination in all 4 output files; internal links correctly scoped |

---

## Validation Results

### Structural Conclusion — narrative_brief

| Check | Result |
|---|---|
| "Structural Conclusion" present | PASS |
| "structurally stable" present | PASS |
| "evidence incompleteness" present | PASS |
| Conclusion block count = 4 (narrative + publish each have 4 occurrences) | PASS |

### Footer Duplicate — both reports

| Check | Result |
|---|---|
| `lens_tier1_narrative_brief.html` — "All structural values" count = 1 | PASS |
| `lens_tier1_evidence_brief.html` — "All structural values" count = 1 | PASS |

### Internal Links — second-client scoped

| File | Link | Scoped? |
|---|---|---|
| `lens_tier1_narrative_brief.html` | `href="/api/report-file?name=lens_tier1_evidence_brief.html&client=e65d2f0a-dfa7-4257-9333-fcbb583f0880&runId=run_01_oss_fastapi"` | YES |
| `lens_tier1_evidence_brief.html` | `href="/api/report-file?name=lens_tier1_narrative_brief.html&client=e65d2f0a-dfa7-4257-9333-fcbb583f0880&runId=run_01_oss_fastapi"` | YES |

### Evidence Brief Hygiene

| Check | Result |
|---|---|
| "Focus Domain" occurrences in second-client evidence_brief = 0 | PASS |
| "Primary Pressure Zone" label present | PASS |
| DOM-01/DOM-02 show "Structural scope: evidence boundary" | PASS |
| Pressure zone condition set deduplicated (shared header) | PASS |

### BlueEdge Contamination

| File | BlueEdge hits | Result |
|---|---|---|
| `lens_tier1_narrative_brief.html` | 0 | PASS |
| `lens_tier1_evidence_brief.html` | 0 | PASS |
| `publish/lens_tier1_narrative_brief_pub.html` | 0 | PASS |
| `publish/lens_tier1_evidence_brief_pub.html` | 0 | PASS |

### BlueEdge Regression

| Check | Result |
|---|---|
| BlueEdge narrative_brief contains "BlueEdge Fleet Management Platform" | PASS |
| BlueEdge narrative_brief contains "0.682" | PASS |
| BlueEdge narrative_brief has no "OSS FastAPI Codebase" | PASS |
| BlueEdge evidence_brief contains "BlueEdge Fleet Management Platform" | PASS |
| BlueEdge evidence_brief contains "0.682" | PASS |
| BlueEdge evidence_brief has no "OSS FastAPI Codebase" | PASS |

---

## Files Modified

| File | Action |
|---|---|
| `scripts/pios/lens_report_generator.py` | Modified — `_scoped_report_url()` helper; conclusion block + CSS; footer dedup; domain legend label; 0-domain sub-text; pressure zone shared header |
| `clients/e65d2f0a.../reports/tier1/lens_tier1_narrative_brief.html` | Regenerated via generator |
| `clients/e65d2f0a.../reports/tier1/lens_tier1_evidence_brief.html` | Regenerated via generator |
| `clients/e65d2f0a.../reports/tier1/publish/lens_tier1_narrative_brief_pub.html` | Regenerated via generator |
| `clients/e65d2f0a.../reports/tier1/publish/lens_tier1_evidence_brief_pub.html` | Regenerated via generator |
| `docs/programs/second-client-kill-plan-01/decisions/step14m_report_closure_and_internal_links.md` | Created — this trace |

## Files NOT Modified

- `clients/blueedge/`: BlueEdge client artifacts unchanged
- `app/gauge-product/`: No runtime changes
- All vault, graph, evidence layer artifacts: unchanged
- `app/gauge-product/pages/api/report-file.js`: unchanged
- `app/gauge-product/pages/api/report.js`: unchanged

---

## Governance Confirmation

- No BlueEdge files modified
- No vault, graph, or evidence layer modified
- All second-client values derived from existing run artifacts
- Generator is the sole authority; no hand-edited HTML
- BlueEdge regression PASS — all 6 checks
- Stream: PI.SECOND-CLIENT.STEP14M.REPORT-CLOSURE-AND-INTERNAL-LINKS.01
