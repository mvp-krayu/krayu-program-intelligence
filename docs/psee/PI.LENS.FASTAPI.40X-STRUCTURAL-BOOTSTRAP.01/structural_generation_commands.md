# Structural Generation Commands
## PI.LENS.FASTAPI.40X-STRUCTURAL-BOOTSTRAP.01

**Generated:** 2026-05-01

---

## Canonical Generation Command

```bash
python3 scripts/pios/40.2/bootstrap_fastapi_40x.py
```

Run from REPO_ROOT (`/Users/khorrix/Projects/k-pi-core`).

**Prerequisites:**
- `clients/fastapi/client.yaml` — must exist
- `clients/fastapi/sources/source_01/source_manifest.json` — must exist
- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend/` — must exist
- Target 40.x artifacts must NOT exist (CREATE_ONLY guard enforced)

**Output:**
- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/structure/40.2/structural_node_inventory.json`
- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/structure/40.3/structural_topology_log.json`
- `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/structure/40.4/canonical_topology.json`

---

## Execution Log (2026-05-01)

```
Bootstrap: PI.LENS.FASTAPI.40X-STRUCTURAL-BOOTSTRAP.01
Source:    clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend
Target:    clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/structure

Discovered: 87 files, 37 directories, 124 total nodes
WROTE: clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/structure/40.2/structural_node_inventory.json
WROTE: clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/structure/40.3/structural_topology_log.json
WROTE: clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/structure/40.4/canonical_topology.json

Bootstrap complete.
  40.2: 124 nodes (87 files, 37 directories)
  40.3: 123 CONTAINS relations
  40.4: 14 clusters
```

---

## Phase 3 Isolation Test

```bash
python3 -c "
import sys, json
from pathlib import Path
REPO_ROOT = Path('/Users/khorrix/Projects/k-pi-core')

def load_json(path):
    with open(path) as f: return json.load(f)

def phase_03_40x_structural(sm):
    struct_path = REPO_ROOT / sm['structure_path']
    required = {
        '40.2/structural_node_inventory.json': '...',
        '40.3/structural_topology_log.json': '...',
        '40.4/canonical_topology.json': '...',
    }
    for rel, desc in required.items():
        p = struct_path / rel
        if not p.exists():
            print(f'  FAIL: Missing {p}')
            return False
    inv = load_json(struct_path / '40.2' / 'structural_node_inventory.json')
    node_count = inv.get('total_nodes', inv.get('node_count', '?'))
    print(f'  PASS: 40.2 ({node_count} nodes), 40.3 (topology), 40.4 (clusters) all present')
    return True

with open(REPO_ROOT / 'clients/fastapi/sources/source_01/source_manifest.json') as f:
    sm = json.load(f)
result = phase_03_40x_structural(sm)
sys.exit(0 if result else 1)
"
```

**Result:**
```
  PASS: 40.2 (124 nodes), 40.3 (topology), 40.4 (clusters) all present
Phase 3 result: PASS
```

---

## Repeat Run Behavior

If any target artifact already exists, the script aborts:

```
ABORT: CREATE_ONLY violation — target already exists: <path>
```

To regenerate, manually remove the target artifacts first.

---

## Phase 4 Advancement Status

After Phase 3 bootstrap, the canonical orchestrator now advances to Phase 4. Phase 4 fails on GAP-REG-02 (`grounding_state_v3.json` not found). This is expected and documented. Resolution requires: **PI.LENS.FASTAPI.CEU-GROUNDING-BOOTSTRAP.01** (future contract).
