/**
 * Core dependency graph data structure.
 */

import { DependencyGraph, GraphNode, GraphEdge, ParsedFile, ImportInfo } from '../models/graph.js';
import { normalizeModulePath, resolveImportPath } from '../parsers/base.js';

/**
 * Build a dependency graph from parsed files.
 */
export function buildGraph(
  parsedFiles: ParsedFile[],
  projectRoot: string
): DependencyGraph {
  const graph: DependencyGraph = {
    nodes: new Map(),
    edges: [],
    adjacencyList: new Map(),
    reverseAdjacencyList: new Map(),
  };

  // First pass: create nodes for all parsed files
  for (const parsed of parsedFiles) {
    const moduleId = normalizeModulePath(parsed.filePath, projectRoot);
    const node: GraphNode = {
      id: moduleId,
      path: parsed.filePath,
      imports: parsed.imports.map((imp) => imp.importedModule),
    };
    graph.nodes.set(moduleId, node);

    if (!graph.adjacencyList.has(moduleId)) {
      graph.adjacencyList.set(moduleId, new Set());
    }
    if (!graph.reverseAdjacencyList.has(moduleId)) {
      graph.reverseAdjacencyList.set(moduleId, new Set());
    }
  }

  // Second pass: create edges from imports
  for (const parsed of parsedFiles) {
    const sourceId = normalizeModulePath(parsed.filePath, projectRoot);

    for (const imp of parsed.imports) {
      // Only track internal (relative) imports
      if (!imp.isRelative) {
        continue;
      }

      const targetId = resolveImportPath(
        imp.importedModule,
        parsed.filePath,
        projectRoot
      );
      const normalizedTarget = normalizeModulePath(targetId, projectRoot);

      // Only add edge if target is a known node
      if (graph.nodes.has(normalizedTarget)) {
        const edge: GraphEdge = {
          from: sourceId,
          to: normalizedTarget,
        };
        graph.edges.push(edge);

        graph.adjacencyList.get(sourceId)!.add(normalizedTarget);
        graph.reverseAdjacencyList.get(normalizedTarget)!.add(sourceId);
      }
    }
  }

  return graph;
}

/**
 * Get all nodes in the graph.
 */
export function getNodes(graph: DependencyGraph): GraphNode[] {
  return Array.from(graph.nodes.values());
}

/**
 * Get all edges in the graph.
 */
export function getEdges(graph: DependencyGraph): GraphEdge[] {
  return graph.edges;
}

/**
 * Get the number of nodes.
 */
export function nodeCount(graph: DependencyGraph): number {
  return graph.nodes.size;
}

/**
 * Get the number of edges.
 */
export function edgeCount(graph: DependencyGraph): number {
  return graph.edges.length;
}

/**
 * Get dependencies of a module (what it imports).
 */
export function getDependencies(graph: DependencyGraph, moduleId: string): string[] {
  return Array.from(graph.adjacencyList.get(moduleId) || []);
}

/**
 * Get dependents of a module (what imports it).
 */
export function getDependents(graph: DependencyGraph, moduleId: string): string[] {
  return Array.from(graph.reverseAdjacencyList.get(moduleId) || []);
}
