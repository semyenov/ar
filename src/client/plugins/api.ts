import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  // Create a new Vue Query client instance
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10000,
        refetchOnWindowFocus: false,
      },
    },
  });

  // Mount the vue-query plugin with the client
  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  // Provide the client to the app
  return {
    provide: {
      queryClient,
    },
  };
});