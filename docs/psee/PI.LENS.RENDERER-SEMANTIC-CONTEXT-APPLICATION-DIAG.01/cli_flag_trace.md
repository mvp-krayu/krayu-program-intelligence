# CLI Flag Trace
## PI.LENS.RENDERER-SEMANTIC-CONTEXT-APPLICATION-DIAG.01

**Generated:** 2026-05-01

---

## `--crosswalk-path` Flow

| Step | Location | Code |
|------|----------|------|
| 1. argparse definition | line 7149 | `parser.add_argument("--crosswalk-path", type=Path, default=None)` |
| 2. parsed value | line 7164 | `args = parser.parse_args()` → `args.crosswalk_path` |
| 3. passed to runtime | line 7172 | `crosswalk_path=args.crosswalk_path` in `_configure_runtime()` call |
| 4. runtime parameter | line 901 | `def _configure_runtime(..., crosswalk_path: Optional[Path] = None, ...)` |
| 5. conditional load | line 939–940 | `if crosswalk_path is not None: _load_semantic_crosswalk(crosswalk_path)` |
| 6. file load function | line 558–562 | `_load_semantic_crosswalk(path)` → sets global `_SEMANTIC_CROSSWALK` |

**Flow: COMPLETE — flag is parsed and loaded.**

## `--semantic-topology-dir` Flow

| Step | Location | Code |
|------|----------|------|
| 1. argparse definition | line 7153 | `parser.add_argument("--semantic-topology-dir", type=Path, default=None)` |
| 2. parsed value | line 7164 | `args = parser.parse_args()` → `args.semantic_topology_dir` |
| 3. passed to runtime | line 7173 | `semantic_topology_dir=args.semantic_topology_dir` in `_configure_runtime()` call |
| 4. runtime parameter | line 902 | `def _configure_runtime(..., semantic_topology_dir: Optional[Path] = None, ...)` |
| 5. conditional load | line 942–943 | `if semantic_topology_dir is not None: _load_semantic_topology(semantic_topology_dir)` |
| 6. file load function | line 565–573 | `_load_semantic_topology(dir_path)` → sets globals `_SEMANTIC_TOPOLOGY_MODEL` + `_SEMANTIC_TOPOLOGY_LAYOUT` |

**Flow: COMPLETE — flag is parsed and loaded IF both model and layout files exist.**

## Globals Set

| Global | Set by | Type |
|--------|--------|------|
| `_SEMANTIC_CROSSWALK` | `_load_semantic_crosswalk()` | `Optional[Dict]`, default None |
| `_SEMANTIC_TOPOLOGY_MODEL` | `_load_semantic_topology()` | `Optional[Dict]`, default None |
| `_SEMANTIC_TOPOLOGY_LAYOUT` | `_load_semantic_topology()` | `Optional[Dict]`, default None |

Both globals are module-level, accessible to all functions.

## `main()` Signature

```python
def main(tier1=True, output_path=None, output_dir=None, deliverable=None, output_root=None)
```

`crosswalk_path` and `semantic_topology_dir` are NOT passed to `main()`. They operate exclusively via globals set by `_configure_runtime()` before `main()` is called. No argument-passing gap — globals are the intended mechanism.
