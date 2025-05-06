import { defineConfig } from 'orval';

export default defineConfig({
  altRegioni: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      target: './src/client/lib/api',
      client: 'vue-query',
      prettier: true,
      override: {
        mutator: {
          path: './src/client/lib/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
        operations: {
          // Convert operationId to camelCase
          getFormHistoryRecord: {
            operationId: 'getFormHistory'
          }
        },
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'limit',
          options: {
            staleTime: 10000,
          },
        },
        mock: false,
      },
      schemas: './src/client/lib/api/model',
      hooks: {
        afterAllFilesWrite: 'prettier --write',
      },
    },
  },
});