# Stream Start Protocol

> **The complete sequence for starting a new PI stream.**

---

## Protocol

### Step 1 — Load Governance

```
Load CLAUDE.md
Load git_structure_contract.md
```

### Step 2 — Load Vault Context

```
Load vault: PIOS_CURRENT_CANONICAL_STATE.md
Load vault: TERMINOLOGY_LOCK.md
Load vault: concept-specific pages (per contract scope)
```

### Step 3 — Pre-flight Verification

```
Verify: branch authorized for planned work
Verify: contract inputs present
Verify: dependencies complete
Verify: validators present (if applicable)
```

### Step 4 — Conditional Loads

```
If cross-layer → load reference_boundary_contract.md
If skill trigger → read SKILLS.md
If 4-Brain trigger → execute 4_BRAIN_ALIGNMENT
```

### Step 5 — Log Pre-flight

Record pre-flight results in execution_report.md.

### Step 6 — Execute

Proceed with contract execution per CLAUDE.md rules.

### Step 7 — Close

```
Produce: execution_report.md
Produce: CLOSURE.md (mandatory 9-section format)
Issue: RETURN block (8-item format)
```

## Cross-References

- [[CLAUDE_LOAD_REQUIREMENTS]] — load details
- [[PREFLIGHT_AND_BRANCH_ENFORCEMENT]] — enforcement details
- [[ARCHITECTURE_LOAD_PROTOCOL]] — architecture-specific loading
