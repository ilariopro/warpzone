import { Knex } from 'knex';

const reset = async (knex: Knex) => {
  await knex('match').del();
};

export async function seed(knex: Knex): Promise<void> {
  await reset(knex);

  await knex('match').insert([
    {
      id: '5f48be90-238d-4c4e-8775-5a35c6dab1d9',
      playerId: '7c85ffe0-c212-4e62-932a-69cc1f874b47',
      sessionId: '20afcf69-12bf-4fcf-904e-e5c1eff97703',
      createdAt: '2024-03-11 12:09:01',
      updatedAt: '2024-03-11 12:25:16',
    },
    {
      id: '23df826c-6eab-4e3c-8f6d-d1433d32afc8',
      playerId: '7c85ffe0-c212-4e62-932a-69cc1f874b47',
      sessionId: '1a5c9d5c-7e1a-4ec9-9587-5e09192c72ce',
      createdAt: '2024-03-12 12:52:20',
      updatedAt: '2024-03-12 13:24:15',
    },
  ]);
}
