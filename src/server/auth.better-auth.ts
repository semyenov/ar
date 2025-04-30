import type { BetterAuthOptions } from 'better-auth'

import prisma from '~~/lib/prisma'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI, organization } from 'better-auth/plugins'

export default {
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [organization(), openAPI()],
} satisfies BetterAuthOptions
