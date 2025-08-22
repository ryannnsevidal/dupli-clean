import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
    },
  },
});

export function createRequestLogger(requestId: string) {
  return logger.child({ requestId });
}

export function logError(error: Error, context?: Record<string, any>) {
  logger.error({ error: error.message, stack: error.stack, ...context });
}

export function logInfo(message: string, context?: Record<string, any>) {
  logger.info({ message, ...context });
}

export function logWarn(message: string, context?: Record<string, any>) {
  logger.warn({ message, ...context });
}
