# Structure Reconstruction

## Definition
Step 02 of the PiOS transformation chain. Rebuilds program structure, dependencies, and execution topology from ingested evidence. No interpretive work from other steps is performed here.

## Classification
- Phase 1 Category: D — PiOS Process Step Construct
- Surface Type: no_route
- Maturity Level: NONE
- Authority Codes: none present

## Role in Program Intelligence
Process step sub-construct of pios. Second step in the four-step PiOS transformation chain. Reconstructs program architecture and dependency relationships from evidence before signal computation.

## Canonical Position
- Route: none
- Backing File: none
- Canonical URL: none
- Referenced In: pages/pios.md, pages/signal-infrastructure.md
- Publish Status: not applicable

## Relationships
Inbound:
- pios →[P] structure_reconstruction

Outbound:
- none documented in Phase 1 or Phase 2

## Boundaries
- Not a top-level authority node
- No standalone route or backing page — defined within pios only
- One of four ordered PiOS steps — not independently authoritative
- Program structure, dependency mapping, and topology are outputs of this step — not separate graph entities

## Authority Level
- Level: Derivative
- Graph Depth: 1 under pios
- Not promotable to top-level

## Public Surface Readiness
- publish_status: not applicable — no backing page
- Maturity: NONE
- Surface: no_route
- Gap: no standalone definition, no backing page, no canonical URL, no authority codes

## Graph Links
- Primary Parent: [[pios]] [L0] — depth 1

## Exclusions
- Program structure outputs are not graph entities in Phase 1 inventory
- Topology reconstruction outputs feed into signal_computation — not a separate derivative entity
