// app/my-auth.better-auth-client.ts
import type { ClientOptions } from 'better-auth'

import { adminClient, organizationClient, usernameClient } from 'better-auth/client/plugins'

export default {
  plugins: [
    adminClient(),
    usernameClient(),
    organizationClient(),
  ],
} satisfies ClientOptions
