/**
 * Check-layers command controller.
 * Validates layer rules against the dependency graph.
 */

import * as path from 'node:path';
import { walkDirectory, readFile } from '../parsers/walker.js';
import { parseTypeScript } from '../parsers/typescript.js';
import { parsePython } from '../parsers/python.js';
import { parseGo } from '../parsers/go.js';
import { buildGraph } from '../engine/graph.js';
import { loadLayerConfig, checkLayerRules } from '../engine/layers.js';
import { LayerViolation } from '../models/graph.js';
import type { ParsedFile } from '../models/graph.js';

export interface CheckLayersOptions {
  projectPath: string;
  language: 'typescript' | 'python' | 'go';
  rulesFile: string;
  excludePatterns?: string[];
}

/**
 * Run the check-layers command.
 */
export async function checkLayers(options: CheckLayersOptions): Promise<void> {
  const projectRoot = path.resolve(options.projectPath);

  // Load layer config
  const rulesPath = path.resolve(options.rulesFile);
  const config = await loadLayerConfig(rulesPath);

  // Walk and parse
  const files = await walkDirectory(projectRoot, {
    language: options.language,
    excludePatterns: options.excludePatterns,
  });

  if (files.length === 0) {
    console.log(`No ${options.language} files found in ${projectRoot}`);
    return;
  }

  const parsedFiles: ParsedFile[] = [];
  for (const filePath of files) {
    const content = await readFile(filePath);
    let parsed: ParsedFile;

    switch (options.language) {
      case 'typescript':
        parsed = parseTypeScript(filePath, content);
        break;
      case 'python':
        parsed = parsePython(filePath, content);
        break;
      case 'go':
        parsed = parseGo(filePath, content);
        break;
      default:
        throw new Error(`Unsupported language: ${options.language}`);
    }

    parsedFiles.push(parsed);
  }

  // Build graph
  const graph = buildGraph(parsedFiles, projectRoot);

  // Check layer rules
  const violations = checkLayerRules(graph, config);

  // Output
  if (violations.length === 0) {
    console.log('✅ All layer rules pass!');
  } else {
    console.log(`Layer rule violations (${violations.length}):\n`);
    for (const violation of violations) {
      console.log(`❌ ${violation.message}`);
    }
    process.exitCode = 1;
  }
}
