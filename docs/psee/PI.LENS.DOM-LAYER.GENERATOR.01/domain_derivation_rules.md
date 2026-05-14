# Domain Derivation Rules
## PI.LENS.DOM-LAYER.GENERATOR.01

**Version:** 1.0
**Method:** cluster_name_pattern_matching
**Evaluation:** first_match_wins

---

## Derivation Basis

Domain assignment operates on **canonical topology clusters** from `40.4/canonical_topology.json`. Each cluster represents a top-level path component of the source tree (e.g., `src`, `.github`, `generated`).

No individual node paths are analyzed for domain assignment — all nodes in a cluster inherit the cluster's domain. This ensures determinism: same canonical_topology → same domain assignment.

---

## Rule Table

Rules are evaluated in priority order. First matching rule determines the domain.

| Priority | Rule ID | Domain | Predicate |
|----------|---------|--------|-----------|
| 1 | `cluster_name_starts_with_ci_prefix` | CI_INFRA | `name.startswith(".github") or name.startswith(".gitlab")` |
| 2 | `cluster_name_starts_with_dot` | TOOLING | `name.startswith(".")` |
| 3 | `cluster_name_in_application_set` | APPLICATION | `name in {"src", "lib", "app", "pkg", "core", "source"}` |
| 4 | `cluster_name_in_test_set` | TESTING | `name in {"tests", "test", "spec", "__tests__"} or name.startswith("test")` |
| 5 | `cluster_name_in_generated_set` | GENERATED | `name in {"generated", "dist", "build", "output"}` |
| 6 | `cluster_name_ends_with_doc_extension` | DOCUMENTATION | `name.endswith(".md") or .txt or .rst` |
| 7 | `cluster_name_ends_with_lock` | DEPENDENCY | `name.endswith(".lock")` |
| 8 | `cluster_name_ends_with_config_extension` | CONFIGURATION | `name.endswith(.toml, .cfg, .ini, .json, .yaml, .yml)` |
| 9 | `cluster_name_ends_with_shell_extension` | INFRA | `name.endswith(.sh, .bash, .zsh, .ps1)` |
| 10 | `default_catch_all` | ROOT | Always matches |

---

## Design Notes

**Rule 1 before Rule 2:** `.github` and `.gitlab` must be classified as CI_INFRA, not TOOLING. Without Rule 1, both would fall to the generic "starts with dot" TOOLING rule.

**Rule 7 before Rule 8:** `.lock` files (e.g., `uv.lock`) must be classified as DEPENDENCY, not CONFIGURATION (which also catches `.toml`, but lock files are dependency artifacts not configuration).

**ROOT domain:** The default catch-all ensures every cluster is assigned. In practice, well-structured projects should have no ROOT-domain clusters. ROOT exists to preserve complete coverage without failure.

**No semantic inference:** Rules are purely syntactic — cluster name patterns, not content analysis. The same cluster name always produces the same domain regardless of the client.

---

## FastAPI Application

| Cluster Name | Matched Rule | Domain |
|---|---|---|
| `.artrc` | Rule 2 (starts with .) | TOOLING |
| `.gitattributes` | Rule 2 | TOOLING |
| `.github` | Rule 1 (starts with .github) | CI_INFRA |
| `.gitignore` | Rule 2 | TOOLING |
| `.pre-commit-config.yaml` | Rule 2 | TOOLING |
| `.readme_assets` | Rule 2 | TOOLING |
| `.sqlite_db` | Rule 2 | TOOLING |
| `.vscode` | Rule 2 | TOOLING |
| `README.md` | Rule 6 (ends with .md) | DOCUMENTATION |
| `TODO.md` | Rule 6 | DOCUMENTATION |
| `config.yaml` | Rule 8 (ends with .yaml) | CONFIGURATION |
| `generated` | Rule 5 (in generated set) | GENERATED |
| `log_config.json` | Rule 8 (ends with .json) | CONFIGURATION |
| `openapitools.json` | Rule 8 | CONFIGURATION |
| `pyproject.toml` | Rule 8 (ends with .toml) | CONFIGURATION |
| `run.sh` | Rule 9 (ends with .sh) | INFRA |
| `src` | Rule 3 (in application set) | APPLICATION |
| `tests` | Rule 4 (in test set) | TESTING |
| `uv.lock` | Rule 7 (ends with .lock) | DEPENDENCY |

**Result:** 19 clusters → 9 domains, 0 clusters in ROOT domain.
