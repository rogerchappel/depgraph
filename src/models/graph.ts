/**
 * Type definitions for dependency graph structures.
 */

export interface GraphNode {
  id: string;
  path: string;
  imports: string[];
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface ImportInfo {
  sourceFile: string;
  importedModule: string;
  importType: 'static' | 'dynamic' | 'require';
  isRelative: boolean;
  lineNumber: number;
}

export interface ParsedFile {
  filePath: string;
  imports: ImportInfo[];
}

export interface CyclePath {
  modules: string[];
  length: number;
}

export interface ModuleMetrics {
  moduleId: string;
  afferentCoupling: number; // Ca: number of modules that depend on this module
  efferentCoupling: number; // Ce: number of modules this module depends on
  instability: number;      // I = Ce / (Ca + Ce), 0 = stable, 1 = unstable
}

export interface LayerConfig {
  layers: LayerDefinition[];
  rules: LayerRule[];
}

export interface LayerDefinition {
  name: string;
  paths: string[];
}

export interface LayerRule {
  from: string;
  to: string[];
  type: 'allow' | 'deny';
}

export interface LayerViolation {
  fromModule: string;
  fromLayer: string;
  toModule: string;
  toLayer: string;
  message: string;
}

export interface DependencyGraph {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  adjacencyList: Map<string, Set<string>>;
  reverseAdjacencyList: Map<string, Set<string>>;
}

export interface AnalysisResult {
  graph: DependencyGraph;
  cycles: CyclePath[];
  metrics: ModuleMetrics[];
  totalFiles: number;
  totalImports: number;
  language: string;
}
