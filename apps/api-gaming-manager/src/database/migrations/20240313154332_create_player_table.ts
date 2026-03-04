import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('player', function (table) {
    table.uuid('id').primary();
    table.string('email', 255).notNullable();
    table.string('name', 255);
    table.uuid('organizationId').notNullable();
    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt');

    table.foreign('organizationId').references('organization.id').onDelete('cascade');

    table.unique(['email', 'organizationId'], { useConstraint: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('player');
}
