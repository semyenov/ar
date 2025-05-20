import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc } from 'better-auth/plugins/admin/access'

// Расширенное определение разрешений, включая операции с мандатами
export const statements = {
  comment: [
    'create',
    'update',
    'delete',
  ],
  file: [
    'create',
    'update',
    'delete',
    'download',
    'share',
  ],
  file_folder: [
    'create',
    'update',
    'delete',
  ],
  form: [
    'create',
    'update',
    'delete',
    'assign',
  ],
  form_field: [
    'create',
    'update',
    'delete',
  ],
  form_template: [
    'create',
    'update',
    'delete',
  ],

  member: [
    'invite',
    'remove',
    'update_role',
  ],
  organization: [
    'create',
    'update',
    'delete',
    'invite',
    'remove',
  ],

  review_flow: [
    'create',
    'update',
    'close',
  ],
} as const

export const ac = createAccessControl(statements)

// Роль обычного пользователя (член организации)
export const member = ac.newRole({
  file: [
    'create',
    'download',
    'share',
  ],
  file_folder: ['create'],
  form: ['create'],
})

// Роль исполнителя
export const executor = ac.newRole({
  ...member.statements,
  form: ['create', 'update'],
})

// Роль рецензента
export const reviewer = ac.newRole({
  ...executor.statements,
  comment: [
    'create',
    'update',
    'delete',
  ],
  form: ['create', 'update'],
  review_flow: ['update', 'close'],
})

// Роль администратора
export const admin = ac.newRole({
  ...adminAc,
  ...reviewer.statements,
  file: [
    'create',
    'update',
    'delete',
    'download',
    'share',
  ],
  file_folder: [
    'create',
    'update',
    'delete',
  ],
  form: [
    'create',
    'update',
    'delete',
    'assign',
  ],
  form_field: [
    'create',
    'update',
    'delete',
  ],
  form_template: [
    'create',
    'update',
    'delete',
  ],
  member: [
    'invite',
    'remove',
    'update_role',
  ],
  organization: ['update'],
})

// Роль владельца организации
export const owner = ac.newRole({
  ...admin.statements,
  organization: [
    'create',
    'update',
    'delete',
    'invite',
    'remove',
  ],
})
