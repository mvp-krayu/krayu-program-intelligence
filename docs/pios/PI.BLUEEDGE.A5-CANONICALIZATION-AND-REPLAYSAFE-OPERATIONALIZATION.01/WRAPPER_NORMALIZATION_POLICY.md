# Wrapper Normalization Policy

## Stream: PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01
## Lane: A (Path A — deterministic structural analysis)

### Policy Statement

When a source archive extracts with a single enclosing root directory (wrapper), the structural scanner normalizes clustering to skip the wrapper. The wrapper is an archive packaging artifact, not a structural boundary.

### Detection Logic

In `build_canonical_topology()` within `structural_scanner.py`:

1. Group all nodes by `Path(node["path"]).parts[0]` (initial clustering).
2. If exactly one initial cluster exists:
   a. Check if nodes within that cluster have paths deeper than 1 component.
   b. If yes: the single cluster name is the wrapper prefix.
3. When a wrapper is detected, re-cluster by `Path(node["path"]).parts[1]` instead.

### Behavior

| Condition | Result |
|-----------|--------|
| Multiple top-level directories (e.g., Flask: `src/`, `tests/`, `docs/`) | No wrapper detected. Cluster by `parts[0]` as before. |
| Single top-level directory (e.g., BlueEdge: `blueedge-platform/`) | Wrapper detected. Cluster by `parts[1]` (the level inside the wrapper). |
| Single top-level directory with no children deeper than 1 level | No wrapper detected. Treated as legitimate structural boundary. |

### Metadata

The 40.4 `canonical_topology.json` artifact includes:

```json
"wrapper_normalization": {
  "wrapper_detected": true,
  "wrapper_prefix": "blueedge-platform"
}
```

This metadata is consumed by the A.5 `dom_layer_generator.py` to strip the wrapper prefix from effective paths during domain derivation.

### Path A Compliance

- Wrapper normalization is a Path A concern (archive packaging vs structural boundary).
- Original node paths in 40.2 are NOT modified — only clustering behavior changes.
- The 40.4 artifact records the normalization decision for downstream consumers.
- Lane A artifacts remain deterministic: same archive → same wrapper detection → same clusters.

### Validation

- BlueEdge: wrapper `blueedge-platform` detected → 11 clusters (was 1 without normalization).
- FastAPI: no wrapper → 19 clusters (unchanged from prior behavior).
