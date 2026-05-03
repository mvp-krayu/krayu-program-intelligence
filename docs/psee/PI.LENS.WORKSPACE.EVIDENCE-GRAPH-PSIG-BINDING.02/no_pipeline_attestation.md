# No Pipeline Attestation
## PI.LENS.WORKSPACE.EVIDENCE-GRAPH-PSIG-BINDING.02

**Date:** 2026-05-03

---

## Attestation

During execution of PI.LENS.WORKSPACE.EVIDENCE-GRAPH-PSIG-BINDING.02:

1. **No pipeline was executed.**
2. **No renderer was modified.** `scripts/pios/lens_report_generator.py` — NOT MODIFIED.
3. **No semantic bundle was modified.**
4. **No canonical data was modified.**
5. **No FastAPI was involved.**
6. **No WHY / TRACE logic was changed.**
7. **No API contract was changed.** All API endpoints unchanged.
8. **No report templates were changed.**
9. **No VaultGraph component was modified.** `VaultGraph.js` — NOT MODIFIED.

---

## Files Modified

| File | Change |
|------|--------|
| `app/gauge-product/pages/tier2/workspace.js` | Added `psigSignals` derivation; added `graphVaultIndex` (PSIG-keyed for EVIDENCE mode); added `graphQsForVault` (synthesizes vault_targets from signal_coverage); added visible signal strip JSX; changed VaultGraph props `vaultIndex` → `graphVaultIndex`, `qs` → `graphQsForVault` |

---

## Why vault_targets Synthesis is Not a Logic Change

`graphQsForVault` only populates `vault_targets` from `signal_coverage` in the same response object. This is not new computation — it is a prop-level reshaping of already-received data so that VaultGraph's existing `computeRelevance` function (which checks `vault_targets`) can mark the correct nodes as relevant. The API response, the query logic, and the VaultGraph component are all unchanged.
