#!/usr/bin/env python3
"""
structural_relevance_classifier.py
Contract: PI.PATHA.STRUCTURAL-SUBSTRATE-MATURATION.01

Deterministic Structural Relevance Classifier. Consumes 40.2 node inventory
and classifies every node by path-pattern rules into one of 9 Structural
Relevance Classes (SRC). Produces filtered derived views for downstream
DOM/pressure derivation.

Three-tier significance model:
  PRIMARY    — CORE_SOURCE only. Enters DOM layer, generates pressure zones.
  SUPPORT    — TESTING, CONFIG. Retained for CEU/evidence context, excluded
               from DOM/pressure derivation.
  PERIPHERAL — Everything else. Excluded from all downstream structural
               computation.

Reads:   clients/<client_id>/psee/runs/<run_id>/structure/40.2/structural_node_inventory.json
         clients/<client_id>/psee/runs/<run_id>/structure/40.3/structural_topology_log.json

Writes:  clients/<client_id>/psee/runs/<run_id>/structure/40.2r/structural_relevance.json
         clients/<client_id>/psee/runs/<run_id>/structure/40.2r/structural_node_inventory_filtered.json
         clients/<client_id>/psee/runs/<run_id>/structure/40.3r/structural_topology_log_filtered.json

Usage:
    python3 scripts/pios/structural_relevance_classifier.py \\
        --client pallets-flask \\
        --run-id run_github_flask_20260517_163222

    --dry-run        Compute all results, log what would be written; no files written
    --validate-only  Check inputs only; no classification or writing

RULE: No AI/LLM. All classification is path-pattern deterministic.
RULE: No file content reading. Classification by path patterns only.
RULE: 40.2r is a DERIVED VIEW — 40.2 remains untouched.
RULE: CREATE_ONLY — abort if any output file already exists (in write mode).
RULE: Deterministic — same 40.2 input → same output.
"""

import argparse
import json
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.PATHA.STRUCTURAL-SUBSTRATE-MATURATION.01"

# ── Structural Relevance Classes (SRC) ─────────────────────────────────────────

SRC_TIERS = {
    "CORE_SOURCE":   "PRIMARY",
    "TESTING":       "SUPPORT",
    "CONFIG":        "SUPPORT",
    "DOCUMENTATION": "PERIPHERAL",
    "INFRASTRUCTURE":"PERIPHERAL",
    "GENERATED":     "PERIPHERAL",
    "TOOLING":       "PERIPHERAL",
    "VENDOR":        "PERIPHERAL",
    "OTHER":         "PERIPHERAL",
}

# First-match-wins ordered rule list. Most specific patterns first.
# Each rule: (name, match_function, SRC class)
# Match functions receive the full path string and return True/False.

def _starts(prefixes):
    def match(p):
        parts = PurePosixPath(p).parts
        return len(parts) > 0 and parts[0] in prefixes
    return match

def _starts_any(prefixes):
    def match(p):
        parts = PurePosixPath(p).parts
        for prefix in prefixes:
            if any(part == prefix for part in parts):
                return True
        return False
    return match

def _exact(names):
    def match(p):
        parts = PurePosixPath(p).parts
        return len(parts) == 1 and parts[0] in names
    return match

def _basename(names):
    def match(p):
        return PurePosixPath(p).name in names
    return match

def _ext(extensions):
    def match(p):
        return PurePosixPath(p).suffix in extensions
    return match

def _re_match(pattern):
    compiled = re.compile(pattern)
    def match(p):
        return bool(compiled.search(p))
    return match


RELEVANCE_RULES = [
    # ── VENDOR (must be first — node_modules contains .js files) ──
    ("vendor_node_modules", _starts_any({"node_modules"}), "VENDOR"),
    ("vendor_venv", _starts_any({".venv", "venv", ".tox", ".nox"}), "VENDOR"),
    ("vendor_site_packages", _starts_any({"site-packages"}), "VENDOR"),
    ("vendor_bower", _starts_any({"bower_components"}), "VENDOR"),
    ("vendor_vendor", _starts({"vendor"}), "VENDOR"),

    # ── GENERATED (build output, caches) ──
    ("generated_pycache", _starts_any({"__pycache__"}), "GENERATED"),
    ("generated_dist", _starts({"dist", "build", "out", "_build"}), "GENERATED"),
    ("generated_next", _starts({".next"}), "GENERATED"),
    ("generated_mypy_cache", _starts_any({".mypy_cache", ".pytest_cache", ".ruff_cache"}), "GENERATED"),
    ("generated_eggs", _starts({"*.egg-info"}), "GENERATED"),
    ("generated_egg_info", _re_match(r"\.egg-info(/|$)"), "GENERATED"),
    ("generated_coverage", _starts({".coverage", "htmlcov", "coverage"}), "GENERATED"),

    # ── INFRASTRUCTURE (CI/CD, containers, dev environments) ──
    ("infra_github", _starts({".github"}), "INFRASTRUCTURE"),
    ("infra_gitlab", _starts({".gitlab"}), "INFRASTRUCTURE"),
    ("infra_circleci", _starts({".circleci"}), "INFRASTRUCTURE"),
    ("infra_devcontainer", _starts({".devcontainer"}), "INFRASTRUCTURE"),
    ("infra_docker", _basename({"Dockerfile", "docker-compose.yml", "docker-compose.yaml", ".dockerignore"}), "INFRASTRUCTURE"),

    # ── TOOLING (editor configs, linting, formatting) ──
    ("tooling_editorconfig", _basename({".editorconfig"}), "TOOLING"),
    ("tooling_pre_commit", _basename({".pre-commit-config.yaml", ".pre-commit-hooks.yaml"}), "TOOLING"),
    ("tooling_eslint", _basename({".eslintrc", ".eslintrc.js", ".eslintrc.json", ".eslintrc.yml", ".eslintignore"}), "TOOLING"),
    ("tooling_prettier", _basename({".prettierrc", ".prettierrc.js", ".prettierrc.json", ".prettierignore"}), "TOOLING"),
    ("tooling_flake8", _basename({".flake8", "tox.ini"}), "TOOLING"),
    ("tooling_ruff", _basename({"ruff.toml"}), "TOOLING"),
    ("tooling_mypy", _basename({"mypy.ini", ".mypy.ini"}), "TOOLING"),
    ("tooling_isort", _basename({".isort.cfg"}), "TOOLING"),
    ("tooling_gitattributes", _basename({".gitattributes"}), "TOOLING"),

    # ── DOCUMENTATION ──
    ("docs_directory", _starts({"docs", "doc", "documentation"}), "DOCUMENTATION"),
    ("docs_root_md", lambda p: PurePosixPath(p).suffix in {".md", ".rst", ".txt"} and len(PurePosixPath(p).parts) == 1, "DOCUMENTATION"),

    # ── TESTING ──
    ("test_directory", _starts({"tests", "test", "testing", "spec", "specs", "__tests__"}), "TESTING"),
    ("test_conftest", _basename({"conftest.py"}), "TESTING"),
    ("test_file_prefix", lambda p: PurePosixPath(p).name.startswith("test_") and PurePosixPath(p).suffix in {".py", ".js", ".ts"}, "TESTING"),
    ("test_file_suffix", lambda p: PurePosixPath(p).stem.endswith("_test") and PurePosixPath(p).suffix in {".py", ".js", ".ts"}, "TESTING"),
    ("test_spec_suffix", lambda p: PurePosixPath(p).name.endswith((".spec.js", ".spec.ts", ".test.js", ".test.ts")), "TESTING"),

    # ── CONFIG (project-level configuration) ──
    ("config_gitignore", _basename({".gitignore"}), "CONFIG"),
    ("config_pyproject", _basename({"pyproject.toml", "setup.py", "setup.cfg"}), "CONFIG"),
    ("config_package_json", _basename({"package.json", "package-lock.json"}), "CONFIG"),
    ("config_requirements", _basename({"requirements.txt", "requirements-dev.txt", "Pipfile", "Pipfile.lock", "poetry.lock"}), "CONFIG"),
    ("config_tsconfig", _basename({"tsconfig.json", "jsconfig.json"}), "CONFIG"),
    ("config_manifest", _basename({"MANIFEST.in"}), "CONFIG"),
    ("config_makefile", _basename({"Makefile"}), "CONFIG"),
    ("config_license", _basename({"LICENSE", "LICENSE.txt", "LICENSE.md", "LICENSE.rst"}), "CONFIG"),
    ("config_lockfile", lambda p: PurePosixPath(p).suffix == ".lock" and len(PurePosixPath(p).parts) == 1, "CONFIG"),

    # ── CORE_SOURCE (catch-all for source code files by extension) ──
    ("core_source_python", _ext({".py"}), "CORE_SOURCE"),
    ("core_source_javascript", _ext({".js", ".jsx", ".mjs", ".cjs"}), "CORE_SOURCE"),
    ("core_source_typescript", _ext({".ts", ".tsx"}), "CORE_SOURCE"),
    ("core_source_java", _ext({".java"}), "CORE_SOURCE"),
    ("core_source_go", _ext({".go"}), "CORE_SOURCE"),
    ("core_source_rust", _ext({".rs"}), "CORE_SOURCE"),
    ("core_source_c_cpp", _ext({".c", ".cpp", ".h", ".hpp", ".cc", ".cxx"}), "CORE_SOURCE"),
    ("core_source_csharp", _ext({".cs"}), "CORE_SOURCE"),
    ("core_source_ruby", _ext({".rb"}), "CORE_SOURCE"),
    ("core_source_shell", _ext({".sh", ".bash", ".zsh"}), "CORE_SOURCE"),
    ("core_source_html", _ext({".html", ".htm"}), "CORE_SOURCE"),
    ("core_source_css", _ext({".css", ".scss", ".sass", ".less"}), "CORE_SOURCE"),
    ("core_source_sql", _ext({".sql"}), "CORE_SOURCE"),
    ("core_source_yaml_in_src", lambda p: PurePosixPath(p).suffix in {".yaml", ".yml"} and len(PurePosixPath(p).parts) > 1 and PurePosixPath(p).parts[0] not in {".github", ".gitlab", ".circleci"}, "CORE_SOURCE"),
    ("core_source_json_in_src", lambda p: PurePosixPath(p).suffix == ".json" and len(PurePosixPath(p).parts) > 1, "CORE_SOURCE"),

    # ── OTHER (final fallback) ──
    ("other_image", _ext({".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp"}), "OTHER"),
    ("other_binary", _ext({".whl", ".tar", ".gz", ".zip", ".exe", ".so", ".dylib"}), "OTHER"),
    ("other_fallback", lambda p: True, "OTHER"),
]


# ── Utilities ──────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Structural Relevance Classifier (Phase 3.5)")
    p.add_argument("--client",        required=True)
    p.add_argument("--run-id",        required=True)
    p.add_argument("--dry-run",       action="store_true")
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


# ── Classification Engine ─────────────────────────────────────────────────────

def classify_node(path: str) -> tuple[str, str, str]:
    """Classify a single node path. Returns (src_class, significance_tier, matched_rule)."""
    for rule_name, match_fn, src_class in RELEVANCE_RULES:
        if match_fn(path):
            return src_class, SRC_TIERS[src_class], rule_name
    return "OTHER", "PERIPHERAL", "other_fallback"


def classify_directory(path: str, child_classifications: dict[str, str]) -> tuple[str, str, str]:
    """Classify a directory node by dominant child classification.
    child_classifications: {child_path: src_class} for all children under this directory."""
    if not child_classifications:
        src, tier, rule = classify_node(path)
        return src, tier, f"dir_empty_fallback_{rule}"

    counts = Counter(child_classifications.values())
    dominant_src = counts.most_common(1)[0][0]
    return dominant_src, SRC_TIERS[dominant_src], f"dir_dominant_{dominant_src.lower()}"


def classify_all_nodes(nodes: list[dict]) -> list[dict]:
    """Classify every node in the 40.2 inventory. Returns list of classification records."""
    file_nodes = [n for n in nodes if n["type"] == "file"]
    dir_nodes = [n for n in nodes if n["type"] == "directory"]

    classifications: dict[str, tuple[str, str, str]] = {}

    for node in file_nodes:
        path = node["path"]
        src, tier, rule = classify_node(path)
        classifications[node["node_id"]] = (src, tier, rule)

    path_to_id = {n["path"]: n["node_id"] for n in nodes}

    sorted_dirs = sorted(dir_nodes, key=lambda n: -n["path"].count("/"))
    for dnode in sorted_dirs:
        dir_path = dnode["path"]
        child_classes = {}
        for node in nodes:
            p = node["path"]
            if p != dir_path and p.startswith(dir_path + "/") or (p.startswith(dir_path) and len(PurePosixPath(p).parts) == len(PurePosixPath(dir_path).parts) + 1):
                nid = node["node_id"]
                if nid in classifications:
                    child_classes[p] = classifications[nid][0]

        if child_classes:
            src, tier, rule = classify_directory(dir_path, child_classes)
        else:
            src, tier, rule = classify_node(dir_path)
            rule = f"dir_no_children_{rule}"

        classifications[dnode["node_id"]] = (src, tier, rule)

    results = []
    for node in nodes:
        nid = node["node_id"]
        src, tier, rule = classifications.get(nid, ("OTHER", "PERIPHERAL", "other_fallback"))
        results.append({
            "node_id": nid,
            "path": node["path"],
            "type": node["type"],
            "src_class": src,
            "significance_tier": tier,
            "matched_rule": rule,
        })

    return results


# ── Filtered Inventory Builder ─────────────────────────────────────────────────

def build_filtered_inventory(
    original_inventory: dict,
    classification_records: list[dict],
) -> dict:
    """Build a filtered 40.2 inventory containing only PRIMARY (CORE_SOURCE) nodes."""
    primary_ids = {
        r["node_id"] for r in classification_records
        if r["significance_tier"] == "PRIMARY"
    }

    filtered_nodes = [
        n for n in original_inventory["nodes"]
        if n["node_id"] in primary_ids
    ]

    file_count = sum(1 for n in filtered_nodes if n["type"] == "file")
    dir_count = sum(1 for n in filtered_nodes if n["type"] == "directory")

    return {
        "contract_id": CONTRACT_ID,
        "derived_from": "40.2/structural_node_inventory.json",
        "filter": "PRIMARY_ONLY (CORE_SOURCE)",
        "client_id": original_inventory.get("client_id", ""),
        "source_id": original_inventory.get("source_id", ""),
        "run_id": original_inventory.get("run_id", ""),
        "stage": "40.2r",
        "generated_at": now_iso(),
        "total_nodes": len(filtered_nodes),
        "file_nodes": file_count,
        "directory_nodes": dir_count,
        "source_root": original_inventory.get("source_root", ""),
        "nodes": filtered_nodes,
    }


# ── Filtered Topology Builder ─────────────────────────────────────────────────

def build_filtered_topology(
    original_topology: dict,
    primary_ids: set[str],
) -> dict:
    """Build a filtered 40.3 topology retaining only edges where BOTH
    source and target are PRIMARY."""
    filtered_edges = [
        e for e in original_topology.get("edges", [])
        if e.get("source") in primary_ids and e.get("target") in primary_ids
    ]

    edge_type_counts = Counter(e.get("edge_type", "UNKNOWN") for e in filtered_edges)

    return {
        "contract_id": CONTRACT_ID,
        "derived_from": "40.3/structural_topology_log.json",
        "filter": "PRIMARY_ONLY (both source and target CORE_SOURCE)",
        "client_id": original_topology.get("client_id", ""),
        "source_id": original_topology.get("source_id", ""),
        "run_id": original_topology.get("run_id", ""),
        "stage": "40.3r",
        "generated_at": now_iso(),
        "total_edges": len(filtered_edges),
        "edge_type_counts": dict(edge_type_counts),
        "source_total_edges": original_topology.get("total_edges", len(original_topology.get("edges", []))),
        "edges": filtered_edges,
    }


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    args = parse_args()
    client_id = args.client
    run_id = args.run_id
    dry_run = args.dry_run
    validate_only = args.validate_only

    print("=" * 64)
    print(f"structural_relevance_classifier.py — {CONTRACT_ID}")
    print(f"  client:  {client_id}")
    print(f"  run_id:  {run_id}")
    mode = "VALIDATE-ONLY" if validate_only else ("DRY-RUN" if dry_run else "WRITE")
    print(f"  mode:    {mode}")
    print("=" * 64)

    # Path resolution
    run_dir = REPO_ROOT / "clients" / client_id / "psee" / "runs" / run_id
    node_inv_path = run_dir / "structure" / "40.2" / "structural_node_inventory.json"
    topo_path = run_dir / "structure" / "40.3" / "structural_topology_log.json"

    out_relevance = run_dir / "structure" / "40.2r" / "structural_relevance.json"
    out_filtered_inv = run_dir / "structure" / "40.2r" / "structural_node_inventory_filtered.json"
    out_filtered_topo = run_dir / "structure" / "40.3r" / "structural_topology_log_filtered.json"

    # ── [1] Validate inputs ──────────────────────────────────────────────────
    print("\n[1] Validating inputs ...")

    if not node_inv_path.exists():
        fail_closed(
            f"structural_node_inventory.json not found at "
            f"{node_inv_path.relative_to(REPO_ROOT)}\n"
            f"  Run structural_scanner.py first."
        )

    topo_available = topo_path.exists()
    if not topo_available:
        print(f"  WARNING: structural_topology_log.json not found — 40.3r will be skipped")

    node_inv = load_json(node_inv_path)
    print(f"  node_inventory: {node_inv['total_nodes']} nodes")

    if validate_only:
        print("\n  Inputs valid. Validate-only mode — stopping before classification.")
        print("\n" + "=" * 64)
        print("VALIDATE-ONLY PASS")
        print("=" * 64)
        return

    if not dry_run:
        for out_path in [out_relevance, out_filtered_inv]:
            if out_path.exists():
                fail_closed(
                    f"CREATE_ONLY violation — output already exists: "
                    f"{out_path.relative_to(REPO_ROOT)}"
                )
        if topo_available and out_filtered_topo.exists():
            fail_closed(
                f"CREATE_ONLY violation — output already exists: "
                f"{out_filtered_topo.relative_to(REPO_ROOT)}"
            )

    # ── [2] Classify all nodes ───────────────────────────────────────────────
    print("\n[2] Classifying nodes ...")
    classification_records = classify_all_nodes(node_inv["nodes"])

    tier_counts = Counter(r["significance_tier"] for r in classification_records)
    src_counts = Counter(r["src_class"] for r in classification_records)

    print(f"  Significance tiers:")
    for tier in ["PRIMARY", "SUPPORT", "PERIPHERAL"]:
        print(f"    {tier:12s} {tier_counts.get(tier, 0):4d} nodes")

    print(f"  SRC classes:")
    for src in ["CORE_SOURCE", "TESTING", "CONFIG", "DOCUMENTATION",
                "INFRASTRUCTURE", "GENERATED", "TOOLING", "VENDOR", "OTHER"]:
        count = src_counts.get(src, 0)
        if count > 0:
            print(f"    {src:16s} {count:4d} nodes")

    total = len(classification_records)
    primary_count = tier_counts.get("PRIMARY", 0)
    core_source_ratio = primary_count / total if total > 0 else 0.0
    print(f"  core_source_ratio: {core_source_ratio:.3f} ({primary_count}/{total})")

    # ── [3] Build structural_relevance.json ──────────────────────────────────
    print("\n[3] Building structural_relevance.json ...")
    relevance_artifact = {
        "contract_id": CONTRACT_ID,
        "client_id": client_id,
        "run_id": run_id,
        "stage": "40.2r",
        "generated_at": now_iso(),
        "source_artifact": "40.2/structural_node_inventory.json",
        "total_nodes": total,
        "significance_summary": {
            "PRIMARY": tier_counts.get("PRIMARY", 0),
            "SUPPORT": tier_counts.get("SUPPORT", 0),
            "PERIPHERAL": tier_counts.get("PERIPHERAL", 0),
        },
        "src_class_summary": dict(src_counts),
        "core_source_ratio": round(core_source_ratio, 4),
        "classification_rules_version": "1.0",
        "tier_model": {
            "PRIMARY": "CORE_SOURCE only — enters DOM layer, generates pressure zones",
            "SUPPORT": "TESTING + CONFIG — retained for CEU/evidence context, excluded from DOM/pressure",
            "PERIPHERAL": "Everything else — excluded from all downstream structural computation",
        },
        "nodes": classification_records,
    }
    save_json(out_relevance, relevance_artifact, dry_run)

    # ── [4] Build filtered node inventory (40.2r) ────────────────────────────
    print("\n[4] Building filtered node inventory (PRIMARY only) ...")
    filtered_inv = build_filtered_inventory(node_inv, classification_records)
    print(f"  filtered: {filtered_inv['total_nodes']} nodes (from {total})")
    save_json(out_filtered_inv, filtered_inv, dry_run)

    # ── [5] Build filtered topology (40.3r) ──────────────────────────────────
    if topo_available:
        print("\n[5] Building filtered topology (PRIMARY edges only) ...")
        topology = load_json(topo_path)
        primary_ids = {
            r["node_id"] for r in classification_records
            if r["significance_tier"] == "PRIMARY"
        }
        filtered_topo = build_filtered_topology(topology, primary_ids)
        print(f"  filtered: {filtered_topo['total_edges']} edges (from {filtered_topo['source_total_edges']})")
        save_json(out_filtered_topo, filtered_topo, dry_run)
    else:
        print("\n[5] Skipping filtered topology (40.3 not available)")

    # ── Summary ──────────────────────────────────────────────────────────────
    print("\n" + "=" * 64)
    print(
        f"CLASSIFICATION COMPLETE — "
        f"{primary_count} PRIMARY, "
        f"{tier_counts.get('SUPPORT', 0)} SUPPORT, "
        f"{tier_counts.get('PERIPHERAL', 0)} PERIPHERAL "
        f"(core_source_ratio={core_source_ratio:.3f})"
    )
    print("=" * 64)


if __name__ == "__main__":
    main()
