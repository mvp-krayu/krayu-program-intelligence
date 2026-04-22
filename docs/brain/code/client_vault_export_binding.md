---
name: client_vault_export_binding
description: Code authority for Vault Export Binding — implementation phases, vault builder spec, runtime resolution contract, not-implemented boundary
type: code
stream: PRODUCTIZE.GAUGE.CLIENT.VAULT.EXPORT.BINDING.01
status: NOT IMPLEMENTED
---

# Code: Client Vault Export Binding

## Implementation Status

**NOT IMPLEMENTED**

No vault builder script exists. No vault_index.json has been produced. No static HTML export has been generated. The current vault.js page is a pre-export fallback that reads canonical JSON directly — it is NOT a vault surface.

---

## Implementation Phases

### Phase 1 — vault_index.json Producer (NOT IMPLEMENTED)

Script: `scripts/vault/build_vault_export.py`

Inputs:
- `clients/<client>/psee/runs/<run_id>/package/gauge_state.json`
- `clients/<client>/psee/runs/<run_id>/package/canonical_topology.json`
- `clients/<client>/psee/runs/<run_id>/package/signal_registry.json`
- `clients/<client>/vaults/<run_id>/` — vault markdown files

Behavior:
- Enumerate all vault markdown files
- Parse frontmatter to extract canonical IDs
- Build full vault_index.json per schema in CLIENT.VAULT.EXPORT.BINDING.01.md
- Set export_status = "NOT_EXPORTED" for all entries initially
- Write to: `clients/<client>/vaults/<run_id>/vault_index.json`

Output: `vault_index.json` with export_status = "NOT_EXPORTED"

### Phase 2 — HTML Export (NOT IMPLEMENTED)

Script: `scripts/vault/export_vault_html.py`

Inputs:
- `clients/<client>/vaults/<run_id>/vault_index.json`
- All vault markdown files

Behavior:
- Convert each .md file to HTML (dark theme, consistent with gauge UI)
- Write to: `app/gauge-product/public/vault/<client>/<run_id>/<export_path>`
- Update export_status = "EXPORTED" per entry in vault_index.json
- Copy vault_index.json to: `app/gauge-product/public/vault/<client>/<run_id>/vault_index.json`

### Phase 3 — Runtime Resolution Integration (PARTIALLY IMPLEMENTED)

Current state: `pages/vault.js` reads canonical JSON directly as pre-export fallback.

Required upgrade:
- Read `public/vault/<client>/<run_id>/vault_index.json`
- If export_status != "EXPORTED" → render "VAULT NOT EXPORTED" state explicitly
- If EXPORTED → serve static HTML via link/redirect to resolved URL
- Remove direct canonical JSON reads from vault.js

The vault_targets field in EVIDENCE mode responses is already implemented in tier2_query_engine.py.
The VaultLinks component in workspace.js already renders vault_targets. No changes needed to these.

### Phase 4 — vault_index.json Consumption in workspace.js (NOT IMPLEMENTED)

Currently workspace.js uses hardcoded placeholder vault route `/vault?type=TYPE&id=ID`.

Required upgrade:
- Fetch `/vault/<client>/<run_id>/vault_index.json` client-side (or pass via API)
- Run resolution algorithm before rendering vault links
- Show "VAULT NOT EXPORTED" explicitly if not exported
- Replace placeholder route with resolved URL

---

## Resolution Algorithm — Code Contract

```javascript
function resolveVaultLink(type, id, vaultIndex) {
  if (!vaultIndex || vaultIndex.export_status !== 'EXPORTED') {
    return { status: 'NOT_EXPORTED', url: null }
  }

  let entry = null

  if (type === 'artifact') {
    entry = vaultIndex.artifacts?.find(a => a.id === id)
  } else if (type === 'signal') {
    entry = vaultIndex.signals?.find(s => s.signal_id === id)
  } else if (type === 'claim') {
    entry = vaultIndex.claims?.find(c => c.id === id)
  } else if (type === 'domain' || type === 'zone') {
    entry = { export_path: vaultIndex.domain_routing?.fallback_export_path, export_status: 'EXPORTED' }
  } else if (type === 'entity') {
    entry = vaultIndex.entities?.find(e => e.id === id)
  } else {
    return { status: 'INVALID_TYPE', url: null }
  }

  if (!entry) return { status: 'NOT_FOUND', url: null }
  if (entry.export_status !== 'EXPORTED') return { status: 'NOT_EXPORTED', url: null }

  return {
    status: 'RESOLVED',
    url: vaultIndex.base_url + '/' + entry.export_path
  }
}
```

---

## Files Affected (when implemented)

New files:
- `scripts/vault/build_vault_export.py`
- `scripts/vault/export_vault_html.py`
- `app/gauge-product/public/vault/blueedge/run_authoritative_recomputed_01/vault_index.json`
- `app/gauge-product/public/vault/blueedge/run_authoritative_recomputed_01/claims/CLM-*.html` (27 files)
- `app/gauge-product/public/vault/blueedge/run_authoritative_recomputed_01/artifacts/ART-*.html` (7 files)
- `app/gauge-product/public/vault/blueedge/run_authoritative_recomputed_01/entities/ENT-*.html` (5 files)
- `app/gauge-product/public/vault/blueedge/run_authoritative_recomputed_01/transformations/TRF-*.html` (6 files)

Modified files:
- `app/gauge-product/pages/vault.js` — upgrade from canonical-JSON reader to vault_index consumer
- `app/gauge-product/pages/tier2/workspace.js` — upgrade from placeholder links to resolved vault URLs

---

## Constraints

- vault builder script must NOT be run inside the runtime process
- export is a build-time operation, not a request-time operation
- static HTML files must be committed or deployed — not generated on demand
- runtime has no write access to vault content
- vault_index.json must be validated against schema before deployment
