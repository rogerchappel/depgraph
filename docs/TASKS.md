# DepGraph - Implementation Tasks

## Phase 1: Project Structure & Configuration
- [x] Set up package.json with proper scripts and dependencies
- [x] Configure TypeScript compilation
- [x] Set up test runner (node --test)
- [x] Create directory structure: src/, tests/, examples/, scripts/

## Phase 2: Core Graph Engine
- [x] Graph data structure (adjacency list)
- [x] Add/remove nodes and edges
- [x] Topological sort
- [x] Cycle detection (DFS-based Tarjan's algorithm)
- [x] Module grouping by directory depth
- [x] Coupling metrics (afferent, efferent, instability)

## Phase 3: Language Parsers
- [x] TypeScript/JavaScript parser (import, require, dynamic import)
- [x] Python parser (import, from...import, relative imports)
- [x] Go parser (import statements, module-relative imports)
- [x] File walker with include/exclude filtering

## Phase 4: CLI Implementation
- [x] Main CLI entry point with argument parsing
- [x] `analyze` command - build and display dependency graph
- [x] `cycles` command - detect and display circular dependencies
- [x] `report` command - text summary with stats
- [x] `visualize` command - output DOT, Mermaid, JSON
- [x] `focus` command - show dependency tree for a specific module
- [x] `check-layers` command - verify layer rules

## Phase 5: Output Formatters
- [x] Text formatter (human-readable)
- [x] JSON formatter (machine-readable)
- [x] DOT formatter (GraphViz)
- [x] Mermaid formatter
- [x] CSV formatter (flat edge list)

## Phase 6: Layer Rule System
- [x] Layer rule config format (JSON)
- [x] Rule checker implementation
- [x] Violation reporting

## Phase 7: Test Fixtures
- [x] TypeScript/JavaScript example project with cycles
- [x] Python example project with cycles
- [x] Go example project with cycles
- [x] Layer rule violation examples

## Phase 8: Testing
- [x] Unit tests for graph engine
- [x] Unit tests for parsers
- [x] Unit tests for cycle detection
- [x] Unit tests for metrics
- [x] Unit tests for output formatters
- [x] Integration tests with fixture projects

## Phase 9: Scripts & Quality
- [x] scripts/smoke.sh - CLI smoke tests
- [x] scripts/validate.sh updates
- [x] ESLint/Prettier config (optional)
- [x] TypeScript strict mode

## Phase 10: Documentation
- [x] README.md rewrite with personality and examples
- [x] docs/PRD.md (already exists)
- [x] docs/TASKS.md (this file)
- [x] docs/ORCHESTRATION.md
- [x] docs/orchestration.json
- [x] CONTRIBUTING.md updates
- [x] Example usage snippets
