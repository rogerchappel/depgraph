/**
 * Base parser interface and utilities.
 */

import { ParsedFile, ImportInfo } from '../models/graph.js';

export interface FileParser {
  parse(filePath: string, content: string): ParsedFile;
  getSupportedExtensions(): string[];
}

/**
 * Normalize a file path to a module identifier relative to project root.
 */
export function normalizeModulePath(filePath: string, projectRoot: string): string {
  let normalized = filePath;

  // Remove project root prefix
  if (normalized.startsWith(projectRoot)) {
    normalized = normalized.slice(projectRoot.length);
  }

  // Remove leading slash
  normalized = normalized.replace(/^\//, '');

  // Remove file extension for module ID
  normalized = normalized.replace(/\.(ts|tsx|js|jsx|py|go)$/, '');

  // Handle index files
  if (normalized.endsWith('/index')) {
    normalized = normalized.slice(0, -6);
  }

  return normalized || '.';
}

/**
 * Resolve a relative import path to an absolute file path.
 */
export function resolveImportPath(
  importedModule: string,
  sourceFile: string,
  projectRoot: string,
  extensions: string[] = ['.ts', '.js', '.tsx', '.jsx', '.py', '.go']
): string {
  // If it's an absolute import (not relative), return as-is
  if (!importedModule.startsWith('.') && !importedModule.startsWith('/')) {
    return importedModule;
  }

  const sourceDir = sourceFile.substring(0, sourceFile.lastIndexOf('/'));
  let resolved = importedModule;

  // Resolve relative path
  if (resolved.startsWith('.')) {
    resolved = `${sourceDir}/${resolved}`;
  }

  // Normalize path segments (handle .. and .)
  const parts = resolved.split('/');
  const normalized: string[] = [];

  for (const part of parts) {
    if (part === '..') {
      normalized.pop();
    } else if (part !== '.' && part !== '') {
      normalized.push(part);
    }
  }

  resolved = normalized.join('/');

  // Ensure absolute path
  if (!resolved.startsWith('/')) {
    resolved = '/' + resolved;
  }

  // Try adding extensions
  for (const ext of extensions) {
    const candidate = `${resolved}${ext}`;
    return candidate;
  }

  // Try as index file
  for (const ext of extensions) {
    const candidate = `${resolved}/index${ext}`;
    return candidate;
  }

  return resolved;
}

/**
 * Check if a path should be excluded based on patterns.
 */
export function isExcluded(filePath: string, excludePatterns: string[]): boolean {
  for (const pattern of excludePatterns) {
    if (filePath.includes(pattern) || filePath.match(new RegExp(pattern))) {
      return true;
    }
  }
  return false;
}
