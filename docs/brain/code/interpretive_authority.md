# interpretive_authority.md
# Code Brain Node — Interpretive Authority

- Stream: PI.LENS.V2.PHASE5B0.GOVERNANCE-GATE-75X-INTERPRETATION-AUTHORIZATION.01
- Authority: brain/code
- Date: 2026-05-15

---

## IMPLEMENTATION REALITY

### authorityTier Prop

| Aspect | Value |
|---|---|
| Component | `app/execlens-demo/components/lens-v2/LensDisclosureShell.jsx` |
| Prop name | `authorityTier` |
| Type | string |
| Default | `'INVESTIGATIVE'` |
| Accepted values | `'DETERMINISTIC'`, `'INVESTIGATIVE'`, `'INTERPRETIVE'` |
| Current callers | None pass this prop (all use default) |

### Conditional Footer Rendering

The governance envelope footer responds to authorityTier:

**DETERMINISTIC / INVESTIGATIVE (default):**
- Prohibition: "All outputs structurally derived · no inference · no AI-generated interpretation"
- Inference prohibition: ENFORCED
- Interpretive authority: INACTIVE

**INTERPRETIVE:**
- Prohibition: "Structural derivation primary · bounded interpretive synthesis active · evidence-bound"
- Inference prohibition: BOUNDED (75.x)
- Interpretive authority: ACTIVE

### File Locations

| File | Purpose | Status |
|---|---|---|
| `app/execlens-demo/components/lens-v2/LensDisclosureShell.jsx` | Governance envelope with authorityTier | MODIFIED |
| `CLAUDE.md` | §3.4.1 bounded interpretive authority | MODIFIED |
| `docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md` | "Interpretive Authority" locked | MODIFIED |
| `docs/pios/PI.LENS.V2.PHASE5B0.../75x_interpretation_authorization_contract.md` | Authorization contract | CREATED |

### What Does NOT Exist Yet

- No interpretive query types implemented (5B.2)
- No interpretive derive functions (5B.2)
- No interpretive answer panel rendering (5B.2)
- No open copilot query interface (5B.3)

### Integration Points for 5B.2

When 5B.2 implements interpretive queries:
1. Caller passes `authorityTier='INTERPRETIVE'` to LensDisclosureShell
2. New query types added to GUIDED_QUERY_ANSWERS (or separate registry)
3. Answer panel rendering gains interpretive output formatting
4. activeQueryKey model extended for interpretive query types
