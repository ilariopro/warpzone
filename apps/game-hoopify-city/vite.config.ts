/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig((_) => {
  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/game-hoopify-city',

    server: {
      host: true,
      port: 5200,
    },

    preview: {
      host: true,
      port: 5300,
    },

    plugins: [nxViteTsPaths()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    build: {
      outDir: '../../dist/apps/game-hoopify-city',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/game-hoopify-city',
        provider: 'v8',
      },
    },
  };
});
