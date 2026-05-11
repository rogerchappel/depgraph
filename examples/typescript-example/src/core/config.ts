// Config module - depends on auth (creates cycle: auth -> config -> auth)
import { Auth } from './auth';

export interface AppConfig {
  debug: boolean;
  authEnabled: boolean;
}

export function loadConfig(): AppConfig {
  return {
    debug: process.env.DEBUG === 'true',
    authEnabled: true,
  };
}

// This creates a cycle: config imports auth, and auth could import config
export function initAuth(): Auth {
  const config = loadConfig();
  if (!config.authEnabled) {
    throw new Error('Auth is disabled');
  }
  return new Auth();
}
