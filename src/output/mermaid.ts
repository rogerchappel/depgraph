/**
 * Mermaid diagram syntax output formatter.
 */

import { DependencyGraph } from '../models/graph.js';
import { getNodes, getEdges } from '../engine/graph.js';

/**
 * Format the dependency graph as Mermaid diagram syntax.
 */
export function formatAsMermaid(graph: DependencyGraph, title: string = 'Dependency Graph'): string {
  const nodes = getNodes(graph);
  const edges = getEdges(graph);

  const lines: string[] = [];

  lines.push('```mermaid');
  lines.push('graph LR');

  if (title) {
    lines.push(`  title("${title}")`);
  }

  lines.push('');

  // Define nodes with IDs
  for (const node of nodes) {
    const nodeId = sanitizeId(node.id);
    const label = escapeLabel(node.id);
    lines.push(`  ${nodeId}["${label}"]`);
  }

  lines.push('');

  // Edges
  for (const edge of edges) {
    const fromId = sanitizeId(edge.from);
    const toId = sanitizeId(edge.to);
    lines.push(`  ${fromId} --> ${toId}`);
  }

  lines.push('```');

  return lines.join('\n');
}

/**
 * Sanitize a module ID for use as a Mermaid node ID.
 */
function sanitizeId(id: string): string {
  // Mermaid node IDs can contain alphanumeric characters and underscores
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Escape a label for Mermaid.
 */
function escapeLabel(label: string): string {
  return label.replace(/"/g, '\\"');
}
