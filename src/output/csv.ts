/**
 * CSV output formatter (flat edge list).
 */

import { DependencyGraph } from '../models/graph.js';
import { getEdges } from '../engine/graph.js';

/**
 * Format the dependency graph as CSV.
 * Columns: from,to
 */
export function formatAsCsv(graph: DependencyGraph): string {
  const edges = getEdges(graph);

  const lines: string[] = [];

  // Header
  lines.push('from,to');

  // Data
  for (const edge of edges) {
    lines.push(`"${edge.from}","${edge.to}"`);
  }

  return lines.join('\n');
}
