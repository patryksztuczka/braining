import path from 'node:path';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
  // Read all migrations in the `migrations` directory
  const migrationsPath = path.join(__dirname, 'drizzle', 'migrations');
  const migrations = await readD1Migrations(migrationsPath);

  return {
    plugins: [
      cloudflareTest({
        wrangler: { configPath: './wrangler.jsonc' },
        miniflare: {
          bindings: {
            BETTER_AUTH_SECRET: 'test-secret',
            BETTER_AUTH_URL: 'http://localhost:8787',
            GITHUB_CLIENT_ID: 'test-github-client-id',
            GITHUB_CLIENT_SECRET: 'test-github-client-secret',
            CLOUDFLARE_ACCOUNT_ID: 'test-account-id',
            CLOUDFLARE_DATABASE_ID: 'test-database-id',
            CLOUDFLARE_D1_TOKEN: 'test-d1-token',
            TEST_MIGRATIONS: migrations,
          },
          d1Databases: ['DATABASE'],
        },
      }),
    ],
    test: {
      coverage: {
        provider: 'istanbul',
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'test/**/*.ts', 'src/db/migrations/**'],
        reporter: ['text', 'html'],
      },
      setupFiles: ['test/apply-migrations.ts'],
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'test/**/*.test.ts', 'test/**/*.spec.ts'],
    },
  };
});
