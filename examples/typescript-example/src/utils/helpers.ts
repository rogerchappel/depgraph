// Helper utilities
import { Logger } from './logger';

const logger = new Logger('Helpers');

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function generateId(): string {
  return Math.random().toString(36).slice(2);
}

export function debounce(fn: Function, delay: number): Function {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
