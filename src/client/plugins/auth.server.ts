export default defineNuxtPlugin({
  enforce: 'pre',
  name: 'better-auth-fetch-plugin',
  async setup(nuxtApp) {
    // Flag if request is cached
    nuxtApp.payload.isCached = Boolean(useRequestEvent()?.context.cache)
    if (nuxtApp.payload.serverRendered && !nuxtApp.payload.prerenderedAt && !nuxtApp.payload.isCached) {
      await useAuth()
        .fetchSession()
    }
  },
})
