/**
 * File system walker with language filtering and exclude patterns.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { isExcluded } from './base.js';

export interface WalkerOptions {
  language: 'typescript' | 'python' | 'go';
  excludePatterns?: string[];
  includePatterns?: string[];
}

const LANGUAGE_EXTENSIONS: Record<string, string[]> = {
  typescript: ['.ts', '.tsx', '.js', '.jsx'],
  python: ['.py'],
  go: ['.go'],
};

/**
 * Walk a directory recursively and return all matching source files.
 */
export async function walkDirectory(
  projectRoot: string,
  options: WalkerOptions
): Promise<string[]> {
  const extensions = LANGUAGE_EXTENSIONS[options.language] || [];
  const excludePatterns = options.excludePatterns || DEFAULT_EXCLUDES;
  const files: string[] = [];

  await walkDir(projectRoot, projectRoot, extensions, excludePatterns, files);

  return files.sort();
}

const DEFAULT_EXCLUDES = [
  'node_modules',
  '__pycache__',
  '.git',
  'dist',
  'build',
  'vendor',
  '.venv',
  'venv',
];

async function walkDir(
  currentDir: string,
  projectRoot: string,
  extensions: string[],
  excludePatterns: string[],
  files: string[]
): Promise<void> {
  let entries: fs.Dirent[];

  try {
    entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(projectRoot, fullPath);

    // Skip excluded directories/files
    if (isExcluded(relativePath, excludePatterns) || isExcluded(entry.name, excludePatterns)) {
      continue;
    }

    if (entry.isDirectory()) {
      await walkDir(fullPath, projectRoot, extensions, excludePatterns, files);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
}

/**
 * Read file content.
 */
export async function readFile(filePath: string): Promise<string> {
  return fs.promises.readFile(filePath, 'utf-8');
}
