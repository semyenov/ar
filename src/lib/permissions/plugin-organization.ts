import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, memberAc, ownerAc } from 'better-auth/plugins/organization/access'

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

const executor = ac.newRole({
  project: ['create', 'update'],
  ...memberAc.statements,
})

const reviewer = ac.newRole({
  project: ['create', 'update'],
  ...memberAc.statements,
})

const member = ac.newRole({
  project: ['create', 'update'],
  ...memberAc.statements,
})

const owner = ac.newRole({
  project: ['create', 'update'],
  ...ownerAc.statements,
})

export const roles = { executor, member, owner, reviewer }
