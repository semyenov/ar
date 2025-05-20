import { type QueryClient, useQueryClient } from '@tanstack/vue-query'

const vueQueryKey = Symbol('query-client')

export function useVueQueryClient() {
  let queryClient = inject<QueryClient>(vueQueryKey)
  if (queryClient) {
    return queryClient
  }
  queryClient = useQueryClient('query-client')
  provide(vueQueryKey, queryClient)

  return queryClient
}
