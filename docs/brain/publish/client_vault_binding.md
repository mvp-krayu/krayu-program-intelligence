# client_vault_binding.md
# Publish Brain Node — Client Vault Binding (Publish-Safe Variant)

- Stream: PRODUCTIZE.GAUGE.CLIENT.VAULT.BINDING.01
- Authority: brain/publish
- Status: PUBLISH-SAFE VARIANT — NOT EXPOSED
- Date: 2026-04-22

---

## PUBLISH STATUS

The client vault binding model is an internal governance and implementation contract. It is not currently exposed on any external surface.

When vault navigation is delivered to clients, publish-layer language must reflect only what is actually implemented and verifiable.

---

## PUBLISH-SAFE LANGUAGE (WHEN IMPLEMENTED)

**What can be said externally:**
- "Every diagnostic finding links directly to its evidence source in the client evidence graph"
- "Results trace to the underlying artifacts that produced them"
- "The evidence graph is produced once per engagement and remains the single source of truth for all outputs"
- "Navigation from live results to source evidence is deterministic — the same finding always resolves to the same evidence node"

**What cannot be said:**
- Any specific client name, run ID, or vault path
- Any specific claim ID, artifact ID, or signal ID
- Any language implying the vault is a real-time system (it is produced once per run)
- Any language implying the platform interprets or diagnoses (vault contains evidence, not conclusions)
- Any language implying full vault navigation exists before it is implemented

---

## DRIFT BOUNDARY

| Language | Classification |
|---|---|
| "links to evidence source" | SAFE (once implemented) |
| "traceable to original artifact" | SAFE |
| "produced once per engagement" | SAFE |
| "deterministic navigation" | SAFE |
| "real-time evidence graph" | VIOLATION — vault is static per run |
| "diagnoses supported by evidence" | DRIFT RISK — implies interpretation |
| "evidence confirms findings" | VIOLATION — vault organizes, does not confirm |
| "complete audit trail available" | DRIFT RISK — only use when export is fully implemented |

---

## REPEATABILITY NOTE

The vault binding model is designed for repeatability across clients. Each client engagement produces one vault from the same governed process. The publish surface applies equally to all clients — no client-specific language on external surfaces.

---

## UPSTREAM AUTHORITY

- docs/brain/product/CLIENT.VAULT.BINDING.01.md
- docs/brain/canonical/client_vault_binding.md
