#!/usr/bin/env python3
"""
ceu_evidence_intake.py
Contract: PI.SQO.CEU-RECONCILIATION-WORKFLOW.01

Documentation evidence intake for CEU candidate reconciliation.
Extracts structural evidence from the client's source repository and maps
it to CEU candidates, producing governed evidence anchors.

This script implements: "Evidence anchors" in the derivation sequence.
Structure suggests → Human validates → EVIDENCE ANCHORS →
  Compiler derives → Operator reviews → SQO qualifies.

Reads:
  clients/<client>/psee/runs/<run>/ceu/candidate_registry.json
  clients/<client>/psee/runs/<run>/intake/canonical_repo/  (source repository)

Writes:
  clients/<client>/psee/runs/<run>/ceu/evidence_anchors.json

Evidence types extracted:
  APP_CONFIG        — Django AppConfig class definition
  MODULE_DOCSTRING  — Top-level module docstrings
  MODEL_INVENTORY   — Model class inventory per domain
  URL_NAMESPACE     — API URL namespace definitions
  OFFICIAL_DOCS     — Feature/model documentation matching domain
  MODEL_DOCS        — Per-model documentation pages

Usage:
    python3 scripts/pios/ceu_evidence_intake.py \\
        --client netbox \\
        --run-id run_github_netbox_20260520_134600

    --dry-run       Compute all results, log what would be written; no files written
    --report-only   Print detailed report; no files written

RULE: No AI/LLM. All extraction is deterministic file reading.
RULE: Evidence is structural extraction, not semantic authoring.
RULE: CREATE_ONLY — abort if output file already exists (in write mode).
RULE: Deterministic — same source repository → same evidence anchors.
"""

from __future__ import annotations

import argparse
import ast
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]

CONTRACT_ID = "PI.SQO.CEU-RECONCILIATION-WORKFLOW.01"
ARTIFACT_CLASS = "ceu_evidence_anchors"


def resolve_paths(client: str, run_id: str) -> dict:
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    return {
        "run_dir": run_dir,
        "candidate_registry": run_dir / "ceu" / "candidate_registry.json",
        "source_repo": run_dir / "intake" / "canonical_repo",
        "output_dir": run_dir / "ceu",
        "evidence_anchors": run_dir / "ceu" / "evidence_anchors.json",
    }


def load_json(path: Path) -> dict | None:
    if not path.is_file():
        return None
    with open(path) as f:
        return json.load(f)


def find_source_root(source_repo: Path) -> str | None:
    """Detect the source root prefix within the repository."""
    source_inv = source_repo.parent.parent / "intake" / "source_inventory.json"
    if source_inv != source_repo.parent / "source_inventory.json":
        source_inv = source_repo.parent / "source_inventory.json"
    inv = load_json(source_inv)
    if inv and "source_root" in inv:
        return inv["source_root"]
    for candidate in ["netbox", "st2", "src", "lib"]:
        if (source_repo / candidate).is_dir():
            return candidate
    return None


def extract_app_config(domain_path: Path) -> dict | None:
    """Extract Django AppConfig from apps.py."""
    apps_file = domain_path / "apps.py"
    if not apps_file.is_file():
        return None

    content = apps_file.read_text(errors="replace")
    result = {
        "source_path": str(apps_file),
        "evidence_type": "APP_CONFIG",
    }

    name_match = re.search(r'''name\s*=\s*['"]([^'"]+)['"]''', content)
    verbose_match = re.search(r'''verbose_name\s*=\s*['"]([^'"]+)['"]''', content)
    class_match = re.search(r'class\s+(\w+)\(AppConfig\)', content)

    if class_match:
        result["config_class"] = class_match.group(1)
    if name_match:
        result["app_name"] = name_match.group(1)
    if verbose_match:
        result["verbose_name"] = verbose_match.group(1)

    if name_match or class_match:
        return result
    return None


def extract_module_docstring(domain_path: Path) -> dict | None:
    """Extract module-level docstring from __init__.py."""
    init_file = domain_path / "__init__.py"
    if not init_file.is_file():
        return None

    content = init_file.read_text(errors="replace").strip()
    if not content:
        return None

    try:
        tree = ast.parse(content)
        docstring = ast.get_docstring(tree)
        if docstring:
            return {
                "source_path": str(init_file),
                "evidence_type": "MODULE_DOCSTRING",
                "content": docstring.strip(),
            }
    except SyntaxError:
        pass
    return None


def extract_model_inventory(domain_path: Path) -> dict | None:
    """Extract model class names from models/ directory."""
    models_dir = domain_path / "models"
    if not models_dir.is_dir():
        models_file = domain_path / "models.py"
        if models_file.is_file():
            models_dir = None
            model_files = [models_file]
        else:
            return None
    else:
        model_files = sorted(models_dir.glob("*.py"))

    models_found = []
    for mf in model_files:
        if mf.name == "__init__.py":
            continue
        content = mf.read_text(errors="replace")
        for match in re.finditer(r'class\s+(\w+)\(.*Model.*\)', content):
            models_found.append({
                "class_name": match.group(1),
                "source_file": mf.name,
            })

    if not models_found:
        return None

    return {
        "source_path": str(models_dir or model_files[0]),
        "evidence_type": "MODEL_INVENTORY",
        "model_count": len(models_found),
        "models": models_found,
    }


def extract_url_namespace(domain_path: Path) -> dict | None:
    """Extract API URL namespace from api/urls.py."""
    urls_file = domain_path / "api" / "urls.py"
    if not urls_file.is_file():
        return None

    content = urls_file.read_text(errors="replace")
    result = {
        "source_path": str(urls_file),
        "evidence_type": "URL_NAMESPACE",
    }

    ns_match = re.search(r'''app_name\s*=\s*['"]([^'"]+)['"]''', content)
    if ns_match:
        result["app_name"] = ns_match.group(1)

    router_entries = re.findall(r'''router\.register\(\s*['"]([^'"]+)['"]''', content)
    if router_entries:
        result["endpoints"] = router_entries
        result["endpoint_count"] = len(router_entries)

    if ns_match or router_entries:
        return result
    return None


def extract_official_docs(docs_dir: Path, domain: str) -> list[dict]:
    """Extract official documentation matching domain name."""
    anchors = []

    features_dir = docs_dir / "features"
    if features_dir.is_dir():
        for doc_file in sorted(features_dir.glob("*.md")):
            if domain.lower() in doc_file.stem.lower().replace("-", "").replace("_", ""):
                content = doc_file.read_text(errors="replace")
                heading = ""
                for line in content.split("\n"):
                    if line.startswith("# "):
                        heading = line[2:].strip()
                        break
                first_para = ""
                in_para = False
                for line in content.split("\n"):
                    if line.startswith("# "):
                        in_para = True
                        continue
                    if in_para and line.strip() and not line.startswith("#") and not line.startswith("```"):
                        first_para = line.strip()
                        break

                anchors.append({
                    "source_path": str(doc_file),
                    "evidence_type": "OFFICIAL_DOCS",
                    "doc_section": "features",
                    "heading": heading,
                    "summary": first_para[:300] if first_para else "",
                })

    models_docs_dir = docs_dir / "models" / domain
    if models_docs_dir.is_dir():
        model_doc_files = sorted(models_docs_dir.glob("*.md"))
        if model_doc_files:
            model_names = [f.stem for f in model_doc_files]
            anchors.append({
                "source_path": str(models_docs_dir),
                "evidence_type": "MODEL_DOCS",
                "doc_section": "models",
                "documented_models": model_names,
                "documented_model_count": len(model_names),
            })

    return anchors


DOMAIN_DOC_ALIASES = {
    "dcim": ["dcim", "devices-cabling", "facilities", "power-tracking"],
    "ipam": ["ipam", "vlan-management"],
    "circuits": ["circuits"],
    "virtualization": ["virtualization"],
    "vpn": ["vpn-tunnels", "l2vpn-overlay"],
    "wireless": ["wireless"],
    "tenancy": ["tenancy", "resource-ownership", "contacts"],
    "extras": ["customization", "event-rules", "journaling", "context-data",
               "configuration-rendering", "notifications", "search"],
    "core": ["background-jobs", "synchronized-data", "change-logging"],
    "users": ["authentication-permissions", "user-preferences"],
}


def extract_aliased_docs(docs_dir: Path, domain: str) -> list[dict]:
    """Extract docs that map to a domain via known aliases."""
    aliases = DOMAIN_DOC_ALIASES.get(domain, [])
    anchors = []
    features_dir = docs_dir / "features"
    if not features_dir.is_dir():
        return anchors

    for alias in aliases:
        doc_file = features_dir / f"{alias}.md"
        if doc_file.is_file():
            content = doc_file.read_text(errors="replace")
            heading = ""
            first_para = ""
            in_para = False
            for line in content.split("\n"):
                if line.startswith("# ") and not heading:
                    heading = line[2:].strip()
                    in_para = True
                    continue
                if in_para and line.strip() and not line.startswith("#") and not line.startswith("```"):
                    first_para = line.strip()
                    break

            already = any(a["source_path"] == str(doc_file) for a in anchors)
            if not already:
                anchors.append({
                    "source_path": str(doc_file),
                    "evidence_type": "OFFICIAL_DOCS",
                    "doc_section": "features",
                    "heading": heading,
                    "summary": first_para[:300] if first_para else "",
                    "alias_mapping": alias,
                })

    return anchors


def build_evidence_anchors(
    candidate_registry: dict,
    source_repo: Path,
) -> dict:
    """Build evidence anchors for all CEU candidates."""

    candidates = candidate_registry.get("candidates", [])
    source_root_name = None

    for candidate in candidates:
        domain = candidate.get("domain", "")
        domain_path = source_repo / domain
        if not domain_path.is_dir():
            for subdir in source_repo.iterdir():
                if subdir.is_dir() and (subdir / domain).is_dir():
                    source_root_name = subdir.name
                    break
            break

    if source_root_name:
        effective_root = source_repo / source_root_name
    else:
        effective_root = source_repo

    docs_dir = source_repo / "docs"

    anchors = []
    anchor_id = 0
    domain_summary = {}

    for candidate in candidates:
        domain = candidate.get("domain", "")
        ceu_id = candidate.get("ceu_id", "")
        domain_path = effective_root / domain
        domain_anchors = []

        app_config = extract_app_config(domain_path)
        if app_config:
            anchor_id += 1
            app_config["anchor_id"] = f"EA-{anchor_id:04d}"
            app_config["ceu_id"] = ceu_id
            app_config["domain"] = domain
            domain_anchors.append(app_config)

        module_doc = extract_module_docstring(domain_path)
        if module_doc:
            anchor_id += 1
            module_doc["anchor_id"] = f"EA-{anchor_id:04d}"
            module_doc["ceu_id"] = ceu_id
            module_doc["domain"] = domain
            domain_anchors.append(module_doc)

        model_inv = extract_model_inventory(domain_path)
        if model_inv:
            anchor_id += 1
            model_inv["anchor_id"] = f"EA-{anchor_id:04d}"
            model_inv["ceu_id"] = ceu_id
            model_inv["domain"] = domain
            domain_anchors.append(model_inv)

        url_ns = extract_url_namespace(domain_path)
        if url_ns:
            anchor_id += 1
            url_ns["anchor_id"] = f"EA-{anchor_id:04d}"
            url_ns["ceu_id"] = ceu_id
            url_ns["domain"] = domain
            domain_anchors.append(url_ns)

        official = extract_official_docs(docs_dir, domain)
        for doc in official:
            anchor_id += 1
            doc["anchor_id"] = f"EA-{anchor_id:04d}"
            doc["ceu_id"] = ceu_id
            doc["domain"] = domain
            domain_anchors.append(doc)

        aliased = extract_aliased_docs(docs_dir, domain)
        for doc in aliased:
            existing_paths = {a["source_path"] for a in domain_anchors}
            if doc["source_path"] not in existing_paths:
                anchor_id += 1
                doc["anchor_id"] = f"EA-{anchor_id:04d}"
                doc["ceu_id"] = ceu_id
                doc["domain"] = domain
                domain_anchors.append(doc)

        anchors.extend(domain_anchors)
        type_counts = {}
        for a in domain_anchors:
            t = a["evidence_type"]
            type_counts[t] = type_counts.get(t, 0) + 1
        domain_summary[ceu_id] = {
            "domain": domain,
            "total_anchors": len(domain_anchors),
            "evidence_types": type_counts,
        }

    return {
        "contract_id": CONTRACT_ID,
        "artifact_class": ARTIFACT_CLASS,
        "client_id": candidate_registry.get("client_id", "unknown"),
        "run_id": candidate_registry.get("run_id", "unknown"),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_repository": str(source_repo),
        "effective_source_root": str(effective_root),
        "total_anchors": len(anchors),
        "candidate_count": len(candidates),
        "domain_summary": domain_summary,
        "anchors": anchors,
        "governance": {
            "extraction_method": "DETERMINISTIC_FILE_READING",
            "no_semantic_authoring": True,
            "no_ai_llm": True,
            "replayable": True,
        },
    }


def print_report(evidence: dict):
    print("=" * 72)
    print("  CEU EVIDENCE INTAKE REPORT")
    print("=" * 72)
    print(f"  Client:     {evidence['client_id']}")
    print(f"  Run:        {evidence['run_id']}")
    print(f"  Candidates: {evidence['candidate_count']}")
    print(f"  Anchors:    {evidence['total_anchors']}")
    print()
    print("-" * 72)
    print("  EVIDENCE PER CANDIDATE")
    print("-" * 72)
    print(f"{'CEU ID':<20} {'Domain':<20} {'Anchors':>8}  Evidence Types")
    print("-" * 90)
    for ceu_id, info in evidence["domain_summary"].items():
        types_str = ", ".join(f"{k}={v}" for k, v in info["evidence_types"].items())
        print(f"{ceu_id:<20} {info['domain']:<20} {info['total_anchors']:>8}  {types_str}")

    print()
    print("-" * 72)
    print("  EVIDENCE TYPE DISTRIBUTION")
    print("-" * 72)
    type_totals = {}
    for anchor in evidence["anchors"]:
        t = anchor["evidence_type"]
        type_totals[t] = type_totals.get(t, 0) + 1
    for t, count in sorted(type_totals.items(), key=lambda x: -x[1]):
        print(f"  {t:<25} {count}")

    gaps = []
    for ceu_id, info in evidence["domain_summary"].items():
        if info["total_anchors"] == 0:
            gaps.append(ceu_id)
        elif "APP_CONFIG" not in info["evidence_types"] and "MODULE_DOCSTRING" not in info["evidence_types"]:
            gaps.append(f"{ceu_id} (no app_config or docstring)")
    if gaps:
        print()
        print("-" * 72)
        print("  EVIDENCE GAPS")
        print("-" * 72)
        for g in gaps:
            print(f"  ⚠  {g}")

    print()


def main():
    parser = argparse.ArgumentParser(description="CEU Evidence Intake")
    parser.add_argument("--client", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--report-only", action="store_true")
    args = parser.parse_args()

    paths = resolve_paths(args.client, args.run_id)

    if not paths["run_dir"].is_dir():
        print(f"FAIL: Run directory not found: {paths['run_dir']}", file=sys.stderr)
        sys.exit(1)

    candidate_registry = load_json(paths["candidate_registry"])
    if not candidate_registry:
        print(f"FAIL: candidate_registry.json not found: {paths['candidate_registry']}", file=sys.stderr)
        sys.exit(1)

    if not paths["source_repo"].is_dir():
        print(f"FAIL: Source repository not found: {paths['source_repo']}", file=sys.stderr)
        sys.exit(1)

    print(f"CEU Evidence Intake ({ARTIFACT_CLASS})")
    print(f"  Client: {args.client}")
    print(f"  Run:    {args.run_id}")
    print(f"  Source: candidate_registry ({candidate_registry.get('candidate_count', 0)} candidates)")
    print(f"  Repo:   {paths['source_repo']}")

    evidence = build_evidence_anchors(candidate_registry, paths["source_repo"])

    print_report(evidence)

    if args.report_only or args.dry_run:
        if args.dry_run:
            print(f"  DRY RUN — would write: {paths['evidence_anchors']}")
        return

    if paths["evidence_anchors"].is_file():
        print(f"FAIL: Output already exists (CREATE_ONLY): {paths['evidence_anchors']}", file=sys.stderr)
        sys.exit(1)

    paths["output_dir"].mkdir(parents=True, exist_ok=True)
    with open(paths["evidence_anchors"], "w") as f:
        json.dump(evidence, f, indent=2)
    print(f"  evidence_anchors.json written: {paths['evidence_anchors'].relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
