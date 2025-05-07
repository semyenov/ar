import { defineConfig } from 'orval';

export default defineConfig({
  altRegioni: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'split',
      target: './src/client/api/generated/index.ts',
      client: 'vue-query',
      namingConvention: 'kebab-case',
      tslint: true,
      indexFiles: true,
      tsconfig: './tsconfig.json',
      override: {
        mutator: {
          path: 'src/client/api/mutator/instance.ts',
          name: 'customInstance',
        },
        enumGenerationType: 'const',
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'limit',
          options: {
            staleTime: 10000,
          },
        },
      },
      schemas: './src/client/api/generated/model',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});