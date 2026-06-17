#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/.tmp/demo-example-gallery"

mkdir -p "$OUT"

npm run build

echo "== TypeScript JSON summary =="
node "$ROOT/dist/cli.js" analyze "$ROOT/examples/typescript-example" \
  --language typescript \
  --format json > "$OUT/typescript-summary.json"
node -e "const fs=require('node:fs'); const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); console.log({files:data.nodes.length, cycles:data.cycles.length});" "$OUT/typescript-summary.json"

echo
echo "== Python report excerpt =="
node "$ROOT/dist/cli.js" report "$ROOT/examples/python-example" \
  --language python > "$OUT/python-report.txt"
sed -n '1,40p' "$OUT/python-report.txt"

echo
echo "== Go Mermaid graph =="
node "$ROOT/dist/cli.js" visualize "$ROOT/examples/go-example" \
  --language go \
  --format mermaid \
  --output "$OUT/go-graph.md"
sed -n '1,30p' "$OUT/go-graph.md"

grep -Fq '"cycles"' "$OUT/typescript-summary.json"
grep -Fq 'DepGraph Report' "$OUT/python-report.txt"
grep -Fq 'graph LR' "$OUT/go-graph.md"

echo
echo "Demo artifacts written to $OUT"
