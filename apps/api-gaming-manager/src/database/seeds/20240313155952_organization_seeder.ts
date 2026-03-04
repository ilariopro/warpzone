import { Knex } from 'knex';

const reset = async (knex: Knex) => {
  await knex('organizationGame').del();
  await knex('organization').del();
};

export async function seed(knex: Knex): Promise<void> {
  await reset(knex);

  await knex('organization').insert([
    {
      id: '64329730-22f4-47ce-aeef-69531cdb3db9',
      name: 'Welcome to Warp Zone',
      email: null,
      description: null,
      createdAt: '2024-03-03 16:34:05',
      updatedAt: null,
    },
    {
      id: '57539d19-7c7d-4aab-b3a4-03919e0b6e32',
      name: 'Groovy Company',
      email: 'hello@groove.com',
      description: null,
      createdAt: '2024-05-20 20:29:45',
      updatedAt: null,
    },
    {
      id: '57539d19-7c7d-4aab-b3a4-03919e0b6e30',
      name: 'Almost Organized',
      email: 'almost@organized.com',
      description: null,
      createdAt: '2024-05-20 20:29:45',
      updatedAt: null,
    },
  ]);

  await knex('organizationGame').insert([
    {
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      activeUntil: null,
    },
    {
      gameId: 'hoopify-city',
      organizationId: '57539d19-7c7d-4aab-b3a4-03919e0b6e32',
      activeUntil: '2029-09-29 20:29:29',
    },
  ]);
}
