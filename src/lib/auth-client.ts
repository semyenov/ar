import { adminClient, organizationClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'
import { customInstance } from '~/client/api/mutator/instance'
import { ofetch } from 'ofetch'


export const authClient = createAuthClient({
  plugins: [
    organizationClient({}),
    adminClient({}),
  ],
})

export default authClient
