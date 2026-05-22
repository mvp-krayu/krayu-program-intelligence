#!/usr/bin/env node
/**
 * PIPELINE_ENRICHMENT_DEPENDENCY: TypeScript import/export/define extraction.
 * Uses TypeScript Compiler API (AST) for certification-grade parsing.
 *
 * Usage:
 *   node ts_import_extractor.js --file <path> [--tsconfig <path>]
 *   node ts_import_extractor.js --batch <dir> --extensions .ts,.tsx [--tsconfig <path>]
 *
 * Output: JSON to stdout. One object per invocation.
 */

"use strict";

const ts = require("typescript");
const path = require("path");
const fs = require("fs");

function parseTsConfig(tsconfigPath) {
  if (!tsconfigPath || !fs.existsSync(tsconfigPath)) return null;
  const raw = fs.readFileSync(tsconfigPath, "utf-8");
  const result = ts.parseConfigFileTextToJson(tsconfigPath, raw);
  if (result.error) return null;
  const parsed = ts.parseJsonConfigFileContent(
    result.config,
    ts.sys,
    path.dirname(tsconfigPath)
  );
  return parsed.options;
}

function buildPathAliasMap(tsconfigPath) {
  if (!tsconfigPath || !fs.existsSync(tsconfigPath)) return {};
  const raw = fs.readFileSync(tsconfigPath, "utf-8");
  const result = ts.parseConfigFileTextToJson(tsconfigPath, raw);
  if (result.error) return {};
  const co = (result.config && result.config.compilerOptions) || {};
  const baseUrl = co.baseUrl || ".";
  const paths = co.paths || {};
  const baseDir = path.resolve(path.dirname(tsconfigPath), baseUrl);
  const aliasMap = {};
  for (const [pattern, targets] of Object.entries(paths)) {
    if (targets.length > 0) {
      const prefix = pattern.replace("/*", "/");
      const target = targets[0].replace("/*", "/");
      aliasMap[prefix] = path.resolve(baseDir, target);
    }
  }
  return aliasMap;
}

function buildScopedAliasMaps(tsconfigPaths) {
  const scopes = [];
  for (const tc of tsconfigPaths) {
    const absTC = path.resolve(tc);
    const scopeDir = path.dirname(absTC);
    const aliasMap = buildPathAliasMap(absTC);
    scopes.push({ scopeDir, aliasMap, tsconfig: absTC });
  }
  scopes.sort((a, b) => b.scopeDir.length - a.scopeDir.length);
  return scopes;
}

function getAliasMapForFile(filePath, scopes) {
  for (const scope of scopes) {
    if (filePath.startsWith(scope.scopeDir + path.sep) || filePath.startsWith(scope.scopeDir + "/")) {
      return scope.aliasMap;
    }
  }
  return scopes.length > 0 ? scopes[scopes.length - 1].aliasMap : {};
}

function classifyImportSpecifier(specifier) {
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    return "RELATIVE";
  }
  if (specifier.startsWith("@/")) {
    return "PATH_ALIAS";
  }
  return "EXTERNAL_PACKAGE";
}

function extractFromFile(filePath, aliasMap) {
  const sourceText = fs.readFileSync(filePath, "utf-8");
  const isJsx = filePath.endsWith(".tsx") || filePath.endsWith(".jsx");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    isJsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  const imports = [];
  const exports = [];
  const defines = [];

  function visit(node) {
    // import declarations: import { X } from 'Y', import X from 'Y', import 'Y'
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
      const specifier = node.moduleSpecifier.getText(sourceFile).replace(/['"]/g, "");
      const isTypeOnly = node.importClause && node.importClause.isTypeOnly;
      const namedBindings = [];

      if (node.importClause) {
        if (node.importClause.name) {
          namedBindings.push(node.importClause.name.text);
        }
        if (node.importClause.namedBindings) {
          if (ts.isNamedImports(node.importClause.namedBindings)) {
            for (const el of node.importClause.namedBindings.elements) {
              namedBindings.push(el.name.text);
            }
          } else if (ts.isNamespaceImport(node.importClause.namedBindings)) {
            namedBindings.push("* as " + node.importClause.namedBindings.name.text);
          }
        }
      }

      imports.push({
        specifier: specifier,
        classification: classifyImportSpecifier(specifier),
        type_only: !!isTypeOnly,
        bindings: namedBindings,
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
      });
    }

    // dynamic imports: import('...')
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      const specifier = node.arguments[0].text;
      imports.push({
        specifier: specifier,
        classification: classifyImportSpecifier(specifier),
        type_only: false,
        bindings: [],
        dynamic: true,
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
      });
    }

    // require() calls
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "require" &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      const specifier = node.arguments[0].text;
      imports.push({
        specifier: specifier,
        classification: classifyImportSpecifier(specifier),
        type_only: false,
        bindings: [],
        require: true,
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
      });
    }

    // export declarations: export { X } from 'Y', export * from 'Y'
    if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      const specifier = node.moduleSpecifier.getText(sourceFile).replace(/['"]/g, "");
      const isTypeOnly = node.isTypeOnly;
      const namedExports = [];

      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (const el of node.exportClause.elements) {
          namedExports.push(el.name.text);
        }
      }

      exports.push({
        specifier: specifier,
        classification: classifyImportSpecifier(specifier),
        type_only: !!isTypeOnly,
        bindings: namedExports,
        is_reexport: true,
        star: !node.exportClause,
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
      });
    }

    // local export declarations (defines)
    if (ts.isExportDeclaration(node) && !node.moduleSpecifier) {
      // export { X, Y } — named local exports
    }

    // exported class/function/interface/type/enum/const
    if (node.modifiers && node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      if (ts.isClassDeclaration(node) && node.name) {
        defines.push({
          kind: "CLASS",
          name: node.name.text,
          exported: true,
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        });
      } else if (ts.isFunctionDeclaration(node) && node.name) {
        defines.push({
          kind: "FUNCTION",
          name: node.name.text,
          exported: true,
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        });
      } else if (ts.isInterfaceDeclaration(node) && node.name) {
        defines.push({
          kind: "INTERFACE",
          name: node.name.text,
          exported: true,
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        });
      } else if (ts.isTypeAliasDeclaration(node) && node.name) {
        defines.push({
          kind: "TYPE_ALIAS",
          name: node.name.text,
          exported: true,
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        });
      } else if (ts.isEnumDeclaration(node) && node.name) {
        defines.push({
          kind: "ENUM",
          name: node.name.text,
          exported: true,
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        });
      } else if (ts.isVariableStatement(node)) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name)) {
            defines.push({
              kind: "CONST",
              name: decl.name.text,
              exported: true,
              line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
            });
          }
        }
      }
    }

    // non-exported class/function definitions
    if (
      !node.modifiers ||
      !node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      if (ts.isClassDeclaration(node) && node.name) {
        defines.push({
          kind: "CLASS",
          name: node.name.text,
          exported: false,
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        });
      } else if (ts.isFunctionDeclaration(node) && node.name) {
        defines.push({
          kind: "FUNCTION",
          name: node.name.text,
          exported: false,
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return { imports, exports, defines };
}

function resolveTsSpecifier(specifier, sourceFilePath, aliasMap, extensions) {
  const sourceDir = path.dirname(sourceFilePath);

  let targetBase = null;

  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    targetBase = path.resolve(sourceDir, specifier);
  } else {
    for (const [prefix, resolvedBase] of Object.entries(aliasMap)) {
      if (specifier.startsWith(prefix)) {
        const remainder = specifier.slice(prefix.length);
        targetBase = path.join(resolvedBase, remainder);
        break;
      }
      const exactPrefix = prefix.replace(/\/$/, "");
      if (specifier === exactPrefix) {
        targetBase = resolvedBase.replace(/\/$/, "");
        break;
      }
    }
  }

  if (!targetBase) return null;

  // Try exact path first, then with extensions, then as directory index
  for (const ext of ["", ...extensions]) {
    const candidate = targetBase + ext;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  // Directory index resolution
  for (const ext of extensions) {
    const indexCandidate = path.join(targetBase, "index" + ext);
    if (fs.existsSync(indexCandidate)) {
      return indexCandidate;
    }
  }

  return null;
}

function processFile(filePath, intakeDir, aliasMap) {
  const result = extractFromFile(filePath, aliasMap);
  const relPath = path.relative(intakeDir, filePath);
  const extensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

  const resolvedImports = result.imports.map((imp) => {
    if (imp.classification === "EXTERNAL_PACKAGE") {
      return { ...imp, resolved_path: null, resolution: "EXTERNAL_PACKAGE" };
    }
    const resolved = resolveTsSpecifier(imp.specifier, filePath, aliasMap, extensions);
    if (resolved) {
      return {
        ...imp,
        resolved_path: path.relative(intakeDir, resolved),
        resolution: "RESOLVED",
      };
    }
    return { ...imp, resolved_path: null, resolution: "UNRESOLVED" };
  });

  const resolvedExports = result.exports.map((exp) => {
    if (exp.classification === "EXTERNAL_PACKAGE") {
      return { ...exp, resolved_path: null, resolution: "EXTERNAL_PACKAGE" };
    }
    const resolved = resolveTsSpecifier(exp.specifier, filePath, aliasMap, extensions);
    if (resolved) {
      return {
        ...exp,
        resolved_path: path.relative(intakeDir, resolved),
        resolution: "RESOLVED",
      };
    }
    return { ...exp, resolved_path: null, resolution: "UNRESOLVED" };
  });

  return {
    file: relPath,
    imports: resolvedImports,
    exports: resolvedExports,
    defines: result.defines,
  };
}

function findFiles(dir, extensions) {
  const results = [];
  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        if (
          entry.name === "node_modules" ||
          entry.name === "dist" ||
          entry.name === ".git" ||
          entry.name === "coverage" ||
          entry.name === "storybook-static"
        ) continue;
        walk(full);
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        results.push(full);
      }
    }
  }
  walk(dir);
  return results;
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--") && i + 1 < args.length && !args[i + 1].startsWith("--")) {
      flags[args[i].replace("--", "")] = args[i + 1];
      i++;
    }
  }

  const tsconfigPaths = (flags.tsconfig || "").split(",").filter(Boolean);
  const intakeDir = flags.intake;

  if (!intakeDir) {
    process.stderr.write("ERROR: --intake <dir> required\n");
    process.exit(1);
  }

  const absIntake = path.resolve(intakeDir);

  // Build scoped alias maps — each tsconfig governs its own sub-project
  const scopes = buildScopedAliasMaps(tsconfigPaths);

  const extensions = (flags.extensions || ".ts,.tsx").split(",");
  const files = findFiles(absIntake, extensions);

  const results = [];
  const errors = [];

  for (const filePath of files) {
    try {
      const aliasMap = getAliasMapForFile(filePath, scopes);
      const fileResult = processFile(filePath, absIntake, aliasMap);
      results.push(fileResult);
    } catch (err) {
      errors.push({
        file: path.relative(absIntake, filePath),
        error: err.message,
      });
    }
  }

  const scopesSummary = {};
  for (const s of scopes) {
    scopesSummary[path.relative(absIntake, s.scopeDir)] = s.aliasMap;
  }

  const output = {
    extractor: "pios-ts-enrichment",
    extractor_version: "1.0.0",
    typescript_version: ts.version,
    dependency_class: "PIPELINE_ENRICHMENT_DEPENDENCY",
    intake_dir: absIntake,
    tsconfig_paths: tsconfigPaths,
    alias_scopes: scopesSummary,
    file_count: files.length,
    results: results,
    errors: errors,
    stats: {
      files_processed: results.length,
      files_errored: errors.length,
      total_imports: results.reduce((s, r) => s + r.imports.length, 0),
      total_exports: results.reduce((s, r) => s + r.exports.length, 0),
      total_defines: results.reduce((s, r) => s + r.defines.length, 0),
      imports_resolved: results.reduce(
        (s, r) => s + r.imports.filter((i) => i.resolution === "RESOLVED").length,
        0
      ),
      imports_external: results.reduce(
        (s, r) => s + r.imports.filter((i) => i.resolution === "EXTERNAL_PACKAGE").length,
        0
      ),
      imports_unresolved: results.reduce(
        (s, r) => s + r.imports.filter((i) => i.resolution === "UNRESOLVED").length,
        0
      ),
    },
  };

  process.stdout.write(JSON.stringify(output, null, 2) + "\n");
}

main();
