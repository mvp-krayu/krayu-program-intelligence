# Unsupported Metric Suppression — PI.DECISION-SURFACE.RECONSTRUCTION.01

**Contract:** PI.DECISION-SURFACE.RECONSTRUCTION.01  
**Date:** 2026-04-30

## Unsupported Metrics in This Run

The following metrics are `NOT_IN_SCOPE` for this run:

| Metric | Value | Suppression |
|---|---|---|
| dep_load (dependency load ratio) | NOT_IN_SCOPE | Not displayed, not classified |
| edge_to_node (structural density) | NOT_IN_SCOPE | Not displayed, not classified |
| containment_density | NOT_IN_SCOPE | Not displayed, not classified |

## Suppression Rule Applied

```python
if metrics and dep_load not in ("—", "NOT_IN_SCOPE"):
    _truth_sentences.append(
        "Dependency and structural density remain within controlled bounds.")
```

This conditional ensures "Dependency and structural density remain within controlled bounds." is NOT emitted when `dep_load == "NOT_IN_SCOPE"`. The statement is **absent** from the reconstructed Decision Surface.

## Confirmed Absence

grep for "dep_load", "density remain", "dependency.*low", "dependency.*high" in reconstructed DS: 0 matches.

## Implication

The INVESTIGATE posture is derived from evidence gaps (execution layer + semantic coverage), NOT from metric elevation. The Decision Surface does not claim any dependency risk level because those metrics are outside the current evidence scope.
