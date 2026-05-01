# Decision Surface Fixup Diff — PI.DECISION-SURFACE.RECONSTRUCTION.FIXUP.01

**Contract:** PI.DECISION-SURFACE.RECONSTRUCTION.FIXUP.01  
**Date:** 2026-04-30  
**File patched:** `scripts/pios/lens_report_generator.py`

---

## FIX-01 — Run ID correction

**Location:** `_configure_runtime()` ~line 910

```python
# BEFORE (BlueEdge-specific guard prevented run_id from updating):
_ACTIVE_CLIENT = client
if client != "blueedge":
    _ACTIVE_VAULT_RUN_ID = run_id

# AFTER (always context-derived from CLI --run-id argument):
_ACTIVE_CLIENT = client
_ACTIVE_VAULT_RUN_ID = run_id
```

Regeneration invocation passes `--run-id run_blueedge_productized_01_fixed`.

---

## FIX-02 — Confidence value correction

**Location:** `_build_decision_surface()` single-zone synthesis block

```python
# BEFORE:
f'Confidence: {esc(str(_pz0.get("zone_confidence", "—")))}'

# AFTER (derived from semantic DOM binding via _resolve_dom_to_semantic_context):
_pz0_conf_raw = _pz0_sem_ctx.get("confidence", 0.0) if _pz0_sem_ctx.get("domain_id") else None
_pz0_lin_stat = _pz0_sem_ctx.get("lineage_status", "") if _pz0_sem_ctx.get("domain_id") else ""
_pz0_confidence_str = (
    f"{_pz0_conf_raw:.2f} — {_pz0_lin_stat}"
    if (_pz0_conf_raw is not None and _pz0_lin_stat and _pz0_conf_raw > 0)
    else str(_pz0.get("zone_confidence", "—"))
)
f'Confidence: {esc(_pz0_confidence_str)}'
```

Resolved to: `0.78 — STRONG` (from semantic_topology_model.json, DOMAIN-10 / DOM-04).

---

## FIX-03 — DOM backing label correction

**Location:** `_build_decision_surface()` single-zone synthesis block

```python
# BEFORE (used semantic business_label — incorrect for DOM backing):
_pz0_dom_bk = (f' / {esc(_pz0_sem_ctx.get("business_label", ""))}'
               if _pz0_sem_ctx.get("domain_id") and _pz0_sem_ctx.get("business_label")
               else "")

# AFTER (uses pressure_zone_projection.json anchor_name — technical DOM label):
_pz0_anchor_name = _pz0.get("anchor_name", "")
_pz0_dom_bk      = (f' / {_pz0_anchor_name}'
                    if _pz0_anchor_name and _pz0_anchor_name != _pz0_anchor
                    else "")
```

Resolved to: `DOM backing: DOM-04 / backend_app_root`.

---

## FIX-04 — Not-activated signal ID display

**Location:** `_build_decision_surface()` gap items block

```python
# BEFORE:
if not_activated:
    _n = len(not_activated)
    gap_items.append(f"{_n} structural signal{'s' if _n != 1 else ''} not activated")

# AFTER (shows IDs from _ds_na_sigs derived from signal_projection.json):
if _ds_na_sigs:
    _na_ids = " · ".join(str(s) for s in sorted(_ds_na_sigs))
    gap_items.append(f"Not-activated signals: {_na_ids}")
elif not_activated:
    _n = len(not_activated)
    gap_items.append(f"Not-activated signals: {_n} structural signal{'s' if _n != 1 else ''}")
```

Resolved to: `Not-activated signals: PSIG-003 · PSIG-005`.

---

## FIX-05 — Structure status qualification

**Location:** `_build_decision_surface()` hero context tags

```python
# BEFORE:
_struct_tag = "STABLE" if (weak_ct == 0 and grounded_ct >= total_doms) else "DEGRADED"

# AFTER:
_struct_tag = ("STABLE within structural evidence scope"
               if (weak_ct == 0 and grounded_ct >= total_doms)
               else "DEGRADED")
```

---

## FIX-06 — Risk label qualification

**Location:** `_build_decision_surface()` after zone_count computation; HTML template

```python
# NEW (computed after zone_count is known):
_risk_explanation = (
    "driven by evidence incompleteness and concentrated structural pressure"
    if (risk == "MODERATE" and not exec_eval and zone_count > 0)
    else ""
)
_risk_label = f"{risk} — {_risk_explanation}" if _risk_explanation else risk

# HTML template change:
# BEFORE: RISK: {esc(risk)}
# AFTER:  RISK: {esc(_risk_label)}
```

---

## FIX-07 — Duplicate coverage paragraph removal

**Location:** `_build_decision_surface()` confirmed card (`_truth_sentences` block)

```python
# REMOVED (was duplicating hero rationale structural statement):
if _sem_ctx_ds["fallback_available"]:
    _truth_sentences.append(
        f"Structural evidence is complete within the current evidence scope: ..."
    )
    if _ds_az_label:
        ...
# KEPT: only the downstream az_label block (pressure pattern sentence onward)
if _sem_ctx_ds["fallback_available"]:
    if _ds_az_label:
        ...
```

---

## FIX-08 — Signal convergence wording

**Location A:** `RC.evidence_pair_block()` — added `support_text` parameter

```python
# BEFORE: static string hardcoded
'All active pressure signals share the same affected domain scope.'

# AFTER: optional parameter, falls back to original if not supplied
def evidence_pair_block(..., support_text: Optional[str] = None):
    _support_line = (support_text if support_text is not None
                     else 'All active pressure signals share the same affected domain scope.')
    ...
    f'{_support_line}'
```

**Location B:** `_build_decision_surface()` call site — dynamic convergence text

```python
_signal_support_text = (
    f"All active signals converge on the same structural domain ({_ds_az_dom_id}), "
    f"indicating concentrated structural pressure within a single semantic domain."
    if _ds_az_dom_id
    else "All active pressure signals share the same affected domain scope."
)
RC.evidence_pair_block(..., support_text=_signal_support_text)
```
