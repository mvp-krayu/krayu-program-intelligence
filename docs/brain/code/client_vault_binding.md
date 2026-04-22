# client_vault_binding.md
# Code Brain Node — Client Vault Binding

- Stream: PRODUCTIZE.GAUGE.CLIENT.VAULT.BINDING.01
- Authority: brain/code
- Status: NOT IMPLEMENTED
- Date: 2026-04-22

---

## IMPLEMENTATION STATUS: NOT IMPLEMENTED

The client vault binding model is defined. No binding implementation exists in the runtime code.

---

## CURRENT STATE

### What exists (pre-binding)

`app/gauge-product/pages/vault.js` — runtime resolver page.

- Uses a hardcoded `ARTIFACT_REGISTRY` in JavaScript (ART-01, ART-04, ART-05 only)
- Reads signal and domain data live from canonical JSON via `getServerSideProps`
- Does NOT link to real vault file paths
- Is a TEMPORARY FALLBACK — not a vault surface

`app/gauge-product/pages/tier2/workspace.js` — workspace page.

- Emits `/vault?type=TYPE&id=ID` links in EVIDENCE results (vault_targets) and zone header
- These links resolve to the resolver page, not to real vault files

### What does not exist

| Missing component | Notes |
|---|---|
| `clients/blueedge/vaults/run_01_authoritative_generated/vault_index.json` | Not yet produced by vault builder |
| Runtime `vault_index.json` loader | No code reads the vault index |
| Vault export (`export/` directory) | Vault not yet exported to static HTML |
| Vault served via `public/vault/` | Not configured in Next.js |
| Real vault path resolution in `vault.js` | Page uses hardcoded fallback only |

---

## IMPLEMENTATION PHASES (WHEN AUTHORIZED)

### Phase 1 — vault_index.json production

**File:** `scripts/psee/build_evidence_vault.py`

Add a post-build step that writes:
```
clients/<client>/vaults/<run_id>/vault_index.json
```

Content: complete artifact, signal, and navigation path map per canonical brain node spec.

This is the prerequisite for all subsequent phases.

### Phase 2 — Runtime vault_index.json loader

**File:** `app/gauge-product/pages/vault.js` (modify)

Add server-side loader in `getServerSideProps`:
1. Locate vault_index.json from known client/run identity
2. If present: use index for all ID-to-path resolution
3. If absent: fall back to current hardcoded resolver (pre-binding state)
4. Replace `ARTIFACT_REGISTRY` constant with index-sourced paths

### Phase 3 — Vault export

**Options (in order of preference):**
1. Copy vault `.md` files into `public/vault/<client>/<run_id>/` with Markdown rendering via a Next.js vault route
2. Export vault to static HTML and serve from `public/vault/<client>/<run_id>/export/`

When served, vault link resolution changes:
- `/vault?type=artifact&id=ART-04` → renders `public/vault/blueedge/run_01.../artifacts/ART-04 canonical_topology.json.md`

### Phase 4 — Remove hardcoded fallback

Once vault_index.json is available and export is served, remove `ARTIFACT_REGISTRY` from `vault.js`. All resolution must use the index.

---

## RULES FOR IMPLEMENTATION (WHEN AUTHORIZED)

1. Runtime must NOT write to vault files — vault is produced by `build_evidence_vault.py` only
2. vault_index.json is READ-ONLY from runtime — it is a produced artifact, not a runtime artifact
3. Signal-to-claim mapping must come from vault_index.json, not from hardcoded CLM-XX offsets
4. vault.js must remain a consumer page — it must not author vault-equivalent content
5. If vault_index.json is absent: show the current resolver card, never invent vault content

---

## UPSTREAM AUTHORITY

- docs/brain/product/CLIENT.VAULT.BINDING.01.md
- docs/brain/canonical/client_vault_binding.md
- scripts/psee/build_evidence_vault.py — vault builder (separate pipeline)
- app/gauge-product/pages/vault.js — current pre-binding resolver (temporary)
