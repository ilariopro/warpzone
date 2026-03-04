import { Knex } from 'knex';

const reset = async (knex: Knex) => {
  await knex('session').del();
};

export async function seed(knex: Knex): Promise<void> {
  await reset(knex);

  await knex('session').insert([
    {
      id: '20afcf69-12bf-4fcf-904e-e5c1eff97703',
      startAt: '2024-03-11 12:00:00',
      endAt: '2024-03-11 14:00:00',
      campaignId: '02aeeb03-54ed-4ba8-ba45-838079023380',
      createdAt: '2024-03-05 17:44:05',
      updatedAt: null,
    },
    {
      id: '1a5c9d5c-7e1a-4ec9-9587-5e09192c72ce',
      startAt: '2024-03-12 12:00:00',
      endAt: '2024-03-12 14:00:00',
      campaignId: '02aeeb03-54ed-4ba8-ba45-838079023380',
      createdAt: '2024-03-06 17:34:05',
      updatedAt: '2024-03-07 12:43:11',
    },
    {
      id: '00227a10-afcb-4dda-9292-6e0dc03b8ce2',
      startAt: '2024-05-21 20:03:35',
      endAt: '2024-05-21 21:03:35',
      campaignId: '57539d19-7c7d-4aab-b3a4-03919e0b6e30',
      createdAt: '2024-05-21 20:03:35',
      updatedAt: null,
    },
    {
      id: '480f7d43-4e58-445f-8995-ad4b28e98ab2',
      startAt: '2024-05-21 20:13:22',
      endAt: '2024-05-21 21:13:22',
      campaignId: '843bf425-ae1b-47a6-9254-b58d23f60c05',
      createdAt: '2024-05-21 20:13:23',
      updatedAt: null,
    },
    {
      id: '7e367e6c-7285-42be-97c5-86dc07adeee6',
      startAt: '2024-05-22 09:34:18',
      endAt: '2024-05-22 10:34:18',
      campaignId: '57539d19-7c7d-4aab-b3a4-03919e0b6e30',
      createdAt: '2024-05-22 09:34:19',
      updatedAt: null,
    },
    {
      id: 'a1928b46-3302-4b3b-ac2c-0d9c3401f700',
      startAt: '2024-05-22 09:41:04',
      endAt: '2024-05-22 10:41:04',
      campaignId: '9350a61b-e601-4248-a669-5894bb5b5427',
      createdAt: '2024-05-22 09:41:05',
      updatedAt: null,
    },
    {
      id: 'a73edd18-36e5-4eae-a9c8-a984cca0879c',
      startAt: '2024-05-15 18:09:00',
      endAt: '2024-05-15 19:09:00',
      campaignId: '886f0237-27a0-457d-b9e9-c6a81644db1f',
      createdAt: '2024-05-21 20:09:21',
      updatedAt: '2024-05-21 20:09:33',
    },
    {
      id: 'c6920dfb-0adc-4e3e-8c36-130a1ea25ccb',
      startAt: '2024-05-21 20:09:22',
      endAt: '2024-05-21 21:09:22',
      campaignId: '886f0237-27a0-457d-b9e9-c6a81644db1f',
      createdAt: '2024-05-21 20:09:23',
      updatedAt: null,
    },
    {
      id: 'd0c68f55-d55e-4671-9d59-7cdba076366f',
      startAt: '2024-05-21 20:03:30',
      endAt: '2024-05-21 21:03:30',
      campaignId: '57539d19-7c7d-4aab-b3a4-03919e0b6e30',
      createdAt: '2024-05-21 20:03:32',
      updatedAt: null,
    },
    {
      id: 'd68fdfb1-d9a4-41e5-9fd1-86a4f75f904c',
      startAt: '2024-05-21 20:09:34',
      endAt: '2024-05-21 21:09:34',
      campaignId: '886f0237-27a0-457d-b9e9-c6a81644db1f',
      createdAt: '2024-05-21 20:09:35',
      updatedAt: null,
    },
  ]);
}
