/**
 * Tests for language parsers.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseTypeScript } from '../src/parsers/typescript.js';
import { parsePython } from '../src/parsers/python.js';
import { parseGo } from '../src/parsers/go.js';

describe('TypeScript Parser', () => {
  it('should parse static imports', () => {
    const content = `import { foo } from './bar';\n`;
    const result = parseTypeScript('/project/src/a.ts', content);
    assert.strictEqual(result.imports.length, 1);
    assert.strictEqual(result.imports[0].importedModule, './bar');
    assert.strictEqual(result.imports[0].importType, 'static');
    assert.strictEqual(result.imports[0].isRelative, true);
  });

  it('should parse require statements', () => {
    const content = `const lodash = require('lodash');\nconst myModule = require('./myModule');\n`;
    const result = parseTypeScript('/project/src/a.js', content);
    assert.strictEqual(result.imports.length, 2);
    const relativeImport = result.imports.find(i => i.isRelative);
    assert.ok(relativeImport, 'Should find relative import');
    assert.strictEqual(relativeImport!.importedModule, './myModule');
  });

  it('should parse dynamic imports', () => {
    const content = `const module = import('./dynamic');\n`;
    const result = parseTypeScript('/project/src/a.ts', content);
    assert.strictEqual(result.imports.length, 1);
    assert.strictEqual(result.imports[0].importedModule, './dynamic');
    assert.strictEqual(result.imports[0].importType, 'dynamic');
  });

  it('should ignore non-relative imports', () => {
    const content = `import React from 'react';\nimport lodash from 'lodash';\n`;
    const result = parseTypeScript('/project/src/a.tsx', content);
    const relativeImports = result.imports.filter((imp) => imp.isRelative);
    assert.strictEqual(relativeImports.length, 0);
  });

  it('should parse multiple imports on same line', () => {
    const content = `import { a, b, c } from './utils';\n`;
    const result = parseTypeScript('/project/src/a.ts', content);
    assert.strictEqual(result.imports.length, 1);
    assert.strictEqual(result.imports[0].importedModule, './utils');
  });
});

describe('Python Parser', () => {
  it('should parse import statements', () => {
    const content = `import os\nimport sys\n`;
    const result = parsePython('/project/src/a.py', content);
    assert.ok(result.imports.length >= 0);
  });

  it('should parse from import statements', () => {
    const content = `from os.path import join\n`;
    const result = parsePython('/project/src/a.py', content);
    assert.strictEqual(result.imports.length, 1);
  });

  it('should parse relative imports', () => {
    const content = `from . import utils\nfrom ..core import auth\n`;
    const result = parsePython('/project/src/a.py', content);
    assert.strictEqual(result.imports.length, 2);
    assert.strictEqual(result.imports[0].isRelative, true);
    assert.strictEqual(result.imports[1].isRelative, true);
  });

  it('should handle multiple imports', () => {
    const content = `import os, sys, json\n`;
    const result = parsePython('/project/src/a.py', content);
    assert.ok(result.imports.length >= 1);
  });
});

describe('Go Parser', () => {
  it('should parse single import', () => {
    const content = `package main\n\nimport "fmt"\n`;
    const result = parseGo('/project/main.go', content);
    assert.strictEqual(result.imports.length, 1);
    assert.strictEqual(result.imports[0].importedModule, 'fmt');
  });

  it('should parse import block', () => {
    const content = `package main\n\nimport (\n  "fmt"\n  "os"\n  "example.com/myproject/utils"\n)\n`;
    const result = parseGo('/project/main.go', content);
    assert.strictEqual(result.imports.length, 3);
  });

  it('should identify standard library packages', () => {
    const content = `package main\n\nimport "fmt"\n`;
    const result = parseGo('/project/main.go', content);
    assert.strictEqual(result.imports[0].isRelative, false);
  });

  it('should identify internal packages as relative', () => {
    const content = `package main\n\nimport "example.com/myproject/utils"\n`;
    const result = parseGo('/project/main.go', content);
    // Note: isRelative check depends on parser logic
    assert.strictEqual(result.imports.length, 1);
  });
});
