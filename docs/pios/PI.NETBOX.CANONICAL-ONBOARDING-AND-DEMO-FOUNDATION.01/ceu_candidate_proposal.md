# CEU Candidate Proposal — NetBox

## Derivation Method

Structure suggests. Human validates. Evidence anchors.

Candidates derived from PATH A structural substrate:
- 40.4 clusters (directory-level topology)
- 40.3s code graph (16,046 relationships, 3,614 IMPORTS, 1,044 INHERITS)
- 40.3c structural centrality (1,089 ranked files, dual authority decomposition)
- Cross-domain coupling matrix (bidirectional import analysis)

## Structural Tier Classification

The structural substrate reveals a 3-tier architecture:

**FOUNDATION (consumed by many — high import-in ratio):**
- `utilities` — 612 inbound imports, 116 outbound. Ratio 5.28. Pure utility/choice infrastructure.
- `netbox` — 620 inbound, 255 outbound. Ratio 2.43. Core framework (forms, views, models, serializers).

**OPERATIONAL DOMAIN (balanced import flow):**
- `dcim` — 228 in, 376 out. Ratio 0.61. Largest operational domain. Gravitational center.
- `ipam` — 109 in, 169 out. Ratio 0.64.
- `tenancy` — 109 in, 76 out. Ratio 1.43. Higher inbound due to multi-tenancy mixin consumption.
- `core` — 155 in, 165 out. Ratio 0.94. Internal infrastructure (jobs, data sources, object changes).
- `users` — 97 in, 86 out. Ratio 1.13. Authentication/authorization.

**CONSUMER (depends on many — low import-in ratio):**
- `circuits` — 28 in, 133 out. Ratio 0.21.
- `virtualization` — 52 in, 195 out. Ratio 0.27.
- `wireless` — 35 in, 118 out. Ratio 0.30.
- `vpn` — 20 in, 105 out. Ratio 0.19.
- `extras` — 131 in, 386 out. Ratio 0.34. Cross-cutting concerns (custom fields, tags, webhooks).
- `account` — 1 in, 17 out. Ratio 0.06. Minimal leaf.

## Candidate CEU Registry

### Tier 1 — Foundation CEUs (structural infrastructure)

| CEU ID | Domain | Files | Structural Role | Authority Pattern |
|--------|--------|-------|-----------------|-------------------|
| CEU-UTIL | `utilities` | 105 | Foundation utility hub | INH dominant: `utilities/choices.py` (107 INH-in) |
| CEU-CORE-FW | `netbox` | 136 | Core framework spine | INH dominant: `netbox/forms/mixins.py` (96 INH-in) |

These are NOT Django apps — they are structural infrastructure consumed by all operational domains. CEU definition must reflect their role as shared substrate, not independent domains.

### Tier 2 — Operational Domain CEUs (primary)

| CEU ID | Domain | Files | Top Spine | Key Coupling |
|--------|--------|-------|-----------|--------------|
| CEU-DCIM | `dcim` | 156 | `dcim/choices.py` (76 IMP-in) | Bidirectional with IPAM, virtualization, wireless, circuits |
| CEU-IPAM | `ipam` | 94 | `ipam/choices.py` (26 IMP-in) | Bidirectional with DCIM |
| CEU-TENANCY | `tenancy` | 56 | `serializers_/tenants.py` (18 IMP-in) | Consumed by all domain CEUs via multi-tenancy mixins |
| CEU-CORE | `core` | 96 | `core/choices.py` (40 IMP-in) | Bidirectional with extras, consumed by netbox framework |
| CEU-USERS | `users` | 60 | `serializers_/mixins.py` (36 IMP-in) | Bidirectional with netbox framework |
| CEU-EXTRAS | `extras` | 151 | `extras/choices.py` (46 IMP-in) | Cross-cutting: highest outbound (386), bidirectional with netbox/utilities |

### Tier 3 — Consumer Domain CEUs (secondary)

| CEU ID | Domain | Files | Structural Character |
|--------|--------|-------|---------------------|
| CEU-CIRCUITS | `circuits` | 63 | Consumer — depends on DCIM, netbox, utilities |
| CEU-VIRTUAL | `virtualization` | 65 | Consumer — heavy DCIM/utilities dependency |
| CEU-WIRELESS | `wireless` | 51 | Consumer — DCIM-coupled |
| CEU-VPN | `vpn` | 51 | Consumer — most isolated operational domain |
| CEU-ACCOUNT | `account` | 5 | Minimal leaf — consider merging with CEU-USERS |

## Structural Observations (Candidate Review Flags)

### 1. DCIM is the gravitational center
DCIM has the most files (156) and the most cross-domain coupling. It is bidirectionally coupled with IPAM, virtualization, wireless, and circuits. Any CEU model must treat DCIM as the primary operational hub.

### 2. `utilities` and `netbox` are NOT independent domains
They are structural infrastructure. Inheritance authority dominates both (utilities: 107 INH-in; netbox: 96 INH-in). They define base classes consumed by all operational domains. CEU-UTIL and CEU-CORE-FW should be classified as INFRASTRUCTURE, not DOMAIN.

### 3. `extras` is cross-cutting
With 386 outbound imports (highest) and 131 inbound, extras is a horizontal concern layer (custom fields, tags, webhooks, event rules). It touches every domain. CEU-EXTRAS may need special treatment — it's not a domain, it's an extension infrastructure.

### 4. `account` may merge with `users`
5 files, 1 inbound import. Structurally insignificant on its own. Consider CEU-ACCOUNT as a sub-unit of CEU-USERS.

### 5. Dual authority suggests two distinct structural planes
Import authority (DCIM dominates) and inheritance authority (utilities dominates) define different structural hierarchies. CEU boundaries should acknowledge both planes.

## Candidate Count

- 13 candidate CEUs (11 Django apps + 2 infrastructure layers)
- Or 12 if account merges with users
- BlueEdge had 17 for comparison — but BlueEdge's were hand-crafted semantic definitions

## Status

CANDIDATE — requires human validation before any semantic derivation.

These candidates are structural proposals, not semantic truth. The correct boundary:
1. Structure suggests (this document)
2. Human validates or adjusts
3. Evidence anchors (NetBox documentation confirms/refines boundaries)
4. Compiler derives (semantic derivation compiler runs)
5. Operator reviews (SQO review obligations)
6. SQO qualifies (promotion workflow)
