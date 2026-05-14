# Overlay Mounting and Revocation Model

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.EXECUTION-SANDBOX.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization (Execution Isolation)

---

## 1. Purpose

This document defines how overlays are mounted, attached, activated,
and revoked within the sandbox execution namespace — and how overlay
origin remains externally visible at all times, preventing overlays
from becoming indistinguishable from baseline state.

---

## 2. Mounting Concept

Overlay mounting is analogous to a filesystem overlay mount:

```
Layer 0 (base):    Certified Baseline          ← read-only
Layer 1 (mount):   Overlay composite layer     ← mounted on top
View (merged):     Composite qualification     ← computed view

The mount adds contributions ON TOP of the baseline.
The mount never modifies the baseline.
Unmounting removes contributions; baseline is unchanged.
```

**Key distinction:** The composite view is a COMPUTED result, not a
persisted artifact. It exists only as the output of combining
baseline + mounted overlays.

---

## 3. Mount Operations

### 3.1 Overlay Mount (Activation)

When an overlay package transitions to ACTIVATED (Phase 4 complete):

```
1. VERIFY package is ACTIVATED in sandbox/registry/package_registry.json
2. ADD mount entry to sandbox/mount/mount_registry.json:
   {
     "package_id": "<id>",
     "package_version": <version>,
     "package_hash": "<hash>",
     "mounted_at": "<ISO-8601>",
     "mount_status": "MOUNTED",
     "entry_count": <N>,
     "semantic_classes": ["<authorized classes>"],
     "claim_types": ["<claim types in package>"],
     "target_domains": ["<domains affected>"]
   }
3. RECOMPUTE composite state:
   composite = computeCompositeState(baseline, all_mounted_packages)
4. WRITE composite to sandbox/mount/composite_state.json
5. LOG mount event in sandbox/mount/mount_log.json
6. TAKE replay snapshot
```

### 3.2 Overlay Unmount (Revocation)

When an overlay package is REVOKED:

```
1. VERIFY package is MOUNTED in mount_registry
2. UPDATE mount entry:
   {
     "mount_status": "UNMOUNTED",
     "unmounted_at": "<ISO-8601>",
     "unmount_reason": "<reason>",
     "unmount_authority": "<who authorized>"
   }
3. RECOMPUTE composite state WITHOUT unmounted package:
   composite = computeCompositeState(baseline, mounted_packages - revoked)
4. WRITE composite to sandbox/mount/composite_state.json
5. LOG unmount event in sandbox/mount/mount_log.json
6. TAKE replay snapshot
7. VERIFY: composite matches independent reconstruction without this package
```

### 3.3 Overlay Re-mount (Reactivation)

When a previously REVOKED package is reactivated:

```
1. VERIFY governance authorization for reactivation
2. RE-ENTER package at Phase 1 (full re-validation required)
3. IF validation passes through Phase 4:
   ADD new mount entry (new mount timestamp)
   RECOMPUTE composite with re-mounted package
4. IF validation fails:
   Package remains REVOKED; mount not restored
5. LOG re-mount event
```

### 3.4 Overlay Version Swap (Supersession)

When a package is replaced by a newer version:

```
1. UNMOUNT current version (v1):
   mount_status = "SUPERSEDED"
2. MOUNT new version (v2):
   mount_status = "MOUNTED"
3. RECOMPUTE composite with v2 entries replacing v1 entries
4. VERIFY composite is consistent
5. LOG version swap event
```

---

## 4. Mount Registry

### 4.1 Registry Schema

```json
{
  "sandbox_id": "<namespace_id>",
  "baseline_hash": "<certified baseline hash>",
  "mounts": [
    {
      "package_id": "SEP-blueedge-run01-001",
      "package_version": 1,
      "package_hash": "<hash>",
      "mounted_at": "2026-05-15T10:00:00Z",
      "mount_status": "MOUNTED",
      "unmounted_at": null,
      "unmount_reason": null,
      "entry_count": 3,
      "semantic_classes": ["DOMAIN", "TECHNICAL"],
      "claim_types": ["LINEAGE_UPGRADE"],
      "target_domains": ["DOM-02", "DOM-04", "DOM-06"],
      "origin": "OVERLAY"
    }
  ],
  "mount_summary": {
    "total_mounts": 1,
    "currently_mounted": 1,
    "unmounted": 0,
    "superseded": 0
  }
}
```

### 4.2 Registry Invariants

| Invariant | Enforcement |
|-----------|------------|
| Every ACTIVATED package has a mount entry | Phase 4 completion triggers mount creation |
| Every REVOKED package has unmount metadata | Revocation process updates mount entry |
| Mount order matches package_id order | Package IDs are monotonically assigned |
| Origin field always present | Every mount entry tagged "OVERLAY" |
| No mount entry lacks package_hash | Hash is required for integrity verification |

---

## 5. Overlay Origin Visibility

### 5.1 Origin Preservation Principle

**Overlay contributions must NEVER become indistinguishable from
certified baseline state.**

Every point where overlay data appears carries origin attribution:

| Context | Attribution Mechanism |
|---------|---------------------|
| Mount registry | mount entry with package_id, origin: "OVERLAY" |
| Composite state | overlay_contributions array with per-entry attribution |
| Qualification metrics | static_backed_count vs overlay_backed_count distinction |
| Re-evaluation artifacts | overlay_attribution section with contributing packages |
| Audit trail | every event references originating package_id |
| Replay snapshots | composite_summary distinguishes certified vs overlay |
| SQO cockpit display | mandatory disclosure (overlay-present flag, attribution ratio) |

### 5.2 Origin Queries

The mount registry supports these origin queries:

| Query | Answer |
|-------|--------|
| Which packages are currently mounted? | mount_registry.mounts where mount_status = "MOUNTED" |
| Which domains are overlay-backed? | Aggregate target_domains from mounted packages |
| What percentage is overlay-derived? | overlay_backed_count / composite_backed_count |
| Who authorized this mount? | Activation audit event for the package |
| When was this overlay mounted? | mount entry mounted_at timestamp |
| What would happen if this overlay is unmounted? | Replay without this package |

### 5.3 Origin Stripping Prevention

The following operations are PROHIBITED because they would strip
overlay origin:

| Prohibited Operation | Why |
|---------------------|-----|
| Copying overlay claims into certified baseline | Destroys attribution |
| Removing origin metadata from composite state | Hides overlay presence |
| Merging overlay-backed count into certified count | Eliminates distinction |
| Promoting composite state to certified status | Bypasses pipeline certification |
| Removing mount entries for ACTIVATED packages | Breaks origin chain |

---

## 6. Composite State and Mounting

### 6.1 Composite Construction from Mounts

```
function computeCompositeFromMounts(baseline, mount_registry) {
  composite = deepClone(baseline)
  composite.overlay_contributions = []
  composite.mount_count = 0

  for mount in mount_registry.mounts (ordered by package_id):
    if mount.mount_status != "MOUNTED": skip

    package = loadPackage(mount.package_id, mount.package_version)
    verify(package.hash == mount.package_hash)

    for entry in package.evidence_entries:
      result = applyEntry(composite, entry)
      composite.overlay_contributions.push({
        package_id: mount.package_id,
        entry_id: entry.entry_id,
        claim_type: entry.claim_type,
        target_domain: entry.target_domain,
        applied: result.success,
        origin: "OVERLAY"
      })

    composite.mount_count++

  return composite
}
```

### 6.2 Mount Count Zero Property

When mount_count = 0 (no overlays mounted):

```
composite == certified_baseline  (identity property)
overlay_contributions = []
overlay_backed_count = 0
composite_backed_count = static_backed_count = 4/17
```

This is the fundamental reversibility guarantee: unmounting all
overlays returns to certified-only state.

---

## 7. BlueEdge Mounting Specifics

| Property | BlueEdge Value |
|----------|---------------|
| Max concurrent mounts | 10 (from operationalization limits) |
| Mount ordering | By package_id (monotonic) |
| Primary mount type | LINEAGE_UPGRADE (drives S-state progression) |
| Secondary mount types | LABEL_ASSIGNMENT, CONTINUITY_MAPPING, DOMAIN_TYPING |
| Authorized semantic classes | DOMAIN, TECHNICAL (for architecture records) |
| Target domain count | Up to 13 (unbacked domains) |
| S3 mount requirement | All 13 unbacked domains must have LINEAGE_UPGRADE mounts |

---

## 8. Governance Rules

1. Every mount creates a registry entry with full attribution.
2. Every unmount updates the registry entry with reason and authority.
3. Overlay origin is preserved at every level of the system.
4. No operation may strip overlay origin from contributions.
5. Composite state reflects current mounts (recomputed on every change).
6. Mount count zero equals certified baseline (identity property).
7. Mount registry is append-only (entries updated but never deleted).
8. Re-mounting requires full re-validation (Phase 1 re-entry).
