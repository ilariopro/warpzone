/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { readFileSync } from 'fs';
import path from 'path';

export default defineConfig((_) => {
  return {
    base: '/admin',
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/web-admin',
    optimizeDeps: {
      exclude: ['bcrypt'],
    },

    server: {
      host: '0.0.0.0',
      port: 4200,
    },

    preview: {
      host: true,
      port: 4300,
    },

    plugins: [react(), nxViteTsPaths()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    build: {
      outDir: '../../dist/apps/web-admin',
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
        reportsDirectory: '../../coverage/apps/web-admin',
        provider: 'v8',
      },
    },
  };
});
