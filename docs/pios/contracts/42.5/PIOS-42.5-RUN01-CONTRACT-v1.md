# PIOS-42.5-RUN01-CONTRACT-v1
## ExecLens Demo Surface Refinement (Gauges + Obsidian Activation)

**Run:** run_01_blueedge
**Layer:** 42.5 — Demo surface refinement (visual only, no logic change)
**Status:** PASS — all 18 validation checks passed

---

## Refinement Objectives Delivered

| Objective | Delivered |
|-----------|-----------|
| O1 Governed gauges | Relevance gauge (HIGH/MEDIUM/LOW), Evidence chain stages count, Evidence objects count, Blocked state badge, Navigation coverage bar |
| O2 Obsidian activation | `obsidian://open?vault=<config>&file=<adapter path>` for resolved links |
| O3 Visual polish | Signal gauge row, evidence metrics panel, coverage bar, link affordances |
| O4 Traceability | Every visual element mapped to explicit adapter field (documented in source) |

---

## Governed Gauge Mapping Rules (G7 — explicit, deterministic, inspectable)

### Confidence gauge (existing, retained from 42.4)
| Level | Bar fill | Source |
|-------|----------|--------|
| STRONG | 100% | `signal.evidence_confidence` from adapter |
| MODERATE | 62% | `signal.evidence_confidence` from adapter |
| WEAK | 25% | `signal.evidence_confidence` from adapter |

### Relevance gauge (new in 42.5)
| Level | Bar fill | CSS class | Source |
|-------|----------|-----------|--------|
| HIGH | 100% | `rel-HIGH` | `signal.relevance` from adapter |
| MEDIUM | 62% | `rel-MEDIUM` | `signal.relevance` from adapter |
| LOW | 25% | `rel-LOW` | `signal.relevance` from adapter |

### Evidence metrics (new in 42.5)
| Metric | Extraction rule | Source |
|--------|----------------|--------|
| Chain stages | `evidence_chain.split('→').filter(Boolean).length` | `signal.evidence.evidence_chain` |
| Evidence objects | `supporting_objects.length` | `signal.evidence.supporting_objects` |
| Blocked | `Boolean(evidence.blocking_point)` | `signal.evidence.blocking_point` |

### Navigation coverage bar (new in 42.5)
| Metric | Extraction rule | Source |
|--------|----------------|--------|
| Coverage ratio | `resolvedCount / navigation.length` | adapter `navigation[]` array |
| Fill width | `Math.round(ratio * 100)%` via inline style | computed from above |

### Obsidian deep-link (new in 42.5)
| Element | Value | Source |
|---------|-------|--------|
| vault | `NEXT_PUBLIC_OBSIDIAN_VAULT_NAME` env var | next.config.js config |
| file path | `nb.path.replace(/\.md$/, '')` | adapter `navigation[].path` |
| Full URI | `obsidian://open?vault=<vault>&file=<path>` | deterministic concatenation |

---

## Files Modified

| File | Change |
|------|--------|
| `app/execlens-demo/next.config.js` | Added `NEXT_PUBLIC_OBSIDIAN_VAULT_NAME` config declaration |
| `app/execlens-demo/components/SignalGaugeCard.js` | Added `RelevanceGauge`, `EvidenceMetrics` row with chain stages, object count, blocked badge |
| `app/execlens-demo/components/NavigationPanel.js` | Added `CoverageGauge`, Obsidian `buildObsidianLink()`, config-guarded link rendering |
| `app/execlens-demo/styles/globals.css` | Added `rel-*` relevance gauge classes, `.evidence-metrics-row`, `.coverage-gauge-*`, `.obsidian-link`, `.obsidian-link-hint` |

## Files Created

| File | Purpose |
|------|---------|
| `scripts/pios/42.5/validate_demo_refinement.py` | Validation: AC-01–AC-10 + R-01–R-08 (18 checks) |
| `docs/pios/contracts/42.5/PIOS-42.5-RUN01-CONTRACT-v1.md` | This contract record |

---

## Enabling Obsidian Deep Links

Set the environment variable before starting the dev server:

```bash
NEXT_PUBLIC_OBSIDIAN_VAULT_NAME=krayu-program-intelligence npm run dev
```

Where `krayu-program-intelligence` is the name of your Obsidian vault (typically the repo root directory name). Resolved PIE navigation links will then render as clickable `obsidian://` deep links.

If unset, resolved links display their raw vault-relative paths only (no deep links). Unresolved links remain marked ⚠ and are never linked in either configuration.

---

## Validation Summary

All 18 checks passed on first run.

```
AC-01  refined surface files exist                              PASS
AC-02  SignalGaugeCard: governed gauge values from adapter      PASS
AC-03  no governed gauge uses invented/fallback values          PASS
AC-04  metric extraction logic explicit and inspectable         PASS
AC-05  NavigationPanel: Obsidian deep-link formula present      PASS
AC-06  unresolved links remain marked and non-linked            PASS
AC-07  42.4 baseline sections remain present                    PASS
AC-08  adapter still fails closed on invalid query              PASS
AC-09  adapter output deterministic                             PASS
AC-10  no writes to canonical docs or upstream layers           PASS
R-01   relevance mapping rule declared in SignalGaugeCard       PASS
R-02   coverage gauge formula explicit in NavigationPanel       PASS
R-03   Obsidian link uses adapter nav path (nb.path)            PASS
R-04   NEXT_PUBLIC_OBSIDIAN_VAULT_NAME config declared          PASS
R-05   evidence metrics from evidence payload fields            PASS
R-06   blocked badge conditional on evidence.blocking_point     PASS
R-07   no synthetic confidence percentages                      PASS
R-08   no hardcoded signal content in refined components        PASS
```
