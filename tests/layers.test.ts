/**
 * Tests for layer rule checking.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildGraph } from '../src/engine/graph.js';
import { checkLayerRules, loadLayerConfig } from '../src/engine/layers.js';
import type { ParsedFile, LayerConfig } from '../src/models/graph.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

describe('Layer Rules', () => {
  it('should detect layer violations', () => {
    const parsedFiles: ParsedFile[] = [
      {
        filePath: '/project/src/core/auth.ts',
        imports: [{ sourceFile: '/project/src/core/auth.ts', importedModule: '../ui/button', importType: 'static', isRelative: true, lineNumber: 1 }],
      },
      {
        filePath: '/project/src/ui/button.ts',
        imports: [],
      },
    ];

    const graph = buildGraph(parsedFiles, '/project');

    const config: LayerConfig = {
      layers: [
        { name: 'core', paths: ['src/core/**'] },
        { name: 'ui', paths: ['src/ui/**'] },
      ],
      rules: [
        { from: 'core', to: ['core'], type: 'allow' },
        { from: 'ui', to: ['ui', 'core'], type: 'allow' },
      ],
    };

    const violations = checkLayerRules(graph, config);
    assert.ok(violations.length >= 1, 'Should detect at least one violation');
  });

  it('should pass when no violations exist', () => {
    const parsedFiles: ParsedFile[] = [
      {
        filePath: '/project/src/ui/button.ts',
        imports: [{ sourceFile: '/project/src/ui/button.ts', importedModule: '../core/auth', importType: 'static', isRelative: true, lineNumber: 1 }],
      },
      {
        filePath: '/project/src/core/auth.ts',
        imports: [],
      },
    ];

    const graph = buildGraph(parsedFiles, '/project');

    const config: LayerConfig = {
      layers: [
        { name: 'core', paths: ['src/core/**'] },
        { name: 'ui', paths: ['src/ui/**'] },
      ],
      rules: [
        { from: 'core', to: ['core'], type: 'allow' },
        { from: 'ui', to: ['ui', 'core'], type: 'allow' },
      ],
    };

    const violations = checkLayerRules(graph, config);
    assert.strictEqual(violations.length, 0, 'Should not detect any violations');
  });

  it('should load layer config from file', async () => {
    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'depgraph-test-'));
    const configPath = path.join(tmpDir, 'layers.json');

    const config = {
      layers: [
        { name: 'core', paths: ['src/core/**'] },
      ],
      rules: [],
    };

    await fs.promises.writeFile(configPath, JSON.stringify(config));

    const loaded = await loadLayerConfig(configPath);
    assert.strictEqual(loaded.layers.length, 1);
    assert.strictEqual(loaded.layers[0].name, 'core');

    // Clean up
    await fs.promises.rm(tmpDir, { recursive: true });
  });
});
