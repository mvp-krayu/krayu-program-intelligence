---
node_class: entity
entity_id: ENT-topology-nodes
entity_label: Topology Nodes
status: ACTIVE
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

# Entity: Topology Nodes

## Definition

Topology nodes are the structural units of the emitted platform map. They include domains (highest level), capabilities (mid-level), and components (leaf level).

## Count

148 nodes total: 17 domains / 42 capabilities / 89 components

## Domain Names

- Edge Data Acquisition
- Telemetry Transport and Messaging
- Fleet Core Operations
- Fleet Vertical Extensions
- Analytics and Intelligence
- AI/ML Intelligence Layer
- Sensor and Security Ingestion
- Real-Time Streaming and Gateway
- Access Control and Identity
- Platform Infrastructure and Data
- Event-Driven Architecture
- SaaS Platform Layer
- External Integration
- Frontend Application
- EV and Electrification
- Operational Engineering
- Extended Operations and Driver Services

## Exposure Policy

| zone | what is exposed |
|------|----------------|
| ZONE-1 | Full node explorer with IDs, names, depths |
| ZONE-2 | Domain names only (17 domain names as named areas) |
| ZONE-3 | Full node inventory |

Component-level names are too technical for non-CTO audiences; domain names are business-meaningful.

## Source Artifact

[[ART-04 canonical_topology.json]]

## Related Claims

[[CLM-14 Structural Domain Count]] [[CLM-15 Structural Capability Count]] [[CLM-16 Structural Component Count]] [[CLM-27 Full Node Inventory 148 Nodes]]
