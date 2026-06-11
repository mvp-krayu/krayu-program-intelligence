import * as winston from 'winston';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const fleetLogFormat = printf(({ level, message, timestamp, context, correlationId, ...meta }) => {
  const ctx = context ? `[${context}]` : '';
  const cid = correlationId ? `{${correlationId}}` : '';
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} ${level} ${ctx}${cid} ${message}${metaStr}`;
});

const jsonFormat = combine(timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), errors({ stack: true }), json());
const consoleFormat = combine(colorize({ all: true }), timestamp({ format: 'HH:mm:ss.SSS' }), errors({ stack: true }), fleetLogFormat);

export function createWinstonLogger(env: string = 'development'): winston.Logger {
  return winston.createLogger({
    level: env === 'production' ? 'info' : 'debug',
    defaultMeta: { service: 'blue-edge-fleet-api', version: '2.13.0' },
    transports: [
      new winston.transports.Console({
        level: env === 'production' ? 'info' : 'debug',
        format: env === 'production' ? jsonFormat : consoleFormat,
      }),
    ],
    exitOnError: false,
  });
}

export function getWinstonModuleOptions() {
  const env = process.env.NODE_ENV || 'development';
  return {
    level: env === 'production' ? 'info' : 'debug',
    defaultMeta: { service: 'blue-edge-fleet-api', version: '2.13.0' },
    transports: [
      new winston.transports.Console({
        level: env === 'production' ? 'info' : 'debug',
        format: env === 'production' ? jsonFormat : consoleFormat,
      }),
    ],
    exitOnError: false,
  };
}
