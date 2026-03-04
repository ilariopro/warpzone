import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('administrator', function (table) {
    table.uuid('id').primary();
    table.string('firstName', 255).notNullable();
    table.string('lastName', 255);
    table.string('email', 255).unique().notNullable();
    table.string('password', 255).notNullable();
    table.tinyint('role').unsigned().notNullable();
    table.uuid('organizationId').notNullable();
    table.boolean('isVerified').defaultTo(false);
    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt');

    table.foreign('organizationId').references('organization.id').onDelete('cascade');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('administrator');
}
