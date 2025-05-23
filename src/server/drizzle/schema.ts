// @eslint-disable
import { relations } from 'drizzle-orm'
import {
  boolean,
  customType,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { Buffer } from 'node:buffer'

export const customBytes = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea'
  },
  fromDriver(value: unknown) {
    if (Buffer.isBuffer(value)) {
      return value
    }
    throw new Error('Expected Buffer')
  },
  toDriver(value: Buffer) {
    return value
  },
})

export const memberRoleEnum = pgEnum('MemberRole', [
  'owner',
  'admin',
  'reviewer',
  'executor',
  'member',
])

export const formStatusEnum = pgEnum('FormStatus', [
  'DRAFT',
  'UNDER_REVIEW',
  'NEEDS_CHANGES',
  'APPROVED',
  'REJECTED',
])

export const fieldTypeEnum = pgEnum('FieldType', [
  'TEXT',
  'TEXTAREA',
  'NUMBER',
  'DATE',
  'SELECT',
  'CHECKBOX',
  'RADIO',
  'FILE',
])

export const formFieldStatusEnum = pgEnum('FormFieldStatus', [
  'DRAFT',
  'REJECTED',
  'APPROVED',
])

export const reviewFlowStatusEnum = pgEnum('ReviewFlowStatus', [
  'OPEN',
  'CLOSED',
])

export const fileAccessEnum = pgEnum('FileAccess', [
  'PRIVATE',
  'ORGANIZATION',
  'PUBLIC',
])

export const users = pgTable('user', {
  banExpires: timestamp('banExpires', { mode: 'date', precision: 3 }),
  banned: boolean('banned'),
  banReason: text('banReason'),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .notNull(),
  email: text('email')
    .notNull(),
  emailVerified: boolean('emailVerified')
    .notNull(),
  id: text('id')
    .primaryKey(),
  image: text('image'),
  name: text('name')
    .notNull(),
  role: text('role'),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .notNull(),
})

export const sessions = pgTable('session', {
  activeOrganizationId: text('activeOrganizationId'),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date', precision: 3 })
    .notNull(),
  id: text('id')
    .primaryKey(),
  impersonatedBy: text('impersonatedBy'),
  ipAddress: text('ipAddress'),
  token: text('token')
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .notNull(),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull(),
})

export const accounts = pgTable('account', {
  accessToken: text('accessToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt', {
    mode: 'date',
    precision: 3,
  }),
  accountId: text('accountId')
    .notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .notNull(),
  id: text('id')
    .primaryKey(),
  idToken: text('idToken'),
  password: text('password'),
  providerId: text('providerId')
    .notNull(),
  refreshToken: text('refreshToken'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', {
    mode: 'date',
    precision: 3,
  }),
  scope: text('scope'),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .notNull(),
  userId: text('userId')
    .notNull(),
})

export const verifications = pgTable('verification', {
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 }),
  expiresAt: timestamp('expiresAt', { mode: 'date', precision: 3 })
    .notNull(),
  id: text('id')
    .primaryKey(),
  identifier: text('identifier')
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 }),
  value: text('value')
    .notNull(),
})

export const organizations = pgTable('organization', {
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .notNull(),
  id: text('id')
    .primaryKey(),
  logo: text('logo'),
  metadata: text('metadata'),
  name: text('name')
    .notNull(),
  slug: text('slug'),
})

export const members = pgTable('member', {
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  id: text('id')
    .primaryKey(),
  lastModifiedBy: text('lastModifiedBy'),
  organizationId: text('organizationId')
    .notNull(),
  role: memberRoleEnum('role')
    .notNull(),
  userId: text('userId')
    .notNull(),
  version: integer('version')
    .default(1)
    .notNull(),
})

export const invitations = pgTable('invitation', {
  email: text('email')
    .notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date', precision: 3 })
    .notNull(),
  id: text('id')
    .primaryKey(),
  inviterId: text('inviterId')
    .notNull(),
  organizationId: text('organizationId')
    .notNull(),
  role: text('role'),
  status: text('status')
    .notNull(),
})

export const forms = pgTable('form', {
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  creatorMemberId: text('creatorMemberId')
    .notNull(),
  description: text('description'),
  executorMemberId: text('executorMemberId'),
  id: text('id')
    .primaryKey(),
  lastModifiedBy: text('lastModifiedBy'),
  organizationId: text('organizationId')
    .notNull(),
  status: formStatusEnum('status')
    .default('DRAFT')
    .notNull(),
  templateId: text('templateId'),
  title: text('title')
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .notNull(),
  version: integer('version')
    .default(1)
    .notNull(),
})

export const formFields = pgTable('form_field', {
  formId: text('formId')
    .notNull(),
  id: text('id')
    .primaryKey(),
  name: text('name')
    .notNull(),
  options: text('options'),
  order: integer('order')
    .notNull(),
  required: boolean('required')
    .default(false)
    .notNull(),
  status: formFieldStatusEnum('status')
    .default('DRAFT')
    .notNull(),
  type: fieldTypeEnum('type')
    .notNull(),
  validationRules: text('validationRules'),
  value: text('value'),
})

export const formTemplates = pgTable('form_template', {
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  description: text('description'),
  id: text('id')
    .primaryKey(),
  lastModifiedBy: text('lastModifiedBy'),
  name: text('name')
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .notNull(),
  version: integer('version')
    .default(1)
    .notNull(),
})

export const formTemplateFields = pgTable('form_template_field', {
  defaultValue: text('defaultValue'),
  id: text('id')
    .primaryKey(),
  name: text('name')
    .notNull(),
  options: text('options'),
  order: integer('order')
    .notNull(),
  required: boolean('required')
    .default(false)
    .notNull(),
  templateId: text('templateId')
    .notNull(),
  type: fieldTypeEnum('type')
    .notNull(),
  validationRules: text('validationRules'),
})

export const formHistories = pgTable('form_history', {
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  data: text('data'),
  formId: text('formId')
    .notNull(),
  id: text('id')
    .primaryKey(),
  memberId: text('memberId')
    .notNull(),
  status: formStatusEnum('status')
    .notNull(),
})

export const reviewFlows = pgTable('review_flow', {
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  formId: text('formId')
    .notNull(),
  id: text('id')
    .primaryKey(),
  lastModifiedBy: text('lastModifiedBy'),
  organizationId: text('organizationId')
    .notNull(),
  status: reviewFlowStatusEnum('status')
    .default('OPEN')
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .notNull(),
  version: integer('version')
    .default(1)
    .notNull(),
})

export const comments = pgTable('comment', {
  content: text('content')
    .notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  formFieldId: text('formFieldId'),
  id: text('id')
    .primaryKey(),
  memberId: text('memberId')
    .notNull(),
  reviewFlowId: text('reviewFlowId')
    .notNull(),
})

export const files = pgTable('file', {
  accessedAt: timestamp('accessedAt', { mode: 'date', precision: 3 }),
  accessLevel: fileAccessEnum('accessLevel')
    .default('ORGANIZATION')
    .notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  deleted: boolean('deleted')
    .default(false)
    .notNull(),
  description: text('description'),
  filename: text('filename')
    .notNull(),
  folderId: text('folderId'),
  id: text('id')
    .primaryKey(),
  lastModifiedBy: text('lastModifiedBy'),
  mimeType: text('mimeType')
    .notNull(),
  organizationId: text('organizationId')
    .notNull(),
  originalName: text('originalName')
    .notNull(),
  path: text('path')
    .notNull(),
  size: integer('size')
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .notNull(),
  uploaderMemberId: text('uploaderMemberId')
    .notNull(),
  version: integer('version')
    .default(1)
    .notNull(),
})

export const fileFolders = pgTable('file_folder', {
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  creatorMemberId: text('creatorMemberId')
    .notNull(),
  description: text('description'),
  id: text('id')
    .primaryKey(),
  lastModifiedBy: text('lastModifiedBy'),
  level: integer('level')
    .notNull(),
  name: text('name')
    .notNull(),
  organizationId: text('organizationId')
    .notNull(),
  parentId: text('parentId'),
  path: text('path'),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .notNull(),
  version: integer('version')
    .default(1)
    .notNull(),
})

export const fileShares = pgTable('file_share', {
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date', precision: 3 }),
  fileId: text('fileId')
    .notNull(),
  id: text('id')
    .primaryKey(),
  memberId: text('memberId')
    .notNull(),
})

export const formFieldFiles = pgTable('form_field_file', {
  fileId: text('fileId')
    .notNull(),
  formFieldId: text('formFieldId')
    .notNull(),
  id: text('id')
    .primaryKey(),
})

export const usersRelations = relations(users, (helpers) => {
  return {
    accounts: helpers.many(accounts, { relationName: 'AccountToUser' }),
    invitations: helpers.many(invitations, {
      relationName: 'InvitationToUser',
    }),
    members: helpers.many(members, { relationName: 'MemberToUser' }),
    sessions: helpers.many(sessions, { relationName: 'SessionToUser' }),
  }
})

export const sessionsRelations = relations(sessions, (helpers) => {
  return {
    user: helpers.one(users, {
      fields: [sessions.userId],
      references: [users.id],
      relationName: 'SessionToUser',
    }),
  }
})

export const accountsRelations = relations(accounts, (helpers) => {
  return {
    user: helpers.one(users, {
      fields: [accounts.userId],
      references: [users.id],
      relationName: 'AccountToUser',
    }),
  }
})

export const organizationsRelations = relations(organizations, (helpers) => {
  return {
    files: helpers.many(files, { relationName: 'FileToOrganization' }),
    folders: helpers.many(fileFolders, {
      relationName: 'FileFolderToOrganization',
    }),
    forms: helpers.many(forms, { relationName: 'FormToOrganization' }),
    invitations: helpers.many(invitations, {
      relationName: 'InvitationToOrganization',
    }),
    members: helpers.many(members, { relationName: 'MemberToOrganization' }),
    reviewFlows: helpers.many(reviewFlows, {
      relationName: 'OrganizationToReviewFlow',
    }),
  }
})

export const membersRelations = relations(members, (helpers) => {
  return {
    assignedForms: helpers.many(forms, { relationName: 'FormExecutor' }),
    comments: helpers.many(comments, { relationName: 'CommentToMember' }),
    createdFolders: helpers.many(fileFolders, {
      relationName: 'FileFolderToMember',
    }),
    createdForms: helpers.many(forms, { relationName: 'FormCreator' }),
    formHistory: helpers.many(formHistories, {
      relationName: 'FormHistoryToMember',
    }),
    organization: helpers.one(organizations, {
      fields: [members.organizationId],
      references: [organizations.id],
      relationName: 'MemberToOrganization',
    }),
    sharedFiles: helpers.many(fileShares, {
      relationName: 'FileShareToMember',
    }),
    uploadedFiles: helpers.many(files, { relationName: 'FileUploader' }),
    user: helpers.one(users, {
      fields: [members.userId],
      references: [users.id],
      relationName: 'MemberToUser',
    }),
  }
})

export const invitationsRelations = relations(invitations, (helpers) => {
  return {
    organization: helpers.one(organizations, {
      fields: [invitations.organizationId],
      references: [organizations.id],
      relationName: 'InvitationToOrganization',
    }),
    user: helpers.one(users, {
      fields: [invitations.inviterId],
      references: [users.id],
      relationName: 'InvitationToUser',
    }),
  }
})

export const formsRelations = relations(forms, (helpers) => {
  return {
    creator: helpers.one(members, {
      fields: [forms.creatorMemberId],
      references: [members.id],
      relationName: 'FormCreator',
    }),
    executor: helpers.one(members, {
      fields: [forms.executorMemberId],
      references: [members.id],
      relationName: 'FormExecutor',
    }),
    fields: helpers.many(formFields, { relationName: 'FormToFormField' }),
    history: helpers.many(formHistories, { relationName: 'FormToFormHistory' }),
    organization: helpers.one(organizations, {
      fields: [forms.organizationId],
      references: [organizations.id],
      relationName: 'FormToOrganization',
    }),
    reviewFlow: helpers.one(reviewFlows),
    template: helpers.one(formTemplates, {
      fields: [forms.templateId],
      references: [formTemplates.id],
      relationName: 'FormToFormTemplate',
    }),
  }
})

export const formFieldsRelations = relations(formFields, (helpers) => {
  return {
    comments: helpers.many(comments, { relationName: 'CommentToFormField' }),
    files: helpers.many(formFieldFiles, {
      relationName: 'FormFieldToFormFieldFile',
    }),
    form: helpers.one(forms, {
      fields: [formFields.formId],
      references: [forms.id],
      relationName: 'FormToFormField',
    }),
  }
})

export const formTemplatesRelations = relations(formTemplates, (helpers) => {
  return {
    fields: helpers.many(formTemplateFields, {
      relationName: 'FormTemplateToFormTemplateField',
    }),
    forms: helpers.many(forms, { relationName: 'FormToFormTemplate' }),
  }
})

export const formTemplateFieldsRelations = relations(
  formTemplateFields,
  (helpers) => {
    return {
      template: helpers.one(formTemplates, {
        fields: [formTemplateFields.templateId],
        references: [formTemplates.id],
        relationName: 'FormTemplateToFormTemplateField',
      }),
    }
  },
)

export const formHistoriesRelations = relations(formHistories, (helpers) => {
  return {
    form: helpers.one(forms, {
      fields: [formHistories.formId],
      references: [forms.id],
      relationName: 'FormToFormHistory',
    }),
    member: helpers.one(members, {
      fields: [formHistories.memberId],
      references: [members.id],
      relationName: 'FormHistoryToMember',
    }),
  }
})

export const reviewFlowsRelations = relations(reviewFlows, (helpers) => {
  return {
    comments: helpers.many(comments, { relationName: 'CommentToReviewFlow' }),
    form: helpers.one(forms, {
      fields: [reviewFlows.formId],
      references: [forms.id],
      relationName: 'FormToReviewFlow',
    }),
    organization: helpers.one(organizations, {
      fields: [reviewFlows.organizationId],
      references: [organizations.id],
      relationName: 'OrganizationToReviewFlow',
    }),
  }
})

export const commentsRelations = relations(comments, (helpers) => {
  return {
    formField: helpers.one(formFields, {
      fields: [comments.formFieldId],
      references: [formFields.id],
      relationName: 'CommentToFormField',
    }),
    member: helpers.one(members, {
      fields: [comments.memberId],
      references: [members.id],
      relationName: 'CommentToMember',
    }),
    reviewFlow: helpers.one(reviewFlows, {
      fields: [comments.reviewFlowId],
      references: [reviewFlows.id],
      relationName: 'CommentToReviewFlow',
    }),
  }
})

export const filesRelations = relations(files, (helpers) => {
  return {
    folder: helpers.one(fileFolders, {
      fields: [files.folderId],
      references: [fileFolders.id],
      relationName: 'FileToFileFolder',
    }),
    formFields: helpers.many(formFieldFiles, {
      relationName: 'FileToFormFieldFile',
    }),
    organization: helpers.one(organizations, {
      fields: [files.organizationId],
      references: [organizations.id],
      relationName: 'FileToOrganization',
    }),
    sharedWith: helpers.many(fileShares, { relationName: 'FileToFileShare' }),
    uploader: helpers.one(members, {
      fields: [files.uploaderMemberId],
      references: [members.id],
      relationName: 'FileUploader',
    }),
  }
})

export const fileFoldersRelations = relations(fileFolders, (helpers) => {
  return {
    children: helpers.many(fileFolders, { relationName: 'FolderHierarchy' }),
    creator: helpers.one(members, {
      fields: [fileFolders.creatorMemberId],
      references: [members.id],
      relationName: 'FileFolderToMember',
    }),
    files: helpers.many(files, { relationName: 'FileToFileFolder' }),
    organization: helpers.one(organizations, {
      fields: [fileFolders.organizationId],
      references: [organizations.id],
      relationName: 'FileFolderToOrganization',
    }),
    parent: helpers.one(fileFolders, {
      fields: [fileFolders.parentId],
      references: [fileFolders.id],
      relationName: 'FolderHierarchy',
    }),
  }
})

export const fileSharesRelations = relations(fileShares, (helpers) => {
  return {
    file: helpers.one(files, {
      fields: [fileShares.fileId],
      references: [files.id],
      relationName: 'FileToFileShare',
    }),
    member: helpers.one(members, {
      fields: [fileShares.memberId],
      references: [members.id],
      relationName: 'FileShareToMember',
    }),
  }
})

export const formFieldFilesRelations = relations(formFieldFiles, (helpers) => {
  return {
    file: helpers.one(files, {
      fields: [formFieldFiles.fileId],
      references: [files.id],
      relationName: 'FileToFormFieldFile',
    }),
    formField: helpers.one(formFields, {
      fields: [formFieldFiles.formFieldId],
      references: [formFields.id],
      relationName: 'FormFieldToFormFieldFile',
    }),
  }
})
