# DepGraph 🔗

> **See your code's skeleton. Find the broken bones before they break you.**

DepGraph is a local-first, offline CLI that statically analyzes dependency graphs for **TypeScript/JavaScript**, **Python**, and **Go** projects. It detects circular dependencies, measures coupling hotspots, and produces actionable reports and diagrams — all without running your code.

Built for engineers who need to understand unfamiliar codebases, tech leads auditing architecture before refactoring, and agentic workflows that need module-level context for safe edits.

## Why DepGraph Exists

Dependency sprawl is invisible until it isn't. A year into a project, you find out:
- Module A imports B, B imports C, C imports A → 💥 circular dependency
- The "utils" module has 47 inbound dependencies and nobody dares touch it
- New contributors spend weeks mapping the architecture in their heads

Existing tools solve this for individual languages (Madge for JS, pylint for Python), but there wasn't a single, fast, **offline** CLI that gives a cross-language overview with actionable insights and visual output.

DepGraph fills that gap. Parse imports statically, build a graph, and get:
- Cycle detection with full paths
- Coupling metrics (afferent/efferent per module)
- Layer rule checking ("core must not import ui")
- Output in text, JSON, GraphViz DOT, Mermaid, and CSV

## Quick Start

```bash
# Install
npm install -g depgraph

# Analyze a TypeScript project
depgraph analyze /path/to/project --language typescript

# Detect circular dependencies
depgraph cycles /path/to/project --language typescript

# Generate a comprehensive report
depgraph report /path/to/project --language python

# Visualize as Mermaid (paste into GitHub)
depgraph visualize /path/to/project --language go --format mermaid

# Focus on a specific module
depgraph focus /path/to/project --language typescript --module src/auth

# Check layer rules
depgraph check-layers /path/to/project --language typescript --rules layers.json
```

## Supported Languages

| Language | Extensions | Import Patterns |
|----------|-----------|-----------------|
| TypeScript/JavaScript | `.ts`, `.tsx`, `.js`, `.jsx` | `import`, `require()`, dynamic `import()` |
| Python | `.py` | `import`, `from...import`, relative imports |
| Go | `.go` | `import "package"`, import blocks |

## Output Formats

- **text**: Human-readable summary with cycle paths and metrics
- **json**: Machine-readable graph data for programmatic use
- **dot**: GraphViz DOT format for rendering with GraphViz
- **mermaid**: Mermaid syntax for GitHub/GitLab markdown rendering
- **csv**: Flat edge list for spreadsheet analysis

## Commands

### `analyze`

Build and display the full dependency graph with cycle detection and metrics.

```bash
depgraph analyze ./my-project --language typescript
depgraph analyze ./my-project --language typescript --format json
depgraph analyze ./my-project --language typescript --exclude node_modules --exclude dist
```

### `cycles`

Detect and display circular dependencies. Exits with code 1 if cycles are found (CI-friendly).

```bash
depgraph cycles ./my-project --language typescript
depgraph cycles ./my-project --language python --format json
```

### `report`

Generate a comprehensive text report with summary statistics, cycles, and coupling metrics.

```bash
depgraph report ./my-project --language typescript
```

### `visualize`

Export the dependency graph in visual formats.

```bash
depgraph visualize ./my-project --language typescript --format mermaid -o graph.md
depgraph visualize ./my-project --language go --format dot -o graph.dot
depgraph visualize ./my-project --language python --format csv -o edges.csv
```

### `focus`

Display the dependency tree for a specific module (upstream and downstream).

```bash
depgraph focus ./my-project --language typescript --module src/auth
depgraph focus ./my-project --language typescript --module src/auth --depth 3
```

### `check-layers`

Verify that dependencies respect configured layer rules. Exits with code 1 on violations.

```bash
depgraph check-layers ./my-project --language typescript --rules layers.json
```

Layer rules are defined in JSON:

```json
{
  "layers": [
    { "name": "core", "paths": ["src/core/**"] },
    { "name": "ui", "paths": ["src/ui/**"] }
  ],
  "rules": [
    { "from": "core", "to": ["core"], "type": "allow" },
    { "from": "ui", "to": ["ui", "core"], "type": "allow" }
  ]
}
```

## Example Fixture Projects

This repo includes example projects under `examples/` with known dependency patterns for testing:

- `examples/typescript-example/` — TypeScript project with a known ui↔services cycle and layer-rule violations
- `examples/python-example/` — Minimal Python project for parser and smoke coverage
- `examples/go-example/` — Go project with layered package imports for parser and smoke coverage

Run the bundled gallery demo to generate one artifact per language:

```bash
bash demo/run-example-gallery.sh
```

It writes JSON, text, and Mermaid outputs under `.tmp/demo-example-gallery/` for quick review or screencast capture. See [docs/tutorials/multi-language-fixture-gallery.md](docs/tutorials/multi-language-fixture-gallery.md) for the walkthrough.

## How It Works

1. **Walk** the project directory for source files (filtered by language and exclude patterns)
2. **Parse** import/require/dependency statements statically (no runtime execution)
3. **Build** an internal dependency graph from relative imports
4. **Analyze** for cycles (DFS), coupling metrics (Ca/Ce), and layer violations
5. **Output** in the requested format (text, json, dot, mermaid, csv)

Completely offline. No network calls. No telemetry.

## Limitations And Safety

- DepGraph parses source files statically and does not execute project code,
  build scripts, or tests.
- Dynamic imports, generated code, non-relative package aliases, and language
  features outside the supported import patterns may produce incomplete edges.
- Treat graph output as review guidance before refactors, not as a complete
  security or architecture audit.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Type check
npm run check

# Build
npm run build

# Smoke tests
npm run smoke

# Full validation
bash scripts/validate.sh
```

## License

MIT — see [LICENSE](LICENSE)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Small, reviewable changes preferred.

---

_Built because spaghetti code isn't a good look on anyone._ 🍝
