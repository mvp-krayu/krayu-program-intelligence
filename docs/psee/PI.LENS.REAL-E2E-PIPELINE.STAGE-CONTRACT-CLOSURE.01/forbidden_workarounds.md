# Forbidden Workarounds
## PI.LENS.REAL-E2E-PIPELINE.STAGE-CONTRACT-CLOSURE.01

**Date:** 2026-05-03

This document records all workarounds that are explicitly FORBIDDEN for each blocker. These are not merely discouraged — they are contract violations if attempted.

---

## BLOCKER-01 Forbidden Workarounds

| Workaround | Why Forbidden |
|-----------|---------------|
| Move or copy source archive into REPO_ROOT | Archive is a large binary artifact; repo is not an archive store; creates hidden dependency on file system layout |
| Create a symlink inside repo pointing to external archive | Breaks reproducibility for other operators; symlinks are implicit contracts |
| Change `source_manifest.json["archive_path"]` to a relative path | Breaks the absolute path contract established by the intake system; mutates canonical manifest |
| Use `try/except` to silently swallow the ValueError | Hides the design gap; does not fix the path assumption; produces misleading logs |
| Create a wrapper that pre-processes the manifest before calling source_intake.py | Hidden mutation; creates implicit coupling between wrapper and producer internals |

---

## BLOCKER-02 Forbidden Workarounds

| Workaround | Why Forbidden |
|-----------|---------------|
| Re-run PI.BLUEEDGE.CLEAN-INTAKE.01 to restore UUID canonical_repo | Perpetuates the broken design; the UUID path is legacy; this is a recurring maintenance burden, not a fix |
| Create a symlink from UUID path to name-keyed run path | Implicit contract; breaks for any other client or run; hides the path identity mismatch |
| Change `source_manifest["extracted_path"]` or `["structure_path"]` to name-keyed values | Mutates canonical manifest with a different path schema; breaks the existing contract the field represents |
| Bypass phase 2 or phase 3 verification in run_client_pipeline.py | Produces an unvalidated vault; removes intake/structure confidence gating from the pipeline |
| Hard-code the BlueEdge run path into run_client_pipeline.py | Breaks generic operation; creates client-specific branching in a generic orchestrator |

---

## BLOCKER-03 Forbidden Workarounds

| Workaround | Why Forbidden |
|-----------|---------------|
| Copy semantic bundle from display_run to execution run | Semantic bundle is a locked reference; unauthorized copy breaks lineage; creates second source of truth |
| Symlink vault into display_run | Implicit contract; breaks for any run pair where vault and display_run names differ |
| Add co-location enforcement at the wrapper (assemble.sh) level | Shifts the contract responsibility to the wrong layer; lens_generate.sh must own its own path resolution |
| Assume single-run co-location for all future clients | BlueEdge already proves this assumption is false; other clients will have the same split |
| Hard-code BlueEdge run pair into lens_generate.sh | Breaks generic operation; creates BlueEdge-specific branching in a generic report generator |

---

## BLOCKER-04 Forbidden Workarounds

| Workaround | Why Forbidden |
|-----------|---------------|
| Treat READY_LOCKED_REFERENCE as permanent for new clients | New clients have no locked reference; pipeline would silently skip semantic generation |
| Copy BlueEdge semantic bundle to new client runs | BlueEdge semantic is client-specific; copying it to another client is a semantic mutation |
| Generate semantic bundle from partial upstream stage outputs | Semantic bundle requires validated vault, 41.x projection, and CEU grounding; partial inputs produce invalid bundles |
| Reuse lens_report_generator.py as semantic bundle generator | These are different responsibilities; lens_report_generator.py produces HTML reports, not semantic bundle artifacts |

---

## BLOCKER-05 Forbidden Workarounds

| Workaround | Why Forbidden |
|-----------|---------------|
| Modify lens_report_generator.py to accept vault/semantic path args separately | Renderer is CLOSED; renderer changes affect all clients and report output contracts |
| Change report template structure or output file names | Breaks the existing demo package, workspace UI, and decision surface consumers |
| Modify semantic bundle content schema | Semantic bundle schema is authoritative; changes require a dedicated semantic stream |
| Re-open the LENS runtime rendering contract | The renderer is validated and locked; reopening creates regression risk across all validated demo surfaces |

---

## General Forbidden Behaviors (All Blockers)

- No inspection of 40.10 or 40.11 directories or streams
- No historical stream forensics beyond the two allowed input directories
- No broad search for alternative producers or workaround paths
- No FastAPI involvement
- No UI changes
- No changes to any canonical client data under `clients/blueedge/psee/runs/`
