// Logger utility - no internal dependencies (leaf node)
export class Logger {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  info(message: string): void {
    console.log(`[${this.prefix}] INFO: ${message}`);
  }

  error(message: string): void {
    console.error(`[${this.prefix}] ERROR: ${message}`);
  }

  warn(message: string): void {
    console.warn(`[${this.prefix}] WARN: ${message}`);
  }
}
