---
name: client_vault_export_binding
description: Publish boundary for Vault Export Binding — what may and may not be externally expressed about vault links, export state, and client vault content
type: publish
stream: PRODUCTIZE.GAUGE.CLIENT.VAULT.EXPORT.BINDING.01
status: PUBLISH-SAFE REQUIRED
---

# Publish: Client Vault Export Binding

## Publish Boundary Status

**PUBLISH-SAFE REQUIRED**

No vault content may be published or externally distributed until:
1. vault builder script is implemented and validated
2. export_status = "EXPORTED" is confirmed in vault_index.json
3. HTML export is reviewed for client-sensitive content
4. Client delivery authorization is obtained

---

## What May Be Published

### Allowed Expressions

- "Evidence Vault" as a product concept — generic, non-client-specific
- The existence of a vault link surface in the GAUGE runtime UI
- "Vault links resolve to exported HTML pages when the vault has been exported"
- The delivery model (static HTML) as an architectural choice
- The vault_index.json concept as a general indexing mechanism

### Allowed in Product-Facing Materials

- Vault link UI is present in EVIDENCE mode workspace
- Vault links route to specific evidence nodes by type and ID
- Vault export is a build-time operation (not real-time)
- Vault content reflects canonical assessment artifacts

---

## What Must NOT Be Published

### Forbidden Expressions

- Any claim that the vault is currently live or accessible
- Any BlueEdge-specific vault node paths, file names, or IDs in external materials
- Any claim that vault_index.json is produced or that export is complete
- Any vault content rendered as if it were a live web surface
- Any assertion that claim materialization is complete (it is NOT MATERIALIZED)
- Any URL that resolves to actual vault HTML (not yet exported)

---

## Drift Boundary Table

| Dimension              | Publish-Safe Claim                          | Forbidden Claim                                  |
|------------------------|---------------------------------------------|--------------------------------------------------|
| Vault existence        | "Vault link surface exists in UI"           | "Vault is live and accessible"                   |
| Export state           | "Export requires build-time script"         | "Vault is exported and available"                |
| Claims                 | "Claims can be linked when exported"        | "All 27 claims are materialized and accessible"  |
| Client specificity     | "Per-client vault per run"                  | Any BlueEdge-specific path or file reference     |
| Delivery model         | "Static HTML via Next.js public/"           | Any live URL pointing to actual vault files      |
| Implementation status  | "Vault builder is not yet implemented"      | Any implication that vault builder runs today    |

---

## Publish Preconditions (All Must Be True)

Before any vault content may be externally distributed:

1. Phase 1 (vault builder) implemented and validated
2. Phase 2 (HTML export) run successfully for target client/run
3. vault_index.json confirms export_status = "EXPORTED" for all entries
4. HTML files reviewed for PII, sensitive content, or client-confidential material
5. Client delivery authorization obtained from engagement owner
6. vault.js upgraded to consume vault_index.json (not raw canonical JSON)
7. Workspace vault links verified to resolve correctly

None of these conditions are currently met.

---

## Vault Content Classification

Vault HTML files contain client assessment artifacts. They are:
- Client-confidential by default
- Not publishable without explicit client authorization
- Not suitable for demo or marketing use without redaction

The publish surface for vault content is client delivery only — not public web.
