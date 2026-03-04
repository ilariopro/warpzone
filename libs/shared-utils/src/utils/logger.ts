import { pino, LoggerOptions } from 'pino';

type LoggerProps = {
  environment: string;
  asObject?: boolean;
};

const redact = [
  'address',
  'birthDate',
  'age',
  'companyName',
  'fiscalCode',
  'email',
  'firstName',
  'lastName',
  'legalName',
  'name',
  'password',
  'phone',
];

const loggerConfig = ({ environment, asObject = false }: LoggerProps) => {
  const options: LoggerOptions = {
    browser: { asObject },
    redact,
  };

  if (environment === 'development') {
    return {
      ...options,
      level: 'debug',
      transport: {
        target: 'pino-pretty',
      },
    };
  }

  if (environment === 'production' || environment === 'staging') {
    return {
      ...options,
      formatters: {
        level: (label: string) => ({ level: label.toUpperCase() }),
      },
      level: 'info',
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
    };
  }

  return;
};

const createLogger = (props: LoggerProps) => pino(loggerConfig(props));

export { createLogger, loggerConfig };
