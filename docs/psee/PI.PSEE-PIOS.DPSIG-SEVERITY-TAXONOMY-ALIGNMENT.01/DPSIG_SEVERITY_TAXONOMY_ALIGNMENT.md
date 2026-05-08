# DPSIG Severity Taxonomy Alignment

**Stream:** PI.PSEE-PIOS.DPSIG-SEVERITY-TAXONOMY-ALIGNMENT.01  
**Status:** COMPLETE — CERTIFIED  
**Date:** 2026-05-08  
**Governance:** PI.PSEE-PIOS.DPSIG-EXECUTIVE-READINESS-GATE.01  

---

## 1. PROBLEM STATEMENT

After PI.PSEE-PIOS.DPSIG-EXECUTIVE-READINESS-GATE.IMPLEMENTATION.01, FastAPI DPSIG rendered:

```
Cluster Topology Intelligence   CRITICAL         ← h2 headline
  STRUCTURAL DIAGNOSTIC — CLUSTER CONCENTRATION  ← body callout (correct)
```

This was a semantic contradiction:
- Headline implied executive urgency (CRITICAL severity label)
- Body correctly stated engineering/diagnostic-only usage
- Readiness state (DIAGNOSTIC_ONLY) was contradicted by the headline severity

Root cause: `_render_label_color` was correctly gated (muted color for DIAGNOSTIC_ONLY) but `{esc(sev_band)}` remained hardcoded in the h2 span — rendering "CRITICAL" regardless of readiness state.

---

## 2. HEADLINE ALIGNMENT MATRIX

| Readiness State | Headline Severity Label | Color |
|---|---|---|
| `EXECUTIVE_READY` | `sev_band` (CRITICAL/HIGH/ELEVATED/NOMINAL) | severity-colored |
| `EXECUTIVE_READY_WITH_QUALIFIER` | `sev_band` | severity-colored |
| `DIAGNOSTIC_ONLY` | `STRUCTURAL DIAGNOSTIC` | muted (`var(--fg-muted)`) |
| `SUPPRESSED_FROM_EXECUTIVE` | `SUPPRESSED` | muted |
| `BLOCKED_PENDING_DOMAIN_GROUNDING` | `GROUNDING REQUIRED` | muted |

**Principle:** The headline severity label must reflect the rendering context (readiness state), not the raw DPSIG signal value. The raw `severity_band` = "CRITICAL" is preserved in the KPI tiles and metadata — it is not suppressed from the engineering data. It is suppressed from the executive framing (headline and callout).

---

## 3. IMPLEMENTATION

**Change:** Two targeted edits to `scripts/pios/lens_report_generator.py`.

**Edit 1:** Added `_render_sev_label` to each rendering branch:

```python
if _diag_only:
    _render_sev_label = {
        "DIAGNOSTIC_ONLY":                   "STRUCTURAL DIAGNOSTIC",
        "SUPPRESSED_FROM_EXECUTIVE":         "SUPPRESSED",
        "BLOCKED_PENDING_DOMAIN_GROUNDING":  "GROUNDING REQUIRED",
    }.get(_rs, "DIAGNOSTIC")
    ...
elif _with_qual:
    _render_sev_label = sev_band
    ...
else:
    _render_sev_label = sev_band
    ...
```

**Edit 2:** Replaced `{esc(sev_band)}` with `{esc(_render_sev_label)}` in the h2 span:

```html
<h2 style="margin-top:36px">Cluster Topology Intelligence
  <span style="...color:{_render_label_color}...">{esc(_render_sev_label)}</span>
</h2>
```

**Net change:** 6 insertions, 0 deletions. Purely additive variable introduction — `sev_band` is unchanged for executive-ready states.

---

## 4. COHERENT READING CHAIN (FastAPI)

After alignment:

```
Cluster Topology Intelligence   STRUCTURAL DIAGNOSTIC     ← headline
  STRUCTURAL DIAGNOSTIC — CLUSTER CONCENTRATION           ← callout
  CPI=5.6126 (CLUSTER_PRESSURE_HIGH): CLU-17/src...       ← engineering summary
  Readiness: DIAGNOSTIC_ONLY — Cluster is ungrounded...   ← diagnostic notice
  readiness_state=DIAGNOSTIC_ONLY · executive_rendering=NO ← metadata
```

**Reading chain is coherent:** headline → callout → notice → metadata all establish diagnostic frame. No semantic contradiction remains.

**Raw DPSIG evidence preserved:**
- CPI = 5.6126 (visible in engineering summary and KPI tile)
- CFA = 0.7236 (visible)
- severity_band = CRITICAL (visible in KPI tile as raw signal value)
- render_id = 44a820d0ea720f01 (visible in metadata)
- salience = 1.6245 (visible in KPI tile)

---

## 5. VALIDATION

| Check | Result |
|---|---|
| TAX-01: STRUCTURAL DIAGNOSTIC in h2 (evidence brief) | PASS (count: 2) |
| TAX-02: CRITICAL absent from h2 headline | PASS |
| TAX-03: readiness_state=DIAGNOSTIC_ONLY preserved | PASS |
| TAX-04: STRUCTURAL DIAGNOSTIC callout in body | PASS |
| TAX-05: CPI=5.6126 engineering summary visible | PASS |
| TAX-06: DPSIG-031 evidence preserved | PASS |
| TAX-07: render_id=44a820d0ea720f01 preserved | PASS |
| TAX-08: salience=1.6245 preserved | PASS |
| TAX-09: STRUCTURAL DIAGNOSTIC in narrative brief | PASS |
| TAX-10: CRITICAL absent from narrative h2 headline | PASS |
| TAX-11: Coherent reading chain | PASS |
| TAX-12: FastAPI lens_generate.sh EXIT 0 | PASS |
| TAX-13: BlueEdge lens_generate.sh EXIT 0 | PASS |
| TAX-14: BlueEdge STRUCTURAL DIAGNOSTIC absent (no DPSIG) | PASS |
| TAX-15: No client-specific logic | PASS |
| TAX-16: No selector/API/report-contract changes | PASS |
| TAX-17: No DPSIG recomputation | PASS |
| TAX-18: Readiness classifier logic unchanged | PASS |

**Overall Validation: 18 / 18 PASS**

---

## 6. ALIGNMENT VERDICT

**SEMANTIC FRAMING ALIGNED — EXECUTIVE ESCALATION CONTAINED**

- DIAGNOSTIC_ONLY no longer renders CRITICAL headline semantics
- Readiness/headline alignment is deterministic via `_render_sev_label` mapping
- DPSIG evidence (CPI/CFA/render_id/salience) fully preserved
- FastAPI rendering coherent headline → readiness → diagnostic body
- BlueEdge unaffected

---

*Stream: PI.PSEE-PIOS.DPSIG-SEVERITY-TAXONOMY-ALIGNMENT.01*  
*Baseline commit: 94747af*  
*Handoff: PI.LENS.END-TO-END-RERUN.FASTAPI.01*
