# CLIENT.VAULT.BINDING.01
# Product Brain Node — Client Vault Binding Model

- Stream: PRODUCTIZE.GAUGE.CLIENT.VAULT.BINDING.01
- Authority: brain/product
- Status: DEFINED — NOT IMPLEMENTED
- Date: 2026-04-22

---

## CORE RULE (NON-NEGOTIABLE)

Vault content is produced once per client by the governed production process.

Runtime may: reference it, link to it, resolve into it.

Runtime must NOT: recreate vault content, author parallel claim/artifact pages, duplicate vault logic inside the app.

There is one vault per client per run. There is one evidence truth.

---

## A. CLIENT VAULT IDENTITY

**Active client:** blueedge
**Authoritative run:** run_authoritative_recomputed_01
**Vault root (repo-relative):** `clients/blueedge/vaults/run_01_authoritative_generated/`
**Vault stream:** PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
**Vault type:** Obsidian-format structured evidence graph — 27 claims, 7 artifacts, 5 entities, 6 transformations

Vault identity is per-client and per-run. Future clients will have their own vault roots at the same structural pattern.

---

## B. TARGET MODEL — DETERMINISTIC VAULT DESTINATIONS

| Runtime Type | Runtime ID Pattern | Vault Destination | Vault Node Type |
|---|---|---|---|
| artifact | ART-01..ART-07 | `artifacts/ART-NN <name>.md` | Artifact node |
| artifact (fallback) | unknown ART-XX | `00 — Navigation/Core Artifacts.md` | Navigation landing |
| signal | SIG-001 | `claims/CLM-20 SIG-001 Sensor Bridge Throughput.md` | Claim node |
| signal | SIG-002 | `claims/CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions.md` | Claim node |
| signal | SIG-003 | `claims/CLM-22 SIG-003 Dependency Load 68 Percent.md` | Claim node |
| signal | SIG-004 | `claims/CLM-23 SIG-004 Structural Volatility Edge Density.md` | Claim node |
| signal | SIG-005 | `claims/CLM-24 SIG-005 Coordination Pressure Partial.md` | Claim node |
| signal (unknown) | SIG-XXX | `entities/ENT-signals.md` | Entity node |
| claim | CLM-NN | `claims/CLM-NN <title>.md` | Claim node (via index) |
| claim (not materialized) | any CLM-XX missing | `governance/Known Gaps.md` | Governance node |
| domain | DOMAIN-XX | `entities/ENT-topology-nodes.md` | Entity node |
| zone scope | ZONE-NN | `entities/ENT-topology-nodes.md` (via domain) | Entity node |

**Signal-to-claim mapping is fixed per vault run.** Every signal in signal_registry.json has exactly one claim node in the vault. This mapping must be encoded in `vault_index.json` (see Section C).

---

## C. BINDING RULES — DETERMINISTIC ID-TO-PATH RESOLUTION

### vault_index.json (required artifact)

The vault builder must produce a `vault_index.json` alongside each vault at:

```
clients/<client>/vaults/<run_id>/vault_index.json
```

Structure:
```json
{
  "client":    "<client_id>",
  "run_id":    "<run_id>",
  "vault_root": "clients/<client>/vaults/<run_id>/",
  "artifacts": {
    "ART-01": "artifacts/ART-01 gauge_state.json.md",
    "ART-02": "artifacts/ART-02 coverage_state.json.md",
    "ART-03": "artifacts/ART-03 reconstruction_state.json.md",
    "ART-04": "artifacts/ART-04 canonical_topology.json.md",
    "ART-05": "artifacts/ART-05 signal_registry.json.md",
    "ART-06": "artifacts/ART-06 binding_envelope.json.md",
    "ART-07": "artifacts/ART-07 admissibility_log.json.md"
  },
  "signals": {
    "SIG-001": "claims/CLM-20 SIG-001 Sensor Bridge Throughput.md",
    "SIG-002": "claims/CLM-21 SIG-002 Platform Runtime State Seven Unknown Dimensions.md",
    "SIG-003": "claims/CLM-22 SIG-003 Dependency Load 68 Percent.md",
    "SIG-004": "claims/CLM-23 SIG-004 Structural Volatility Edge Density.md",
    "SIG-005": "claims/CLM-24 SIG-005 Coordination Pressure Partial.md"
  },
  "navigation": {
    "core_artifacts":        "00 — Navigation/Core Artifacts.md",
    "top_claims":            "00 — Navigation/Top Claims.md",
    "value_creation_path":   "00 — Navigation/Value Creation Path.md",
    "entity_signals":        "entities/ENT-signals.md",
    "entity_topology_nodes": "entities/ENT-topology-nodes.md",
    "known_gaps":            "governance/Known Gaps.md",
    "claim_index":           "00 — Meta/Claim Index.md"
  }
}
```

Runtime reads `vault_index.json` at link-resolution time. No scanning of vault files. No hardcoded paths in runtime code.

---

## D. DELIVERY MODEL — RECOMMENDED TARGET ARCHITECTURE

### Current state (Obsidian-local)
Vault is an Obsidian workspace at `clients/blueedge/vaults/run_01_authoritative_generated/`.  
Links cannot be served to a browser without export or a custom server.  
This is the development-only state.

### Recommended: Static HTML export per run

**Target path:** `clients/<client>/vaults/<run_id>/export/`

**Process:** Vault builder pipeline adds an export step — Obsidian or a custom Markdown-to-HTML converter outputs static HTML files at the same relative paths as the `.md` files.

**Runtime resolution:**
- `/vault?type=artifact&id=ART-04` → serves or links to `export/artifacts/ART-04 canonical_topology.json.html`
- Link target: file:// for local development, relative URL for served deployment

**Repeatability:** Same canonical inputs → same vault → same export → same runtime links. One export per run. Export is a production artifact, not a runtime operation.

**Alternative:** Serve vault files from the Next.js app by copying the export into `public/vault/<client>/<run_id>/`. This makes vault links standard relative URLs and requires no special routing.

### Not recommended
- Obsidian-local links: not repeatable, not browser-compatible
- Runtime-authored vault pages: violates the no-duplication rule

---

## E. FAILURE BEHAVIOR

| Condition | Runtime Behavior |
|---|---|
| vault_index.json not present | Show: "Vault index not available for this client/run. Export has not been produced." No fake content. |
| vault_index.json present, target path not in index | Show: "Target not indexed — resolve via `governance/Known Gaps.md`." |
| Export not yet produced | Show: "Vault not yet exported for this run. [type/id] identified; full vault navigation pending export." |
| Vault unavailable (export missing) | Show resolution card with type/id metadata. Do NOT invent content. Do NOT author a substitute page. |
| Signal without claim mapping | Route to `entities/ENT-signals.md`. Mark as "Entity-level resolution — per-signal claim node not indexed." |

The current `/vault` resolver page fulfills the pre-export failure behavior. It is a TEMPORARY FALLBACK ONLY. It must not accumulate vault-equivalent content.

---

## F. GOVERNANCE LOCK

**Invariants — non-negotiable:**

1. **One vault per client per run.** `clients/blueedge/vaults/run_01_authoritative_generated/` is the only Evidence Vault for this client/run. No second vault surface may be created inside the app.

2. **Runtime is consumer only.** The `/vault` resolver page, the `vault_targets` field, and any future vault navigation are read-only projections into the real vault. They produce no new vault content.

3. **No claim authoring in runtime.** The current `/vault` resolver card is permitted because it reads and reflects existing canonical data. It must not author claims, artifact descriptions, or evidence values that do not exist in the real vault.

4. **vault_index.json is the single resolution authority.** Once produced, all runtime ID-to-vault-path resolution must use it. The hardcoded `ARTIFACT_REGISTRY` in `pages/vault.js` is a pre-index fallback and must be removed when vault_index.json is available.

5. **Repeatability for future clients.** The binding model uses parameterized client/run identity. Future clients follow the same pattern with different vault roots and vault_index.json files.

---

## IMPLEMENTATION STATUS

| Component | Status |
|---|---|
| Vault identity defined | DEFINED |
| Target mapping defined | DEFINED |
| vault_index.json spec defined | DEFINED |
| vault_index.json produced by builder | NOT IMPLEMENTED |
| Static HTML export | NOT IMPLEMENTED |
| Runtime reads vault_index.json | NOT IMPLEMENTED |
| `/vault` resolver uses real vault paths | NOT IMPLEMENTED |
| Vault served via Next.js public/ | NOT IMPLEMENTED |

---

## UPSTREAM AUTHORITY

- PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01 — vault production stream
- PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01 — vault builder spec
- docs/brain/product/VAULT.RUNTIME.ALIGNMENT.01.md — alignment contract
- docs/brain/canonical/client_vault_binding.md — canonical truth
