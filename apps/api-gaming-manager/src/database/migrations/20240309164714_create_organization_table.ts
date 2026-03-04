import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('organization', function (table) {
      table.uuid('id').primary();
      table.string('name', 255).notNullable();
      table.string('email', 255).unique();
      table.text('description');
      table.timestamp('createdAt').notNullable();
      table.timestamp('updatedAt');
    })
    .createTable('organizationGame', function (table) {
      table.uuid('gameId').notNullable();
      table.uuid('organizationId').notNullable();
      table.timestamp('activeUntil');

      table.foreign('gameId').references('game.id').onDelete('cascade');
      table.foreign('organizationId').references('organization.id').onDelete('cascade');

      table.index(['gameId', 'organizationId']);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('organizationGame').dropTable('organization');
}
