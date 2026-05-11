/**
 * Focus command controller.
 * Shows dependency tree for a specific module.
 */

import * as path from 'node:path';
import { walkDirectory, readFile } from '../parsers/walker.js';
import { parseTypeScript } from '../parsers/typescript.js';
import { parsePython } from '../parsers/python.js';
import { parseGo } from '../parsers/go.js';
import { buildGraph } from '../engine/graph.js';
import { buildDependencyTree, formatDependencyTree } from '../engine/focus.js';
import { formatAsJson } from '../output/json.js';
import type { ParsedFile } from '../models/graph.js';

export interface FocusOptions {
  projectPath: string;
  language: 'typescript' | 'python' | 'go';
  module: string;
  excludePatterns?: string[];
  format?: 'text' | 'json';
  depth?: number;
}

/**
 * Run the focus command.
 */
export async function focus(options: FocusOptions): Promise<void> {
  const projectRoot = path.resolve(options.projectPath);
  const maxDepth = options.depth || 5;

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

  // Build dependency tree for the module
  const tree = buildDependencyTree(graph, options.module, maxDepth);

  if (!tree) {
    console.log(`Module "${options.module}" not found in the dependency graph`);
    process.exitCode = 1;
    return;
  }

  // Output
  if (options.format === 'json') {
    console.log(formatAsJson({
      graph,
      cycles: [],
      metrics: [],
      totalFiles: files.length,
      totalImports: 0,
      language: options.language,
    }));
    // Also output tree
    console.log(JSON.stringify(tree, null, 2));
  } else {
    console.log(`Dependency tree for: ${options.module}\n`);
    console.log(`└── ─ ${options.module}`);
    if (tree.dependencies.length > 0) {
      console.log('');
      for (let i = 0; i < tree.dependencies.length; i++) {
        console.log(
          formatDependencyTree(tree.dependencies[i], '', i === tree.dependencies.length - 1, 'downstream')
        );
      }
    }
    if (tree.dependents.length > 0) {
      console.log('');
      console.log('Dependents (modules that import this):');
      for (let i = 0; i < tree.dependents.length; i++) {
        console.log(
          formatDependencyTree(tree.dependents[i], '', i === tree.dependents.length - 1, 'upstream')
        );
      }
    }
  }
}
