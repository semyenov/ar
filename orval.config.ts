import { defineConfig } from 'orval'

export default defineConfig({
  altRegioni: {
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
    input: {
      target: './openapi.yaml',
    },
    output: {
      client: 'vue-query',
      indexFiles: true,
      mode: 'split',
      namingConvention: 'kebab-case',
      override: {

        enumGenerationType: 'const',
        mutator: {
          name: 'customInstance',
          path: 'src/client/api/mutator/instance.ts',
        },
        query: {
          options: {
            staleTime: 10000,
          },
          signal: true,
          useInfinite: true,
          useInfiniteQueryParam: 'limit',
          useMutation: true,
          useQuery: true,
        },
      },
      schemas: './src/client/api/generated/model',
      target: './src/client/api/generated/index.ts',
      tsconfig: './tsconfig.json',
      tslint: true,
    },
  },
})
