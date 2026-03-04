import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('game', function (table) {
    table.string('id', 70).primary();
    table.string('title', 255).notNullable();
    table.boolean('hasScheduledSessions').defaultTo(true);
    table.boolean('hasTeams').defaultTo(true);
    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('game');
}
