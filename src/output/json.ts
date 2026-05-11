/**
 * JSON output formatter.
 */

import { AnalysisResult, CyclePath, ModuleMetrics, GraphNode, GraphEdge } from '../models/graph.js';
import { getNodes, getEdges } from '../engine/graph.js';

/**
 * Format the full analysis result as JSON.
 */
export function formatAsJson(result: AnalysisResult): string {
  const output = {
    language: result.language,
    summary: {
      totalFiles: result.totalFiles,
      totalImports: result.totalImports,
      nodes: getNodes(result.graph).length,
      edges: getEdges(result.graph).length,
      cycles: result.cycles.length,
    },
    nodes: getNodes(result.graph).map((n) => ({
      id: n.id,
      path: n.path,
    })),
    edges: getEdges(result.graph),
    cycles: result.cycles,
    metrics: result.metrics,
  };

  return JSON.stringify(output, null, 2);
}

/**
 * Format just the graph as JSON.
 */
export function formatGraphAsJson(nodes: GraphNode[], edges: GraphEdge[]): string {
  return JSON.stringify(
    {
      nodes,
      edges,
    },
    null,
    2
  );
}

/**
 * Format cycles as JSON.
 */
export function formatCyclesAsJson(cycles: CyclePath[]): string {
  return JSON.stringify(
    {
      cycles,
      count: cycles.length,
    },
    null,
    2
  );
}

/**
 * Format metrics as JSON.
 */
export function formatMetricsAsJson(metrics: ModuleMetrics[]): string {
  return JSON.stringify(
    {
      metrics,
      count: metrics.length,
    },
    null,
    2
  );
}
