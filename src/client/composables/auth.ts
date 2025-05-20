import type {
  ClientOptions,
  InferSessionFromClient,
  InferUserFromClient,
} from 'better-auth/client'
import type { RouteLocationRaw } from 'vue-router'

import { useAuthClient } from '~/lib/auth-client'
import { defu } from 'defu'

interface RuntimeAuthConfig {
  redirectAdminTo: RouteLocationRaw | string
  redirectGuestTo: RouteLocationRaw | string
  redirectUserTo: RouteLocationRaw | string
}

export function useAuth() {
  const url = useRequestURL()
  const headers = import.meta.server ? useRequestHeaders() : undefined

  const client = useAuthClient(
    url,
    headers,
  )

  const options = defu(useRuntimeConfig().public.auth as Partial<RuntimeAuthConfig>, {
    redirectAdminTo: '/',
    redirectGuestTo: '/',
    redirectUserTo: '/',
  })
  const session = useState<InferSessionFromClient<ClientOptions> | null>('auth:session', () => {
    return null
  })
  const user = useState<InferUserFromClient<ClientOptions> | null>('auth:user', () => {
    return null
  })
  const sessionFetching = import.meta.server
    ? ref(false)
    : useState('auth:sessionFetching', () => {
        return false
      })

  const fetchSession = async () => {
    if (sessionFetching.value) {
      console.log('already fetching session')

      return
    }
    sessionFetching.value = true
    const { data } = await client.getSession({
      fetchOptions: {
        headers,
      },
    })
    session.value = data?.session || null

    user.value = data?.user || null
    sessionFetching.value = false

    return data
  }

  if (import.meta.client) {
    client.$store.listen('$sessionSignal', async (signal) => {
      if (!signal) {
        return
      }
      await fetchSession()
    })
  }

  return {
    client,
    fetchSession,
    loggedIn: computed(() => {
      return Boolean(session.value)
    }),
    options,
    session,
    signIn: client.signIn,
    async signOut({ redirectTo }: { redirectTo?: RouteLocationRaw } = {}) {
      const res = await client.signOut()
      session.value = null
      user.value = null
      if (redirectTo) {
        await navigateTo(redirectTo)
      }

      return res
    },
    signUp: client.signUp,
    user,
  }
}
