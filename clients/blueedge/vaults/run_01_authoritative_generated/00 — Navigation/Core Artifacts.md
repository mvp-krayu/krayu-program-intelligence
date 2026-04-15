---
title: Core Artifacts
node_type: navigation
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

# Core Artifacts

Seven source artifacts that ground all vault claims.

| artifact | role |
|----------|------|
| [[ART-01 gauge_state.json]] | Terminal execution chain output; primary GAUGE input |
| [[ART-02 coverage_state.json]] | Coverage computation result; DIM-01 source |
| [[ART-03 reconstruction_state.json]] | Reconstruction result; DIM-02 source |
| [[ART-04 canonical_topology.json]] | Topology map: 17 domains / 42 capabilities / 89 components |
| [[ART-05 signal_registry.json]] | 5 governed intelligence signals |
| [[ART-06 binding_envelope.json]] | Binding envelope — cross-domain coverage model |
| [[ART-07 admissibility_log.json]] | IG admissibility decisions; 30 units admitted |

## Artifact → Score Chain

```
ART-07 admissibility_log  → ART-02 coverage_state  → coverage_points  (35)
                          → ART-03 reconstruction   → reconstruction_points (25)
execution_layer_evaluated → completion_points (0)
                                                    ─────────────────────
                                         canonical = 0 + 35 + 25 = 60 = 60
ART-01 gauge_state.json ← all of the above
```
