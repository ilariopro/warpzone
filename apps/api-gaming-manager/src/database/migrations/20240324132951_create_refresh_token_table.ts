import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('refreshToken', function (table) {
    table.bigIncrements('id').unsigned();
    table.uuid('userId').notNullable();
    table.text('token', 'longtext').notNullable();
    table.string('family', 50).notNullable();
    table.timestamp('issuedAt').notNullable();
    table.timestamp('expireAt').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('refreshToken');
}
