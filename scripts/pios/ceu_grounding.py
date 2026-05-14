#!/usr/bin/env python3
"""
ceu_grounding.py
Contract: PI.LENS.CEU-GROUNDING.GENERIC.01

Generic deterministic CEU grounding stage. Consumes 40.x structural artifacts
and produces grounding_state_v3.json for any client.

Reads:   clients/<client_id>/psee/runs/<run_id>/structure/40.2/structural_node_inventory.json
         clients/<client_id>/psee/runs/<run_id>/structure/40.3/structural_topology_log.json
         clients/<client_id>/psee/runs/<run_id>/structure/40.4/canonical_topology.json
         scripts/pios/ceu_registry.json

Writes:  clients/<client_id>/psee/runs/<run_id>/ceu/grounding_state_v3.json

Usage:
    python3 scripts/pios/ceu_grounding.py \\
        --client fastapi \\
        --run-id run_02_oss_fastapi_pipeline

    --dry-run        Compute all results, log what would be written; no files written
    --validate-only  Check structural inputs only; no grounding or writing

RULE: No semantic inference. Deterministic pattern matching only.
RULE: No BlueEdge dependency. No CEU redesign. No DOM/41.x/75.x.
RULE: CREATE_ONLY — abort if output file already exists (in write mode).
RULE: All output is deterministic — same structural inventory → same grounding state.
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CONTRACT_ID = "PI.LENS.CEU-GROUNDING.GENERIC.01"
REGISTRY_PATH = REPO_ROOT / "scripts" / "pios" / "ceu_registry.json"
EVIDENCE_CAP = 10  # max evidence_paths per CEU in output


# ── Utilities ──────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generic CEU grounding stage")
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


# ── Detection Engine ───────────────────────────────────────────────────────────

def matches_rule(node_path: str, rule: dict) -> bool:
    """Return True if node_path satisfies the detection rule. Case-sensitive."""
    rtype = rule["type"]
    value = rule["value"]

    if rtype == "path_prefix":
        return node_path.startswith(value)
    elif rtype == "path_contains":
        return value in node_path
    elif rtype == "filename_equals":
        return Path(node_path).name == value
    elif rtype == "extension_equals":
        return Path(node_path).suffix.lower() == value
    elif rtype == "dir_component_equals":
        return value in Path(node_path).parts
    return False


def evaluate_ceu(
    ceu_def: dict,
    file_nodes: list[dict],
) -> tuple[bool, bool, str, list[str], int]:
    """
    Match file nodes against CEU detection rules.

    Returns: (present, grounded, activation_class, evidence_paths, node_count)

    Grounding logic:
      FULL           → present → grounded = True
      LIMITED        → present AND node_count >= 2 → grounded = True
      STRUCTURAL_ONLY → present → grounded = False
      (not present)  → NONE, grounded = False
    """
    matched: list[str] = []

    for node in file_nodes:
        fpath = node["path"]
        for rule in ceu_def["detection_rules"]:
            if matches_rule(fpath, rule):
                matched.append(fpath)
                break  # at most one match per node

    node_count = len(matched)
    present = node_count > 0
    default_class = ceu_def["default_activation_class"]

    if not present:
        activation_class = "NONE"
        grounded = False
    elif default_class == "FULL":
        activation_class = "FULL"
        grounded = True
    elif default_class == "LIMITED":
        activation_class = "LIMITED"
        grounded = node_count >= 2
    elif default_class == "STRUCTURAL_ONLY":
        activation_class = "STRUCTURAL_ONLY"
        grounded = False
    else:
        activation_class = "NONE"
        grounded = False

    evidence_paths = sorted(matched)[:EVIDENCE_CAP]
    return present, grounded, activation_class, evidence_paths, node_count


# ── Classification ─────────────────────────────────────────────────────────────

def classify_coverage(grounding_ratio: float) -> str:
    if grounding_ratio >= 0.8:
        return "HIGH"
    elif grounding_ratio >= 0.5:
        return "MEDIUM"
    elif grounding_ratio > 0:
        return "LOW"
    return "ZERO"


def compute_validation_status(grounding_ratio: float) -> str:
    if grounding_ratio >= 0.5:
        return "PASS"
    elif grounding_ratio > 0:
        return "PARTIAL"
    return "FAIL"


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    args = parse_args()
    client_id = args.client
    run_id    = args.run_id
    dry_run   = args.dry_run
    validate_only = args.validate_only

    print("=" * 64)
    print(f"ceu_grounding.py — {CONTRACT_ID}")
    print(f"  client:  {client_id}")
    print(f"  run_id:  {run_id}")
    mode = "VALIDATE-ONLY" if validate_only else ("DRY-RUN" if dry_run else "WRITE")
    print(f"  mode:    {mode}")
    print("=" * 64)

    # Path resolution
    run_dir       = REPO_ROOT / "clients" / client_id / "psee" / "runs" / run_id
    structure_dir = run_dir / "structure"
    ceu_dir       = run_dir / "ceu"
    output_path   = ceu_dir / "grounding_state_v3.json"

    node_inventory_path    = structure_dir / "40.2" / "structural_node_inventory.json"
    topology_log_path      = structure_dir / "40.3" / "structural_topology_log.json"
    canonical_topology_path = structure_dir / "40.4" / "canonical_topology.json"

    # ── [1] Validate inputs ───────────────────────────────────────────────────
    print("\n[1] Validating inputs ...")

    if not REGISTRY_PATH.exists():
        fail_closed(f"CEU registry not found: {REGISTRY_PATH.relative_to(REPO_ROOT)}")

    for path, label in [
        (node_inventory_path,     "40.2/structural_node_inventory.json"),
        (topology_log_path,       "40.3/structural_topology_log.json"),
        (canonical_topology_path, "40.4/canonical_topology.json"),
    ]:
        if not path.exists():
            fail_closed(
                f"Structural artifact missing: {label}\n"
                f"  Run structural_scanner.py first."
            )

    registry  = load_json(REGISTRY_PATH)
    inventory = load_json(node_inventory_path)
    # Verify registry integrity
    if "ceus" not in registry or not registry["ceus"]:
        fail_closed("CEU registry is empty or malformed.")

    print(f"  CEU registry:    {len(registry['ceus'])} CEUs  ({registry['registry_id']})")
    print(f"  40.2 inventory:  {inventory['total_nodes']} nodes ({inventory['file_nodes']} files)")
    print(f"  40.3 topology:   present")
    print(f"  40.4 canonical:  present")

    if validate_only:
        print("\n  Inputs valid. Validate-only mode — stopping before grounding.")
        print("\n" + "=" * 64)
        print("VALIDATE-ONLY PASS")
        print("=" * 64)
        return

    if not dry_run and output_path.exists():
        fail_closed(
            f"CREATE_ONLY violation — output already exists: "
            f"{output_path.relative_to(REPO_ROOT)}"
        )

    # ── [2] Evaluate CEUs ─────────────────────────────────────────────────────
    print("\n[2] Evaluating CEUs against structural nodes ...")

    file_nodes = [n for n in inventory["nodes"] if n["type"] == "file"]

    ceu_results: list[dict] = []
    for ceu_def in registry["ceus"]:
        present, grounded, activation_class, evidence_paths, node_count = evaluate_ceu(
            ceu_def, file_nodes
        )
        status = "GROUNDED" if grounded else ("PRESENT" if present else "ABSENT")
        print(
            f"  {ceu_def['ceu_id']} {ceu_def['name']:28s}"
            f" {status:10s}  nodes={node_count:3d}  class={activation_class}"
        )
        ceu_results.append({
            "ceu_id":          ceu_def["ceu_id"],
            "present":         present,
            "grounded":        grounded,
            "activation_class": activation_class,
            "evidence_paths":  evidence_paths,
            "node_count":      node_count,
        })

    # ── [3] Compute summary ───────────────────────────────────────────────────
    total_ceu       = len(ceu_results)
    grounded_count  = sum(1 for r in ceu_results if r["grounded"])
    ungrounded_count = total_ceu - grounded_count
    grounding_ratio = round(grounded_count / total_ceu, 4) if total_ceu > 0 else 0.0
    coverage_classification = classify_coverage(grounding_ratio)
    validation_status       = compute_validation_status(grounding_ratio)

    print(f"\n  total_ceu:              {total_ceu}")
    print(f"  grounded_count:         {grounded_count}")
    print(f"  ungrounded_count:       {ungrounded_count}")
    print(f"  grounding_ratio:        {grounding_ratio}")
    print(f"  coverage_classification: {coverage_classification}")
    print(f"  validation_status:       {validation_status}")

    # ── [4] Assemble output ───────────────────────────────────────────────────
    grounding_state = {
        "contract_id":             CONTRACT_ID,
        "client":                  client_id,
        "run_id":                  run_id,
        "generated_at":            now_iso(),
        "registry_id":             registry["registry_id"],
        "total_ceu":               total_ceu,
        "grounded_count":          grounded_count,
        "ungrounded_count":        ungrounded_count,
        "grounding_ratio":         grounding_ratio,
        "coverage_classification": coverage_classification,
        "ceus":                    ceu_results,
        "validation_status":       validation_status,
    }

    # ── [5] Write ─────────────────────────────────────────────────────────────
    print("\n[3] Writing output ...")
    save_json(output_path, grounding_state, dry_run)

    print("\n" + "=" * 64)
    print(
        f"GROUNDING COMPLETE — {grounded_count}/{total_ceu} CEUs grounded"
        f" ({grounding_ratio:.1%}) — {validation_status}"
    )
    print("=" * 64)


if __name__ == "__main__":
    main()
