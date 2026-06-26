/**
 * Cycle detection using DFS (Tarjan's algorithm variant).
 */

import { DependencyGraph, CyclePath } from '../models/graph.js';

/**
 * Detect all circular dependencies in the graph.
 * Returns an array of cycle paths.
 */
export function detectCycles(graph: DependencyGraph): CyclePath[] {
  const cycles: CyclePath[] = [];
  const visited = new Set<string>();
  const recStack = new Set<string>();
  const parent = new Map<string, string>();

  for (const nodeId of graph.adjacencyList.keys()) {
    if (!visited.has(nodeId)) {
      findCyclesDFS(
        nodeId,
        graph,
        visited,
        recStack,
        parent,
        cycles
      );
    }
  }

  return deduplicateCycles(cycles);
}

function findCyclesDFS(
  node: string,
  graph: DependencyGraph,
  visited: Set<string>,
  recStack: Set<string>,
  parent: Map<string, string>,
  cycles: CyclePath[]
): void {
  visited.add(node);
  recStack.add(node);

  const neighbors = graph.adjacencyList.get(node) || new Set();

  for (const neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      parent.set(neighbor, node);
      findCyclesDFS(neighbor, graph, visited, recStack, parent, cycles);
    } else if (recStack.has(neighbor)) {
      // Found a cycle - reconstruct it
      const cycle = reconstructCycle(parent, node, neighbor);
      cycles.push(cycle);
    }
  }

  recStack.delete(node);
}

function reconstructCycle(
  parent: Map<string, string>,
  current: string,
  start: string
): CyclePath {
  const path: string[] = [current];
  let node = current;

  while (node !== start) {
    node = parent.get(node) || start;
    path.push(node);
  }

  path.reverse();
  path.push(start); // Complete the cycle

  return {
    modules: path,
    length: path.length - 1,
  };
}

/**
 * Remove duplicate cycles (same modules, different starting points).
 */
function deduplicateCycles(cycles: CyclePath[]): CyclePath[] {
  const seen = new Set<string>();
  const unique: CyclePath[] = [];

  for (const cycle of cycles) {
    // Normalize: rotate to start with smallest module
    const modules = cycle.modules.slice(0, -1); // Remove the repeated last element
    if (modules.length === 0) continue;

    const minIndex = modules.indexOf(min(modules));
    const normalized = [...modules.slice(minIndex), ...modules.slice(0, minIndex)];
    const key = normalized.join(' -> ');

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(cycle);
    }
  }

  return unique;
}

function min(arr: string[]): string {
  return arr.reduce((a, b) => (a < b ? a : b));
}
