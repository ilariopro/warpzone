import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('session', function (table) {
    table.uuid('id').primary();
    table.timestamp('startAt');
    table.timestamp('endAt');
    table.uuid('campaignId').notNullable();
    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt');

    table.foreign('campaignId').references('campaign.id').onDelete('cascade');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('session');
}
