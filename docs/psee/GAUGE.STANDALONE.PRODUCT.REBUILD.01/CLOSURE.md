1. Status: COMPLETE

2. Scope:
   GAUGE.STANDALONE.PRODUCT.REBUILD.01
   Rebuild Gauge as standalone Next.js product at app/gauge-product/
   Authoritative baseline: docs/pios/PSEE.UI/run_01_blueedge_surface/gauge_v2_product.html
   Topology isolated as opt-in add-on (OFF by default)

3. Change log:
   - Created app/gauge-product/ standalone Next.js app (7 files)
   - CSS ported from baseline HTML; React state patterns added
   - TopologyAddon.js: self-contained topology add-on, no cross-app import
   - pages/index.js: faithful port of all baseline sections, React state for modal + discovery + topology
   - pages/api/topology.js: proxy route to ExecLens DEMO adapter
   - No modification to existing files

4. Files impacted:
   NEW: app/gauge-product/package.json
   NEW: app/gauge-product/next.config.js
   NEW: app/gauge-product/pages/_app.js
   NEW: app/gauge-product/styles/gauge.css
   NEW: app/gauge-product/components/TopologyAddon.js
   NEW: app/gauge-product/pages/index.js
   NEW: app/gauge-product/pages/api/topology.js
   NEW: docs/psee/GAUGE.STANDALONE.PRODUCT.REBUILD.01/gauge_standalone_rebuild_contract.md
   NEW: docs/psee/GAUGE.STANDALONE.PRODUCT.REBUILD.01/gauge_standalone_rebuild_validation.md
   NEW: docs/psee/GAUGE.STANDALONE.PRODUCT.REBUILD.01/GAUGE.STANDALONE.PRODUCT.REBUILD.01_EXECUTION_LOG.md
   NEW: docs/psee/GAUGE.STANDALONE.PRODUCT.REBUILD.01/CLOSURE.md

5. Validation:
   24 / 24 checks PASS
   0 failure codes triggered
   See: gauge_standalone_rebuild_validation.md

6. Governance:
   Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
   Branch domain: work/psee-runtime (runtime/demo layer)
   No cross-domain execution
   No Core derivation, no synthetic data

7. Regression status:
   No existing files modified
   ExecLens DEMO (app/execlens-demo/) unaffected
   Gauge product is standalone and independently deployable

8. Artifacts:
   docs/psee/GAUGE.STANDALONE.PRODUCT.REBUILD.01/gauge_standalone_rebuild_contract.md
   docs/psee/GAUGE.STANDALONE.PRODUCT.REBUILD.01/gauge_standalone_rebuild_validation.md
   docs/psee/GAUGE.STANDALONE.PRODUCT.REBUILD.01/GAUGE.STANDALONE.PRODUCT.REBUILD.01_EXECUTION_LOG.md
   docs/psee/GAUGE.STANDALONE.PRODUCT.REBUILD.01/CLOSURE.md

9. Ready state:
   READY — app/gauge-product/ is complete and deployable
   To run: cd app/gauge-product && npm install && npm run dev (port 3001)
   Topology adapter (app/execlens-demo) must be running for topology panel to populate
