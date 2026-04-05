# Branch Authorization Resolution

**Stream:** GOV-RUNTIME.0
**Date:** 2026-04-05
**Authority:** GOV-RUNTIME.0 stream contract + git_structure_contract.md

---

## 1. Branch Finding

**Current branch:** `work/ig-foundation`

**Authorized domains per git_structure_contract.md §3 and CLAUDE.md §12.1:**

| Branch | Domain |
|---|---|
| main | Stable integrated baseline |
| feature/pios-core | PiOS Core / Ingestion (L1–L4) |
| feature/activation | Activation (L5) |
| feature/runtime-demo | Runtime / Demo (L6–L7) |
| feature/governance | Governance / Canonical definitions (L8) |

**Finding:** `work/ig-foundation` is NOT a recognized branch domain.

**Confirmed by:** git_structure_contract.md §3, §11, §14; CLAUDE.md §12.1.

---

## 2. Branch Existence Check

**Local branches present:**
- `feature/pios-core` — EXISTS locally
- `feature/governance` — NOT present locally (remote only)
- `main` — EXISTS locally

**Result:** `feature/pios-core` is available without checkout overhead.

---

## 3. Domain Classification of Pending Work

| Stream | Domain | Required branch |
|---|---|---|
| GOV-RUNTIME.0 (this stream) | Governance repair (L8) | feature/governance |
| PSEE-GAUGE.0 | PSEE Core schema definition | feature/pios-core |
| Future PSEE streams | PiOS Core (L2–L4) | feature/pios-core |

---

## 4. Resolution Decision

### GOV-RUNTIME.0 (current stream)

**Finding:** Governance artifacts (docs/governance/runtime/) belong to `feature/governance` per the git_structure_contract.md. However, `feature/governance` is not present locally.

**Resolution:** GOV-RUNTIME.0 repair artifacts are written on `work/ig-foundation` under explicit stream contract authorization. This is a bounded emergency repair. No PSEE or Core artifacts are produced.

**Rationale:** The GOV-RUNTIME.0 stream contract explicitly authorizes this execution. The purpose is to restore the pre-flight gate that blocks ALL other streams. Blocking the repair because the governance branch is unavailable creates a circular dependency: governance work needs the governance branch, but the governance branch cannot be accessed without resolution. The stream contract is the operative authority for this bounded action.

**Obligation after repair:** These governance runtime contracts MUST be promoted to `feature/governance` (and ultimately `main`) as part of normal promotion flow. They must not remain permanently on `work/ig-foundation`.

---

### PSEE-GAUGE.0 and all future Core streams

**Resolution:** MUST execute on `feature/pios-core`.

**Required action before PSEE-GAUGE.0 begins:**
1. Checkout `feature/pios-core`
2. Merge or cherry-pick the runtime contract files from this repair
3. Confirm pre-flight on `feature/pios-core`
4. Then open PSEE-GAUGE.0

**`feature/pios-core` is confirmed to exist locally** — checkout is immediately available.

---

## 5. work/ig-foundation Domain Assessment

`work/ig-foundation` is assessed as:

- **Purpose:** IG (Ingestion Governance) foundational work — likely belongs to `feature/pios-core` domain based on IG family ownership
- **Authorized for Core work:** NO — not a recognized branch domain
- **Authorized for this repair:** YES — bounded to GOV-RUNTIME.0 under explicit stream contract authority
- **Long-term status:** Should be merged to `feature/pios-core` or closed; must not accumulate unauthorized Core artifacts

---

## 6. Governance Confirmation

- No silent branch authorization was created.
- The git_structure_contract.md domain model is preserved.
- The only authorized execution on `work/ig-foundation` is this GOV repair stream.
- PSEE-GAUGE.0 is directed to `feature/pios-core`.
