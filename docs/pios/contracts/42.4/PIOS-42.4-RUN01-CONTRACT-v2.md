# PIOS-42.4-RUN01-CONTRACT-v2
## ExecLens Demo Surface Layer

**Run:** run_01_blueedge
**Layer:** 42.4 — Graphical demo surface (React/Next.js)
**Status:** PASS — all 20 validation checks passed

---

## Layer Chain

```
41.x  locked foundation artifacts (read-only)
42.1  computation / traversal   scripts/pios/42.1/run_execlens_query.py
42.2  narrative rendering        scripts/pios/42.2/render_executive_narrative.py
42.3  CLI delivery               scripts/pios/42.3/execlens_cli.py
42.4  demo surface               scripts/pios/42.4/execlens_adapter.py
                                  app/execlens-demo/
```

---

## Scripts Produced

| Script | Purpose |
|--------|---------|
| `scripts/pios/42.4/execlens_adapter.py` | Python JSON adapter: imports 42.2, returns structured JSON via 42.1 data |
| `scripts/pios/42.4/validate_demo_surface.py` | Validation: AC-01–AC-10 + NS-01–NS-10 (20 checks) |

## Application Produced

| File | Purpose |
|------|---------|
| `app/execlens-demo/package.json` | Next.js 14 app manifest |
| `app/execlens-demo/next.config.js` | Next.js config; sets REPO_ROOT env |
| `app/execlens-demo/pages/_app.js` | App wrapper |
| `app/execlens-demo/pages/index.js` | Main demo page |
| `app/execlens-demo/pages/api/execlens.js` | API route: delegates to Python adapter |
| `app/execlens-demo/components/QuerySelector.js` | Fetches query list from adapter; no hardcoded queries |
| `app/execlens-demo/components/ExecutivePanel.js` | Query header: ID, text, intent, confidence, tags |
| `app/execlens-demo/components/SignalGaugeCard.js` | Signal card with confidence gauge bar |
| `app/execlens-demo/components/EvidencePanel.js` | Evidence chains with supporting objects and chain pipeline |
| `app/execlens-demo/components/NavigationPanel.js` | PIE vault links: resolved ✓ / unresolved ⚠ |
| `app/execlens-demo/styles/globals.css` | Dark terminal-style CSS theme |

---

## Governance Rules Enforced

| Rule | Enforcement |
|------|------------|
| R1 | All data via `_r42._q41.*` — no direct 41.x file access in 42.4 |
| R2 | Adapter imports 42.2 module; 42.2 imports 42.1; layer chain maintained |
| R3 | No synthetic data, no placeholders; missing fields render as null/unavailable |
| R4 | Invalid query_id → exit 1 (propagated from 42.1 via 42.2) |
| R5 | JSON to stdout only; no file writes |
| R6 | Deterministic — same query_id → same JSON (verified AC-09) |

---

## Running the Demo

```bash
# Install dependencies
cd app/execlens-demo
npm install

# Start development server
npm run dev
# → open http://localhost:3000

# Test JSON adapter directly
python3 scripts/pios/42.4/execlens_adapter.py GQ-001
python3 scripts/pios/42.4/execlens_adapter.py --list

# Run validation
python3 scripts/pios/42.4/validate_demo_surface.py
```

---

## Validation Summary

All 20 checks passed on first run.

```
AC-01  execlens_adapter.py exists                              PASS
AC-02  validate_demo_surface.py exists                         PASS
AC-03  adapter imports 42.2 module (render_executive_narrative) PASS
AC-04  adapter accesses 42.1 via _r42._q41 (not direct import) PASS
AC-05  no direct 41.x file path references in adapter          PASS
AC-06  adapter JSON: required fields present for GQ-001        PASS
AC-07  adapter JSON: signals array non-empty for GQ-001        PASS
AC-08  adapter fails closed on invalid query_id                PASS
AC-09  deterministic JSON output across two runs               PASS
AC-10  no file writes in adapter                               PASS
NS-01  package.json exists in app/execlens-demo/               PASS
NS-02  pages/index.js exists                                   PASS
NS-03  pages/api/execlens.js exists                            PASS
NS-04  QuerySelector component exists                          PASS
NS-05  ExecutivePanel component exists                         PASS
NS-06  SignalGaugeCard component exists                        PASS
NS-07  EvidencePanel component exists                          PASS
NS-08  NavigationPanel component exists                        PASS
NS-09  API route calls Python adapter (not inline computation) PASS
NS-10  no hardcoded query content in UI components             PASS
```
