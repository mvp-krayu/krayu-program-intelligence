---
name: CLIENT.VAULT.EXPORT.BINDING.01
description: Complete Vault Export Binding Model — vault_index.json schema, export structure, delivery model, runtime resolution contract, governance lock
type: product
stream: PRODUCTIZE.GAUGE.CLIENT.VAULT.EXPORT.BINDING.01
status: LOCKED
---

# CLIENT.VAULT.EXPORT.BINDING.01 — Vault Export Binding Model

## A. Purpose

This artifact defines the complete binding model between the Evidence Vault V3 (client artifact) and the GAUGE runtime. It governs how vault nodes are exported, indexed, resolved, and served. It does not define vault authoring or evidence ingestion.

---

## B. Delivery Model

**SELECTED: Option A — Static HTML via Next.js /public/vault/**

- Vault `.md` files are converted to HTML by a vault builder script (not yet implemented)
- HTML files are placed in `app/gauge-product/public/vault/<client>/<run_id>/`
- Served as static Next.js public files — zero runtime overhead
- URL pattern: `/vault/<client>/<run_id>/<export_path>`
- Example: `/vault/blueedge/run_authoritative_recomputed_01/claims/CLM-21.html`

Rejected alternatives:
- Option B (SSR from markdown): adds server-side parsing cost; vault content is static per run
- Option C (Obsidian integration): not implemented; no API contract defined

---

## C. vault_index.json — Canonical Location

Two locations, identical content:

1. **Source**: `clients/<client>/vaults/<run_id>/vault_index.json`
2. **Deployed**: `app/gauge-product/public/vault/<client>/<run_id>/vault_index.json`

The deployed copy is the runtime-authoritative copy. The source copy is the build input.

---

## D. export_status Field

Every entry in vault_index.json carries:

```json
"export_status": "NOT_EXPORTED" | "EXPORTED"
```

Runtime rule:
- If `export_status != "EXPORTED"` → render explicit "VAULT NOT EXPORTED" state
- No fallback rendering
- No fake content
- The not-exported state must be visible to the user

---

## E. vault_index.json — Full JSON Schema

```json
{
  "vault_id": "string — <client>/<run_id>",
  "client": "string",
  "run_id": "string",
  "export_status": "NOT_EXPORTED | EXPORTED",
  "exported_at": "ISO8601 | null",
  "base_url": "/vault/<client>/<run_id>",

  "artifacts": [
    {
      "id": "ART-01 | ART-02 | ART-03 | ART-04 | ART-05 | ART-06 | ART-07",
      "label": "string",
      "export_path": "artifacts/<ID>.html",
      "export_status": "NOT_EXPORTED | EXPORTED",
      "source_path": "string — relative vault path"
    }
  ],

  "claims": [
    {
      "id": "CLM-01 .. CLM-27",
      "label": "string",
      "export_path": "claims/<ID>.html",
      "export_status": "NOT_EXPORTED | EXPORTED",
      "source_path": "string"
    }
  ],

  "signals": [
    {
      "signal_id": "SIG-001 .. SIG-005",
      "bound_claim_id": "CLM-20 .. CLM-24",
      "export_path": "claims/<bound_claim_id>.html",
      "export_status": "NOT_EXPORTED | EXPORTED"
    }
  ],

  "entities": [
    {
      "id": "ENT-*",
      "label": "string",
      "export_path": "entities/<ID>.html",
      "export_status": "NOT_EXPORTED | EXPORTED",
      "source_path": "string"
    }
  ],

  "transformations": [
    {
      "id": "TRF-*",
      "label": "string",
      "export_path": "transformations/<ID>.html",
      "export_status": "NOT_EXPORTED | EXPORTED",
      "source_path": "string"
    }
  ],

  "navigation": [
    {
      "id": "NAV-*",
      "label": "string",
      "export_path": "navigation/<ID>.html",
      "export_status": "NOT_EXPORTED | EXPORTED"
    }
  ],

  "domain_routing": {
    "rule": "domain IDs route to topology entity node — no per-domain vault nodes exist",
    "fallback_entity_id": "ENT-topology-nodes",
    "fallback_export_path": "entities/ENT-topology-nodes.html"
  },

  "zone_routing": {
    "rule": "zone IDs not individually vaulted — route to topology entity node",
    "fallback_entity_id": "ENT-topology-nodes",
    "fallback_export_path": "entities/ENT-topology-nodes.html"
  },

  "meta": {
    "vault_version": "string",
    "schema_version": "1.0",
    "builder_script": "scripts/vault/build_vault_export.py"
  },

  "governance": {
    "source_of_truth": "canonical JSON — gauge_state.json, canonical_topology.json, signal_registry.json",
    "vault_role": "READ-ONLY projection",
    "mutation_forbidden": true,
    "runtime_role": "consumer only"
  }
}
```

---

## F. BlueEdge Run — Deterministic ID→Path Mapping

Run: `run_authoritative_recomputed_01`
Client: `blueedge`

### Artifacts (7)

| ID     | Label                          | export_path                  |
|--------|--------------------------------|------------------------------|
| ART-01 | Evidence Package               | artifacts/ART-01.html        |
| ART-02 | Stakeholder Map                | artifacts/ART-02.html        |
| ART-03 | Source Inventory               | artifacts/ART-03.html        |
| ART-04 | Signal Registry                | artifacts/ART-04.html        |
| ART-05 | Topology Map                   | artifacts/ART-05.html        |
| ART-06 | Assessment Summary             | artifacts/ART-06.html        |
| ART-07 | Delivery Package               | artifacts/ART-07.html        |

### Claims (27) — CLM-01 to CLM-27

| ID     | export_path            |
|--------|------------------------|
| CLM-01 | claims/CLM-01.html     |
| CLM-02 | claims/CLM-02.html     |
| CLM-03 | claims/CLM-03.html     |
| CLM-04 | claims/CLM-04.html     |
| CLM-05 | claims/CLM-05.html     |
| CLM-06 | claims/CLM-06.html     |
| CLM-07 | claims/CLM-07.html     |
| CLM-08 | claims/CLM-08.html     |
| CLM-09 | claims/CLM-09.html     |
| CLM-10 | claims/CLM-10.html     |
| CLM-11 | claims/CLM-11.html     |
| CLM-12 | claims/CLM-12.html     |
| CLM-13 | claims/CLM-13.html     |
| CLM-14 | claims/CLM-14.html     |
| CLM-15 | claims/CLM-15.html     |
| CLM-16 | claims/CLM-16.html     |
| CLM-17 | claims/CLM-17.html     |
| CLM-18 | claims/CLM-18.html     |
| CLM-19 | claims/CLM-19.html     |
| CLM-20 | claims/CLM-20.html     |
| CLM-21 | claims/CLM-21.html     |
| CLM-22 | claims/CLM-22.html     |
| CLM-23 | claims/CLM-23.html     |
| CLM-24 | claims/CLM-24.html     |
| CLM-25 | claims/CLM-25.html     |
| CLM-26 | claims/CLM-26.html     |
| CLM-27 | claims/CLM-27.html     |

### Signals→Claims Binding (5)

| Signal  | Bound Claim | export_path          |
|---------|-------------|----------------------|
| SIG-001 | CLM-20      | claims/CLM-20.html   |
| SIG-002 | CLM-21      | claims/CLM-21.html   |
| SIG-003 | CLM-22      | claims/CLM-22.html   |
| SIG-004 | CLM-23      | claims/CLM-23.html   |
| SIG-005 | CLM-24      | claims/CLM-24.html   |

### Entities (5)

| ID                     | export_path                          |
|------------------------|--------------------------------------|
| ENT-topology-nodes     | entities/ENT-topology-nodes.html     |
| ENT-signal-registry    | entities/ENT-signal-registry.html    |
| ENT-stakeholders       | entities/ENT-stakeholders.html       |
| ENT-sources            | entities/ENT-sources.html            |
| ENT-delivery           | entities/ENT-delivery.html           |

### Transformations (6)

| ID      | export_path                    |
|---------|--------------------------------|
| TRF-001 | transformations/TRF-001.html   |
| TRF-002 | transformations/TRF-002.html   |
| TRF-003 | transformations/TRF-003.html   |
| TRF-004 | transformations/TRF-004.html   |
| TRF-005 | transformations/TRF-005.html   |
| TRF-006 | transformations/TRF-006.html   |

---

## G. Runtime Resolution Algorithm

```
function resolve_vault_link(type, id, vault_index):
  if vault_index.export_status != "EXPORTED":
    return { status: "NOT_EXPORTED", url: null }

  if type == "artifact":
    entry = vault_index.artifacts.find(id)
  elif type == "signal":
    entry = vault_index.signals.find(signal_id == id)
    → use entry.export_path (routes to bound claim)
  elif type == "claim":
    entry = vault_index.claims.find(id)
  elif type == "domain" or type == "zone":
    entry = { export_path: vault_index.domain_routing.fallback_export_path }
  elif type == "entity":
    entry = vault_index.entities.find(id)
  else:
    return { status: "INVALID_TYPE", url: null }

  if entry is null:
    return { status: "NOT_FOUND", url: null }
  if entry.export_status != "EXPORTED":
    return { status: "NOT_EXPORTED", url: null }

  return {
    status: "RESOLVED",
    url: vault_index.base_url + "/" + entry.export_path
  }
```

---

## H. Failure Model

| Condition                     | Runtime Behavior                          |
|-------------------------------|-------------------------------------------|
| vault_index.json missing      | "VAULT INDEX NOT FOUND" — explicit        |
| export_status = NOT_EXPORTED  | "VAULT NOT EXPORTED" — explicit           |
| type unknown                  | "INVALID VAULT TYPE" — explicit           |
| id not in index               | "VAULT NODE NOT FOUND" — explicit         |
| file 404 at resolved URL      | Browser 404 — acceptable, not masked      |

No fake rendering. No silent fallback. Every failure state must be explicit and visible.

---

## I. Governance Lock

- vault_index.json is produced by vault builder only
- runtime is consumer only — no write operations
- vault files are READ-ONLY projections of canonical JSON
- no vault content may be authored inside the runtime
- the canonical JSON remains the single source of truth
- vault builder is a future implementation — not yet scoped
- this model is LOCKED for BlueEdge run_authoritative_recomputed_01
