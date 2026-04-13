# GAUGE.STANDALONE.PRODUCT.REBUILD.01 — Validation

## Validation Identity

- Contract: GAUGE.STANDALONE.PRODUCT.REBUILD.01
- Mode: POST-BUILD STRUCTURAL VALIDATION
- Date: 2026-04-12
- Verdict: COMPLETE — PASS

---

## Validation Table

| Check | ID    | Description                                                | Result |
|-------|-------|------------------------------------------------------------|--------|
| VB-01 | File  | `app/gauge-product/package.json` exists, port 3001         | PASS   |
| VB-02 | File  | `app/gauge-product/next.config.js` exists                  | PASS   |
| VB-03 | File  | `app/gauge-product/pages/_app.js` exists, imports gauge.css | PASS  |
| VB-04 | File  | `app/gauge-product/styles/gauge.css` exists, contains all baseline sections | PASS |
| VB-05 | File  | `app/gauge-product/components/TopologyAddon.js` exists     | PASS   |
| VB-06 | File  | `app/gauge-product/pages/index.js` exists                  | PASS   |
| VB-07 | File  | `app/gauge-product/pages/api/topology.js` exists           | PASS   |
| VB-08 | State | `showTopology` defaults to `false` (topology OFF by default) | PASS |
| VB-09 | State | `discoveryEnabled` defaults to `false`                     | PASS   |
| VB-10 | Key   | `VALID_KEY = 'PIOS-DISCOVERY-DEMO'` present verbatim       | PASS   |
| VB-11 | Content | Top bar: run_01, PHASE_1_ACTIVE, gauge-v2-product, score grid (60/100/[60-100]) | PASS |
| VB-12 | Content | Left col: Score Decomposition, Component Detail (3 blocks + CTA), Capabilities Not Available (4), Confidence Band, Operator Mode | PASS |
| VB-13 | Content | Right col: Structural Proof (SI bridge, 3 metrics), Discovery Queries (3 structural + 2 exec-locked), State Summary (7 rows) | PASS |
| VB-14 | Separation | No import from `app/execlens-demo/` | PASS |
| VB-15 | Activation | `TopologyAddon` receives `showTopology` and `onToggle` props from index.js | PASS |
| VB-16 | Activation | `TopologyAddon` renders activation bar always; panel only when `showTopology=true` | PASS |
| VB-17 | Fetch | `useTopologyData` fetches only when `active=true` | PASS |
| VB-18 | API | `/api/topology` proxies to `TOPOLOGY_UPSTREAM_URL/api/execlens?envelope=true` | PASS |
| VB-19 | CSS | `.topology-addon-bar`, `.topology-addon-btn`, `.topology-addon-panel`, `.topology-addon-note` present | PASS |
| VB-20 | CSS | `.cta-btn-enabled`, `.si-bridge-btn-enabled` present | PASS |
| VB-21 | Modal | Access key modal: React state, not DOM mutation | PASS |
| VB-22 | Discovery | Structural queries gain `unlocked` class when `discoveryEnabled=true` | PASS |
| VB-23 | Discovery | Exec-locked queries never unlock | PASS |
| VB-24 | State row | Discovery state row reflects `discoveryEnabled` (dot color, text) | PASS |

---

## Failure Codes NOT Triggered

| Code   | Description                                        |
|--------|----------------------------------------------------|
| GSR-01 | Baseline content deviation from HTML source        |
| GSR-02 | Topology auto-activates without explicit toggle    |
| GSR-03 | Import from app/execlens-demo/ present             |
| GSR-04 | Access key hardcoded incorrectly                   |
| GSR-05 | Discovery unlocks exec-locked queries              |
| GSR-06 | Topology data fetched when inactive                |
| GSR-07 | CSS sections missing from port                     |

---

## Final Verdict

**COMPLETE — PASS**

All 24 checks PASS. No failure codes triggered.
Standalone Gauge product is structurally complete and governance-compliant.
