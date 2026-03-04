export const applicationName = 'api-gaming-mananger';

export const applicationHost = process.env.APP_HOST ?? '0.0.0.0';

export const applicationPort = Number(process.env.APP_PORT ?? 3000);

export const applicationVersion = '0.1.0-alpha';

export const cryptoSalt = 10;

export const environment = process.env.ENVIRONMENT;

export const cookieExpiration = '7d';

export const cookieSecret = process.env.SECRET_COOKIE;

export const corsOrigins = process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost'];

export const defaultPagination = 25;

export const defaultBcc = [''];

export const defaultFrom = '';

export const jwtExpiration = '10m';

export const jwtSecret = process.env.SECRET_JWT;

export const mailerEncryption = Boolean(process.env.MAIL_ENCRYPTION);

export const mailerHost = process.env.MAIL_HOST;

export const mailerPort = Number(process.env.MAIL_PORT);

export const mailerUsername = process.env.MAIL_USERNAME;

export const mailerPassword = process.env.MAIL_PASSWORD;
