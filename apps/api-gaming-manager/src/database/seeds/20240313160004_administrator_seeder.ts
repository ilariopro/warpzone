import { Knex } from 'knex';
import { hash } from 'bcryptjs';
import { cryptoSalt } from '../../app/config';

const reset = async (knex: Knex) => {
  await knex('administrator').del();
};

export async function seed(knex: Knex): Promise<void> {
  await reset(knex);

  await knex('administrator').insert([
    {
      id: 'a2b2cfee-1233-4a20-9aee-7823d59b98db',
      firstName: 'Ilario',
      lastName: 'Promutico',
      email: 'ilario.promutico@gmail.com',
      password: await hash('secret', cryptoSalt),
      role: 0,
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      isVerified: true,
      createdAt: '2024-03-03 16:34:05',
      updatedAt: null,
    },
    {
      id: 'a2b2cfee-1233-4a20-9aee-7833d59b98db',
      firstName: 'Luigi Andrea',
      lastName: 'Coscia',
      email: 'luigiandrea.coscia@jobtech.it',
      password: await hash('secret', cryptoSalt),
      role: 0,
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      isVerified: true,
      createdAt: '2025-05-14 21:58:05',
      updatedAt: null,
    },
    {
      id: 'a2b2cfee-1233-4a20-9aee-7823d59b98aa',
      firstName: 'Pacman',
      lastName: null,
      email: 'pacman@pacman.com',
      password: await hash('W&Lk0#m3', cryptoSalt),
      role: 2,
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      isVerified: false,
      createdAt: '2024-03-03 14:32:10',
      updatedAt: '2024-05-03 16:34:05',
    },
    {
      id: 'a2b2cfee-1233-4a20-9aee-7823d59b98ab',
      firstName: 'Mrs. Pacman',
      lastName: null,
      email: 'mrs.pacman@pacman.com',
      password: await hash('W&Lk0#m3', cryptoSalt),
      role: 2,
      organizationId: '64329730-22f4-47ce-aeef-69531cdb3db9',
      isVerified: true,
      createdAt: '2024-03-03 23:32:00',
      updatedAt: '2024-05-03 16:34:05',
    },
    {
      id: 'a2b2cfee-1233-4a20-9aee-7823d59b97dc',
      firstName: 'Bugs',
      lastName: 'Bunny',
      email: 'bugs.bunny@looneytunes.com',
      password: await hash('W&Lk0#m3', cryptoSalt),
      role: 2,
      organizationId: '57539d19-7c7d-4aab-b3a4-03919e0b6e30',
      isVerified: false,
      createdAt: '2024-04-13 11:50:11',
      updatedAt: '2024-04-14 19:41:18',
    },
    {
      id: 'a2b2cfee-1233-4a20-9aee-7823d59b96dc',
      firstName: 'Duffy',
      lastName: 'Duck',
      email: 'duffy.duck@looneytunes.com',
      password: await hash('W&Lk0#m3', cryptoSalt),
      role: 2,
      organizationId: '57539d19-7c7d-4aab-b3a4-03919e0b6e30',
      isVerified: false,
      createdAt: '2024-04-13 11:50:11',
      updatedAt: null,
    },
    {
      id: 'a2b2cfee-1233-4a20-9aee-7823d59b98dc',
      firstName: 'Mario',
      lastName: 'Mario',
      email: 'mario@bros.com',
      password: await hash('W&Lk0#m3', cryptoSalt),
      role: 1,
      organizationId: '57539d19-7c7d-4aab-b3a4-03919e0b6e32',
      isVerified: true,
      createdAt: '2024-04-03 16:54:15',
      updatedAt: null,
    },
    {
      id: 'a2b2cfee-1233-4a20-9aee-7823d59b98df',
      firstName: 'Luigi',
      lastName: 'Mario',
      email: 'luigi@bros.com',
      password: await hash('W&Lk0#m3', cryptoSalt),
      role: 1,
      organizationId: '57539d19-7c7d-4aab-b3a4-03919e0b6e32',
      isVerified: true,
      createdAt: '2024-04-04 16:54:15',
      updatedAt: null,
    },
  ]);
}
