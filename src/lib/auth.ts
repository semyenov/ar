import { MemberRole, PrismaClient } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI, organization, admin as pluginAdmin } from 'better-auth/plugins'

import { adminPermissions, organizationsPermissions } from './permissions'

const prisma = new PrismaClient()

// Define types for organization hooks
type UserParams = {
  userId: string
  organizationId: string
  [key: string]: any
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    pluginAdmin({ ...adminPermissions }),
    organization({
      ...organizationsPermissions,
      allowUserToCreateOrganization(_user) {
        return true
      },
      onUserJoinOrganization: async (_userparams: UserParams) => {
        // Store the appropriate role in the database
        // Default to 'member' role
        return { role: 'executor' }
      },

    }),
    openAPI(),
  ],
})
