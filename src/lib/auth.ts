import { MemberRole, PrismaClient } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI, organization, admin as pluginAdmin } from 'better-auth/plugins'

import { ac, admin, executor, member, owner } from './permissions'

const prisma = new PrismaClient()

// Define types for organization hooks
type UserParams = {
  userId: string
  organizationId: string
  [key: string]: any
}

type RemoveMemberParams = {
  targetUserId: string
} & UserParams

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    pluginAdmin(),
    organization({
      ac,
      allowUserToCreateOrganization(user) {
        return true
      },
      canInviteUser: async (params: UserParams) => {
        // Only owners and admins can invite users
        const member = await prisma.member.findFirst({
          where: {
            organizationId: params.organizationId,
            userId: params.userId,
          },
        })

        return member?.role === MemberRole.owner || member?.role === MemberRole.admin
      },
      canRemoveMember: async (params: RemoveMemberParams) => {
        // Owners can remove anyone, admins can remove non-owners/admins
        const member = await prisma.member.findFirst({
          where: {
            organizationId: params.organizationId,
            userId: params.userId,
          },
        })

        if (member?.role === MemberRole.owner) {
          return true
        }

        if (member?.role === MemberRole.admin) {
          const targetMember = await prisma.member.findFirst({
            where: {
              organizationId: params.organizationId,
              userId: params.targetUserId,
            },
          })

          return targetMember?.role !== MemberRole.owner && targetMember?.role !== MemberRole.admin
        }

        return false
      },
      onUserJoinOrganization: async (params: UserParams) => {
        // Store the appropriate role in the database
        // Default to 'member' role
        return { role: 'member' }
      },
      roles: {
        admin,
        executor,
        member,
        owner,
      },
      // teams: {
      //   allowRemovingAllTeams: false, // Optional: prevent removing the last team
      //   enabled: true,
      //   maximumTeams: 1, // Optional: limit teams per organization
      // },
    }),
    openAPI(),
  ],
})
