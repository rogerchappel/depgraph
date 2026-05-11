/**
 * Go import parser.
 * Handles: import statements (single and grouped)
 */

import { ParsedFile, ImportInfo } from '../models/graph.js';
import { FileParser } from './base.js';

export class GoParser implements FileParser {
  private inImportBlock = false;

  parse(filePath: string, content: string): ParsedFile {
    const imports: ImportInfo[] = [];
    const lines = content.split('\n');
    this.inImportBlock = false;

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
    return ['.go'];
  }

  private extractImportsFromLine(
    line: string,
    sourceFile: string,
    lineNumber: number
  ): ImportInfo[] {
    const imports: ImportInfo[] = [];

    // Skip empty lines and comments
    if (line === '' || line.startsWith('//') || line.startsWith('/*')) {
      return imports;
    }

    // Check for import block start: import (
    if (line === 'import (' || line.startsWith('import(')) {
      this.inImportBlock = true;
      return imports;
    }

    // Check for import block end: )
    if (this.inImportBlock && line === ')') {
      this.inImportBlock = false;
      return imports;
    }

    // Single import statement: import "package"
    const singleImportRegex = /^import\s+"([^"]+)"/;
    const singleMatch = line.match(singleImportRegex);
    if (singleMatch) {
      const importedModule = singleMatch[1];
      imports.push({
        sourceFile,
        importedModule: importedModule,
        importType: 'static',
        isRelative: !this.isStandardLibrary(importedModule),
        lineNumber,
      });
      return imports;
    }

    // Inside import block: "package" or alias "package"
    if (this.inImportBlock) {
      const blockImportRegex = /(?:(\w+)\s+)?"([^"]+)"/;
      const blockMatch = line.match(blockImportRegex);
      if (blockMatch) {
        const importedModule = blockMatch[2];
        imports.push({
          sourceFile,
          importedModule: importedModule,
          importType: 'static',
          isRelative: !this.isStandardLibrary(importedModule),
          lineNumber,
        });
      }
    }

    return imports;
  }

  private isStandardLibrary(pkg: string): boolean {
    // Standard library packages don't contain dots and aren't github.com, etc.
    const parts = pkg.split('/');
    if (parts.length === 1) {
      // Single word like "fmt", "os", "net/http"
      return true;
    }
    // Standard library can have subpackages like "net/http"
    const firstPart = parts[0];
    return !firstPart.includes('.') && !firstPart.includes(':') && firstPart === firstPart.toLowerCase();
  }
}

export function parseGo(filePath: string, content: string): ParsedFile {
  const parser = new GoParser();
  return parser.parse(filePath, content);
}
