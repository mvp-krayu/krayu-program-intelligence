# Domain Emergence Observations — PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01

## Source

- Client: netbox (netbox-community/netbox)
- Run: run_github_netbox_20260520_134600
- Archive: netbox-64d3b11.tar (v4.6.1)
- Analysis date: 2026-05-20

## 40.4 Path-Prefix Clustering: Domain Blindness

Path-prefix clustering (A.5 algorithm) produced 24 clusters but failed to separate Django apps:

| Cluster | Name | Nodes | Content |
|---------|------|-------|---------|
| CLU-20 | netbox | 2,129 | ALL operational code — 13+ Django apps collapsed |
| CLU-18 | docs | 337 | Documentation |
| CLU-03 | .github | 23 | GitHub CI/templates |
| CLU-01 | .claude | 17 | Claude Code skills |
| CLU-17 | contrib | 9 | Deployment configs |
| CLU-23 | scripts | 6 | Operational scripts |
| 18 others | (singletons) | 1 each | Root-level files |

**Finding:** Path-prefix clustering at depth 1 cannot differentiate Django apps. All 11 apps share `netbox/` as parent directory and merge into a single cluster.

## CLU-20 Internal Distribution (the monolithic cluster)

| App | Nodes | % of CLU-20 |
|-----|-------|-------------|
| templates | 511 | 24.0% |
| project-static | 194 | 9.1% |
| dcim | 184 | 8.6% |
| extras | 172 | 8.1% |
| utilities | 167 | 7.8% |
| netbox (settings) | 163 | 7.7% |
| ipam | 114 | 5.4% |
| core | 113 | 5.3% |
| virtualization | 79 | 3.7% |
| circuits | 77 | 3.6% |
| users | 73 | 3.4% |
| tenancy | 70 | 3.3% |
| translations | 65 | 3.1% |
| vpn | 65 | 3.1% |
| wireless | 64 | 3.0% |
| account | 8 | 0.4% |

## Import-Graph Domain Emergence (40.3s + 40.3c)

Domain boundaries emerge only from cross-domain import analysis. The import graph reveals a 3-tier structural hierarchy:

### Foundation Tier (high imported-by, universal dependency)

| App | Imported by (count) | From N apps | Role |
|-----|---------------------|-------------|------|
| netbox | 620 | 12 (all) | Framework infrastructure |
| utilities | 612 | 12 (all) | Shared primitives |
| core | 155 | 12 (all) | Core models/jobs/config |

### Operational Domain Tier (high bidirectional coupling)

| App | Imports out | Imported by | Cross-domain ratio |
|-----|-------------|-------------|--------------------|
| dcim | 376 from 11 | 228 from 11 | Hub — largest bidirectional coupling |
| extras | 386 from 10 | 131 from 12 | Integration mediator |
| ipam | 169 from 11 | 109 from 11 | Co-dependent with DCIM |

### Consumer Tier (high imports, lower imported-by)

| App | Imports out | Imported by | Structural dependency |
|-----|-------------|-------------|-----------------------|
| virtualization | 195 from 9 | 52 from 7 | Subordinate to DCIM (42 imports) |
| wireless | 118 from 8 | 35 from 6 | Subordinate to DCIM (36 imports) |
| circuits | 133 from 8 | 28 from 6 | Moderate coupling |
| vpn | 105 from 8 | 20 from 5 | Least coupled domain |
| tenancy | 76 from 10 | 109 from 9 | Widely consumed (tenant ownership) |
| users | 86 from 6 | 97 from 10 | Auth/permission consumption |
| account | 17 from 5 | 1 from 1 | Near-independent leaf |

## Key Cross-Domain Import Flows (top 15)

| Count | Flow | Interpretation |
|-------|------|----------------|
| 117 | extras → netbox | Extensibility consumes framework |
| 112 | netbox → utilities | Framework consumes shared primitives |
| 108 | extras → utilities | Extensibility consumes shared primitives |
| 106 | dcim → netbox | DCIM consumes framework |
| 102 | dcim → utilities | DCIM consumes shared primitives |
| 82 | core → netbox | Core consumes framework |
| 66 | extras → core | Extensibility consumes core models |
| 56 | ipam → netbox | IPAM consumes framework |
| 54 | core → utilities | Core consumes shared primitives |
| 51 | virtualization → utilities | Virtualization consumes shared primitives |
| 45 | netbox → extras | Framework consumes extensibility (reverse!) |
| 45 | utilities → netbox | Shared primitives consume framework (reverse!) |
| 43 | circuits → netbox | Circuits consumes framework |
| 42 | virtualization → dcim | Virtualization depends on DCIM models |
| 40 | netbox → core | Framework consumes core models |

## Structural Coupling Summary

- **Total imports:** 3,614
- **Cross-domain:** 2,197 (60.8%)
- **Intra-domain:** 1,417 (39.2%)

The 60.8% cross-domain import rate demonstrates that NetBox's Django app boundaries are organizational, not architectural. The system is a tightly integrated monolith with strong structural coupling across all domains.
