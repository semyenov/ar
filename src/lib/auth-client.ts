import { adminClient, organizationClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

import { adminPermissions, organizationsPermissions } from './permissions'

export function useAuthClient(url: URL, headers?: Record<string, string>) {
  return createAuthClient({
    baseURL: url.origin,
    fetchOptions: {
      headers,
    },
    plugins: [
      organizationClient({
        ...organizationsPermissions,
      }),
      adminClient({ ...adminPermissions }),
    ],
  })
}
