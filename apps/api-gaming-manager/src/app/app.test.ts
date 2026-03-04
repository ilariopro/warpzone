import { fastify, FastifyInstance } from 'fastify';
import app from './app';
import { applicationName } from './config';

describe('GET /', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = fastify();

    await server.register(app);
  });

  it('should respond with a message', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.json()).toEqual({ message: applicationName });
  });
});
