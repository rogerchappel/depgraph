# DepGraph PRD

Status: in-progress

## Summary

DepGraph is a local-first TypeScript CLI that analyzes and visualizes internal dependency graphs for TypeScript/JavaScript, Python, and Go projects. It detects circular dependencies, measures coupling, and produces actionable reports and diagrams. Built for developer and agentic workflows that need to understand code architecture without running the project.

## Motivation

As projects grow, dependency sprawl becomes invisible until it causes real pain: circular imports break builds, tightly coupled modules resist refactoring, and new contributors can't visualize the architecture. Tools exist for individual languages (Madge for JS, pylint for Python), but there isn't a single, fast, offline CLI that gives a cross-language dependency overview with actionable insights and visual output.

DepGraph parses import/require/dependency statements statically (no runtime needed), builds a graph, and reports cycles, coupling hotspots, and layering violations.

## Target users

- Engineers onboarding to unfamiliar codebases
- Tech leads auditing architecture before refactoring
- Agentic workflows that need module-level context for safe edits
- OSS maintainers verifying clean dependency boundaries

## Goals

- Statically parse imports/dependencies from source files (no runtime execution)
- Build an internal dependency graph
- Detect circular dependencies with full cycle paths
- Output dependency reports (text, JSON, GraphViz DOT, Mermaid)
- Support `--focus` to highlight a specific module's dependencies
- Support layer rule checking (e.g., "core must not import ui")
- Output SVG/PNG diagrams via DOT rendering
- Work completely offline by default

## Non-goals

- No runtime dependency analysis (only static)
- No LLM calls in the V1 path
- No full dependency management or version resolution
- No support for every ecosystem in V1 (focus on TypeScript, Python, Go)

## V1 CLI

```bash
depgraph analyze /path/to/project --language typescript
depgraph analyze /path/to/project --language python
depgraph analyze /path/to/project --language go
depgraph cycles /path/to/project          # detect and show circular deps
depgraph report /path/to/project           # text summary + stats
depgraph visualize /path/to/project --format mermaid  # or dot, json
depgraph focus /path/to/project --module src/auth       # show dep tree for module
depgraph check-layers /path/to/project --rules layers.json  # verify layer rules
```

## Supported languages V1

- **TypeScript/JavaScript**: `import`, `require()`, dynamic `import()`
- **Python**: `import`, `from ... import`, relative imports
- **Go**: `import "package"`, relative imports within module

## Output formats

- `text`: human-readable summary with cycle paths
- `json`: machine-readable graph data
- `dot`: GraphViz DOT format for GraphViz rendering
- `mermaid`: Mermaid graph syntax for GitHub/GitLab rendering
- `csv`: flat edge list for spreadsheet analysis

## Functional requirements

1. Static parsing of import statements (no runtime)
2. Configurable source path filtering (include/exclude patterns)
3. Cycle detection with human-readable cycle paths
4. Coupling metrics (afferent/efferent coupling per module)
5. Layer rule checking with explicit rule configuration
6. Multiple output formats (text, json, dot, mermaid, csv)
7. `--focus` module tree visualization
8. Module grouping by directory depth or config
9. Include fixtures under `examples/` and tests under `tests/`
10. No telemetry, no network calls

## Acceptance criteria

- `npm test`, `npm run check`, `npm run build`, and `npm run smoke` pass
- `bash scripts/validate.sh` passes
- At least one real CLI smoke uses checked-in fixture projects with known cycles
- README explains why DepGraph exists, quick start, supported languages, output formats
- GitHub repository is public under `rogerchappel/depgraph` with useful description and topics

## Source attribution

Created during the twice-daily OSS factory run on 2026-05-12. Inspired by the dependency analysis ecosystem (Madge, depcruise, pylint's import checker, golang.org/x/tools/imports) but reimagined as a focused, multi-language dep-graph CLI. No code copied from existing projects.
