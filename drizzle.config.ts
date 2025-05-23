import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: 'postgresql://postgres:postgres@localhost:5432/dev',
  },
  dialect: 'postgresql',
  out: './src/server/drizzle/migrations',
  schema: './src/server/drizzle/schema.ts',
  strict: true,
  verbose: true,
})
