# Replay Commands — PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01

## Prerequisites

- Python 3.9+
- Git
- ~200MB disk space
- Repository: k-pi-core at commit `67d1c39` or later (feature/PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01 branch)

## Replay Sequence

All commands run from repository root.

### Phase A — Source Acquisition

```bash
# 1. Clone NetBox (shallow)
git clone --depth 1 https://github.com/netbox-community/netbox.git /tmp/netbox-clone

# 2. Archive FULL repository (excluding .git)
cd /tmp/netbox-clone && tar cf /tmp/netbox-source.tar --exclude='.git' . && cd -

# 3. Compute SHA256
shasum -a 256 /tmp/netbox-source.tar
# Expected (may differ on future clones — tied to HEAD at time of run):
# 043d4ca2b85fde16e2bc86eea6631e5f363c8f5c59d14332eed11d0f0c44a697

# 4. Get commit short hash
SHORT_HASH=$(cd /tmp/netbox-clone && git rev-parse --short HEAD) && echo $SHORT_HASH
# Expected: 64d3b11

# 5. Create client directories
mkdir -p clients/netbox/archives
mkdir -p clients/netbox/sources/source_01

# 6. Move archive
mv /tmp/netbox-source.tar clients/netbox/archives/netbox-${SHORT_HASH}.tar

# 7. Create run directory and extract
RUN_ID="run_github_netbox_20260520_134600"
mkdir -p clients/netbox/psee/runs/${RUN_ID}/intake/canonical_repo
tar xf clients/netbox/archives/netbox-${SHORT_HASH}.tar -C clients/netbox/psee/runs/${RUN_ID}/intake/canonical_repo/
```

### Phase B — Client Registration

```bash
# client.yaml and source_manifest.json must exist before pipeline runs.
# See: clients/netbox/client.yaml
# See: clients/netbox/sources/source_01/source_manifest.json
```

### Phase C — Source Intake

```bash
python3 scripts/pios/source_intake.py \
  --client netbox \
  --source source_01 \
  --run-id run_github_netbox_20260520_134600
```

**Expected output:** `intake/source_inventory.json` with 2,169 files.

### Phase D — Structural Scanning

```bash
python3 scripts/pios/structural_scanner.py \
  --client netbox \
  --source source_01 \
  --run-id run_github_netbox_20260520_134600
```

**Expected output:**
- `structure/40.2/structural_node_inventory.json` — 2,540 nodes
- `structure/40.3/structural_topology_log.json` — 2,516 CONTAINS edges, 0 IMPORTS
- `structure/40.4/canonical_topology.json` — 24 clusters

### Phase E — Pipeline Phases 3.5–3.7

```bash
# SRC Classification (Phase 3.5)
python3 scripts/pios/structural_relevance_classifier.py \
  --client netbox \
  --source source_01 \
  --run-id run_github_netbox_20260520_134600

# Code-Graph Enrichment (Phase 3.6)
python3 scripts/pios/code_graph_feasibility.py \
  --client netbox \
  --run-id run_github_netbox_20260520_134600

# Structural Centrality (Phase 3.7)
python3 scripts/pios/structural_centrality.py \
  --client netbox \
  --run-id run_github_netbox_20260520_134600
```

**Expected output:**
- `structure/40.2r/structural_relevance.json` — 1,848 PRIMARY, 138 SUPPORT, 554 PERIPHERAL
- `structure/40.3s/code_graph.json` — 1,155 files, 3,614 IMPORTS, 16,046 total relationships
- `structure/40.3c/structural_centrality.json` — 1,089 files ranked, 6/6 validation PASS

### Phase F — Full Pipeline (Phases 1–9)

```bash
python3 scripts/pios/run_client_pipeline.py \
  --client netbox \
  --source source_01 \
  --run-id run_github_netbox_20260520_134600
```

**Expected:** Phases 1–3.7 PASS. Phase 4 (CEU grounding) FAIL — no CEU model configured.

## Run ID

```
run_github_netbox_20260520_134600
```

## Immutable Archive Reference

```
Archive: clients/netbox/archives/netbox-64d3b11.tar
SHA256:  043d4ca2b85fde16e2bc86eea6631e5f363c8f5c59d14332eed11d0f0c44a697
Source:  netbox-community/netbox @ 64d3b11 (v4.6.1)
Date:    2026-05-20T13:46:00Z
```
