/**
 * Report command controller.
 * Generates a comprehensive text report.
 */

import * as path from 'node:path';
import { walkDirectory, readFile } from '../parsers/walker.js';
import { parseTypeScript } from '../parsers/typescript.js';
import { parsePython } from '../parsers/python.js';
import { parseGo } from '../parsers/go.js';
import { buildGraph } from '../engine/graph.js';
import { detectCycles } from '../engine/cycles.js';
import { calculateMetrics } from '../engine/metrics.js';
import { formatReport } from '../output/text.js';
import { formatAsJson } from '../output/json.js';
import type { ParsedFile, AnalysisResult } from '../models/graph.js';

export interface ReportOptions {
  projectPath: string;
  language: 'typescript' | 'python' | 'go';
  excludePatterns?: string[];
  format?: 'text' | 'json';
}

/**
 * Run the report command.
 */
export async function report(options: ReportOptions): Promise<void> {
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
  let totalImports = 0;

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

    totalImports += parsed.imports.filter((imp) => imp.isRelative).length;
    parsedFiles.push(parsed);
  }

  // Build graph, detect cycles, calculate metrics
  const graph = buildGraph(parsedFiles, projectRoot);
  const cycles = detectCycles(graph);
  const metrics = calculateMetrics(graph);

  const result: AnalysisResult = {
    graph,
    cycles,
    metrics,
    totalFiles: files.length,
    totalImports,
    language: options.language,
  };

  // Output
  if (options.format === 'json') {
    console.log(formatAsJson(result));
  } else {
    console.log(formatReport(result));
  }
}
