import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('match', function (table) {
    table.uuid('id').primary();
    table.uuid('playerId').notNullable();
    table.uuid('sessionId').notNullable();
    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('match');
}
