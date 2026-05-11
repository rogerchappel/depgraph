/**
 * Module dependency tree traversal for focus mode.
 */

import { DependencyGraph } from '../models/graph.js';
import { getDependencies, getDependents } from './graph.js';

export interface DependencyTreeNode {
  moduleId: string;
  dependencies: DependencyTreeNode[];
  dependents: DependencyTreeNode[];
  level: number;
}

/**
 * Build a dependency tree centered on a specific module.
 * Includes both upstream (what imports it) and downstream (what it imports).
 */
export function buildDependencyTree(
  graph: DependencyGraph,
  targetModule: string,
  maxDepth: number = 5
): DependencyTreeNode | null {
  // Find the target module
  let foundModule: string | null = null;
  for (const [id] of graph.nodes) {
    if (id === targetModule || id.endsWith('/' + targetModule) || id.includes(targetModule)) {
      foundModule = id;
      break;
    }
  }

  if (!foundModule) {
    return null;
  }

  const visitedUpstream = new Set<string>();
  const visitedDownstream = new Set<string>();

  const tree: DependencyTreeNode = {
    moduleId: targetModule,
    dependencies: [],
    dependents: [],
    level: 0,
  };

  // Build downstream (dependencies - what this module imports)
  buildDownstream(
    graph,
    foundModule,
    tree.dependencies,
    visitedDownstream,
    1,
    maxDepth
  );

  // Build upstream (dependents - what imports this module)
  buildUpstream(
    graph,
    foundModule,
    tree.dependents,
    visitedUpstream,
    1,
    maxDepth
  );

  return tree;
}

function buildDownstream(
  graph: DependencyGraph,
  moduleId: string,
  children: DependencyTreeNode[],
  visited: Set<string>,
  currentDepth: number,
  maxDepth: number
): void {
  if (visited.has(moduleId) || currentDepth > maxDepth) {
    return;
  }

  visited.add(moduleId);

  const deps = getDependencies(graph, moduleId);
  for (const dep of deps) {
    const node: DependencyTreeNode = {
      moduleId: dep,
      dependencies: [],
      dependents: [],
      level: currentDepth,
    };
    children.push(node);
    buildDownstream(graph, dep, node.dependencies, visited, currentDepth + 1, maxDepth);
  }
}

function buildUpstream(
  graph: DependencyGraph,
  moduleId: string,
  children: DependencyTreeNode[],
  visited: Set<string>,
  currentDepth: number,
  maxDepth: number
): void {
  if (visited.has(moduleId) || currentDepth > maxDepth) {
    return;
  }

  visited.add(moduleId);

  const dependents = getDependents(graph, moduleId);
  for (const dependent of dependents) {
    const node: DependencyTreeNode = {
      moduleId: dependent,
      dependencies: [],
      dependents: [],
      level: currentDepth,
    };
    children.push(node);
    buildUpstream(graph, dependent, node.dependents, visited, currentDepth + 1, maxDepth);
  }
}

/**
 * Format the dependency tree as a text string.
 */
export function formatDependencyTree(
  tree: DependencyTreeNode,
  prefix: string = '',
  isLast: boolean = true,
  direction: 'downstream' | 'upstream' = 'downstream'
): string {
  let result = '';
  const connector = isLast ? '└── ' : '├── ';
  const extension = isLast ? '    ' : '│   ';

  if (direction === 'downstream') {
    result += `${prefix}${connector}→ ${tree.moduleId}\n`;
    const children = tree.dependencies;
    for (let i = 0; i < children.length; i++) {
      result += formatDependencyTree(
        children[i],
        prefix + extension,
        i === children.length - 1,
        'downstream'
      );
    }
  } else {
    result += `${prefix}${connector}← ${tree.moduleId}\n`;
    const children = tree.dependents;
    for (let i = 0; i < children.length; i++) {
      result += formatDependencyTree(
        children[i],
        prefix + extension,
        i === children.length - 1,
        'upstream'
      );
    }
  }

  return result;
}
