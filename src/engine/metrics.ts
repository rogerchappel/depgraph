/**
 * Coupling metrics calculation.
 */

import { DependencyGraph, ModuleMetrics } from '../models/graph.js';

/**
 * Calculate coupling metrics for all modules in the graph.
 *
 * Afferent coupling (Ca): Number of modules that depend on this module.
 * Efferent coupling (Ce): Number of modules this module depends on.
 * Instability (I): Ce / (Ca + Ce), where 0 = maximally stable, 1 = maximally unstable.
 */
export function calculateMetrics(graph: DependencyGraph): ModuleMetrics[] {
  const metrics: ModuleMetrics[] = [];

  for (const [moduleId, _node] of graph.nodes) {
    const afferent = graph.reverseAdjacencyList.get(moduleId)?.size || 0;
    const efferent = graph.adjacencyList.get(moduleId)?.size || 0;
    const total = afferent + efferent;
    const instability = total === 0 ? 0 : efferent / total;

    metrics.push({
      moduleId,
      afferentCoupling: afferent,
      efferentCoupling: efferent,
      instability,
    });
  }

  // Sort by instability (descending)
  metrics.sort((a, b) => b.instability - a.instability);

  return metrics;
}

/**
 * Get the most unstable modules (highest instability values).
 */
export function getMostUnstableModules(
  metrics: ModuleMetrics[],
  limit: number = 10
): ModuleMetrics[] {
  return metrics.slice(0, limit);
}

/**
 * Get the most stable modules (lowest instability values).
 */
export function getMostStableModules(
  metrics: ModuleMetrics[],
  limit: number = 10
): ModuleMetrics[] {
  return [...metrics].reverse().slice(0, limit);
}

/**
 * Calculate average instability across all modules.
 */
export function getAverageInstability(metrics: ModuleMetrics[]): number {
  if (metrics.length === 0) return 0;
  const sum = metrics.reduce((acc, m) => acc + m.instability, 0);
  return sum / metrics.length;
}
