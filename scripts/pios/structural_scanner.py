#!/usr/bin/env python3
"""
structural_scanner.py
Contract: PI.LENS.STRUCTURAL-SCANNER.GENERIC.01

Generic deterministic structural scanner. Consumes source intake output
and produces canonical 40.x structural artifacts for any client source.

Reads:   clients/<client_id>/psee/runs/<run_id>/intake/source_inventory.json
         clients/<client_id>/sources/<source_id>/source_manifest.json
         REPO_ROOT/<source_root>/<file>.py  (for import analysis — Python only)

Writes:  clients/<client_id>/psee/runs/<run_id>/structure/40.2/
         clients/<client_id>/psee/runs/<run_id>/structure/40.3/
         clients/<client_id>/psee/runs/<run_id>/structure/40.4/

Usage:
    python3 scripts/pios/structural_scanner.py \\
        --client fastapi \\
        --source source_01 \\
        --run-id run_02_oss_fastapi_pipeline

    --dry-run        Compute all artifacts, log what would be written; no files written
    --validate-only  Check intake inputs only; no scanning or writing

RULE: No BlueEdge dependency. No CEU/DOM/41.x/75.x. Structural analysis only.
RULE: CREATE_ONLY — abort if any output file already exists (in write mode).
RULE: All output is deterministic — same source_inventory → same JSON.
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.LENS.STRUCTURAL-SCANNER.GENERIC.01"

EXTENSION_TYPES = {
    ".py":    "python",
    ".js":    "javascript",
    ".ts":    "typescript",
    ".jsx":   "jsx",
    ".tsx":   "tsx",
    ".json":  "json",
    ".yaml":  "yaml",
    ".yml":   "yaml",
    ".md":    "markdown",
    ".sh":    "shell",
    ".html":  "html",
    ".css":   "css",
    ".toml":  "toml",
    ".txt":   "text",
    ".lock":  "lockfile",
    ".png":   "image",
    ".jpg":   "image",
    ".jpeg":  "image",
    ".svg":   "image",
    ".ico":   "image",
    ".sql":   "sql",
    ".env":   "config",
    ".ini":   "config",
    ".cfg":   "config",
    ".gitignore":    "config",
    ".gitattributes": "config",
    ".dockerignore": "config",
}

IMPORT_RE = re.compile(
    r"""^(?:from\s+([\w.]+)\s+import|import\s+([\w.]+))""",
    re.MULTILINE,
)


# ── Utilities ──────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generic structural scanner (Phase 3 generator)")
    p.add_argument("--client",       required=True)
    p.add_argument("--source",       required=True)
    p.add_argument("--run-id",       required=True)
    p.add_argument("--dry-run",      action="store_true")
    p.add_argument("--validate-only", action="store_true")
    return p.parse_args()


def load_json(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: dict, dry_run: bool) -> None:
    if dry_run:
        print(f"  [DRY-RUN] Would write: {path.relative_to(REPO_ROOT)}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"  [WROTE]   {path.relative_to(REPO_ROOT)}")


def fail_closed(msg: str) -> None:
    print(f"\nFAIL-CLOSED: {msg}")
    sys.exit(1)


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def classify_extension(filename: str) -> tuple[str, str]:
    """Return (extension, language_type) for a filename."""
    p = Path(filename)
    # Handle dotfiles with no suffix (e.g., .gitignore, .artrc)
    if p.suffix:
        ext = p.suffix.lower()
    else:
        ext = p.name.lower() if p.name.startswith(".") else ""
    lang = EXTENSION_TYPES.get(ext, "other")
    return (ext or None, lang)


# ── Path Resolution ────────────────────────────────────────────────────────────

def resolve_paths(client_id: str, source_id: str, run_id: str) -> tuple[Path, Path, Path]:
    """Return (intake_dir, structure_dir, manifest_path)."""
    client_dir = REPO_ROOT / "clients" / client_id
    intake_dir = client_dir / "psee" / "runs" / run_id / "intake"
    structure_dir = client_dir / "psee" / "runs" / run_id / "structure"
    manifest_path = client_dir / "sources" / source_id / "source_manifest.json"
    return intake_dir, structure_dir, manifest_path


def check_create_only(structure_dir: Path) -> None:
    targets = [
        structure_dir / "40.2" / "structural_node_inventory.json",
        structure_dir / "40.3" / "structural_topology_log.json",
        structure_dir / "40.4" / "canonical_topology.json",
    ]
    conflicts = [str(t.relative_to(REPO_ROOT)) for t in targets if t.exists()]
    if conflicts:
        fail_closed(f"CREATE_ONLY violation — output files already exist: {conflicts}")


# ── Node Construction ──────────────────────────────────────────────────────────

def derive_directories(file_paths: list[str]) -> list[str]:
    """Collect all unique ancestor directories from file paths. Sorted."""
    dirs: set[str] = set()
    for fpath in file_paths:
        parts = Path(fpath).parts
        for i in range(1, len(parts)):
            dirs.add("/".join(parts[:i]))
    return sorted(dirs)


def build_nodes(file_entries: list[dict], source_root: Path) -> tuple[list[dict], dict[str, str]]:
    """
    Build node records and a path→node_id map.
    Directories are assigned NODE IDs first (sorted), then files (sorted).
    """
    file_paths = [e["path"] for e in file_entries]
    dir_paths = derive_directories(file_paths)

    path_to_node: dict[str, str] = {}
    nodes: list[dict] = []
    counter = 1

    # Directory nodes
    for dpath in dir_paths:
        nid = f"NODE-{counter:04d}"
        counter += 1
        nodes.append({
            "node_id": nid,
            "path": dpath,
            "type": "directory",
            "extension": None,
            "language_type": "directory",
            "size_bytes": None,
        })
        path_to_node[dpath] = nid

    # File nodes
    for entry in sorted(file_entries, key=lambda e: e["path"]):
        nid = f"NODE-{counter:04d}"
        counter += 1
        fpath = entry["path"]
        ext, lang = classify_extension(fpath)
        nodes.append({
            "node_id": nid,
            "path": fpath,
            "type": "file",
            "extension": ext,
            "language_type": lang,
            "size_bytes": entry.get("size_bytes"),
        })
        path_to_node[fpath] = nid

    return nodes, path_to_node


# ── Topology Construction ──────────────────────────────────────────────────────

def build_contains_edges(nodes: list[dict], path_to_node: dict[str, str]) -> list[dict]:
    """
    Build CONTAINS edges: parent_dir → child (file or directory).
    Only adds an edge if the parent path is in path_to_node.
    """
    edges = []
    for node in nodes:
        npath = node["path"]
        parent = str(Path(npath).parent)
        if parent in (".", ""):
            continue
        if parent in path_to_node:
            edges.append({
                "source_id": path_to_node[parent],
                "target_id": node["node_id"],
                "relation_type": "CONTAINS",
            })
    return edges


def parse_python_imports(
    fpath: str,
    source_root: Path,
    path_to_node: dict[str, str],
) -> list[dict]:
    """
    Parse import statements in a Python file via regex.
    Returns IMPORTS edges where the imported module resolves to a known node.
    No execution — static regex only.
    """
    abs_path = source_root / fpath
    try:
        content = abs_path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return []

    importer_id = path_to_node.get(fpath)
    if not importer_id:
        return []

    edges = []
    seen_targets: set[str] = set()

    for match in IMPORT_RE.finditer(content):
        module = (match.group(1) or match.group(2) or "").strip()
        if not module:
            continue
        # Strip leading dots (relative imports) — use the bare module name
        module = module.lstrip(".")
        if not module:
            continue

        # Resolve module.path → filesystem candidates
        parts = module.split(".")
        candidates = [
            "/".join(parts) + ".py",
            "/".join(parts) + "/__init__.py",
        ]
        for candidate in candidates:
            if candidate in path_to_node and candidate not in seen_targets:
                target_id = path_to_node[candidate]
                if target_id != importer_id:
                    seen_targets.add(candidate)
                    edges.append({
                        "source_id": importer_id,
                        "target_id": target_id,
                        "relation_type": "IMPORTS",
                    })
    return edges


def build_topology_edges(
    nodes: list[dict],
    path_to_node: dict[str, str],
    source_root: Path,
) -> list[dict]:
    """Build all edges: CONTAINS + IMPORTS (Python only)."""
    edges = build_contains_edges(nodes, path_to_node)

    for node in nodes:
        if node["type"] == "file" and node.get("extension") == ".py":
            import_edges = parse_python_imports(node["path"], source_root, path_to_node)
            edges.extend(import_edges)

    return edges


# ── Canonical Topology ─────────────────────────────────────────────────────────

def build_canonical_topology(nodes: list[dict]) -> list[dict]:
    """
    Group nodes by top-level path component (cluster).
    Root-level files (no directory ancestor) go into cluster '_root'.
    """
    clusters: dict[str, list[str]] = {}
    for node in nodes:
        parts = Path(node["path"]).parts
        top = parts[0] if len(parts) >= 1 else "_root"
        clusters.setdefault(top, []).append(node["node_id"])

    result = []
    for i, (name, node_ids) in enumerate(sorted(clusters.items()), start=1):
        result.append({
            "cluster_id": f"CLU-{i:02d}",
            "name": name,
            "node_count": len(node_ids),
            "node_ids": node_ids,
        })
    return result


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    args = parse_args()
    client_id = args.client
    source_id = args.source
    run_id = args.run_id
    dry_run = args.dry_run
    validate_only = args.validate_only

    print("=" * 64)
    print(f"structural_scanner.py — {CONTRACT_ID}")
    print(f"  client:  {client_id}")
    print(f"  source:  {source_id}")
    print(f"  run_id:  {run_id}")
    mode = "VALIDATE-ONLY" if validate_only else ("DRY-RUN" if dry_run else "WRITE")
    print(f"  mode:    {mode}")
    print("=" * 64)

    intake_dir, structure_dir, manifest_path = resolve_paths(client_id, source_id, run_id)

    # ── [1] Validate inputs ───────────────────────────────────────────────────
    print("\n[1] Validating inputs ...")

    inventory_path = intake_dir / "source_inventory.json"
    if not inventory_path.exists():
        fail_closed(
            f"source_inventory.json not found at {inventory_path.relative_to(REPO_ROOT)}\n"
            f"  Run source_intake.py first."
        )
    inventory = load_json(inventory_path)
    print(f"  source_inventory.json: {inventory['file_count']} files")

    if not manifest_path.exists():
        fail_closed(f"source_manifest.json not found: {manifest_path.relative_to(REPO_ROOT)}")
    manifest = load_json(manifest_path)

    source_root = REPO_ROOT / inventory["source_root"]
    if not source_root.exists():
        fail_closed(f"source_root not found: {inventory['source_root']}")
    print(f"  source_root: {inventory['source_root']}")

    if validate_only:
        print("\n  Inputs valid. Validate-only mode — stopping before scan.")
        print("\n" + "=" * 64)
        print("VALIDATE-ONLY PASS")
        print("=" * 64)
        return

    if not dry_run:
        check_create_only(structure_dir)

    # ── [2] Build nodes ────────────────────────────────────────────────────────
    print("\n[2] Building structural nodes ...")
    file_entries = inventory["files"]
    nodes, path_to_node = build_nodes(file_entries, source_root)

    dir_nodes = [n for n in nodes if n["type"] == "directory"]
    file_nodes = [n for n in nodes if n["type"] == "file"]
    total_nodes = len(nodes)
    print(f"  directory nodes: {len(dir_nodes)}")
    print(f"  file nodes:      {len(file_nodes)}")
    print(f"  total nodes:     {total_nodes}")

    # ── [3] Build topology ─────────────────────────────────────────────────────
    print("\n[3] Building topology edges ...")
    edges = build_topology_edges(nodes, path_to_node, source_root)

    contains_edges = [e for e in edges if e["relation_type"] == "CONTAINS"]
    imports_edges  = [e for e in edges if e["relation_type"] == "IMPORTS"]
    print(f"  CONTAINS edges: {len(contains_edges)}")
    print(f"  IMPORTS edges:  {len(imports_edges)}")
    print(f"  total edges:    {len(edges)}")

    # ── [4] Build canonical topology ──────────────────────────────────────────
    print("\n[4] Building canonical topology ...")
    clusters = build_canonical_topology(nodes)
    print(f"  clusters: {len(clusters)}")
    for c in clusters:
        print(f"    {c['cluster_id']} {c['name']:30s} ({c['node_count']} nodes)")

    # ── [5] Assemble artifacts ─────────────────────────────────────────────────
    ts = now_iso()

    artifact_40_2 = {
        "contract_id": CONTRACT_ID,
        "client_id": client_id,
        "source_id": source_id,
        "run_id": run_id,
        "stage": "40.2",
        "generated_at": ts,
        "total_nodes": total_nodes,
        "file_nodes": len(file_nodes),
        "directory_nodes": len(dir_nodes),
        "source_root": str(inventory["source_root"]),
        "nodes": nodes,
    }

    artifact_40_3 = {
        "contract_id": CONTRACT_ID,
        "client_id": client_id,
        "source_id": source_id,
        "run_id": run_id,
        "stage": "40.3",
        "generated_at": ts,
        "total_relations": len(edges),
        "contains_count": len(contains_edges),
        "imports_count": len(imports_edges),
        "relation_types": ["CONTAINS", "IMPORTS"],
        "parsing_method": "static_filesystem_and_regex_import_analysis",
        "edges": edges,
    }

    artifact_40_4 = {
        "contract_id": CONTRACT_ID,
        "client_id": client_id,
        "source_id": source_id,
        "run_id": run_id,
        "stage": "40.4",
        "generated_at": ts,
        "platform": "generic",
        "cluster_count": len(clusters),
        "clusters": clusters,
    }

    # ── [6] Write ──────────────────────────────────────────────────────────────
    print("\n[5] Writing artifacts ...")
    save_json(structure_dir / "40.2" / "structural_node_inventory.json", artifact_40_2, dry_run)
    save_json(structure_dir / "40.3" / "structural_topology_log.json",   artifact_40_3, dry_run)
    save_json(structure_dir / "40.4" / "canonical_topology.json",        artifact_40_4, dry_run)

    print("\n" + "=" * 64)
    print(f"SCAN COMPLETE — {total_nodes} nodes, {len(edges)} edges, {len(clusters)} clusters")
    print("=" * 64)


if __name__ == "__main__":
    main()
