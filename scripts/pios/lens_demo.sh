#!/usr/bin/env bash
# lens_demo.sh — LENS BlueEdge demo entrypoint
# PI.LENS.PRODUCT-DEMO-PACKAGE.01
#
# Usage: bash scripts/pios/lens_demo.sh
# Must be called from repo root or any subdirectory.
#
# Demo runtime (locked):
#   client:      blueedge
#   display_run: run_blueedge_productized_01_fixed
#   vault_run:   run_blueedge_productized_01
set -euo pipefail

# Resolve repo root regardless of call location
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

CLIENT="blueedge"
DISPLAY_RUN="run_blueedge_productized_01_fixed"
REPORT_RUN="run_blueedge_productized_01_fixed"
VAULT_RUN="run_blueedge_productized_01"

echo ""
echo "  LENS DEMO — BlueEdge Productized Run"
echo "  ======================================"
echo "  client:       $CLIENT"
echo "  display_run:  $DISPLAY_RUN"
echo "  vault_run:    $VAULT_RUN"
echo ""

# ── 1. PATH VALIDATION ────────────────────────────────────────────────────────

echo "[ 1/3 ] Validating paths..."

REPORTS_DIR="$REPO_ROOT/clients/$CLIENT/psee/runs/$DISPLAY_RUN/reports"
VAULT_DIR="$REPO_ROOT/clients/$CLIENT/psee/runs/$VAULT_RUN/vault"

if [[ ! -d "$REPORTS_DIR" ]]; then
  echo "  ERROR: reports directory not found: $REPORTS_DIR" >&2
  exit 1
fi
echo "  reports : $REPORTS_DIR  [OK]"

if [[ ! -d "$VAULT_DIR" ]]; then
  echo "  ERROR: vault directory not found: $VAULT_DIR" >&2
  exit 1
fi
echo "  vault   : $VAULT_DIR  [OK]"
echo ""

# ── 2. GENERATE REPORTS (IDEMPOTENT) ─────────────────────────────────────────

echo "[ 2/3 ] Generating reports..."
cd "$REPO_ROOT"
bash scripts/pios/lens_generate.sh \
  --client "$CLIENT" \
  --run    "$DISPLAY_RUN"
echo ""

# ── 3. START UI ───────────────────────────────────────────────────────────────

echo "[ 3/3 ] Starting LENS UI..."
echo ""
echo "  Open in browser:"
echo ""
echo "    http://localhost:3001/lens"
echo ""
echo "  Demo path:"
echo "    1. Select: blueedge / run_blueedge_productized_01_fixed"
echo "    2. Click:  Generate"
echo "    3. Open:   Diagnostic Workspace"
echo ""
echo "  Direct workspace URL:"
echo "    http://localhost:3001/tier2/workspace?client=blueedge&displayRun=run_blueedge_productized_01_fixed&vaultRun=run_blueedge_productized_01&reportRun=run_blueedge_productized_01_fixed"
echo ""

cd "$REPO_ROOT/app/gauge-product"
npm run dev
