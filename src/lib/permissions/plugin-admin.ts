import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultStatements, userAc } from 'better-auth/plugins/admin/access'

const statement = {
  ...defaultStatements,
  project: [
    'create',
    'share',
    'update',
    'delete',
  ],
} as const

export const ac = createAccessControl(statement)

const admin = ac.newRole({
  project: ['create', 'update'],
  ...adminAc.statements,
})

const user = ac.newRole({
  project: ['create', 'update'],
  ...userAc.statements,
})

export const roles = { admin, user }
