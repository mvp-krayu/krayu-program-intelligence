---
name: client_vault_export_binding
description: Canonical truth for Vault Export Binding — ID existence, path structure, signal→claim mapping, domain routing rules
type: canonical
stream: PRODUCTIZE.GAUGE.CLIENT.VAULT.EXPORT.BINDING.01
status: LOCKED
---

# Canonical: Client Vault Export Binding

## Source of Truth

Canonical JSON is the sole source of truth for all vault content:
- `gauge_state.json` — signals, confidence levels, zone traceability
- `canonical_topology.json` — domain structure, capabilities, zone assignments
- `signal_registry.json` — signal definitions and bound claims

Vault files are READ-ONLY projections. They do not author truth.

---

## ID Existence — BlueEdge run_authoritative_recomputed_01

### Artifacts: 7 canonical IDs

ART-01, ART-02, ART-03, ART-04, ART-05, ART-06, ART-07

ART-04 = Signal Registry (canonical signal artifact)
ART-05 = Topology Map (canonical topology artifact)
These two are always included in EVIDENCE mode vault_targets.

### Claims: 27 canonical IDs

CLM-01 through CLM-27 (contiguous range, no gaps)

Signal-bound claims occupy CLM-20 through CLM-24:
- CLM-20: bound to SIG-001
- CLM-21: bound to SIG-002
- CLM-22: bound to SIG-003
- CLM-23: bound to SIG-004
- CLM-24: bound to SIG-005

All other claims (CLM-01..CLM-19, CLM-25..CLM-27) are not signal-bound.
Claims have no materialized vault nodes at present. Status: NOT MATERIALIZED.

### Signals: 5 canonical IDs

SIG-001, SIG-002, SIG-003, SIG-004, SIG-005

Signal→claim binding is deterministic and stable per run:

| Signal  | Bound Claim |
|---------|-------------|
| SIG-001 | CLM-20      |
| SIG-002 | CLM-21      |
| SIG-003 | CLM-22      |
| SIG-004 | CLM-23      |
| SIG-005 | CLM-24      |

### Entities: 5 canonical IDs

- ENT-topology-nodes
- ENT-signal-registry
- ENT-stakeholders
- ENT-sources
- ENT-delivery

### Transformations: 6 canonical IDs

TRF-001 through TRF-006

---

## Domain and Zone Routing — Canonical Rule

No per-domain vault nodes exist in Evidence Vault V3.
No per-zone vault nodes exist in Evidence Vault V3.

Canonical routing rule: all domain and zone queries route to ENT-topology-nodes.

This is not a fallback — it is the correct canonical behavior given vault V3 structure.

---

## Export Path Naming — Canonical Convention

Pattern: `<section>/<ID>.html`

Sections:
- `artifacts/` — for ART-XX IDs
- `claims/` — for CLM-XX IDs
- `entities/` — for ENT-* IDs
- `transformations/` — for TRF-XX IDs
- `navigation/` — for NAV-* IDs

Signal resolution routes to the bound claim's export path.
Domain/zone resolution routes to `entities/ENT-topology-nodes.html`.

---

## URL Construction — Canonical Formula

`/vault/<client>/<run_id>/<export_path>`

BlueEdge example:
`/vault/blueedge/run_authoritative_recomputed_01/claims/CLM-21.html`

---

## vault_index.json — Canonical Location

Build input: `clients/<client>/vaults/<run_id>/vault_index.json`
Runtime copy: `app/gauge-product/public/vault/<client>/<run_id>/vault_index.json`

Both must be identical. The runtime copy is authoritative for resolution.

---

## Immutability Rule

vault_index.json entries are immutable once export_status is set to EXPORTED.
Re-export requires a new run_id.
Canonical JSON remains unchanged between export and runtime consumption.
