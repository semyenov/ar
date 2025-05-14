import { Icon, NuxtLink } from '#components'
// import tasks from '@/client/data/tasks.json'
import { faker,fakerRU} from '@faker-js/faker';
import type { ColumnDef } from '@tanstack/vue-table'
import { organizationStatuses } from '~/client/data/data'

// import { columns } from '@/client/components/organizations/column'
import type { Organization, Task } from '~/client/data/schema'
import DataTableColumnHeader from '@/client/components/organizations/ColumnHeader.vue'
import DataTableRowActions from '@/client/components/organizations/RowActions.vue'
import { Checkbox } from '@/client/components/ui/checkbox'

export const columns = (t:any):ColumnDef<Organization>[] => ([
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
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.name') }),

    cell: ({ row  }) => {

      console.log(row)
      return h('div', { class: 'flex space-x-2' }, [
        h(NuxtLink, { to: `/admin/organizations/${row.original.id}` ,class: 'transition hover:text-muted-foreground max-w-[500px] truncate ' }, row.getValue('name')),
      ])
    },
  },
  {
    accessorKey: 'inn',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.inn') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('inn')),
      ])
    },
    enableSorting: false,
  },
  {
    accessorKey: 'kpp',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.kpp') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('kpp')),
      ])
    },
    enableSorting: false,
  },
  {
    accessorKey: 'district',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.district') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('district')),
      ])
    },
  },
  {
    accessorKey: 'address',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.address') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('address')),
      ])
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.status') }),

    cell: ({ row }) => {
      const status = organizationStatuses.find(
        status => status.value === row.getValue('status'),
      )

      if (!status)
        return null

      return h('div', { class: 'flex w-[100px] items-center' }, [
        status.icon && h(Icon, { class: 'mr-2 h-4 w-4 shrink-0 text-muted-foreground',name:status.icon }),
        h('span', {class:'whitespace-nowrap'},status.label),
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