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
        // Только владельцы и админы могут приглашать пользователей
        const member = await prisma.member.findFirst({
          where: {
            organizationId: params.organizationId,
            userId: params.userId,
          },
        })

        return member?.role === MemberRole.owner || member?.role === MemberRole.admin
      },
      canRemoveMember: async (params: RemoveMemberParams) => {
        // Получаем данные пользователя, который хочет удалить члена
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

        return false;
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
      teams: {
        allowRemovingAllTeams: false, // Optional: prevent removing the last team
        enabled: true,
        maximumTeams: 1, // Optional: limit teams per organization
      },
    }),
    pluginAdmin({
      ac,
      roles: {
        owner,
        admin,
        executor,
        member
      }
    }),
    openAPI(),
  ],

  // Hooks will be implemented separately to handle mandate-related operations
  // This is a temporary solution to make TypeScript happy
  hooks: {}
})
