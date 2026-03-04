import { FastifyPluginAsync } from 'fastify';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';

type OpenApiOpts = {
  title: string;
  description?: string;
  externalDocs?: { description?: string; url: string };
  servers?: { description?: string; url: string }[];
  termsOfService?: string;
  version: string;
};

const openApi: FastifyPluginAsync<OpenApiOpts> = async (app, opts) => {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: opts.title,
        description: opts.description ?? `OpenApi 3.0 reference for ${opts.title}`,
        termsOfService: opts.termsOfService,
        version: opts.version,
      },
      externalDocs: opts.externalDocs,
      servers: opts.servers,
      components: {
        securitySchemes: {
          accessToken: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          refreshToken: {
            type: 'apiKey',
            in: 'cookie',
            name: 'refreshToken',
          },
        },
      },
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    theme: {
      title: `${opts.title} | OAS 3.0`,
      css: [{ filename: 'theme.css', content: '.topbar { display: none; }' }],
    },
  });

  app.addSchema({
    $id: 'message',
    description: 'Response with message and optional details',
    type: 'object',
    properties: {
      message: { type: 'string' },
      data: { type: 'string' },
    },
    additionalProperties: false,
    required: ['message'],
  });
};

export { openApi, OpenApiOpts };
