# DepGraph Orchestration Guide

## Architecture Overview

DepGraph follows a layered architecture with clear separation of concerns:

```
CLI Layer (src/cli.ts)
  └── Command routing and argument parsing
      └── Controller Layer (src/controllers/)
          └── Business logic orchestration
              └── Engine Layer (src/engine/)
                  └── Graph building, cycle detection, metrics
                      └── Parser Layer (src/parsers/)
                          └── Language-specific import extraction
                              └── Output Layer (src/output/)
                                  └── Format rendering
```

## Module Responsibilities

### `src/cli.ts`
- Entry point for the CLI
- Parses command-line arguments using yargs
- Routes to appropriate controller
- Handles global options (--language, --exclude, --format)

### `src/controllers/`
- **analyze.ts** - Builds graph and outputs summary
- **cycles.ts** - Detects and reports circular dependencies
- **report.ts** - Generates comprehensive text report
- **visualize.ts** - Outputs graph in visual formats (DOT, Mermaid, JSON)
- **focus.ts** - Shows dependency tree for a specific module
- **checkLayers.ts** - Validates layer rules

### `src/engine/`
- **graph.ts** - Core graph data structure (adjacency list)
- **builder.ts** - Builds graph from parsed imports
- **cycles.ts** - Cycle detection using DFS (Tarjan's algorithm)
- **metrics.ts** - Coupling metrics (afferent, efferent, instability)
- **focus.ts** - Module dependency tree traversal
- **layers.ts** - Layer rule checking

### `src/parsers/`
- **base.ts** - Parser interface and utilities
- **typescript.ts** - TypeScript/JavaScript import parser
- **python.ts** - Python import parser
- **go.ts** - Go import parser
- **walker.ts** - File system walker with filtering

### `src/output/`
- **text.ts** - Human-readable text output
- **json.ts** - Machine-readable JSON output
- **dot.ts** - GraphViz DOT format
- **mermaid.ts** - Mermaid diagram syntax
- **csv.ts** - CSV edge list

### `src/models/`
- **graph.ts** - Type definitions for graph structures
- **report.ts** - Type definitions for reports

## Data Flow

1. **CLI** receives command and arguments
2. **Controller** orchestrates the pipeline:
   a. Walker discovers source files
   b. Parser extracts imports from each file
   c. Builder constructs the dependency graph
   d. Engine performs analysis (cycles, metrics, etc.)
   e. Formatter renders output
3. **Output** is written to stdout or file

## Orchestration Patterns

### Single Language Analysis
```typescript
const files = await walkDirectory(projectPath, language, excludePatterns);
const imports = await parseFiles(files, language);
const graph = buildGraph(imports, projectPath);
const cycles = detectCycles(graph);
const metrics = calculateMetrics(graph);
```

### Multi-Language Analysis (future)
```typescript
const graph = new DependencyGraph();
for (const lang of languages) {
  const files = await walkDirectory(projectPath, lang, excludePatterns);
  const imports = await parseFiles(files, lang);
  graph.addImports(imports);
}
```

### Focus Mode
```typescript
const tree = buildDependencyTree(graph, targetModule);
renderTree(tree, format);
```

### Layer Checking
```typescript
const violations = checkLayerRules(graph, layerConfig);
if (violations.length > 0) {
  reportViolations(violations);
  process.exit(1);
}
```

## Error Handling

- Parser errors are non-fatal (log warning, skip file)
- Cycle detection is best-effort (may miss dynamic imports)
- Layer violations cause non-zero exit code (CI-friendly)
- Invalid arguments cause immediate exit with usage hint

## Configuration

Layer rules are loaded from JSON files:
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

## Testing Strategy

- Unit tests for each parser (fixture-based)
- Unit tests for graph operations
- Integration tests with example projects
- Smoke tests for CLI commands
- Snapshot tests for output formats
