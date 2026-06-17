# Social Hooks

Grounded post drafts for the multi-language fixture gallery.

## Hooks

1. `depgraph` turns TypeScript, Python, and Go imports into dependency reports without running the target app.
2. The fixture gallery produces JSON for automation, a text report for reviewer handoff, and Mermaid for a pasteable architecture sketch.
3. Circular dependencies are easier to discuss when the report names the path instead of asking reviewers to reconstruct imports by hand.
4. Run `bash demo/run-example-gallery.sh` to generate three local artifacts from the checked-in examples.

## Clip Outline

- Open `examples/typescript-example`, `examples/python-example`, and `examples/go-example`.
- Run `bash demo/run-example-gallery.sh`.
- Show `.tmp/demo-example-gallery/typescript-summary.json`.
- Show the Python report summary.
- Paste the Go Mermaid graph into a Markdown preview.

## Guardrails

- Do not claim semantic correctness or runtime coverage.
- Keep the story on static import analysis, cycles, coupling, and shareable artifacts.
- Mention that the target projects are not executed during analysis.
