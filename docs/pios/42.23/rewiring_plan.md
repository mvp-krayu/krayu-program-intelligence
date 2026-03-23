# Stream 42.23 — Rewiring Plan

Stream: 42.23 — ExecLens Governed Demo Surface Rewiring
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Branch: feature/42-23-governed-demo-surface-rewiring

---

## Objective

Rewire the ExecLens demo surface topology route from the legacy 42.7 co-occurrence
adapter chain to the governed WOW chain (42.22 + 51.1 + 51.1R). Surface governed
emphasis attributes in the topology panel using the 51.1 static rendering spec.

---

## Scope

In scope:
- topology API route: replace 42.7 adapter with 42.23 WOW chain adapter
- components/TopologyPanel.js: add WOW chain rendering path, update metadata text
- pages/index.js: update hero meta to governed chain reference
- scripts/pios/42.23/execlens_wowchain_adapter.py: new governed adapter

Out of scope:
- overview route (42.6): no 42.22 dependency — unchanged
- query/list routes (42.4): no 42.22 dependency — unchanged
- 75.x interpretation layer: remains blocked
- UI styling for emphasis tokens: additive only, existing CSS classes unmodified

---

## Source Inputs (pre-execution checksums)

| Artifact | SHA-256 |
|---|---|
| docs/pios/42.22/attribute_lineage.json | b94e0cae0f5769aff2740388a74e8016defc25980ccd16723b473c14c271719a |
| docs/pios/42.22/sample_runtime_output.json | ca6c9e1ca8d9ac2c66a1a77edf4155050036f0af55fd80e6ab2445d84530b9af |
| docs/pios/51.1/rendering_spec.md | 593a299629b28cc023feb356246f19b390d9c395cda44973b6167add6c58c835 |
| docs/pios/51.1/ui_mapping_contract.md | 3b993881c4c3ab1316dd7c2962902349d45285b13f0eaed2a455f10ddc316d88 |

---

## Target Files (pre-execution checksums)

| File | Pre-Execution SHA-256 |
|---|---|
| app/execlens-demo/pages/api/execlens.js | 32712ef70b0f579073640d6a288f25ad901b40d1ecf1c84f10b9c5436b20d444 |
| app/execlens-demo/components/TopologyPanel.js | 2503e67fcba8b572dad1e9c471a0394aef2996648f84bea901e45d5bbd36d80a |
| app/execlens-demo/pages/index.js | b546fac64323b4346341252edf5b460366b356d66b692ecff9b353619973d223 |

---

## Rewiring Steps

### Step 1 — Create scripts/pios/42.23/execlens_wowchain_adapter.py

- Reads docs/pios/42.22/sample_runtime_output.json (governed source)
- Validates emphasis field per governed closed set [high, medium, low, none]
- Applies 51.1 static mapping: high→RENDER_RED, medium→RENDER_AMBER, low→RENDER_NEUTRAL, none→RENDER_NONE
- Outputs: contract_id, wow_chain=true, exposure_records with emphasis_render_token
- Fail-closed on 5 trigger conditions per 51.1 spec

### Step 2 — Modify pages/api/execlens.js

- Add ADAPTER_42_23 constant pointing to scripts/pios/42.23/execlens_wowchain_adapter.py
- Replace ADAPTER_42_7 call in topology route with ADAPTER_42_23
- Remove --query/--highlight args (WOW chain does not filter by query)
- Update file comment to PIOS-42.23-RUN01-CONTRACT-v1

### Step 3 — Modify components/TopologyPanel.js

- Add ExposureNodeRow component for governed emphasis records
- Add RENDER_TOKEN_CLASS map (RENDER_RED/AMBER/NEUTRAL/NONE → CSS class)
- Add WOW chain render path: detect topology.wow_chain === true
- Retain legacy hierarchy render path for fallback compatibility
- Update metadata text to governed WOW chain wording
- Update file comment to PIOS-42.23-RUN01-CONTRACT-v1

### Step 4 — Modify pages/index.js

- Update hero meta: PIOS-42.23-RUN01-CONTRACT-v1 · run_02_governed
- Update chain reference: 42.22 → 51.1 → 51.1R → 42.23
- Update description meta tag to run_02_governed
- Update file comment to PIOS-42.23-RUN01-CONTRACT-v1

---

## Fail-Closed Conditions

Execution terminates with NO OUTPUT if:
1. 42.22 source file missing or unreadable
2. exposure_records absent or empty
3. emphasis field absent from any record
4. emphasis value outside governed closed set
5. mapping ambiguity in RENDERING_MAP
