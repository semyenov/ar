import { auth } from '~/lib/auth'

export default defineEventHandler((event) => {
  for (const api in auth.api) {
    console.log('api', api)
  }

  return auth.handler(toWebRequest(event))
})
