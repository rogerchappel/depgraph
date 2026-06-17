# Multi-Language Fixture Gallery

This walkthrough uses the checked-in fixture projects to show how `depgraph` can produce reviewer-friendly artifacts for TypeScript, Python, and Go without running the target code.

## 1. Run The Gallery Demo

```sh
npm install
bash demo/run-example-gallery.sh
```

The demo writes:

- `.tmp/demo-example-gallery/typescript-summary.json`
- `.tmp/demo-example-gallery/python-report.txt`
- `.tmp/demo-example-gallery/go-graph.md`

## 2. Read The TypeScript Summary

The TypeScript fixture has known cycles between auth/config and UI/service modules. Use the JSON output when an agent or CI job needs stable counts without parsing terminal text.

## 3. Review The Python Report

The text report is the easiest artifact to paste into a refactor brief. It lists summary counts, cycles, and coupling metrics in a format a maintainer can scan before touching a module.

## 4. Paste The Go Mermaid Graph

The Mermaid output can be pasted into GitHub Markdown to make a quick architecture sketch from the Go fixture. Keep it next to the code review or refactor plan that needs the graph.

## Boundaries

- `depgraph` parses import statements statically; it does not execute the fixture projects.
- Cycles and coupling metrics are architectural signals, not a correctness verdict.
- Layer rules only mean what the supplied `layers.json` says for that project.
