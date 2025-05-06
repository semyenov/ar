import { MemberRole, PrismaClient } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI, organization } from 'better-auth/plugins'

const prisma = new PrismaClient()

// Define types for organization hooks
type UserParams = {
  userId: string;
  organizationId: string;
  [key: string]: any;
};

type RemoveMemberParams = UserParams & {
  targetUserId: string;
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization({
      allowUserToCreateOrganization(user) {
        return true
      },
      onUserJoinOrganization: async (params: UserParams) => {
        // Store the appropriate role in the database
        // Default to 'member' role
        return { role: 'member' }
      },
      canInviteUser: async (params: UserParams) => {
        // Only owners and admins can invite users
        const member = await prisma.member.findFirst({
          where: {
            userId: params.userId,
            organizationId: params.organizationId
          }
        })
        return member?.role === MemberRole.owner || member?.role === MemberRole.admin
      },
      canRemoveMember: async (params: RemoveMemberParams) => {
        // Owners can remove anyone, admins can remove non-owners/admins
        const member = await prisma.member.findFirst({
          where: {
            userId: params.userId,
            organizationId: params.organizationId
          }
        })

        if (member?.role === MemberRole.owner) return true

        if (member?.role === MemberRole.admin) {
          const targetMember = await prisma.member.findFirst({
            where: {
              userId: params.targetUserId,
              organizationId: params.organizationId
            }
          })
          return targetMember?.role !== MemberRole.owner && targetMember?.role !== MemberRole.admin
        }

        return false
      },
    }),
    openAPI(),
  ],
})
