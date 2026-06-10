export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

export type LogPayload = {
  timestamp: string;
  level: LogLevel;
  message: unknown;
  context?: string;
  trace?: string;
  optionalParams?: unknown[];
};
