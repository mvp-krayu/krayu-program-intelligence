# Vault Semantic Evolution Lineage

> **How "vault" changed meaning across the system's evolution.**

---

## Meaning 1: Obsidian File Vault (Stratum 2)

**Context:** ExecLens era
**Meaning:** Obsidian vault navigation — evidence files organized in Obsidian, linked via obsidian:// protocol
**Commits:** Present in ExecLens-era code (utils/obsidian.js, TopologyPanel.js)
**Branch:** feature/runtime-demo era

## Meaning 2: PIE Vault / Semantic Inventory (Stratum 2)

**Context:** Stream 41.2
**Meaning:** 17-domain, 42-capability, 89-component semantic inventory
**Location:** docs/pios/41.2/pie_vault/
**Branch:** feature/pios-core

## Meaning 3: Structural Evidence Vault (Stratum 3+)

**Context:** PATH A emergence
**Meaning:** Structural evidence backing — vault anchors provide grounding proof for semantic claims
**First usage:** ~2026-05-01 (evidence chain work)
**Commits:**
- 6a93a56 (2026-05-01): BlueEdge evidence chain manifest
- 550b2ce (2026-05-04): Vault readiness conformance gap
- 834bb97 (2026-05-04): Close vault readiness gap

## Current Canonical Meaning

**"Vault" = structural evidence backing.** Always. In all current contexts.

See [[../06_CANONICAL_TERMINOLOGY/SEMANTIC_COLLISIONS]] for full collision documentation.

## Cross-References

- [[../06_CANONICAL_TERMINOLOGY/SEMANTIC_COLLISIONS]] — collision documentation
- [[../06_CANONICAL_TERMINOLOGY/VAULT_SEMANTIC_MUTATION]] — mutation tracking
- [[EXECUTION_RUNTIME_LINEAGE]] — parallel evolution
