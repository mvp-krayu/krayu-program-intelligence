#!/usr/bin/env python3
"""
code_graph_feasibility.py
Contract: PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01

Bounded Tier-2 prototype: ast-based code-graph structural enrichment.
Produces 40.3s artifact — resolved import edges, class/function definitions,
and unresolved symbolic inheritance evidence from Python source files.

40.3s is code-graph STRUCTURAL enrichment — not semantic authority.
It enriches the structural topology (40.3/40.3r) with resolved code
relationships that path-based scanning cannot produce.

Reads:   clients/<client>/psee/runs/<run>/intake/canonical_repo/  (Python source)
         clients/<client>/psee/runs/<run>/structure/40.2/structural_node_inventory.json
         clients/<client>/sources/source_01/source_manifest.json

Writes:  clients/<client>/psee/runs/<run>/structure/40.3s/code_graph.json

Usage:
    python3 scripts/pios/code_graph_feasibility.py \\
        --client pallets-flask \\
        --run-id run_github_flask_20260517_163222

    --dry-run       Compute all results, log what would be written; no files written
    --report-only   Print detailed feasibility report; no files written

RULE: No AI/LLM. All extraction is ast-deterministic.
RULE: 40.3s is ADDITIVE structural enrichment — does NOT replace 40.3 or 40.3r.
RULE: INHERITS_UNRESOLVED = symbolic inheritance evidence, NOT resolved authority.
RULE: Indexer-neutral schema — any indexer can produce 40.3s.
RULE: CREATE_ONLY — abort if output file already exists (in write mode).
RULE: Deterministic — same source + same inventory → same output.
"""

from __future__ import annotations

import argparse
import ast
import json
import os
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01"

SUPPORTED_RELATION_TYPES = frozenset([
    "IMPORTS",
    "DEFINES_CLASS",
    "DEFINES_FUNCTION",
    "INHERITS_UNRESOLVED",
])

INDEXER_INFO = {
    "name": "python-ast",
    "version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
    "capabilities": sorted(SUPPORTED_RELATION_TYPES),
}


# ── CLI ───────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Code-graph structural enrichment prototype (40.3s)"
    )
    p.add_argument("--client", required=True)
    p.add_argument("--run-id", required=True)
    p.add_argument("--dry-run", action="store_true",
                   help="Compute all results, log what would be written; no files written")
    p.add_argument("--report-only", action="store_true",
                   help="Print detailed feasibility report; no files written")
    return p.parse_args()


# ── Path Resolution ──────────────────────────────────────────────────────────

def resolve_paths(client: str, run_id: str) -> dict:
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    return {
        "run_dir": run_dir,
        "intake_dir": run_dir / "intake" / "canonical_repo",
        "node_inventory": run_dir / "structure" / "40.2" / "structural_node_inventory.json",
        "source_manifest": REPO_ROOT / "clients" / client / "sources" / "source_01" / "source_manifest.json",
        "output_dir": run_dir / "structure" / "40.3s",
        "output_file": run_dir / "structure" / "40.3s" / "code_graph.json",
    }


# ── Source Root Discovery ────────────────────────────────────────────────────

def discover_source_root(intake_dir: Path) -> Path | None:
    """
    Find the primary Python source root within the intake directory.
    Handles single-package (Flask: src/flask/) and multi-app (Django: project/{app1,app2,...}/).
    """
    candidates = []
    for root, dirs, files in os.walk(intake_dir):
        root_path = Path(root)
        rel = root_path.relative_to(intake_dir)

        if any(part in ("tests", "test", "testing", "benchmarks", "examples", "docs")
               for part in rel.parts):
            continue

        if "__init__.py" in files:
            depth = len(rel.parts)
            candidates.append((depth, root_path, rel))

    if not candidates:
        return None

    min_depth = min(c[0] for c in candidates)
    shallowest = [c for c in candidates if c[0] == min_depth]

    if len(shallowest) == 1:
        return shallowest[0][1]

    # Multiple packages at same depth → return their common parent (multi-app layout)
    parents = {c[1].parent for c in shallowest}
    if len(parents) == 1:
        return parents.pop()

    # Multiple distinct parents — find deepest common ancestor
    ref = shallowest[0][2].parts
    common_depth = 0
    for i in range(min(len(ref), min_depth)):
        if all(len(c[2].parts) > i and c[2].parts[i] == ref[i] for c in shallowest):
            common_depth = i + 1
        else:
            break
    if common_depth > 0:
        return intake_dir / Path(*ref[:common_depth])

    return intake_dir


def find_python_files(source_root: Path, intake_dir: Path) -> list[tuple[Path, str]]:
    """
    Find all Python files under source_root.
    Returns list of (absolute_path, relative_path_from_intake).
    """
    results = []
    for root, dirs, files in os.walk(source_root):
        dirs[:] = [d for d in dirs if d != "__pycache__"]
        for f in sorted(files):
            if f.endswith(".py"):
                abs_path = Path(root) / f
                rel_path = str(abs_path.relative_to(intake_dir))
                results.append((abs_path, rel_path))
    return results


# ── Multi-Package Discovery ──────────────────────────────────────────────────

def discover_package_prefixes(intake_dir: Path) -> dict[str, str]:
    """
    Detect multi-package Python repos where each top-level directory contains
    a nested directory of the same name with __init__.py.

    Pattern: <pkg>/<pkg>/__init__.py  (e.g. st2common/st2common/__init__.py)

    Returns a mapping: { "st2common": "st2common/st2common" }
    so that `from st2common.models import X` resolves to
    `st2common/st2common/models.py` or `st2common/st2common/models/__init__.py`.
    """
    prefixes = {}
    try:
        entries = sorted(intake_dir.iterdir())
    except OSError:
        return prefixes
    for entry in entries:
        if not entry.is_dir() or entry.name.startswith("."):
            continue
        nested = entry / entry.name
        if nested.is_dir() and (nested / "__init__.py").is_file():
            prefixes[entry.name] = f"{entry.name}/{entry.name}"
    return prefixes


# ── AST Extraction ───────────────────────────────────────────────────────────

def resolve_relative_import(
    importing_file: Path,
    level: int,
    module: str | None,
    package_root: Path,
    intake_dir: Path,
) -> str | None:
    """
    Resolve a relative import to a target path relative to intake_dir.

    from .globals import X    → level=1, module="globals"
    from ..foo import X       → level=2, module="foo"
    from . import something   → level=1, module=None
    """
    current_dir = importing_file.parent

    target_dir = current_dir
    for _ in range(level - 1):
        target_dir = target_dir.parent
        if not str(target_dir).startswith(str(package_root)):
            return None

    if module:
        parts = module.split(".")
        target_base = target_dir
        for part in parts:
            target_base = target_base / part

        candidates = [
            target_base.with_suffix(".py"),
            target_base / "__init__.py",
        ]
        for candidate in candidates:
            if candidate.is_file():
                return str(candidate.relative_to(intake_dir))

    else:
        init = target_dir / "__init__.py"
        if init.is_file():
            return str(init.relative_to(intake_dir))

    return None


def resolve_absolute_import(
    module: str,
    known_files: set[str],
    intake_dir: Path,
    source_root_rel: str = "",
    package_prefixes: dict[str, str] | None = None,
) -> str | None:
    """
    Resolve an absolute import against known project files.

    Resolution order:
    1. Multi-package prefix rewrite (st2common.X → st2common/st2common/X)
    2. Bare path (X.Y → X/Y.py)
    3. source_root_rel prefix (for Django-style layouts)
    4. src/ prefix (for src-layout)
    """
    parts = module.split(".")

    # Multi-package prefix resolution: if the top-level module name matches
    # a discovered package prefix, rewrite the path through the nested package.
    if package_prefixes and parts[0] in package_prefixes:
        rewritten = [package_prefixes[parts[0]]] + list(parts[1:])
        suffixes = ["/".join(rewritten) + ".py", "/".join(rewritten) + "/__init__.py"]
        for suffix in suffixes:
            if suffix in known_files:
                return suffix

    suffixes = ["/".join(parts) + ".py", "/".join(parts) + "/__init__.py"]

    prefixes = [""]
    if source_root_rel and source_root_rel != "." and source_root_rel != "src":
        prefixes.append(source_root_rel + "/")
    prefixes.append("src/")

    for prefix in prefixes:
        for suffix in suffixes:
            candidate = prefix + suffix
            if candidate in known_files:
                return candidate

    return None


def extract_relationships(
    abs_path: Path,
    rel_path: str,
    package_root: Path,
    intake_dir: Path,
    known_files: set[str],
    source_root_rel: str = "",
    package_prefixes: dict[str, str] | None = None,
) -> list[dict]:
    """
    Extract all structural code-graph relationships from a single Python file.
    """
    try:
        source = abs_path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return []

    try:
        tree = ast.parse(source, filename=rel_path)
    except SyntaxError:
        return []

    relationships = []
    seen_imports: set[str] = set()

    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom):
            if node.level > 0:
                target = resolve_relative_import(
                    abs_path, node.level, node.module, package_root, intake_dir
                )
                if target and target != rel_path and target not in seen_imports:
                    seen_imports.add(target)
                    level_dots = "." * node.level
                    mod = node.module or ""
                    names = ", ".join(a.name for a in node.names[:3])
                    if len(node.names) > 3:
                        names += ", ..."
                    relationships.append({
                        "source_path": rel_path,
                        "target_path": target,
                        "source_node_id": None,
                        "target_node_id": None,
                        "relation_type": "IMPORTS",
                        "evidence": {
                            "line": node.lineno,
                            "statement": f"from {level_dots}{mod} import {names}",
                        },
                    })
            else:
                if node.module:
                    target = resolve_absolute_import(node.module, known_files, intake_dir, source_root_rel, package_prefixes)
                    if target and target != rel_path and target not in seen_imports:
                        seen_imports.add(target)
                        names = ", ".join(a.name for a in node.names[:3])
                        if len(node.names) > 3:
                            names += ", ..."
                        relationships.append({
                            "source_path": rel_path,
                            "target_path": target,
                            "source_node_id": None,
                            "target_node_id": None,
                            "relation_type": "IMPORTS",
                            "evidence": {
                                "line": node.lineno,
                                "statement": f"from {node.module} import {names}",
                            },
                        })

        elif isinstance(node, ast.Import):
            for alias in node.names:
                target = resolve_absolute_import(alias.name, known_files, intake_dir, source_root_rel, package_prefixes)
                if target and target != rel_path and target not in seen_imports:
                    seen_imports.add(target)
                    relationships.append({
                        "source_path": rel_path,
                        "target_path": target,
                        "source_node_id": None,
                        "target_node_id": None,
                        "relation_type": "IMPORTS",
                        "evidence": {
                            "line": node.lineno,
                            "statement": f"import {alias.name}",
                        },
                    })

        elif isinstance(node, ast.ClassDef):
            relationships.append({
                "source_path": rel_path,
                "target_path": None,
                "source_node_id": None,
                "target_node_id": None,
                "relation_type": "DEFINES_CLASS",
                "symbol": node.name,
                "evidence": {
                    "line": node.lineno,
                    "statement": f"class {node.name}",
                },
            })

            for base in node.bases:
                base_name = None
                if isinstance(base, ast.Name):
                    base_name = base.id
                elif isinstance(base, ast.Attribute):
                    parts = []
                    current = base
                    while isinstance(current, ast.Attribute):
                        parts.append(current.attr)
                        current = current.value
                    if isinstance(current, ast.Name):
                        parts.append(current.id)
                    base_name = ".".join(reversed(parts))

                if base_name:
                    relationships.append({
                        "source_path": rel_path,
                        "target_path": None,
                        "source_node_id": None,
                        "target_node_id": None,
                        "relation_type": "INHERITS_UNRESOLVED",
                        "symbol": f"{node.name} -> {base_name}",
                        "evidence": {
                            "line": node.lineno,
                            "statement": f"class {node.name}({base_name})",
                        },
                    })

        elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            if not any(
                isinstance(parent_node, ast.ClassDef)
                for parent_node in _walk_parents(tree, node)
            ):
                kind = "async def" if isinstance(node, ast.AsyncFunctionDef) else "def"
                relationships.append({
                    "source_path": rel_path,
                    "target_path": None,
                    "source_node_id": None,
                    "target_node_id": None,
                    "relation_type": "DEFINES_FUNCTION",
                    "symbol": node.name,
                    "evidence": {
                        "line": node.lineno,
                        "statement": f"{kind} {node.name}",
                    },
                })

    return relationships


def _annotate_parents(tree: ast.AST) -> None:
    """Add _parent attribute to all AST nodes."""
    for node in ast.walk(tree):
        for child in ast.iter_child_nodes(node):
            child._parent = node  # type: ignore[attr-defined]


def _walk_parents(tree: ast.AST, target: ast.AST) -> list[ast.AST]:
    """Walk up the parent chain from target to root."""
    if not hasattr(target, "_parent"):
        _annotate_parents(tree)
    parents = []
    current = target
    while hasattr(current, "_parent"):
        current = current._parent  # type: ignore[attr-defined]
        parents.append(current)
    return parents


# ── Cross-Reference with 40.2 Inventory ─────────────────────────────────────

def cross_reference_inventory(
    relationships: list[dict],
    node_inventory_path: Path,
) -> tuple[list[dict], dict]:
    """
    Populate source_node_id and target_node_id by matching paths against
    the 40.2 node inventory. Returns updated relationships and stats.
    """
    if not node_inventory_path.is_file():
        return relationships, {"inventory_loaded": False, "matched": 0, "unmatched": 0}

    inventory = json.loads(node_inventory_path.read_text(encoding="utf-8"))
    nodes = inventory.get("nodes", [])

    path_to_node: dict[str, str] = {}
    for node in nodes:
        path_to_node[node.get("path", "")] = node.get("node_id", "")

    matched = 0
    unmatched_paths: set[str] = set()

    for rel in relationships:
        source = rel.get("source_path", "")
        target = rel.get("target_path")

        if source in path_to_node:
            rel["source_node_id"] = path_to_node[source]
        else:
            unmatched_paths.add(source)

        if target and target in path_to_node:
            rel["target_node_id"] = path_to_node[target]
            matched += 1
        elif target:
            unmatched_paths.add(target)

    return relationships, {
        "inventory_loaded": True,
        "inventory_nodes": len(nodes),
        "matched_targets": matched,
        "unmatched_paths": sorted(unmatched_paths),
    }


# ── Validation ───────────────────────────────────────────────────────────────

def validate_graph(
    relationships: list[dict],
    known_files: set[str],
) -> dict:
    """
    Self-integrity checks on the produced code-graph.
    """
    checks = {}

    self_refs = [r for r in relationships
                 if r.get("target_path") and r["source_path"] == r["target_path"]]
    checks["no_self_references"] = len(self_refs) == 0

    bad_types = [r for r in relationships
                 if r["relation_type"] not in SUPPORTED_RELATION_TYPES]
    checks["all_relation_types_supported"] = len(bad_types) == 0

    import_rels = [r for r in relationships if r["relation_type"] == "IMPORTS"]
    source_ok = all(r["source_path"] in known_files for r in import_rels)
    target_ok = all(r["target_path"] in known_files for r in import_rels if r.get("target_path"))
    checks["all_source_paths_in_files"] = source_ok
    checks["all_target_paths_in_files"] = target_ok

    checks["has_evidence"] = all("evidence" in r for r in relationships)

    return checks


# ── In-Degree Analysis ───────────────────────────────────────────────────────

def compute_in_degree(relationships: list[dict]) -> list[tuple[str, int]]:
    """
    Compute in-degree (number of inbound IMPORTS edges) per target file.
    Returns sorted list of (path, count) descending.
    """
    counter: Counter = Counter()
    for r in relationships:
        if r["relation_type"] == "IMPORTS" and r.get("target_path"):
            counter[r["target_path"]] += 1
    return counter.most_common()


def find_isolated_files(
    known_files: set[str],
    relationships: list[dict],
) -> list[str]:
    """
    Files with 0 inbound IMPORTS edges — potential entry points or dead code.
    """
    imported = {r["target_path"] for r in relationships
                if r["relation_type"] == "IMPORTS" and r.get("target_path")}
    return sorted(known_files - imported)


# ── Artifact Assembly ────────────────────────────────────────────────────────

def build_artifact(
    relationships: list[dict],
    client: str,
    run_id: str,
    source_root_rel: str,
    file_count: int,
    validation: dict,
    xref_stats: dict,
) -> dict:
    """Assemble the 40.3s code_graph.json artifact."""
    type_counts: Counter = Counter()
    for r in relationships:
        type_counts[r["relation_type"]] += 1

    summary = {rt: type_counts.get(rt, 0) for rt in sorted(SUPPORTED_RELATION_TYPES)}
    summary["total"] = len(relationships)

    return {
        "contract_id": CONTRACT_ID,
        "artifact_class": "40.3s",
        "client_id": client,
        "run_id": run_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "indexer": INDEXER_INFO,
        "source_root": source_root_rel,
        "file_count": file_count,
        "relationship_summary": summary,
        "relationships": relationships,
        "validation": validation,
        "cross_reference": xref_stats,
    }


# ── Feasibility Report ──────────────────────────────────────────────────────

def print_report(
    relationships: list[dict],
    validation: dict,
    xref_stats: dict,
    known_files: set[str],
    source_root_rel: str,
) -> None:
    """Print detailed feasibility / prototype assessment report."""
    type_counts: Counter = Counter()
    for r in relationships:
        type_counts[r["relation_type"]] += 1

    print("\n" + "=" * 72)
    print("  CODE-GRAPH STRUCTURAL ENRICHMENT — PROTOTYPE REPORT")
    print("=" * 72)

    print(f"\n  Source root:   {source_root_rel}")
    print(f"  Python files:  {len(known_files)}")
    print(f"  Total relationships: {len(relationships)}")

    print("\n  Relationship breakdown:")
    for rt in sorted(SUPPORTED_RELATION_TYPES):
        count = type_counts.get(rt, 0)
        print(f"    {rt:25s}  {count:>5d}")

    print("\n  Validation:")
    for check, passed in validation.items():
        status = "PASS" if passed else "FAIL"
        print(f"    {check:35s}  {status}")

    print("\n  Cross-reference with 40.2 inventory:")
    for key, val in xref_stats.items():
        if key == "unmatched_paths":
            print(f"    unmatched_paths: {len(val)}")
            for p in val[:5]:
                print(f"      - {p}")
            if len(val) > 5:
                print(f"      ... and {len(val) - 5} more")
        else:
            print(f"    {key}: {val}")

    in_degree = compute_in_degree(relationships)
    if in_degree:
        print("\n  In-degree analysis (most-imported files):")
        for path, count in in_degree[:10]:
            print(f"    {count:>3d}  {path}")

    isolated = find_isolated_files(known_files, relationships)
    if isolated:
        print(f"\n  Isolated files (0 inbound IMPORTS): {len(isolated)}")
        for p in isolated[:10]:
            print(f"    - {p}")

    all_pass = all(validation.values())
    feasibility = "VIABLE" if (all_pass and type_counts.get("IMPORTS", 0) > 0) else "NOT VIABLE"
    if not all_pass and type_counts.get("IMPORTS", 0) > 0:
        feasibility = "PARTIALLY VIABLE"

    print(f"\n  FEASIBILITY VERDICT: {feasibility}")
    if feasibility == "VIABLE":
        print("  ast-based code-graph structural enrichment produces useful")
        print("  resolved IMPORTS edges. 40.3s artifact contract validated.")
    elif feasibility == "PARTIALLY VIABLE":
        print("  IMPORTS edges produced but validation checks failed.")
    else:
        print("  No resolved IMPORTS edges produced. Indexer insufficient for this source.")

    print("\n" + "=" * 72 + "\n")


# ── Main ─────────────────────────────────────────────────────────────────────

def main() -> int:
    args = parse_args()
    paths = resolve_paths(args.client, args.run_id)

    print(f"\n  CODE-GRAPH STRUCTURAL ENRICHMENT PROTOTYPE")
    print(f"  Contract: {CONTRACT_ID}")
    print(f"  Client:   {args.client}")
    print(f"  Run:      {args.run_id}")
    print(f"  Indexer:  {INDEXER_INFO['name']} {INDEXER_INFO['version']}")

    # ── Pre-flight checks ────────────────────────────────────────────────
    if not paths["intake_dir"].is_dir():
        print(f"\n  FAIL: intake directory not found: {paths['intake_dir']}")
        return 1

    if not paths["node_inventory"].is_file():
        print(f"\n  WARN: 40.2 node inventory not found: {paths['node_inventory']}")
        print(f"        Cross-referencing will be skipped.")

    if not args.dry_run and not args.report_only and paths["output_file"].is_file():
        print(f"\n  FAIL: output already exists (CREATE_ONLY): {paths['output_file']}")
        return 1

    # ── Discover source root ─────────────────────────────────────────────
    source_root = discover_source_root(paths["intake_dir"])
    if source_root is None:
        print(f"\n  FAIL: no Python package found in {paths['intake_dir']}")
        return 1

    source_root_rel = str(source_root.relative_to(paths["intake_dir"]))
    print(f"\n  Source root discovered: {source_root_rel}")

    # ── Find Python files ────────────────────────────────────────────────
    py_files = find_python_files(source_root, paths["intake_dir"])
    if not py_files:
        print(f"\n  FAIL: no Python files found under {source_root}")
        return 1

    known_files = {rel for _, rel in py_files}
    print(f"  Python files found: {len(py_files)}")

    # ── Determine package root for relative import resolution ────────────
    # Package root = the directory containing the top-level __init__.py
    # For src-layout: intake/src/flask/__init__.py → package_root = intake/src/flask/
    package_candidates = []
    for abs_p, rel_p in py_files:
        if abs_p.name == "__init__.py":
            package_candidates.append(abs_p.parent)

    # The package root is the shallowest directory with __init__.py under source_root
    package_root = source_root
    if package_candidates:
        package_candidates.sort(key=lambda p: len(p.parts))
        package_root = package_candidates[0]

    print(f"  Package root: {package_root.relative_to(paths['intake_dir'])}")

    # ── Discover multi-package prefixes ──────────────────────────────────
    package_prefixes = discover_package_prefixes(paths["intake_dir"])
    if package_prefixes:
        print(f"  Multi-package prefixes: {len(package_prefixes)} detected")
        for pkg_name, pkg_path in sorted(package_prefixes.items()):
            print(f"    {pkg_name} → {pkg_path}/")

    # ── Extract relationships from all files ──────────────────────────────
    all_relationships: list[dict] = []
    for abs_path, rel_path in py_files:
        rels = extract_relationships(
            abs_path, rel_path, package_root, paths["intake_dir"], known_files, source_root_rel,
            package_prefixes=package_prefixes,
        )
        all_relationships.extend(rels)

    all_relationships.sort(key=lambda r: (r["source_path"], r["relation_type"], r.get("evidence", {}).get("line", 0)))

    print(f"  Total relationships extracted: {len(all_relationships)}")

    # ── Cross-reference with 40.2 ────────────────────────────────────────
    all_relationships, xref_stats = cross_reference_inventory(
        all_relationships, paths["node_inventory"]
    )

    # ── Validate ─────────────────────────────────────────────────────────
    validation = validate_graph(all_relationships, known_files)

    # ── Report ───────────────────────────────────────────────────────────
    if args.report_only:
        print_report(all_relationships, validation, xref_stats, known_files, source_root_rel)
        return 0

    # ── Build artifact ───────────────────────────────────────────────────
    artifact = build_artifact(
        all_relationships, args.client, args.run_id,
        source_root_rel, len(py_files), validation, xref_stats,
    )

    if args.dry_run:
        print(f"\n  [DRY-RUN] Would write: {paths['output_file']}")
        print(f"  [DRY-RUN] Relationships: {len(all_relationships)}")
        type_counts: Counter = Counter()
        for r in all_relationships:
            type_counts[r["relation_type"]] += 1
        for rt in sorted(SUPPORTED_RELATION_TYPES):
            print(f"    {rt:25s}  {type_counts.get(rt, 0):>5d}")
        print_report(all_relationships, validation, xref_stats, known_files, source_root_rel)
        return 0

    # ── Write artifact ───────────────────────────────────────────────────
    paths["output_dir"].mkdir(parents=True, exist_ok=True)
    paths["output_file"].write_text(
        json.dumps(artifact, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(f"\n  WRITTEN: {paths['output_file'].relative_to(REPO_ROOT)}")
    print_report(all_relationships, validation, xref_stats, known_files, source_root_rel)
    return 0


if __name__ == "__main__":
    sys.exit(main())
