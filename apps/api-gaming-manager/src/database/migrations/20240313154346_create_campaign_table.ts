import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('campaign', function (table) {
      table.uuid('id').primary();
      table.string('title', 255).notNullable();
      table.uuid('gameId').notNullable();
      table.uuid('organizationId').notNullable();
      table.timestamp('createdAt').notNullable();
      table.timestamp('updatedAt');

      table.foreign('gameId').references('game.id').onDelete('cascade');
      table.foreign('organizationId').references('organization.id').onDelete('cascade');
    })
    .createTable('campaignPlayer', function (table) {
      table.uuid('campaignId').notNullable();
      table.uuid('playerId').notNullable();
      table.string('team', 255);
      table.timestamp('notifiedAt');

      table.foreign('campaignId').references('campaign.id').onDelete('cascade');
      table.foreign('playerId').references('player.id').onDelete('cascade');

      table.index(['campaignId', 'playerId']);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('campaignPlayer').dropTable('campaign');
}
