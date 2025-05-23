import { Icon, NuxtLink } from '#components'

// import tasks from '@/client/data/tasks.json'
import type { ColumnDef } from '@tanstack/vue-table'
// import { columns } from '@/client/components/organizations/column'
import type { User } from '~/client/data/schema'

import { Checkbox } from '@/client/components/ui/checkbox'
import DataTableColumnHeader from '@/client/components/users/DataTable/ColumnHeader.vue'
import DataTableRowActions from '@/client/components/users/DataTable/RowActions.vue'

export function columns(t: any): ColumnDef<User>[] {
  return [
  // {
  //   id: 'select',
  //   header: ({ table }) => h(Checkbox, {
  //     'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
  //     'onUpdate:modelValue': (value:any)=> table.toggleAllPageRowsSelected(!!value),
  //     'ariaLabel': 'Select all',

    //   }),
    //   cell: ({ row }) => h(Checkbox, { 'modelValue': row.getIsSelected(), 'onUpdate:modelValue': (value:any) => row.toggleSelected(!!value), 'ariaLabel': 'Select row',  }),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    // {
    //   accessorKey: 'id',
    //   header: ({ column }) => h(DataTableColumnHeader, { column, title: t }),
    //   cell: ({ row }) => h('div', { class: 'w-20' }, row.getValue('id')),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'name',

      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('schemas.users.name') })
      },

      cell: ({ row }) => {
        console.log(row.getValue('name'))

        return h(NuxtLink, { class: 'transition hover:text-muted-foreground max-w-[500px] truncate ', to: `/users/${row.id}` }, () => {
          return `${row.getValue('name')}`
        })
      },
    },
    {
      accessorKey: 'role',

      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('schemas.users.role') })
      },

      cell: ({ row }) => {
        console.log(row.getValue('role'))

        return h('span', { class: 'flex space-x-2' }, () => {
          return `${row.getValue('role')}`
        })
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('schemas.users.email') })
      },

      cell: ({ row }) => {
        return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('email'))])
      },
      enableSorting: true,
    },
    {
      accessorKey: 'emailVerified',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('schemas.users.emailVerified') })
      },

      cell: ({ row }) => {
        return h('div', { class: 'flex space-x-2' }, [h('Icon', { class: 'max-w-[500px] truncate ', name: row.getValue('emailVerified') ? 'tabler:check' : 'tabler:x' })])
      },
      enableSorting: true,
    },
    // {
    //   accessorKey: 'phone',
    //   header: ({ column }) => {
    //     return h(DataTableColumnHeader, { column, title: t('schemas.users.phone') })
    //   },

    //   cell: ({ row }) => {
    //     return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('phone'))])
    //   },
    //   enableSorting: false,
    // },
    // {
    //   accessorKey: 'status',
    //   header: ({ column }) => {
    //     return h(DataTableColumnHeader, { column, title: t('schemas.users.status') })
    //   },

    //   cell: ({ row }) => {
    //     const status = userStatuses.find(
    //       (status) => {
    //         return status.value === row.getValue('status')
    //       },
    //     )

    //     if (!status) {
    //       return null
    //     }

    //     return h('div', { class: 'flex w-[100px] items-center' }, [
    //       status.icon && h(Icon, { class: 'mr-2 h-4 w-4 shrink-0 text-muted-foreground', name: status.icon }),
    //       h('span', { class: 'whitespace-nowrap' }, status.label),
    //     ])
    //   },
    //   enableSorting: false,
    //   filterFn: (row, id, value) => {
    //     return value.includes(row.getValue(id))
    //   },
    // },
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
