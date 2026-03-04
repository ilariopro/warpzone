import type { Knex } from 'knex';

const knexConfig: Knex.Config = {
  client: 'mysql2',
  connection: {
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST, // '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 3306),
    password: process.env.DATABASE_PASSWORD,
    user: process.env.DATABASE_USER,
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './seeds',
    extension: 'ts',
  },
};

export default knexConfig;
export { knexConfig };
