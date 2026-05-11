/**
 * Visualize command controller.
 * Outputs graph in visual formats (DOT, Mermaid, JSON, CSV).
 */

import * as path from 'node:path';
import { walkDirectory, readFile } from '../parsers/walker.js';
import { parseTypeScript } from '../parsers/typescript.js';
import { parsePython } from '../parsers/python.js';
import { parseGo } from '../parsers/go.js';
import { buildGraph } from '../engine/graph.js';
import { formatAsDot } from '../output/dot.js';
import { formatAsMermaid } from '../output/mermaid.js';
import { formatAsJson } from '../output/json.js';
import { formatAsCsv } from '../output/csv.js';
import type { ParsedFile } from '../models/graph.js';

export interface VisualizeOptions {
  projectPath: string;
  language: 'typescript' | 'python' | 'go';
  format: 'dot' | 'mermaid' | 'json' | 'csv';
  excludePatterns?: string[];
  output?: string; // Optional output file path
}

/**
 * Run the visualize command.
 */
export async function visualize(options: VisualizeOptions): Promise<void> {
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

  // Build graph
  const graph = buildGraph(parsedFiles, projectRoot);

  // Format output
  let output: string;
  switch (options.format) {
    case 'dot':
      output = formatAsDot(graph, `DepGraph: ${projectRoot}`);
      break;
    case 'mermaid':
      output = formatAsMermaid(graph, `DepGraph: ${projectRoot}`);
      break;
    case 'json':
      output = formatAsJson({
        graph,
        cycles: [],
        metrics: [],
        totalFiles: files.length,
        totalImports: 0,
        language: options.language,
      });
      break;
    case 'csv':
      output = formatAsCsv(graph);
      break;
    default:
      throw new Error(`Unsupported format: ${options.format}`);
  }

  // Write to file or stdout
  if (options.output) {
    const fs = await import('node:fs');
    await fs.promises.writeFile(options.output, output, 'utf-8');
    console.log(`Output written to ${options.output}`);
  } else {
    console.log(output);
  }
}
