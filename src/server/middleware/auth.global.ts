import { useRequestURL } from 'nuxt/app'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const method = getMethod(event)
  const headers = getHeaders(event)
  const urlParams = url.pathname.split('/')
    .filter(Boolean)

  console.log({ headers, method, url, urlParams })

  if (urlParams[0] === 'api') {
    const token = headers['x-api-key']
    if (!token) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
  }
})
