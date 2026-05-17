# A5 Operationalization Correction

## Stream: PI.BLUEEDGE.A5-CANONICALIZATION-AND-REPLAYSAFE-OPERATIONALIZATION.01

### Certification Drift Corrected

The certification stream (PI.E2E.BLUEEDGE.CANONICAL-CERTIFICATION.01) incorrectly framed `dom_path_domain_layer.json` as a "non-canonical conformance artifact." This framing was incomplete and partially incorrect.

**Corrected interpretation:** `dom_path_domain_layer.json` is a historically evolved A.5 semantic participation artifact whose reconstruction methodology was incompletely operationalized into canonical replay-safe runtime governance.

### What was wrong

1. The certification stream treated the 13-domain topology as a conformance bypass rather than a legitimate A.5 semantic participation artifact.
2. CERT-09, CERT-10, and CERT-11 identified real gaps but misattributed the root cause.
3. The "1 cluster, 1 domain" result was not a pipeline limitation — it was two compounding issues:
   - Path A (wrapper normalization): `structural_scanner.py` clusters by `Path.parts[0]`, which collapses when a tar archive has a wrapping directory.
   - Path A.5 (semantic participation): `dom_layer_generator.py` used static name-pattern matching instead of path-prefix structural grouping.

### What was done

1. **Wrapper normalization** operationalized into `structural_scanner.py` (Path A, Lane A):
   - Single-enclosing-directory detection
   - Clustering at depth 1 past wrapper
   - `wrapper_normalization` metadata in 40.4 artifact
   - BlueEdge: 1 cluster → 11 clusters

2. **Path-prefix semantic participation reconstruction** operationalized into `dom_layer_generator.py` (Path A.5):
   - Replaced static DOMAIN_RULES with path-prefix grouping
   - Two-pass subdivision: depth 1, with intermediate directory expansion (>75% ratio)
   - Loads 40.2 node inventory for actual file paths
   - Reads wrapper_metadata from 40.4
   - BlueEdge: 1 domain → 48 domains

3. **Client-agnostic vault construction** in `run_client_pipeline.py`:
   - Removed hardcoded BlueEdge references (commit 64ff900 source authority, "13 DOM groups", hardcoded node count 35)
   - Vault construction now reads domain count and generation method from dom_layer.json

### Certification gap reinterpretation

| Gap ID | Original framing | Corrected framing |
|--------|-----------------|-------------------|
| CERT-09 | "Generic pipeline: 1 domain. LENS-serving: 13 domains." | Two compounding issues: wrapper normalization (Path A) + semantic participation method (Path A.5). Both now operationalized. |
| CERT-10 | "Generic pipeline: 945 nodes. LENS-serving: 35 curated nodes." | 945 vs 35 is expected — reference artifact uses curated nodes. Generic pipeline processes all nodes. Domain count (48 vs 13) reflects structural reality at full node density. |
| CERT-11 | "No AMOps/Vault authority declares canonical reconstruction method." | A.5 semantic participation now declared via `generation_rules.method: a5_path_prefix_reconstruction` in dom_layer.json. |
| CERT-12 | Non-blocking: "run_be_orchestrated_fixup_01 assembled from partial outputs." | Unchanged — historical run, not affected by this stream. |
