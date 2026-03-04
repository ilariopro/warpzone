/**
 * plugins
 */
export { errorHandler, type ErrorHandlerOpts } from './plugins/error-handler';
export { jwtAuth, type JwtAuthOpts } from './plugins/jwt-auth';
export { knex, type KnexOpts } from './plugins/knex';
export { mailer, type Email, type MailerOpts } from './plugins/mailer';
export { openApi, type OpenApiOpts } from './plugins/open-api';
export { security, type SecurityOpts } from './plugins/security';
