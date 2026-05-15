# IMPLEMENTATION_SEMANTICS.md

**Stream:** PI.LENS.V2.PHASE5B0.GOVERNANCE-GATE-75X-INTERPRETATION-AUTHORIZATION.01

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|---|---|---|---|
| authorityTier prop | LensDisclosureShell.jsx | Governance envelope authority classification | REUSABLE — consumed by 5B.2+ callers |
| 75.x Authorization Contract | 75x_interpretation_authorization_contract.md | Formal authorization of bounded interpretive operations | REUSABLE — referenced by all 75.x streams |
| Authority-aware footer | LensDisclosureShell.jsx | Conditional governance disclosure text | REUSABLE — responds to authorityTier value |

## 2. Input Contracts

### authorityTier prop
- **Type:** string
- **Accepted values:** `'DETERMINISTIC'`, `'INVESTIGATIVE'`, `'INTERPRETIVE'`
- **Default:** `'INVESTIGATIVE'`
- **Source:** Caller determines tier based on active query type

### 75.x Authorization Contract
- **Consumed by:** Any stream implementing interpretive outputs
- **Required fields:** Permitted operations list, prohibition list, evidence binding, disclosure wrapping

## 3. Output Contracts

### Governance Envelope Footer (DETERMINISTIC / INVESTIGATIVE)
- Prohibition text: "All outputs structurally derived · no inference · no AI-generated interpretation"
- Inference prohibition: "ENFORCED"
- Interpretive authority: "INACTIVE"

### Governance Envelope Footer (INTERPRETIVE)
- Prohibition text: "Structural derivation primary · bounded interpretive synthesis active · evidence-bound"
- Inference prohibition: "BOUNDED (75.x)"
- Interpretive authority: "ACTIVE"

## 4. Calibration Assumptions

- Default authority tier: `'INVESTIGATIVE'` (not `'DETERMINISTIC'`) — reflects current 5B.1 investigative capability
- Footer text is hardcoded strings, not configurable — intentional for governance stability
- Prohibition list is embedded in CLAUDE.md §3.4.1 — not in code, not overridable at runtime

## 5. Extension Points

- **authorityTier values:** New authority tiers can be added (e.g., `'CERTIFIED'`) by extending the conditional rendering in the footer
- **Footer detail rows:** Additional governance detail rows can be added without modifying existing ones
- **5B.2 integration:** Caller passes `authorityTier='INTERPRETIVE'` when interpretive queries are active

## 6. Module Responsibility Map

| File | Concern |
|---|---|
| CLAUDE.md §3.4.1 | Constitutional authorization of bounded interpretation |
| 75x_interpretation_authorization_contract.md | Formal authorization contract with permitted/forbidden operations |
| TERMINOLOGY_LOCK.md | Canonical definition of "Interpretive Authority" |
| LensDisclosureShell.jsx | Runtime governance envelope with authority-tier awareness |
| brain/*/interpretive_authority.md | 4-brain alignment nodes for interpretive authority concept |
