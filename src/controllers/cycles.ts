/**
 * Cycles command controller.
 * Detects and displays circular dependencies.
 */

import * as path from 'node:path';
import { walkDirectory, readFile } from '../parsers/walker.js';
import { parseTypeScript } from '../parsers/typescript.js';
import { parsePython } from '../parsers/python.js';
import { parseGo } from '../parsers/go.js';
import { buildGraph } from '../engine/graph.js';
import { detectCycles } from '../engine/cycles.js';
import { formatCycles } from '../output/text.js';
import { formatCyclesAsJson } from '../output/json.js';
import type { ParsedFile } from '../models/graph.js';

export interface CyclesOptions {
  projectPath: string;
  language: 'typescript' | 'python' | 'go';
  excludePatterns?: string[];
  format?: 'text' | 'json';
}

/**
 * Run the cycles command.
 */
export async function detectCyclesCmd(options: CyclesOptions): Promise<void> {
  const projectRoot = path.resolve(options.projectPath);

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

  // Build graph and detect cycles
  const graph = buildGraph(parsedFiles, projectRoot);
  const cycles = detectCycles(graph);

  // Output
  if (options.format === 'json') {
    console.log(formatCyclesAsJson(cycles));
  } else {
    console.log(formatCycles(cycles));
  }

  // Exit with error code if cycles found
  if (cycles.length > 0) {
    process.exitCode = 1;
  }
}
