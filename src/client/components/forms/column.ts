import { Icon, NuxtLink } from '#components'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTableColumnHeader from '@/client/components/forms/ColumnHeader.vue'
import DataTableRowActions from '@/client/components/forms/RowActions.vue'
import { Checkbox } from '@/client/components/ui/checkbox'
import {  FormStatus, useUserListAccounts, type Form, type FormExecutor, type FormTemplate } from '~/client/api'
import type { Member, Organization } from '@prisma/client'

export const columns = (t:any):ColumnDef<Form>[] => ([

  {
    accessorKey: 'createdAt',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('forms.createdAt') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('createdAt')),
      ])
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('forms.title') }),

    cell: ({ row  }) => {

      console.log(row)
      return h('div', { class: 'flex space-x-2' }, [
        h(NuxtLink, { to: `/admin/forms/${row.original.id}` ,class: 'transition hover:text-muted-foreground hover:underline max-w-[500px] truncate ' }, row.getValue('title')),
      ])
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('forms.updatedAt') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('updatedAt')),
      ])
    },
  },
  {
    accessorKey: 'organization',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('forms.organization') }),

    cell: ({ row }) => {
      const org = row.getValue('organization') as Organization
      return h('div', { class: 'flex space-x-2' }, [
        h(NuxtLink, { to: `/admin/organizations/${org.id}` ,class: 'transition hover:text-muted-foreground hover:underline max-w-[500px] truncate ' }, org.name)
      ])
    },
  },
  {
    accessorKey: 'template',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('forms.template') }),

    cell: ({ row }) => {
      const template = row.getValue('template') as FormTemplate
      return h('div', { class: 'flex space-x-2' }, [
        h(NuxtLink, { to: `/admin/formTemplates/${template.id}` ,class: 'transition hover:text-muted-foreground hover:underline max-w-[500px] truncate ' }, template.name)
      ])
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false
  },
  {
    accessorKey: 'executor',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('forms.executor') }),

    cell: ({ row }) => {
      const executor = row.getValue('executor') as Member
      return h('div', { class: 'flex space-x-2' }, [
        h(NuxtLink, { to: `/admin/users/${executor.id}` ,class: 'transition hover:text-muted-foreground hover:underline max-w-[500px] truncate ' }, executor.id),
      ])
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('forms.status.title') }),

    cell: ({ row }) => {
      const status = row.getValue('status') as FormStatus
      let icon = 'tabler:file'
      switch (status) {
        case FormStatus.DRAFT:
          icon = 'tabler:file-text'
          break
        case FormStatus.UNDER_REVIEW:
          icon = 'tabler:user-pause'
          break
        case FormStatus.NEEDS_CHANGES:
          icon = 'tabler:edit'
          break
        case FormStatus.APPROVED:
          icon = 'tabler:check'
          break
        case FormStatus.REJECTED:
          icon = 'tabler:x'
          break
      }

      if (!status)
        return null

      return h('div', { class: 'flex w-[100px] items-center' }, [
       icon && h(Icon, { class: 'mr-2 h-4 w-4 shrink-0 text-muted-foreground',name:icon }),
        h('span', {class:'whitespace-nowrap'},t(`forms.status.${status.toLowerCase()}`)),
      ])
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // {
  //   accessorKey: 'priority',
  //   header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Priority' }),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       priority => priority.value === row.getValue('priority'),
  //     )

  //     if (!priority)
  //       return null

  //     return h('div', { class: 'flex items-center' }, [
  //       priority.icon && h(Icon, { class: 'mr-2 h-4 w-4 text-muted-foreground',name:priority.icon }),
  //       h('span', {}, priority.label),
  //     ])
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
])