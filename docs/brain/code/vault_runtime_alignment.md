# vault_runtime_alignment.md
# Code Brain Node — Vault ↔ Runtime Alignment

- Stream: PRODUCTIZE.GAUGE.VAULT.RUNTIME.ALIGNMENT.01
- Authority: brain/code
- Status: NOT IMPLEMENTED
- Date: 2026-04-22

---

## IMPLEMENTATION STATUS: NOT IMPLEMENTED

The vault-runtime alignment contract is defined. No implementation exists.

The current runtime (tier2_query_engine.py, api/query.js, api/zones.js, tier2/workspace.js) reads canonical JSON directly and does not reference vault file paths or vault node IDs.

---

## WHAT DOES NOT EXIST (YET)

| Feature | File | Status |
|---|---|---|
| Vault navigation helper | scripts/psee/ or app/ | NOT CREATED |
| ID → vault path lookup table | any | NOT CREATED |
| "Open in Evidence Vault" handler | workspace.js | NOT IMPLEMENTED |
| Vault-to-zone dependency map | any | NOT CREATED |
| Vault audit view | workspace or report | NOT IMPLEMENTED |

---

## CURRENT RUNTIME DATA FLOW

```
canonical JSON (canonical_topology.json, signal_registry.json, gauge_state.json)
  → tier2_data.py (derive_zones, get_zone, load_topology, load_signals, load_gauge)
    → tier2_query_engine.py (handle_why, handle_evidence, list_zones)
      → api/query.js or api/zones.js (execFile → JSON response)
        → workspace.js (React — renders ZoneCard, WhyResult, EvidenceResult)
```

Vault is not in this path. The runtime does not read vault files at any point.

---

## WHAT MUST EXIST FOR ALIGNMENT IMPLEMENTATION

### Phase 1 — Navigation helper (prerequisite for all vault links)

```
scripts/psee/vault_nav.py   (or app/gauge-product/lib/vaultNav.js)
```

Responsibilities:
- accept a runtime ID (DOMAIN-XX, SIG-XX, ART-XX)
- return vault file path relative to vault root
- mapping table is static and deterministic (same canonical run → same vault paths)

### Phase 2 — "Open in Evidence Vault" in workspace

In `workspace.js`, each zone card and result panel would gain vault links:
- zone → vault entry via domain entity node
- signal → Entity Signals.md + ART-05
- evidence_basis → ART-04 or ART-05

Links would use the vault path resolver from Phase 1.

### Phase 3 — Vault audit layer (future)

A future panel in workspace.js or a separate audit view:
- display WHY result field alongside vault claim node value
- confirm field-level agreement between runtime derivation and vault source_trace

---

## RULES FOR IMPLEMENTATION (WHEN AUTHORIZED)

1. Runtime MUST NOT read vault files to answer queries — runtime reads canonical JSON only
2. Vault links are presentation-layer only — they open the vault for human navigation
3. Navigation helper maps ID → path; it does not parse vault file content
4. No vault file path may be hardcoded in workspace.js — all paths resolved via helper
5. Vault builder (build_evidence_vault.py) must not be called from runtime — vault is pre-built

---

## UPSTREAM AUTHORITY

- docs/brain/product/VAULT.RUNTIME.ALIGNMENT.01.md
- docs/brain/canonical/vault_runtime_alignment.md
- scripts/pios/tier2_data.py — current data source
- scripts/pios/tier2_query_engine.py — current query engine
- scripts/psee/build_evidence_vault.py — vault builder (separate pipeline)
