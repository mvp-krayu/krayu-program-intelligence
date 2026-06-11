#!/bin/bash
# ══════════════════════════════════════════════════════════════
# Blue Edge Fleet — Bundle Analysis
# Runs production build and reports chunk sizes
# ══════════════════════════════════════════════════════════════

set -e
cd "$(dirname "$0")/.."

echo "══════════════════════════════════════════════════════════"
echo "  Blue Edge Fleet — Bundle Analysis"
echo "══════════════════════════════════════════════════════════"
echo ""

# ── Build ────────────────────────────────────────────────────
echo "▶ Running production build..."
npx vite build --mode production 2>&1 | tail -5
echo ""

# ── Analyze Output ───────────────────────────────────────────
echo "▶ Chunk Analysis:"
echo "  ┌────────────────────────────┬──────────┬────────────┐"
echo "  │ Chunk                      │  Raw KB  │  Gzip KB   │"
echo "  ├────────────────────────────┼──────────┼────────────┤"

TOTAL_RAW=0
TOTAL_GZIP=0

for file in dist/assets/js/*.js; do
  if [ -f "$file" ]; then
    name=$(basename "$file" | sed 's/-[a-f0-9]*.js/.js/')
    raw=$(wc -c < "$file")
    raw_kb=$(echo "scale=1; $raw / 1024" | bc 2>/dev/null || echo "?")
    gzip_size=$(gzip -c "$file" | wc -c)
    gzip_kb=$(echo "scale=1; $gzip_size / 1024" | bc 2>/dev/null || echo "?")
    printf "  │ %-26s │ %7s  │ %9s  │\n" "$name" "${raw_kb}KB" "${gzip_kb}KB"
    TOTAL_RAW=$((TOTAL_RAW + raw))
    TOTAL_GZIP=$((TOTAL_GZIP + gzip_size))
  fi
done

echo "  ├────────────────────────────┼──────────┼────────────┤"
total_raw_kb=$(echo "scale=1; $TOTAL_RAW / 1024" | bc 2>/dev/null || echo "?")
total_gzip_kb=$(echo "scale=1; $TOTAL_GZIP / 1024" | bc 2>/dev/null || echo "?")
printf "  │ %-26s │ %7s  │ %9s  │\n" "TOTAL" "${total_raw_kb}KB" "${total_gzip_kb}KB"
echo "  └────────────────────────────┴──────────┴────────────┘"
echo ""

# ── CSS Analysis ─────────────────────────────────────────────
echo "▶ CSS Chunks:"
for file in dist/assets/css/*.css; do
  if [ -f "$file" ]; then
    name=$(basename "$file" | sed 's/-[a-f0-9]*.css/.css/')
    raw=$(wc -c < "$file")
    raw_kb=$(echo "scale=1; $raw / 1024" | bc 2>/dev/null || echo "?")
    echo "    $name — ${raw_kb}KB"
  fi
done

echo ""
echo "▶ Recommendations:"
echo "  ○ Chunks > 250KB (gzip) should be further split"
echo "  ○ vendor-react should be < 50KB gzip"
echo "  ○ vendor-charts (chart.js) is ~80KB gzip — consider dynamic import"
echo "  ○ vendor-maps (leaflet) is ~40KB gzip — only loaded on map pages ✓"
echo ""

# ── Tree map (text-based) ────────────────────────────────────
echo "▶ Install rollup-plugin-visualizer for interactive treemap:"
echo "    npm i -D rollup-plugin-visualizer"
echo "    Add to vite.config.ts plugins: visualizer({ open: true })"
echo ""
echo "══════════════════════════════════════════════════════════"
