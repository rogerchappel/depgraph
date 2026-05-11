/**
 * Python import parser.
 * Handles: import, from...import, relative imports
 */

import { ParsedFile, ImportInfo } from '../models/graph.js';
import { FileParser } from './base.js';

export class PythonParser implements FileParser {
  parse(filePath: string, content: string): ParsedFile {
    const imports: ImportInfo[] = [];
    const lines = content.split('\n');

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum].trim();
      const lineImports = this.extractImportsFromLine(line, filePath, lineNum + 1);
      imports.push(...lineImports);
    }

    return {
      filePath,
      imports,
    };
  }

  getSupportedExtensions(): string[] {
    return ['.py'];
  }

  private extractImportsFromLine(
    line: string,
    sourceFile: string,
    lineNumber: number
  ): ImportInfo[] {
    const imports: ImportInfo[] = [];

    // Skip comments and empty lines
    if (line.startsWith('#') || line === '') {
      return imports;
    }

    // from ... import ... statements
    const fromImportRegex = /^from\s+([.\w]+)\s+import\s+(.+)/;
    const fromMatch = line.match(fromImportRegex);
    if (fromMatch) {
      const importedModule = fromMatch[1];
      imports.push({
        sourceFile,
        importedModule: this.normalizePythonImport(importedModule, sourceFile),
        importType: 'static',
        isRelative: importedModule.startsWith('.'),
        lineNumber,
      });
      return imports;
    }

    // import ... statements (single or multiple)
    const importRegex = /^import\s+(.+)$/;
    const importMatch = line.match(importRegex);
    if (importMatch) {
      const importsList = importMatch[1];
      // Handle multiple imports: import os, sys, json
      const moduleNames = importsList.split(',').map((m) => m.trim().split(' as ')[0].trim());
      for (const moduleName of moduleNames) {
        if (moduleName) {
          imports.push({
            sourceFile,
            importedModule: this.normalizePythonImport(moduleName, sourceFile),
            importType: 'static',
            isRelative: moduleName.startsWith('.'),
            lineNumber,
          });
        }
      }
    }

    return imports;
  }

  private normalizePythonImport(importedModule: string, sourceFile: string): string {
    // Convert relative imports to module paths
    if (importedModule.startsWith('.')) {
      // Count the number of dots for relative depth
      let depth = 0;
      let moduleName = importedModule;
      while (moduleName.startsWith('.')) {
        depth++;
        moduleName = moduleName.slice(1);
      }

      // Get the directory of the source file
      const sourceDir = sourceFile.substring(0, sourceFile.lastIndexOf('/'));
      const dirParts = sourceDir.split('/');

      // Go up the directory tree based on depth
      const baseDir = dirParts.slice(0, Math.max(0, dirParts.length - depth + 1)).join('/');

      if (moduleName) {
        return `${baseDir}/${moduleName.replace(/\./g, '/')}`;
      }
      return baseDir;
    }

    // Convert dot notation to path notation for absolute imports
    return importedModule.replace(/\./g, '/');
  }
}

export function parsePython(filePath: string, content: string): ParsedFile {
  const parser = new PythonParser();
  return parser.parse(filePath, content);
}
