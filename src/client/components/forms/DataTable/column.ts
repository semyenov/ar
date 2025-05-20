import type { Member, Organization } from '@prisma/client'
import type { ColumnDef } from '@tanstack/vue-table'

import { Icon, NuxtLink } from '#components'
import { type Form, type FormExecutor, FormStatus, type FormTemplate, useUserListAccounts } from '~/client/api'

import DataTableColumnHeader from '@/client/components/forms/DataTable/ColumnHeader.vue'
import DataTableRowActions from '@/client/components/forms/DataTable/RowActions.vue'
import { Checkbox } from '@/client/components/ui/checkbox'

export function columns(t: any): ColumnDef<Form>[] {
  return [

    {

      accessorKey: 'createdAt',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('forms.createdAt') })
      },

      cell: ({ row }) => {
        return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('createdAt'))])
      },
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('forms.title') })
      },

      cell: ({ row }) => {
        console.log(row)

        return h(NuxtLink, { class: 'transition hover:text-muted-foreground hover:underline max-w-[500px] truncate ', to: `/admin/forms/${row.original.id}` }, () => {
          return row.getValue('title')
        })
      },
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('forms.updatedAt') })
      },

      cell: ({ row }) => {
        return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('updatedAt'))])
      },
    },
    {
      accessorKey: 'organization',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('forms.organization') })
      },

      cell: ({ row }) => {
        const org = row.getValue('organization') as Organization

        return h(NuxtLink, { class: 'transition hover:text-muted-foreground hover:underline max-w-[500px] truncate ', to: `/admin/organizations/${org.id}` }, () => {
          return [org.name]
        })
      },
    },
    {
      accessorKey: 'template',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('forms.template') })
      },

      cell: ({ row }) => {
        const template = row.getValue('template') as FormTemplate

        return h(NuxtLink, { class: 'transition hover:text-muted-foreground hover:underline max-w-[500px] truncate ', to: `/admin/formTemplates/${template.id}` }, () => {
          return template.name
        })
      },
      enableSorting: false,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'executor',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('forms.executor') })
      },

      cell: ({ row }) => {
        const executor = row.getValue('executor') as Member

        return h(NuxtLink, { class: 'transition hover:text-muted-foreground hover:underline max-w-[500px] truncate ', to: `/admin/users/${executor.id}` }, () => {
          return [h('span', executor.id)]
        })
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('forms.status.title') })
      },

      cell: ({ row }) => {
        const status = row.getValue('status') as FormStatus
        let icon = 'tabler:file'
        switch (status) {
          case FormStatus.APPROVED:
            icon = 'tabler:check'
            break
          case FormStatus.DRAFT:
            icon = 'tabler:file-text'
            break
          case FormStatus.NEEDS_CHANGES:
            icon = 'tabler:edit'
            break
          case FormStatus.REJECTED:
            icon = 'tabler:x'
            break
          case FormStatus.UNDER_REVIEW:
            icon = 'tabler:user-pause'
            break
        }

        if (!status) {
          return null
        }

        return h('div', { class: 'flex w-[100px] items-center' }, [
          icon && h(Icon, { class: 'mr-2 h-4 w-4 shrink-0 text-muted-foreground', name: icon }),
          h('span', { class: 'whitespace-nowrap' }, t(`forms.status.${status.toLowerCase()}`)),
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
      cell: ({ row }) => {
        return h(DataTableRowActions, { row })
      },
      id: 'actions',
    },
  ]
}
