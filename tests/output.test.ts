/**
 * Tests for output formatters.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildGraph } from '../src/engine/graph.js';
import { detectCycles } from '../src/engine/cycles.js';
import { calculateMetrics } from '../src/engine/metrics.js';
import { formatAnalysis, formatCycles, formatReport } from '../src/output/text.js';
import { formatAsJson, formatCyclesAsJson } from '../src/output/json.js';
import { formatAsDot } from '../src/output/dot.js';
import { formatAsMermaid } from '../src/output/mermaid.js';
import { formatAsCsv } from '../src/output/csv.js';
import type { ParsedFile, AnalysisResult } from '../src/models/graph.js';

function createTestGraph(): AnalysisResult {
  const parsedFiles: ParsedFile[] = [
    {
      filePath: '/project/src/a.ts',
      imports: [{ sourceFile: '/project/src/a.ts', importedModule: './b', importType: 'static', isRelative: true, lineNumber: 1 }],
    },
    {
      filePath: '/project/src/b.ts',
      imports: [{ sourceFile: '/project/src/b.ts', importedModule: './a', importType: 'static', isRelative: true, lineNumber: 1 }],
    },
  ];

  const graph = buildGraph(parsedFiles, '/project');
  const cycles = detectCycles(graph);
  const metrics = calculateMetrics(graph);

  return {
    graph,
    cycles,
    metrics,
    totalFiles: 2,
    totalImports: 2,
    language: 'typescript',
  };
}

describe('Text Formatter', () => {
  it('should format analysis as text', () => {
    const result = createTestGraph();
    const output = formatAnalysis(result);
    assert.ok(output.includes('DepGraph Analysis Report'));
    assert.ok(output.includes('Circular Dependencies'));
  });

  it('should format cycles as text', () => {
    const result = createTestGraph();
    const output = formatCycles(result.cycles);
    assert.ok(output.includes('circular dependency'));
  });

  it('should format report as text', () => {
    const result = createTestGraph();
    const output = formatReport(result);
    assert.ok(output.includes('DepGraph Report'));
    assert.ok(output.includes('Language'));
  });
});

describe('JSON Formatter', () => {
  it('should format analysis as valid JSON', () => {
    const result = createTestGraph();
    const output = formatAsJson(result);
    const parsed = JSON.parse(output);
    assert.ok(parsed.language);
    assert.ok(parsed.summary);
    assert.ok(Array.isArray(parsed.nodes));
    assert.ok(Array.isArray(parsed.edges));
  });

  it('should format cycles as valid JSON', () => {
    const result = createTestGraph();
    const output = formatCyclesAsJson(result.cycles);
    const parsed = JSON.parse(output);
    assert.ok(Array.isArray(parsed.cycles));
    assert.ok(typeof parsed.count === 'number');
  });
});

describe('DOT Formatter', () => {
  it('should format graph as DOT', () => {
    const result = createTestGraph();
    const output = formatAsDot(result.graph, 'Test Graph');
    assert.ok(output.includes('digraph'));
    assert.ok(output.includes('Test Graph'));
    assert.ok(output.includes('->'));
  });
});

describe('Mermaid Formatter', () => {
  it('should format graph as Mermaid', () => {
    const result = createTestGraph();
    const output = formatAsMermaid(result.graph, 'Test Graph');
    assert.ok(output.includes('```mermaid'));
    assert.ok(output.includes('graph LR'));
    assert.ok(output.includes('-->'));
  });
});

describe('CSV Formatter', () => {
  it('should format graph as CSV', () => {
    const result = createTestGraph();
    const output = formatAsCsv(result.graph);
    assert.ok(output.includes('from,to'));
    const lines = output.split('\n');
    assert.ok(lines.length >= 2); // Header + at least one edge
  });
});
