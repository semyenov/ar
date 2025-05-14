import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultAc, defaultStatements, memberAc, ownerAc } from 'better-auth/plugins/organization/access'

export const statement = {
  ...defaultStatements,
  form: [
    'create',
    'read',
    'update',
    'delete',
  ],
} as const

export const ac = createAccessControl(statement)

export const admin = ac.newRole({

  ...adminAc.statements,
})

export const member = ac.newRole({
  ...memberAc.statements,
})

export const owner = ac.newRole({

  ...ownerAc.statements,

})

export const executor = ac.newRole({
  ...memberAc.statements,
  form: ['update'],
})
