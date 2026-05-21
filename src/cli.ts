#!/usr/bin/env node

/**
 * DepGraph CLI - Main entry point.
 * A multi-language dependency graph analyzer.
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { analyze } from './controllers/analyze.js';
import { detectCyclesCmd } from './controllers/cycles.js';
import { report } from './controllers/report.js';
import { visualize } from './controllers/visualize.js';
import { focus } from './controllers/focus.js';
import { checkLayers } from './controllers/checkLayers.js';

const argv = yargs(hideBin(process.argv))
  .scriptName('depgraph')
  .version('0.1.0')
  .usage('depgraph <command> [options]')
  .command(
    'analyze <project>',
    'Build and display the dependency graph',
    (yargs) => {
      return yargs
        .positional('project', {
          describe: 'Path to the project directory',
          type: 'string',
          demandOption: true,
        })
        .option('language', {
          alias: 'l',
          describe: 'Language to analyze',
          type: 'string',
          choices: ['typescript', 'python', 'go'],
          default: 'typescript',
        })
        .option('exclude', {
          alias: 'e',
          describe: 'Patterns to exclude',
          type: 'array',
          default: [],
        })
        .option('format', {
          alias: 'f',
          describe: 'Output format',
          type: 'string',
          choices: ['text', 'json'],
          default: 'text',
        });
    },
    async (args) => {
      await analyze({
        projectPath: args.project as string,
        language: args.language as 'typescript' | 'python' | 'go',
        excludePatterns: args.exclude as string[],
        format: args.format as 'text' | 'json',
      });
    }
  )
  .command(
    'cycles <project>',
    'Detect and show circular dependencies',
    (yargs) => {
      return yargs
        .positional('project', {
          describe: 'Path to the project directory',
          type: 'string',
          demandOption: true,
        })
        .option('language', {
          alias: 'l',
          describe: 'Language to analyze',
          type: 'string',
          choices: ['typescript', 'python', 'go'],
          default: 'typescript',
        })
        .option('exclude', {
          alias: 'e',
          describe: 'Patterns to exclude',
          type: 'array',
          default: [],
        })
        .option('format', {
          alias: 'f',
          describe: 'Output format',
          type: 'string',
          choices: ['text', 'json'],
          default: 'text',
        });
    },
    async (args) => {
      await detectCyclesCmd({
        projectPath: args.project as string,
        language: args.language as 'typescript' | 'python' | 'go',
        excludePatterns: args.exclude as string[],
        format: args.format as 'text' | 'json',
      });
    }
  )
  .command(
    'report <project>',
    'Generate a comprehensive text report',
    (yargs) => {
      return yargs
        .positional('project', {
          describe: 'Path to the project directory',
          type: 'string',
          demandOption: true,
        })
        .option('language', {
          alias: 'l',
          describe: 'Language to analyze',
          type: 'string',
          choices: ['typescript', 'python', 'go'],
          default: 'typescript',
        })
        .option('exclude', {
          alias: 'e',
          describe: 'Patterns to exclude',
          type: 'array',
          default: [],
        })
        .option('format', {
          alias: 'f',
          describe: 'Output format',
          type: 'string',
          choices: ['text', 'json'],
          default: 'text',
        });
    },
    async (args) => {
      await report({
        projectPath: args.project as string,
        language: args.language as 'typescript' | 'python' | 'go',
        excludePatterns: args.exclude as string[],
        format: args.format as 'text' | 'json',
      });
    }
  )
  .command(
    'visualize <project>',
    'Output graph in visual formats',
    (yargs) => {
      return yargs
        .positional('project', {
          describe: 'Path to the project directory',
          type: 'string',
          demandOption: true,
        })
        .option('language', {
          alias: 'l',
          describe: 'Language to analyze',
          type: 'string',
          choices: ['typescript', 'python', 'go'],
          default: 'typescript',
        })
        .option('format', {
          alias: 'f',
          describe: 'Output format',
          type: 'string',
          choices: ['dot', 'mermaid', 'json', 'csv'],
          default: 'mermaid',
        })
        .option('output', {
          alias: 'o',
          describe: 'Output file path',
          type: 'string',
        })
        .option('exclude', {
          alias: 'e',
          describe: 'Patterns to exclude',
          type: 'array',
          default: [],
        });
    },
    async (args) => {
      await visualize({
        projectPath: args.project as string,
        language: args.language as 'typescript' | 'python' | 'go',
        format: args.format as 'dot' | 'mermaid' | 'json' | 'csv',
        output: args.output as string,
        excludePatterns: args.exclude as string[],
      });
    }
  )
  .command(
    'focus <project>',
    'Show dependency tree for a specific module',
    (yargs) => {
      return yargs
        .positional('project', {
          describe: 'Path to the project directory',
          type: 'string',
          demandOption: true,
        })
        .option('module', {
          alias: 'm',
          describe: 'Module to focus on',
          type: 'string',
          demandOption: true,
        })
        .option('language', {
          alias: 'l',
          describe: 'Language to analyze',
          type: 'string',
          choices: ['typescript', 'python', 'go'],
          default: 'typescript',
        })
        .option('depth', {
          alias: 'd',
          describe: 'Maximum depth of the tree',
          type: 'number',
          default: 5,
        })
        .option('format', {
          alias: 'f',
          describe: 'Output format',
          type: 'string',
          choices: ['text', 'json'],
          default: 'text',
        })
        .option('exclude', {
          alias: 'e',
          describe: 'Patterns to exclude',
          type: 'array',
          default: [],
        });
    },
    async (args) => {
      await focus({
        projectPath: args.project as string,
        module: args.module as string,
        language: args.language as 'typescript' | 'python' | 'go',
        depth: args.depth as number,
        format: args.format as 'text' | 'json',
        excludePatterns: args.exclude as string[],
      });
    }
  )
  .command(
    'check-layers <project>',
    'Verify layer rules',
    (yargs) => {
      return yargs
        .positional('project', {
          describe: 'Path to the project directory',
          type: 'string',
          demandOption: true,
        })
        .option('rules', {
          alias: 'r',
          describe: 'Path to layer rules JSON file',
          type: 'string',
          demandOption: true,
        })
        .option('language', {
          alias: 'l',
          describe: 'Language to analyze',
          type: 'string',
          choices: ['typescript', 'python', 'go'],
          default: 'typescript',
        })
        .option('exclude', {
          alias: 'e',
          describe: 'Patterns to exclude',
          type: 'array',
          default: [],
        });
    },
    async (args) => {
      await checkLayers({
        projectPath: args.project as string,
        language: args.language as 'typescript' | 'python' | 'go',
        rulesFile: args.rules as string,
        excludePatterns: args.exclude as string[],
      });
    }
  )
  .demandCommand(1, 'You need to specify a command')
  .strict()
  .fail((msg, err, yargs) => {
    if (msg) {
      console.error(`depgraph: ${msg}`);
    }
    if (err) {
      console.error(`depgraph: ${err.message}`);
    }
    console.error(yargs.help());
    process.exit(1);
  })
  .recommendCommands()
  .help('h')
  .alias('h', 'help')
  .epilogue('DepGraph - Multi-language dependency graph analyzer\n\nFor more info: https://github.com/rogerchappel/depgraph')
  .parse();
