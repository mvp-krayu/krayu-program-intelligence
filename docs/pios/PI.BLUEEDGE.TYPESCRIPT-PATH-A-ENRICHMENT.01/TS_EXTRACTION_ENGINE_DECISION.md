# TS_EXTRACTION_ENGINE_DECISION

## Stream: PI.BLUEEDGE.TYPESCRIPT-PATH-A-ENRICHMENT.01 (CC-01)
## Date: 2026-05-22

---

## 1. Governance Boundary

The TypeScript extraction engine is a **PIPELINE_ENRICHMENT_DEPENDENCY** — tooling owned by `scripts/pios/`, invoked by the pipeline, producing 40.3s artifacts.

It is NOT:
- Specimen-native capability (BlueEdge's own `typescript: ^5.3.3` is specimen evidence, not pipeline tooling)
- Workspace application dependency (execlens-demo, gauge-product are unrelated applications)
- Runtime product dependency (LENS, SQO, BOARDROOM do not consume this)

**Classification:** Any dependency introduced under `scripts/pios/` for TypeScript parsing is `PIPELINE_ENRICHMENT_DEPENDENCY`.

---

## 2. Environment Assessment

| Resource | Status | Location |
|----------|--------|----------|
| Node.js v20.20.0 | AVAILABLE | `/opt/homebrew/opt/node@20/bin/node` |
| npm 10.8.2 | AVAILABLE | system |
| Python 3.9.6 | AVAILABLE | `/usr/bin/python3` |
| tree-sitter (Python) | NOT INSTALLED | — |
| TypeScript compiler (global) | NOT INSTALLED | — |
| Existing Node infrastructure in scripts/ | NONE | no package.json |
| Existing code graph enricher | OPERATIONAL | `scripts/pios/code_graph_feasibility.py` (Python-only) |

---

## 3. Specimen Evidence (Read-Only)

BlueEdge intake contains two TypeScript sub-projects:

| Sub-project | Module System | Path Aliases | baseUrl | Files |
|-------------|--------------|--------------|---------|-------|
| frontend/ | ESNext (bundler resolution) | `@/*` → `./*` (13 alias entries) | `.` | ~494 .ts + ~186 .tsx |
| backend/ | CommonJS | `@/*` → `src/*` | `./` | remaining .ts |

Import patterns observed in specimen:
- Relative: `./`, `../`
- Path alias: `@/components/...`, `@/hooks/...`, `@/api/...`
- External packages: `@nestjs/*`, `react`, `react-dom`, `leaflet`, `socket.io-client`
- Re-exports: `export { X } from './Y'`, `export * from './Z'`

---

## 4. Options Assessment

### Option A: TypeScript Compiler API (Node.js script)

**Mechanism:** Install `typescript` as PIPELINE_ENRICHMENT_DEPENDENCY under `scripts/pios/ts-enrichment/`. Node script uses `ts.createSourceFile()` for AST parsing. Python orchestrator calls Node script via subprocess, receives JSON on stdout.

**Certification grade:** AST/compiler-based. Full TypeScript parser. Handles all ES2020+/ESNext syntax, JSX, decorators, path aliases (when tsconfig is read as evidence). Zero false positives on import extraction.

| Criterion | Assessment |
|-----------|-----------|
| Import extraction | COMPLETE — all static import/export forms |
| Path alias resolution | COMPLETE — reads tsconfig.paths as evidence |
| Dynamic imports | DETECTABLE — `import()` expressions flagged as DYNAMIC_IMPORT |
| Re-exports | COMPLETE — `export { } from`, `export * from` |
| Type-only imports | DISTINGUISHABLE — `import type { }` vs value imports |
| JSX/TSX | COMPLETE — native parser support |
| Decorators | COMPLETE — experimentalDecorators supported |
| Determinism | YES — same source → same AST → same output |
| Dependency size | ~60MB (typescript npm package) |
| Installation | `npm init -y && npm install typescript` under scripts/pios/ts-enrichment/ |
| Integration | Python subprocess → Node script → JSON stdout → Python writes 40.3s |

**Certification eligibility:** PATH_A_ENRICHED

### Option B: tree-sitter-typescript (Python)

**Mechanism:** Install `tree-sitter` and `tree-sitter-typescript` as Python packages. Parse TS files using tree-sitter grammar. Extract import/export nodes from CST.

**Certification grade:** Grammar-based parser. Not the TypeScript compiler but a robust incremental parser used by editors (VS Code, Neovim). Handles all syntax but does NOT resolve types or path aliases natively.

| Criterion | Assessment |
|-----------|-----------|
| Import extraction | COMPLETE — all static forms via CST query |
| Path alias resolution | MANUAL — must implement resolution from tsconfig evidence |
| Dynamic imports | DETECTABLE — via CST pattern |
| Re-exports | COMPLETE |
| Type-only imports | COMPLETE — distinguishable in CST |
| JSX/TSX | COMPLETE — separate grammar needed for .tsx |
| Decorators | COMPLETE |
| Determinism | YES |
| Dependency size | ~15MB (tree-sitter + grammar) |
| Installation | `pip3 install tree-sitter tree-sitter-typescript` |
| Integration | Native Python — no subprocess boundary |

**Certification eligibility:** PATH_A_ENRICHED (grammar-based = deterministic AST equivalent)

**Risk:** Python 3.9.6 may have tree-sitter compatibility issues (tree-sitter v0.23+ requires Python 3.9+, should work but untested in this environment).

### Option C: Regex with AST Verification Layer

**Mechanism:** Regex extracts candidate imports → TypeScript compiler verifies subset.

**Certification grade:** Regex as primary = NOT_CERTIFYING. Even with verification layer, the extraction fidelity depends on regex coverage.

**Certification eligibility:** DISCOVERY_ONLY / NOT_CERTIFYING

**Rejected per operator directive.**

### Option D: dependency-cruiser / madge (npm tools)

**Mechanism:** Install dependency-cruiser or madge as npm package. Run as CLI tool on specimen source. Parse output.

**Certification grade:** These tools use TypeScript compiler internally. Deterministic. But they produce their own output format (not 40.3s schema) and require the specimen's `node_modules/` to be installed for full resolution — which we don't have and shouldn't create.

| Criterion | Assessment |
|-----------|-----------|
| Import extraction | COMPLETE (via internal TS compiler) |
| Path alias resolution | REQUIRES node_modules installed in specimen |
| Without node_modules | PARTIAL — external packages unresolvable |
| Output format | Non-40.3s — requires transform |
| Determinism | YES |
| Dependency size | ~80MB+ (dependency-cruiser + transitive deps) |

**Certification eligibility:** PATH_A_ENRICHED (if deterministic), but **impractical** — requires specimen mutation (node_modules installation) which violates intake isolation.

**Rejected: would require installing node_modules inside specimen intake directory.**

---

## 5. Integration Architecture

The chosen engine must integrate with the existing `code_graph_feasibility.py` pattern:

```
Python orchestrator (code_graph_feasibility.py)
    │
    ├─ discover source files (.ts/.tsx)
    ├─ read tsconfig as evidence (path alias map)
    │
    ├─ FOR EACH source file:
    │   ├─ [Option A] subprocess: node ts_import_extractor.js <file> → JSON stdout
    │   ├─ [Option B] tree-sitter: parse in-process → import nodes
    │   └─ resolve import specifier → target path (using alias map + filesystem)
    │
    ├─ cross-reference against 40.2 node inventory
    └─ write 40.3s/code_graph.json (same schema as Python enricher)
```

Both Option A and B produce the same output: resolved IMPORTS edges in 40.3s schema.

---

## 6. Decision Matrix

| Criterion | Weight | Option A (TS Compiler) | Option B (tree-sitter) |
|-----------|--------|----------------------|----------------------|
| Parse fidelity | HIGH | **5/5** — IS the TS parser | 4/5 — grammar equivalent |
| Path alias resolution | HIGH | **5/5** — native | 3/5 — manual implementation |
| Integration simplicity | MED | 3/5 — subprocess boundary | **5/5** — native Python |
| Dependency governance | MED | 4/5 — isolated npm package | **5/5** — pip install |
| Python 3.9 compatibility | MED | 5/5 — Node is separate | 3/5 — untested |
| Determinism | HIGH | **5/5** | **5/5** |
| Certification grade | HIGH | **5/5** — compiler-grade | 4/5 — grammar-grade |
| Future generalization | LOW | 4/5 — any TS project | 4/5 — any TS project |

---

## 7. VERDICT: TS_EXTRACTION_ENGINE_DECISION

**Selected: Option A — TypeScript Compiler API as PIPELINE_ENRICHMENT_DEPENDENCY**

**Rationale:**
1. The TypeScript compiler is the only parser that IS TypeScript. Zero ambiguity about parse fidelity.
2. Path alias resolution is native — reads tsconfig.json evidence without reimplementation.
3. The subprocess boundary (Python → Node → JSON) is clean and auditable. The JSON contract between them is the same 40.3s schema.
4. Node v20.20.0 is already available on the system. The only new dependency is the `typescript` npm package (~60MB) installed under `scripts/pios/ts-enrichment/`.
5. Certification grade: PATH_A_ENRICHED — compiler AST extraction is the highest possible fidelity.

**Dependency classification:**
```
scripts/pios/ts-enrichment/
├── package.json              # PIPELINE_ENRICHMENT_DEPENDENCY manifest
├── node_modules/typescript/  # The compiler (gitignored)
├── ts_import_extractor.js    # Extraction script (tracked)
└── .gitignore                # node_modules/
```

**Integration contract:**
```
Python: code_graph_feasibility.py --client blueedge --run-id <run>
  └─ detects TypeScript specimen (no __init__.py, has tsconfig.json)
  └─ invokes: node scripts/pios/ts-enrichment/ts_import_extractor.js <file> [--tsconfig <path>]
  └─ receives: { "imports": [...], "exports": [...], "defines": [...] }
  └─ resolves: import specifier → filesystem path → 40.2 node match
  └─ writes: 40.3s/code_graph.json (same schema as Python enricher)
```

**What this does NOT do:**
- Does NOT install node_modules inside the specimen
- Does NOT use specimen's own typescript package
- Does NOT require specimen to be buildable
- Does NOT resolve external package internals (marked as EXTERNAL_PACKAGE)
- Does NOT introduce runtime dependencies (LENS/SQO do not consume this)

---

## 8. Implementation Sequence (Post-Decision)

1. Create `scripts/pios/ts-enrichment/` with package.json + .gitignore
2. `npm install typescript` under that directory (PIPELINE_ENRICHMENT_DEPENDENCY)
3. Write `ts_import_extractor.js` — reads .ts/.tsx, emits JSON import/export/define edges
4. Extend `code_graph_feasibility.py` with TypeScript detection + Node subprocess dispatch
5. Add tsconfig evidence reader (path alias resolution)
6. Run on BlueEdge — produce 40.3s with IMPORTS > 0
7. Verify centrality/coupling pipeline consumes TS-derived 40.3s
8. Before/after comparison per CC-01 contract

---

## 9. Approval Gate

This decision requires operator approval before implementation proceeds.

**Approve** = proceed with Option A implementation.
**Reject** = provide alternative direction.
