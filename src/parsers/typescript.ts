/**
 * TypeScript/JavaScript import parser.
 * Handles: import, require(), dynamic import()
 */

import { ParsedFile, ImportInfo } from '../models/graph.js';
import { FileParser, normalizeModulePath } from './base.js';

export class TypeScriptParser implements FileParser {
  parse(filePath: string, content: string): ParsedFile {
    const imports: ImportInfo[] = [];
    const lines = content.split('\n');

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];
      const lineImports = this.extractImportsFromLine(line, filePath, lineNum + 1);
      imports.push(...lineImports);
    }

    return {
      filePath,
      imports,
    };
  }

  getSupportedExtensions(): string[] {
    return ['.ts', '.tsx', '.js', '.jsx'];
  }

  private extractImportsFromLine(
    line: string,
    sourceFile: string,
    lineNumber: number
  ): ImportInfo[] {
    const imports: ImportInfo[] = [];

    // Static imports: import ... from 'module'
    const staticImportRegex = /import\s+(?:[\w\s{},*]*\s+from\s+)?['"]([^'"]+)['"]/g;
    let match;
    while ((match = staticImportRegex.exec(line)) !== null) {
      const importedModule = match[1];
      imports.push({
        sourceFile,
        importedModule,
        importType: 'static',
        isRelative: importedModule.startsWith('.'),
        lineNumber,
      });
    }

    // require() calls: require('module')
    const requireRegex = /(?:const|let|var)\s+[\w{},=\s*]*\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = requireRegex.exec(line)) !== null) {
      const importedModule = match[1];
      imports.push({
        sourceFile,
        importedModule,
        importType: 'require',
        isRelative: importedModule.startsWith('.'),
        lineNumber,
      });
    }

    // Dynamic imports: import('module')
    const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((match = dynamicImportRegex.exec(line)) !== null) {
      const importedModule = match[1];
      imports.push({
        sourceFile,
        importedModule,
        importType: 'dynamic',
        isRelative: importedModule.startsWith('.'),
        lineNumber,
      });
    }

    return imports;
  }
}

export function parseTypeScript(filePath: string, content: string): ParsedFile {
  const parser = new TypeScriptParser();
  return parser.parse(filePath, content);
}
