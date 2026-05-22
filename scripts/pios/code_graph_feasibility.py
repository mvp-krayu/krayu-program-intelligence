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
import subprocess
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01"
TS_ENRICHMENT_DIR = Path(__file__).resolve().parent / "ts-enrichment"
TS_EXTRACTOR_SCRIPT = TS_ENRICHMENT_DIR / "ts_import_extractor.js"

SUPPORTED_RELATION_TYPES = frozenset([
    "IMPORTS",
    "DEFINES_CLASS",
    "DEFINES_FUNCTION",
    "INHERITS_UNRESOLVED",
    "INHERITS",
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
) -> tuple[list[dict], dict[str, str]]:
    """
    Extract all structural code-graph relationships from a single Python file.
    Returns (relationships, import_names) where import_names maps
    imported symbol names to their resolved target file paths.
    """
    try:
        source = abs_path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return [], {}

    try:
        tree = ast.parse(source, filename=rel_path)
    except SyntaxError:
        return [], {}

    relationships = []
    import_names: dict[str, str] = {}
    seen_imports: set[str] = set()

    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom):
            if node.level > 0:
                target = resolve_relative_import(
                    abs_path, node.level, node.module, package_root, intake_dir
                )
                if target and target != rel_path and target not in seen_imports:
                    seen_imports.add(target)
                    for alias in node.names:
                        name = alias.asname or alias.name
                        import_names[name] = target
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
                        for alias in node.names:
                            name = alias.asname or alias.name
                            import_names[name] = target
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
                    name = alias.asname or alias.name.split(".")[-1]
                    import_names[name] = target
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

    return relationships, import_names


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


# ── Inheritance Resolution ───────────────────────────────────────────────────

def resolve_inheritance(
    relationships: list[dict],
    file_import_names: dict[str, dict[str, str]],
) -> dict:
    """
    Post-processing step: resolve INHERITS_UNRESOLVED edges using import
    context and class definition registry.

    For each INHERITS_UNRESOLVED edge:
    1. Parse the base class expression (bare name or qualified dotted name)
    2. Look up the importing file's import context to find the source file
    3. Verify the target file defines that class
    4. If resolved: change relation_type to INHERITS, set target_path

    Returns resolution statistics.
    """
    class_registry: dict[str, list[str]] = {}
    for r in relationships:
        if r["relation_type"] == "DEFINES_CLASS":
            sym = r.get("symbol", "")
            if sym:
                class_registry.setdefault(sym, []).append(r["source_path"])

    classes_in_file: dict[str, set[str]] = {}
    for r in relationships:
        if r["relation_type"] == "DEFINES_CLASS":
            classes_in_file.setdefault(r["source_path"], set()).add(r.get("symbol", ""))

    resolved = 0
    resolved_via_import = 0
    resolved_via_same_file = 0
    resolved_via_unique_class = 0
    unresolved_external = 0
    unresolved_ambiguous = 0

    for r in relationships:
        if r["relation_type"] != "INHERITS_UNRESOLVED":
            continue

        source_file = r["source_path"]
        symbol = r.get("symbol", "")
        if " -> " not in symbol:
            continue

        class_name, base_expr = symbol.split(" -> ", 1)
        file_imports = file_import_names.get(source_file, {})

        target_path = None

        if "." in base_expr:
            module_part = base_expr.rsplit(".", 1)[0]
            attr_part = base_expr.rsplit(".", 1)[1]

            if module_part in file_imports:
                candidate_file = file_imports[module_part]
                file_classes = classes_in_file.get(candidate_file, set())
                if attr_part in file_classes:
                    target_path = candidate_file
                    resolved_via_import += 1
        else:
            if base_expr in file_imports:
                candidate_file = file_imports[base_expr]
                file_classes = classes_in_file.get(candidate_file, set())
                if base_expr in file_classes:
                    target_path = candidate_file
                    resolved_via_import += 1
                else:
                    target_path = candidate_file
                    resolved_via_import += 1

            if not target_path:
                file_classes = classes_in_file.get(source_file, set())
                if base_expr in file_classes:
                    target_path = source_file
                    resolved_via_same_file += 1

            if not target_path and base_expr in class_registry:
                defs = class_registry[base_expr]
                if len(defs) == 1:
                    target_path = defs[0]
                    resolved_via_unique_class += 1
                else:
                    unresolved_ambiguous += 1

        if target_path:
            r["relation_type"] = "INHERITS"
            r["target_path"] = target_path
            resolved += 1
        else:
            unresolved_external += 1

    return {
        "total_inherits_input": resolved + unresolved_external + unresolved_ambiguous,
        "resolved": resolved,
        "resolved_via_import_context": resolved_via_import,
        "resolved_via_same_file": resolved_via_same_file,
        "resolved_via_unique_class": resolved_via_unique_class,
        "unresolved_external": unresolved_external,
        "unresolved_ambiguous": unresolved_ambiguous,
    }


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
                 if r["relation_type"] == "IMPORTS"
                 and r.get("target_path") and r["source_path"] == r["target_path"]]
    checks["no_self_references"] = len(self_refs) == 0

    bad_types = [r for r in relationships
                 if r["relation_type"] not in SUPPORTED_RELATION_TYPES]
    checks["all_relation_types_supported"] = len(bad_types) == 0

    edge_rels = [r for r in relationships if r["relation_type"] in ("IMPORTS", "INHERITS")]
    source_ok = all(r["source_path"] in known_files for r in edge_rels)
    target_ok = all(r["target_path"] in known_files for r in edge_rels if r.get("target_path"))
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
    inheritance_stats: dict | None = None,
) -> dict:
    """Assemble the 40.3s code_graph.json artifact."""
    type_counts: Counter = Counter()
    for r in relationships:
        type_counts[r["relation_type"]] += 1

    summary = {rt: type_counts.get(rt, 0) for rt in sorted(SUPPORTED_RELATION_TYPES)}
    summary["total"] = len(relationships)

    artifact = {
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
    if inheritance_stats:
        artifact["inheritance_resolution"] = inheritance_stats
    return artifact


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


# ── TypeScript Detection + Extraction ────────────────────────────────────────

def detect_typescript_specimen(intake_dir):
    """
    Detect if intake contains TypeScript sub-projects.
    Returns list of (sub_project_rel, tsconfig_abs_path) tuples, or empty list.
    """
    tsconfigs = []
    for root, dirs, files in os.walk(intake_dir):
        dirs[:] = [d for d in dirs if d not in ("node_modules", "dist", ".git", "coverage")]
        if "tsconfig.json" in files:
            tc_path = Path(root) / "tsconfig.json"
            sub_rel = str(Path(root).relative_to(intake_dir))
            tsconfigs.append((sub_rel, tc_path))
    return tsconfigs


def find_typescript_files(intake_dir):
    """Find all .ts/.tsx files under intake directory."""
    results = []
    for root, dirs, files in os.walk(intake_dir):
        dirs[:] = [d for d in dirs if d not in ("node_modules", "dist", ".git", "coverage", "storybook-static")]
        for f in sorted(files):
            if f.endswith(".ts") or f.endswith(".tsx"):
                abs_path = Path(root) / f
                rel_path = str(abs_path.relative_to(intake_dir))
                results.append((abs_path, rel_path))
    return results


TS_INDEXER_INFO = {
    "name": "typescript-compiler-api",
    "version": "pipeline",
    "capabilities": sorted(SUPPORTED_RELATION_TYPES),
    "dependency_class": "PIPELINE_ENRICHMENT_DEPENDENCY",
}


def run_ts_extractor(intake_dir, tsconfig_paths):
    """
    Invoke the Node.js TypeScript extractor as subprocess.
    Returns parsed JSON output or None on failure.
    """
    if not TS_EXTRACTOR_SCRIPT.is_file():
        print(f"\n  FAIL: TypeScript extractor not found: {TS_EXTRACTOR_SCRIPT}")
        return None

    node_modules = TS_ENRICHMENT_DIR / "node_modules" / "typescript"
    if not node_modules.is_dir():
        print(f"\n  FAIL: TypeScript PIPELINE_ENRICHMENT_DEPENDENCY not installed")
        print(f"        Run: cd {TS_ENRICHMENT_DIR} && npm install")
        return None

    cmd = [
        "node", str(TS_EXTRACTOR_SCRIPT),
        "--intake", str(intake_dir),
        "--extensions", ".ts,.tsx",
    ]
    if tsconfig_paths:
        cmd.extend(["--tsconfig", ",".join(str(p) for p in tsconfig_paths)])

    print(f"\n  Invoking TypeScript extractor (PIPELINE_ENRICHMENT_DEPENDENCY)...")
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

    if result.returncode != 0:
        print(f"\n  FAIL: TypeScript extractor returned {result.returncode}")
        if result.stderr:
            print(f"  stderr: {result.stderr[:500]}")
        return None

    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as e:
        print(f"\n  FAIL: TypeScript extractor produced invalid JSON: {e}")
        return None


def transform_ts_extraction_to_relationships(ts_output, known_files):
    """
    Transform TypeScript extractor JSON into 40.3s relationship list.
    Only emits relationships where both source and target are in known_files.
    """
    relationships = []
    seen = set()

    for file_result in ts_output.get("results", []):
        source_path = file_result["file"]
        if source_path not in known_files:
            continue

        for imp in file_result.get("imports", []):
            if imp.get("resolution") != "RESOLVED":
                continue
            target_path = imp.get("resolved_path")
            if not target_path or target_path not in known_files:
                continue
            if target_path == source_path:
                continue

            edge_key = (source_path, target_path, "IMPORTS")
            if edge_key in seen:
                continue
            seen.add(edge_key)

            bindings_str = ", ".join(imp.get("bindings", [])[:3])
            if len(imp.get("bindings", [])) > 3:
                bindings_str += ", ..."
            type_prefix = "import type " if imp.get("type_only") else "import "
            stmt = f"{type_prefix}{{{bindings_str}}} from '{imp['specifier']}'" if bindings_str else f"import '{imp['specifier']}'"

            relationships.append({
                "source_path": source_path,
                "target_path": target_path,
                "source_node_id": None,
                "target_node_id": None,
                "relation_type": "IMPORTS",
                "evidence": {
                    "line": imp.get("line", 0),
                    "statement": stmt,
                },
            })

        for exp in file_result.get("exports", []):
            if not exp.get("is_reexport"):
                continue
            if exp.get("resolution") != "RESOLVED":
                continue
            target_path = exp.get("resolved_path")
            if not target_path or target_path not in known_files:
                continue
            if target_path == source_path:
                continue

            edge_key = (source_path, target_path, "IMPORTS")
            if edge_key in seen:
                continue
            seen.add(edge_key)

            relationships.append({
                "source_path": source_path,
                "target_path": target_path,
                "source_node_id": None,
                "target_node_id": None,
                "relation_type": "IMPORTS",
                "evidence": {
                    "line": exp.get("line", 0),
                    "statement": f"export from '{exp['specifier']}'",
                },
            })

        for defn in file_result.get("defines", []):
            kind = defn.get("kind", "")
            if kind in ("CLASS", "INTERFACE"):
                relationships.append({
                    "source_path": source_path,
                    "target_path": None,
                    "source_node_id": None,
                    "target_node_id": None,
                    "relation_type": "DEFINES_CLASS",
                    "symbol": defn["name"],
                    "evidence": {
                        "line": defn.get("line", 0),
                        "statement": f"{kind.lower()} {defn['name']}",
                    },
                })
            elif kind in ("FUNCTION", "CONST"):
                relationships.append({
                    "source_path": source_path,
                    "target_path": None,
                    "source_node_id": None,
                    "target_node_id": None,
                    "relation_type": "DEFINES_FUNCTION",
                    "symbol": defn["name"],
                    "evidence": {
                        "line": defn.get("line", 0),
                        "statement": f"{kind.lower()} {defn['name']}",
                    },
                })

    return relationships


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

    # ── Detect language ────────────────────────────────────────────────
    ts_projects = detect_typescript_specimen(paths["intake_dir"])
    source_root = discover_source_root(paths["intake_dir"])

    is_typescript = len(ts_projects) > 0 and source_root is None

    if is_typescript:
        return main_typescript(args, paths, ts_projects)

    # ── Python path ──────────────────────────────────────────────────────
    if source_root is None:
        print(f"\n  FAIL: no Python package found in {paths['intake_dir']}")
        if ts_projects:
            print(f"  NOTE: TypeScript tsconfigs detected but Python source root also found.")
            print(f"  Mixed-language enrichment not yet supported.")
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
    package_candidates = []
    for abs_p, rel_p in py_files:
        if abs_p.name == "__init__.py":
            package_candidates.append(abs_p.parent)

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
    all_relationships = []
    file_import_names = {}
    for abs_path, rel_path in py_files:
        rels, imp_names = extract_relationships(
            abs_path, rel_path, package_root, paths["intake_dir"], known_files, source_root_rel,
            package_prefixes=package_prefixes,
        )
        all_relationships.extend(rels)
        if imp_names:
            file_import_names[rel_path] = imp_names

    all_relationships.sort(key=lambda r: (r["source_path"], r["relation_type"], r.get("evidence", {}).get("line", 0)))

    print(f"  Total relationships extracted: {len(all_relationships)}")

    # ── Resolve inheritance ──────────────────────────────────────────────
    inheritance_stats = resolve_inheritance(all_relationships, file_import_names)
    print(f"  Inheritance resolution: {inheritance_stats['resolved']}/{inheritance_stats['total_inherits_input']} resolved")
    print(f"    via import context: {inheritance_stats['resolved_via_import_context']}")
    print(f"    via same file:     {inheritance_stats['resolved_via_same_file']}")
    print(f"    via unique class:  {inheritance_stats['resolved_via_unique_class']}")
    print(f"    unresolved (external): {inheritance_stats['unresolved_external']}")
    print(f"    unresolved (ambiguous): {inheritance_stats['unresolved_ambiguous']}")

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
        inheritance_stats=inheritance_stats,
    )

    if args.dry_run:
        print(f"\n  [DRY-RUN] Would write: {paths['output_file']}")
        print(f"  [DRY-RUN] Relationships: {len(all_relationships)}")
        type_counts = Counter()
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


def main_typescript(args, paths, ts_projects):
    """TypeScript specimen path — uses PIPELINE_ENRICHMENT_DEPENDENCY extractor."""
    tsconfig_paths = [tc_path for _, tc_path in ts_projects]
    sub_projects = [sub_rel for sub_rel, _ in ts_projects]

    print(f"\n  Language:     TypeScript (detected {len(ts_projects)} sub-project(s))")
    for sub_rel, tc_path in ts_projects:
        print(f"    {sub_rel}/tsconfig.json")
    print(f"  Indexer:      {TS_INDEXER_INFO['name']} (PIPELINE_ENRICHMENT_DEPENDENCY)")

    # ── Find TypeScript files ────────────────────────────────────────────
    ts_files = find_typescript_files(paths["intake_dir"])
    if not ts_files:
        print(f"\n  FAIL: no TypeScript files found")
        return 1

    known_files = {rel for _, rel in ts_files}
    print(f"  TypeScript files found: {len(ts_files)}")

    # ── Invoke Node extractor ────────────────────────────────────────────
    ts_output = run_ts_extractor(paths["intake_dir"], tsconfig_paths)
    if ts_output is None:
        return 1

    ts_stats = ts_output.get("stats", {})
    print(f"\n  Extractor results:")
    print(f"    Files processed:    {ts_stats.get('files_processed', 0)}")
    print(f"    Files errored:      {ts_stats.get('files_errored', 0)}")
    print(f"    Total imports:      {ts_stats.get('total_imports', 0)}")
    print(f"    Imports resolved:   {ts_stats.get('imports_resolved', 0)}")
    print(f"    Imports external:   {ts_stats.get('imports_external', 0)}")
    print(f"    Imports unresolved: {ts_stats.get('imports_unresolved', 0)}")
    print(f"    Total exports:      {ts_stats.get('total_exports', 0)}")
    print(f"    Total defines:      {ts_stats.get('total_defines', 0)}")

    # ── Transform to 40.3s relationships ─────────────────────────────────
    all_relationships = transform_ts_extraction_to_relationships(ts_output, known_files)
    all_relationships.sort(key=lambda r: (r["source_path"], r["relation_type"], r.get("evidence", {}).get("line", 0)))

    print(f"\n  40.3s relationships produced: {len(all_relationships)}")
    type_counts = Counter(r["relation_type"] for r in all_relationships)
    for rt in sorted(SUPPORTED_RELATION_TYPES):
        count = type_counts.get(rt, 0)
        if count > 0:
            print(f"    {rt:25s}  {count:>5d}")

    # ── Cross-reference with 40.2 ────────────────────────────────────────
    all_relationships, xref_stats = cross_reference_inventory(
        all_relationships, paths["node_inventory"]
    )

    # ── Validate ─────────────────────────────────────────────────────────
    validation = validate_graph(all_relationships, known_files)

    # ── Report ───────────────────────────────────────────────────────────
    source_root_rel = ", ".join(sub_projects)
    if args.report_only:
        print_report(all_relationships, validation, xref_stats, known_files, source_root_rel)
        return 0

    # ── Build artifact ───────────────────────────────────────────────────
    artifact = build_artifact(
        all_relationships, args.client, args.run_id,
        source_root_rel, len(ts_files), validation, xref_stats,
    )
    artifact["indexer"] = TS_INDEXER_INFO
    artifact["indexer"]["typescript_compiler_version"] = ts_output.get("typescript_version", "unknown")
    artifact["typescript_extraction"] = {
        "sub_projects": sub_projects,
        "tsconfig_paths": [str(p) for p in tsconfig_paths],
        "resolution_stats": ts_stats,
        "errors": ts_output.get("errors", []),
    }

    if args.dry_run:
        print(f"\n  [DRY-RUN] Would write: {paths['output_file']}")
        print(f"  [DRY-RUN] Relationships: {len(all_relationships)}")
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
