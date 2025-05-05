import { Icon, NuxtLink } from '#components'
// import tasks from '@/client/data/tasks.json'
import { faker,fakerRU} from '@faker-js/faker';
import type { ColumnDef } from '@tanstack/vue-table'
import { userStatuses } from '~/client/data/data'

// import { columns } from '@/client/components/organizations/column'
import type { User, Task } from '~/client/data/schema'
import DataTableColumnHeader from '@/client/components/users/ColumnHeader.vue'
import DataTableRowActions from '@/client/components/users/RowActions.vue'
import { Checkbox } from '@/client/components/ui/checkbox'

export const columns = (t:any):ColumnDef<User>[] => ([
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': (value:any)=> table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',

    }),
    cell: ({ row }) => h(Checkbox, { 'modelValue': row.getIsSelected(), 'onUpdate:modelValue': (value:any) => row.toggleSelected(!!value), 'ariaLabel': 'Select row',  }),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => h(DataTableColumnHeader, { column, title: t }),
  //   cell: ({ row }) => h('div', { class: 'w-20' }, row.getValue('id')),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'last_name',

    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.users.last_name') }),

    cell: ({ row }) => {
      console.log(row)
      return h('div', { class: 'flex space-x-2' }, [
        h(NuxtLink, { to: `/users/${row.id}` ,class: 'transition hover:text-muted-foreground max-w-[500px] truncate ' }, `${row.getValue('last_name')}`),
      ])
    },
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.users.first_name') }),

    cell: ({ row }) => {
      console.log(row)
      return h('div', { class: 'flex space-x-2' }, [
        h(NuxtLink, { to: `/users/${row.id}` ,class: 'transition hover:text-muted-foreground max-w-[500px] truncate ' }, `${row.getValue('first_name')}`),
      ])
    },
  },

  {
    accessorKey: 'email',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.users.email') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('email')),
      ])
    },
    enableSorting: true,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.users.phone') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('phone')),
      ])
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.users.status') }),

    cell: ({ row }) => {
      const status = userStatuses.find(
        status => status.value === row.getValue('status'),
      )

      if (!status)
        return null

      return h('div', { class: 'flex w-[100px] items-center' }, [
        status.icon && h(Icon, { class: 'mr-2 h-4 w-4 shrink-0 text-muted-foreground',name:status.icon }),
        h('span', {class:'whitespace-nowrap'},status.label),
      ])
    },
    enableSorting: false,
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