/**
 * Tests for the graph engine.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildGraph, getNodes, getEdges, nodeCount, edgeCount } from '../src/engine/graph.js';
import { detectCycles } from '../src/engine/cycles.js';
import { calculateMetrics } from '../src/engine/metrics.js';
import type { ParsedFile } from '../src/models/graph.js';

describe('Graph Engine', () => {
  describe('buildGraph', () => {
    it('should build a graph from parsed files', () => {
      const parsedFiles: ParsedFile[] = [
        {
          filePath: '/project/src/a.ts',
          imports: [
            { sourceFile: '/project/src/a.ts', importedModule: './b', importType: 'static', isRelative: true, lineNumber: 1 },
          ],
        },
        {
          filePath: '/project/src/b.ts',
          imports: [],
        },
      ];

      const graph = buildGraph(parsedFiles, '/project');

      assert.strictEqual(nodeCount(graph), 2);
      assert.strictEqual(edgeCount(graph), 1);
    });

    it('should ignore non-relative imports', () => {
      const parsedFiles: ParsedFile[] = [
        {
          filePath: '/project/src/a.ts',
          imports: [
            { sourceFile: '/project/src/a.ts', importedModule: 'lodash', importType: 'static', isRelative: false, lineNumber: 1 },
          ],
        },
      ];

      const graph = buildGraph(parsedFiles, '/project');
      assert.strictEqual(nodeCount(graph), 1);
      assert.strictEqual(edgeCount(graph), 0);
    });

    it('should build graph with multiple nodes and edges', () => {
      const parsedFiles: ParsedFile[] = [
        {
          filePath: '/project/src/a.ts',
          imports: [
            { sourceFile: '/project/src/a.ts', importedModule: './b', importType: 'static', isRelative: true, lineNumber: 1 },
            { sourceFile: '/project/src/a.ts', importedModule: './c', importType: 'static', isRelative: true, lineNumber: 2 },
          ],
        },
        {
          filePath: '/project/src/b.ts',
          imports: [{ sourceFile: '/project/src/b.ts', importedModule: './c', importType: 'static', isRelative: true, lineNumber: 1 }],
        },
        {
          filePath: '/project/src/c.ts',
          imports: [],
        },
      ];

      const graph = buildGraph(parsedFiles, '/project');
      assert.strictEqual(nodeCount(graph), 3);
      assert.strictEqual(edgeCount(graph), 3);
    });
  });

  describe('detectCycles', () => {
    it('should detect no cycles in acyclic graph', () => {
      const parsedFiles: ParsedFile[] = [
        {
          filePath: '/project/src/a.ts',
          imports: [{ sourceFile: '/project/src/a.ts', importedModule: './b', importType: 'static', isRelative: true, lineNumber: 1 }],
        },
        {
          filePath: '/project/src/b.ts',
          imports: [{ sourceFile: '/project/src/b.ts', importedModule: './c', importType: 'static', isRelative: true, lineNumber: 1 }],
        },
        {
          filePath: '/project/src/c.ts',
          imports: [],
        },
      ];

      const graph = buildGraph(parsedFiles, '/project');
      const cycles = detectCycles(graph);
      assert.strictEqual(cycles.length, 0);
    });

    it('should detect a simple cycle', () => {
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
      assert.ok(cycles.length >= 1, 'Should detect at least one cycle');
      assert.ok(cycles[0].length >= 2, 'Cycle should have at least 2 nodes');
      assert.strictEqual(cycles[0].modules[0], cycles[0].modules[cycles[0].modules.length - 1], 'Cycle should close on the start node');
    });

    it('should detect a 3-node cycle', () => {
      const parsedFiles: ParsedFile[] = [
        {
          filePath: '/project/src/a.ts',
          imports: [{ sourceFile: '/project/src/a.ts', importedModule: './b', importType: 'static', isRelative: true, lineNumber: 1 }],
        },
        {
          filePath: '/project/src/b.ts',
          imports: [{ sourceFile: '/project/src/b.ts', importedModule: './c', importType: 'static', isRelative: true, lineNumber: 1 }],
        },
        {
          filePath: '/project/src/c.ts',
          imports: [{ sourceFile: '/project/src/c.ts', importedModule: './a', importType: 'static', isRelative: true, lineNumber: 1 }],
        },
      ];

      const graph = buildGraph(parsedFiles, '/project');
      const cycles = detectCycles(graph);
      assert.ok(cycles.length >= 1, 'Should detect at least one cycle');
    });
  });

  describe('calculateMetrics', () => {
    it('should calculate metrics for all modules', () => {
      const parsedFiles: ParsedFile[] = [
        {
          filePath: '/project/src/a.ts',
          imports: [{ sourceFile: '/project/src/a.ts', importedModule: './b', importType: 'static', isRelative: true, lineNumber: 1 }],
        },
        {
          filePath: '/project/src/b.ts',
          imports: [],
        },
      ];

      const graph = buildGraph(parsedFiles, '/project');
      const metrics = calculateMetrics(graph);
      assert.strictEqual(metrics.length, 2);
    });

    it('should have correct instability values', () => {
      const parsedFiles: ParsedFile[] = [
        {
          filePath: '/project/src/a.ts',
          imports: [{ sourceFile: '/project/src/a.ts', importedModule: './b', importType: 'static', isRelative: true, lineNumber: 1 }],
        },
        {
          filePath: '/project/src/b.ts',
          imports: [],
        },
      ];

      const graph = buildGraph(parsedFiles, '/project');
      const metrics = calculateMetrics(graph);

      // Module a: Ce=1, Ca=0, I=1/(0+1)=1.0
      // Module b: Ce=0, Ca=1, I=0/(1+0)=0.0
      const aMetrics = metrics.find((m) => m.moduleId === 'src/a');
      const bMetrics = metrics.find((m) => m.moduleId === 'src/b');

      assert.ok(aMetrics, 'Should find module a');
      assert.ok(bMetrics, 'Should find module b');
      assert.strictEqual(aMetrics!.instability, 1.0);
      assert.strictEqual(bMetrics!.instability, 0.0);
    });
  });
});
