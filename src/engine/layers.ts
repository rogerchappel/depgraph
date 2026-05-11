/**
 * Layer rule checking engine.
 */

import * as fs from 'node:fs';
import { DependencyGraph, LayerConfig, LayerViolation, LayerDefinition } from '../models/graph.js';

/**
 * Load layer configuration from a JSON file.
 */
export async function loadLayerConfig(configPath: string): Promise<LayerConfig> {
  const content = await fs.promises.readFile(configPath, 'utf-8');
  return JSON.parse(content) as LayerConfig;
}

/**
 * Check layer rules against the dependency graph.
 * Returns a list of violations.
 */
export function checkLayerRules(
  graph: DependencyGraph,
  config: LayerConfig
): LayerViolation[] {
  const violations: LayerViolation[] = [];

  // Build a map of module -> layer
  const moduleToLayer = new Map<string, string>();

  for (const [moduleId] of graph.nodes) {
    const layer = findLayerForModule(moduleId, config.layers);
    if (layer) {
      moduleToLayer.set(moduleId, layer.name);
    }
  }

  // Check each edge against the rules
  for (const edge of graph.edges) {
    const fromLayer = moduleToLayer.get(edge.from);
    const toLayer = moduleToLayer.get(edge.to);

    if (!fromLayer || !toLayer) {
      continue; // Skip edges where we can't determine layers
    }

    const isViolation = checkRule(config.rules, fromLayer, toLayer);
    if (isViolation) {
      violations.push({
        fromModule: edge.from,
        fromLayer,
        toModule: edge.to,
        toLayer,
        message: `Layer violation: '${fromLayer}' (${edge.from}) should not depend on '${toLayer}' (${edge.to})`,
      });
    }
  }

  return violations;
}

/**
 * Find which layer a module belongs to based on path patterns.
 */
function findLayerForModule(moduleId: string, layers: LayerDefinition[]): LayerDefinition | null {
  for (const layer of layers) {
    for (const pattern of layer.paths) {
      if (matchesPattern(moduleId, pattern)) {
        return layer;
      }
    }
  }
  return null;
}

/**
 * Check if a module path matches a glob-like pattern.
 */
function matchesPattern(moduleId: string, pattern: string): boolean {
  // First escape literal dots (but not in ** or *)
  // We need to be careful about the order
  let regexPattern = '';
  let i = 0;

  while (i < pattern.length) {
    if (pattern[i] === '*' && pattern[i + 1] === '*') {
      // ** matches any path (including empty)
      regexPattern += '.*';
      i += 2;
    } else if (pattern[i] === '*') {
      // * matches any chars except /
      regexPattern += '[^/]*';
      i += 1;
    } else if (pattern[i] === '.') {
      // Literal dot - escape for regex
      regexPattern += '\\.';
      i += 1;
    } else {
      // Regular character - escape if needed for regex
      regexPattern += pattern[i];
      i += 1;
    }
  }

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(moduleId);
}

/**
 * Check if a rule allows or denies the layer dependency.
 * Returns true if it's a violation.
 */
function checkRule(rules: any[], fromLayer: string, toLayer: string): boolean {
  for (const rule of rules) {
    if (rule.from === fromLayer) {
      if (rule.type === 'allow') {
        // If explicitly allowed, it's not a violation
        if (rule.to.includes(toLayer)) {
          return false;
        }
        // If not in allow list, it's a violation
        return true;
      } else if (rule.type === 'deny') {
        // If explicitly denied, it's a violation
        if (rule.to.includes(toLayer)) {
          return true;
        }
        // If not in deny list, check if there's a default policy
      }
    }
  }

  // Default: if there are allow rules for this layer, everything else is denied
  const hasAllowRules = rules.some((r) => r.from === fromLayer && r.type === 'allow');
  if (hasAllowRules) {
    return true; // Not in allow list = violation
  }

  return false; // No rules = allowed by default
}
