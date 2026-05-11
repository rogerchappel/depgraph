/**
 * GraphViz DOT format output formatter.
 */

import { DependencyGraph, GraphNode, GraphEdge } from '../models/graph.js';
import { getNodes, getEdges } from '../engine/graph.js';

/**
 * Format the dependency graph as GraphViz DOT.
 */
export function formatAsDot(graph: DependencyGraph, title: string = 'Dependency Graph'): string {
  const nodes = getNodes(graph);
  const edges = getEdges(graph);

  const lines: string[] = [];

  lines.push('digraph "DepGraph" {');
  lines.push(`  label="${title}";`);
  lines.push('  fontsize=14;');
  lines.push('  node [shape=box, style=filled, fillcolor=lightblue, fontsize=10];');
  lines.push('  edge [color=gray40];');
  lines.push('  rankdir=LR;');
  lines.push('');

  // Nodes
  for (const node of nodes) {
    const nodeId = sanitizeId(node.id);
    const label = escapeLabel(node.id);
    lines.push(`  "${nodeId}" [label="${label}"];`);
  }

  lines.push('');

  // Edges
  for (const edge of edges) {
    const fromId = sanitizeId(edge.from);
    const toId = sanitizeId(edge.to);
    lines.push(`  "${fromId}" -> "${toId}";`);
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Sanitize a module ID for use as a DOT node ID.
 */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Escape a label for DOT format.
 */
function escapeLabel(label: string): string {
  return label.replace(/"/g, '\\"');
}
