/**
 * DepGraph - Multi-language dependency graph analyzer.
 *
 * Public API exports.
 */

export { analyze } from './controllers/analyze.js';
export { detectCyclesCmd } from './controllers/cycles.js';
export { report } from './controllers/report.js';
export { visualize } from './controllers/visualize.js';
export { focus } from './controllers/focus.js';
export { checkLayers } from './controllers/checkLayers.js';

export { buildGraph, getNodes, getEdges, nodeCount, edgeCount } from './engine/graph.js';
export { detectCycles } from './engine/cycles.js';
export { calculateMetrics } from './engine/metrics.js';
export { buildDependencyTree } from './engine/focus.js';
export { loadLayerConfig, checkLayerRules } from './engine/layers.js';

export { walkDirectory, readFile } from './parsers/walker.js';
export { TypeScriptParser, parseTypeScript } from './parsers/typescript.js';
export { PythonParser, parsePython } from './parsers/python.js';
export { GoParser, parseGo } from './parsers/go.js';

export * from './models/graph.js';
