import { Injectable, LoggerService } from '@nestjs/common';
import { LogLevel, LogPayload } from './logger.types';

@Injectable()
export class JsonLogger implements LoggerService {
  log(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    const { trace, context, rest } = this.extractErrorParams(optionalParams);

    console.error(this.formatMessage('error', message, rest, context, trace));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(this.formatMessage('warn', message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    console.debug(this.formatMessage('debug', message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    console.info(this.formatMessage('verbose', message, optionalParams));
  }

  formatMessage(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[] = [],
    context?: string,
    trace?: string,
  ): string {
    const payload: LogPayload = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context) {
      payload.context = context;
    }

    if (trace) {
      payload.trace = trace;
    }

    if (optionalParams.length > 0) {
      payload.optionalParams = optionalParams;
    }

    return JSON.stringify(payload);
  }

  private extractErrorParams(optionalParams: unknown[]): {
    trace?: string;
    context?: string;
    rest: unknown[];
  } {
    if (optionalParams.length === 0) {
      return { rest: [] };
    }

    const [first, second, ...restTail] = optionalParams;
    const trace = typeof first === 'string' ? first : undefined;
    const context = typeof second === 'string' ? second : undefined;

    return {
      trace,
      context,
      rest: [first, second, ...restTail].filter(
        (item) => item !== trace && item !== context,
      ),
    };
  }
}
