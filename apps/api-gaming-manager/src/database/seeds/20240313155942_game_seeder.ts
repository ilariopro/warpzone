import { Knex } from 'knex';

const reset = async (knex: Knex) => {
  await knex('game').del();
};

export async function seed(knex: Knex): Promise<void> {
  await reset(knex);

  await knex('game').insert([
    {
      id: 'hoopify-city',
      title: 'Hoopify City',
      hasScheduledSessions: true,
      hasTeams: true,
      createdAt: '2024-03-03 16:34:05',
      updatedAt: null,
    },
  ]);
}
