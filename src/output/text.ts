/**
 * Human-readable text output formatter.
 */

import { AnalysisResult, CyclePath, ModuleMetrics } from '../models/graph.js';
import { nodeCount, edgeCount } from '../engine/graph.js';

/**
 * Format full analysis result as text.
 */
export function formatAnalysis(result: AnalysisResult): string {
  const lines: string[] = [];

  lines.push('═'.repeat(60));
  lines.push('DepGraph Analysis Report');
  lines.push('═'.repeat(60));
  lines.push('');

  // Summary
  lines.push('📊 Summary');
  lines.push('─'.repeat(40));
  lines.push(`Language:     ${result.language}`);
  lines.push(`Total files:  ${result.totalFiles}`);
  lines.push(`Total imports: ${result.totalImports}`);
  lines.push(`Graph nodes:  ${nodeCount(result.graph)}`);
  lines.push(`Graph edges:  ${edgeCount(result.graph)}`);
  lines.push('');

  // Cycles
  if (result.cycles.length > 0) {
    lines.push('🔄 Circular Dependencies');
    lines.push('─'.repeat(40));
    lines.push(`Found ${result.cycles.length} cycle(s):\n`);
    for (let i = 0; i < result.cycles.length; i++) {
      lines.push(`  Cycle ${i + 1} (${result.cycles[i].length} modules):`);
      lines.push(`    ${result.cycles[i].modules.join(' → ')}`);
      lines.push('');
    }
  } else {
    lines.push('✅ No circular dependencies detected');
    lines.push('');
  }

  // Top metrics
  if (result.metrics.length > 0) {
    lines.push('📈 Coupling Metrics (Top 10 by instability)');
    lines.push('─'.repeat(40));
    lines.push(formatMetricsTable(result.metrics.slice(0, 10)));
    lines.push('');
  }

  lines.push('═'.repeat(60));

  return lines.join('\n');
}

/**
 * Format cycles as text.
 */
export function formatCycles(cycles: CyclePath[]): string {
  const lines: string[] = [];

  if (cycles.length === 0) {
    lines.push('✅ No circular dependencies detected');
    return lines.join('\n');
  }

  lines.push(`Found ${cycles.length} circular dependency(ies):\n`);

  for (let i = 0; i < cycles.length; i++) {
    lines.push(`Cycle ${i + 1} (${cycles[i].length} modules):`);
    lines.push(`  ${cycles[i].modules.join(' → ')}`);
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format a report summary as text.
 */
export function formatReport(result: AnalysisResult): string {
  const lines: string[] = [];

  lines.push('DepGraph Report');
  lines.push('');
  lines.push(`Language: ${result.language}`);
  lines.push(`Files analyzed: ${result.totalFiles}`);
  lines.push(`Internal imports: ${result.totalImports}`);
  lines.push(`Modules: ${nodeCount(result.graph)}`);
  lines.push(`Dependencies: ${edgeCount(result.graph)}`);
  lines.push(`Cycles: ${result.cycles.length}`);
  lines.push('');

  if (result.metrics.length > 0) {
    const avgInstability = result.metrics.reduce((sum, m) => sum + m.instability, 0) / result.metrics.length;
    lines.push(`Average instability: ${avgInstability.toFixed(3)}`);
    lines.push('');

    const mostUnstable = result.metrics.slice(0, 5);
    lines.push('Most unstable modules:');
    for (const m of mostUnstable) {
      lines.push(`  ${m.moduleId} (I=${m.instability.toFixed(3)}, Ca=${m.afferentCoupling}, Ce=${m.efferentCoupling})`);
    }
    lines.push('');
  }

  if (result.cycles.length > 0) {
    lines.push('Circular dependencies:');
    for (const cycle of result.cycles) {
      lines.push(`  ${cycle.modules.join(' → ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format metrics as an ASCII table.
 */
function formatMetricsTable(metrics: ModuleMetrics[]): string {
  const lines: string[] = [];

  // Header
  lines.push(formatTableRow('Module', 'Ca', 'Ce', 'Instability'));
  lines.push(formatTableRow('─'.repeat(40), '───', '───', '───────────'));

  // Data
  for (const m of metrics) {
    lines.push(formatTableRow(
      truncateModuleId(m.moduleId, 40),
      m.afferentCoupling.toString(),
      m.efferentCoupling.toString(),
      m.instability.toFixed(3)
    ));
  }

  return lines.join('\n');
}

function formatTableRow(col1: string, col2: string, col3: string, col4: string): string {
  const pad1 = col1.padEnd(40);
  const pad2 = col2.padStart(3);
  const pad3 = col3.padStart(3);
  const pad4 = col4.padStart(11);
  return `${pad1} ${pad2} ${pad3} ${pad4}`;
}

function truncateModuleId(id: string, maxLen: number): string {
  if (id.length <= maxLen) return id;
  return '...' + id.slice(-(maxLen - 3));
}
