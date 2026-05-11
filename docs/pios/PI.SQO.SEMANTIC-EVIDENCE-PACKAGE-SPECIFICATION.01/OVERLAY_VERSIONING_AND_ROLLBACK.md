# Overlay Versioning and Rollback

**Stream:** PI.SQO.SEMANTIC-EVIDENCE-PACKAGE-SPECIFICATION.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation

---

## 1. Versioning Model

### 1.1 Package Versioning

Each Semantic Evidence Package (SEP) uses monotonic integer versioning:

```
SEP-fastapi-run_02-001.v1.json  ← initial version
SEP-fastapi-run_02-001.v2.json  ← supersedes v1
SEP-fastapi-run_02-001.v3.json  ← supersedes v2
```

Rules:
- Version numbers are sequential integers starting at 1
- Each new version MUST have a strictly higher version number
- Only the latest version of a package may be ACTIVATED
- Prior versions are automatically transitioned to SUPERSEDED status
- SUPERSEDED versions are retained for audit trail

### 1.2 Version Immutability

Once a package version is persisted, its contents are immutable.
The package hash is computed at creation and verified at every load.

To change any field in a package, a new version must be created.
In-place edits are prohibited.

### 1.3 Version Lineage

Each package version beyond v1 MUST declare:

```json
{
  "version_lineage": {
    "prior_version": 1,
    "change_reason": "Updated capability model v2 provides additional domain evidence",
    "entries_added": 3,
    "entries_removed": 1,
    "entries_modified": 2,
    "entries_unchanged": 5
  }
}
```

This lineage enables:
- audit of what changed between versions
- impact analysis before activation
- rollback planning

---

## 2. Rollback Model

### 2.1 Package Revocation

Revoking a package removes its overlay contributions from the
composite semantic state:

```
ACTIVATED → REVOKED

Trigger: explicit revocation command with reason

Effects:
1. Package marked REVOKED in registry
2. Composite state recomputed without this package
3. Qualification re-evaluation triggered
4. Package artifact retained for audit (not deleted)
```

### 2.2 Version Rollback

Rolling back to a prior version of a package:

```
v3 (ACTIVATED) → v3 (SUPERSEDED) + v2 (ACTIVATED)

Trigger: explicit rollback command with reason

Effects:
1. Current version marked SUPERSEDED
2. Target version marked ACTIVATED
3. Composite state recomputed with target version
4. Qualification re-evaluation triggered
```

Rollback is only permitted to versions that were previously
ACTIVATED or STAGED. Rolling back to a version that was never
validated is prohibited.

### 2.3 Full Overlay Reset

In an emergency, all overlays may be deactivated:

```
All ACTIVATED → All REVOKED

Trigger: governance emergency reset command

Effects:
1. All packages marked REVOKED
2. Composite state reverts to certified substrate alone
3. Qualification state reverts to Static CEU evaluation
4. Full re-evaluation triggered
```

This is the nuclear option. It is equivalent to removing the
entire Dynamic CEU layer and returning to the pre-overlay state.

---

## 3. Rollback Safety

### 3.1 Independent Removability Guarantee

Every overlay MUST be independently removable. This means:

1. No overlay may create state that other overlays depend on
   (unless explicitly declared as a dependency).
2. Removing overlay A must not corrupt the contributions of overlay B.
3. The substrate must remain valid after any combination of
   overlay removals.

### 3.2 Dependency Declaration

If overlay B depends on a claim from overlay A (e.g., B's
LINEAGE_UPGRADE assumes A's LABEL_ASSIGNMENT), the dependency
MUST be declared:

```json
{
  "dependencies": [
    {
      "depends_on_package": "SEP-fastapi-run_02-001",
      "depends_on_entry": "SEP-ENTRY-003",
      "reason": "lineage upgrade assumes label assignment from package 001"
    }
  ]
}
```

If A is revoked while B depends on it:
- revocation is BLOCKED
- the dependency must be resolved (revoke B first, or update B
  to remove the dependency)

### 3.3 Rollback Verification

After any rollback:
1. Recompute composite state
2. Verify replay safety (hash comparison)
3. Verify no substrate corruption
4. Verify no orphaned dependencies
5. Log rollback in governance audit trail

---

## 4. Version Retention Policy

| Status | Retention | Reason |
|--------|-----------|--------|
| ACTIVATED | Permanent (while active) | Required for composite computation |
| STAGED | Permanent (until activated or deleted) | Pending review |
| SUPERSEDED | Permanent | Audit trail and rollback capability |
| REVOKED | Permanent | Audit trail |

No package version is ever physically deleted from the artifact store.
Revoked and superseded packages are retained for:
- governance audit
- rollback capability
- replay verification
- provenance chain integrity

---

## 5. Versioning Constraints

1. Maximum one ACTIVATED version per package at any time.
2. Version numbers never reuse (no gaps allowed).
3. Package ID is immutable across versions (only version number changes).
4. Client and run_id are immutable across versions.
5. A version upgrade MUST NOT change the package's source_type.
6. A version upgrade MAY change semantic_class_authorizations (with justification).
7. A version upgrade MAY add, modify, or remove evidence entries.
