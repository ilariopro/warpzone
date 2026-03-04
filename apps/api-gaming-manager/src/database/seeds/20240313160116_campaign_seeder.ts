import { Knex } from 'knex';

const reset = async (knex: Knex) => {
  await knex('campaignPlayer').del();
  await knex('campaign').del();
};

export async function seed(knex: Knex): Promise<void> {
  await reset(knex);

  await knex('campaign').insert([
    {
      id: '02aeeb03-54ed-4ba8-ba45-838079023380',
      title: 'The great Warp Zone campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-03-05 17:35:07',
      updatedAt: '2024-03-13 18:44:17',
    },
    {
      id: '57539d19-7c7d-4aab-b3a4-03919e0b6e30',
      title: 'My Aquamarine Scallop Campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-03-05 17:35:07',
      updatedAt: '2024-03-13 18:44:17',
    },
    {
      id: '4b316de2-b832-4318-9b6e-7d4f220b7d15',
      title: 'Great Amaranth Starfish Campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-05-22 20:05:17',
      updatedAt: '2024-05-22 20:05:18',
    },
    {
      id: '521cafe0-7c42-4419-977e-82fc3b0d05c5',
      title: 'Lucky Amethyst Planarian Campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-05-22 20:05:27',
      updatedAt: '2024-05-22 20:05:28',
    },
    {
      id: '5dd66cef-5893-45f9-91f1-21d89f8640f3',
      title: 'Welcome To Red Beetle Campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-05-21 20:11:22',
      updatedAt: null,
    },
    {
      id: '843bf425-ae1b-47a6-9254-b58d23f60c05',
      title: 'Amazing Chocolate Wildfowl Campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-05-21 20:13:20',
      updatedAt: '2024-05-21 20:13:25',
    },
    {
      id: '84704cc6-5d5e-4195-9ef2-62098e4ebaa1',
      title: 'My Jade Gibbon Campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-05-23 17:32:29',
      updatedAt: null,
    },
    {
      id: '8603bd86-9807-4dce-9f81-4d7415883cb1',
      title: 'Amazing Indigo Hookworm Campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-05-22 20:05:23',
      updatedAt: '2024-05-22 20:05:23',
    },
    {
      id: '886f0237-27a0-457d-b9e9-c6a81644db1f',
      title: 'The Apricot Skink Campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-05-21 20:09:16',
      updatedAt: '2024-05-21 20:09:17',
    },
    {
      id: '9350a61b-e601-4248-a669-5894bb5b5427',
      title: 'New Amethyst Flea Campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-05-22 09:41:02',
      updatedAt: null,
    },
    {
      id: 'c5b26c4f-95e3-498f-b1bf-d980dc17c78e',
      title: 'New Scarlet Jaguar Campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-05-22 20:05:20',
      updatedAt: '2024-05-22 20:05:20',
    },
    {
      id: 'd32bffd0-570f-4bec-a37f-7e5a2459c8e1',
      title: 'Super Silver Bear Campaign',
      gameId: 'hoopify-city',
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      createdAt: '2024-05-22 10:40:49',
      updatedAt: null,
    },
  ]);

  // TODO add more entries
  await knex('campaignPlayer').insert([
    {
      campaignId: '02aeeb03-54ed-4ba8-ba45-838079023380',
      playerId: '7c85ffe0-c212-4e62-932a-69cc1f874b47',
      team: null,
      notifiedAt: null,
    },
  ]);
}
