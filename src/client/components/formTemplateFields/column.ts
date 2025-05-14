import { Icon, NuxtLink } from '#components'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTableColumnHeader from '@/client/components/formTemplateFields/ColumnHeader.vue'
import DataTableRowActions from '@/client/components/formTemplateFields/RowActions.vue'
import { Checkbox } from '@/client/components/ui/checkbox'
import type { FormTemplateField } from '~/client/api'

export const columns = (t:any):ColumnDef<FormTemplateField>[] => ([
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
    accessorKey: 'order',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('formTemplateFields.order') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('order')),
      ])
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('formTemplateFields.name') }),

    cell: ({ row  }) => {

      console.log(row)
      return h('div', { class: 'flex space-x-2' }, [
        h(NuxtLink, { to: `/admin/formTemplateFields/${row.original.id}` ,class: 'transition hover:text-muted-foreground max-w-[500px] truncate ' }, row.getValue('name')),
      ])
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('formTemplateFields.type') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('type')),
      ])
    },
    enableSorting: false,
  },
  {
    accessorKey: 'validationRules',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('formTemplateFields.validationRules') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('validationRules')),
      ])
    },
    enableSorting: false,
  },
  {
    accessorKey: 'defaultValue',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('formTemplateFields.defaultValue') }),

    cell: ({ row }) => {
      return h('div', { class: 'flex space-x-2' }, [
        h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('defaultValue')),
      ])
    },
    enableSorting: false,
  },
  {
    accessorKey: 'required',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: t('formTemplateFields.required') }),

    cell: ({ row }) => {
      const v = row.getValue('required')
      return h('div', { class: 'flex w-[100px] items-center' }, [
         h(Icon, { class: 'mr-2 h-4 w-4 shrink-0',name:v?"tabler:check" :"tabler:x" }),
      ])
    },
    enableSorting: false,
  },

  // {
  //   accessorKey: 'options',
  //   header: ({ column }) => h(DataTableColumnHeader, { column, title: t('formTemplateFields.options') }),

  //   cell: ({ row }) => {
  //     return h('div', { class: 'flex space-x-2' }, [
  //       h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('options')),
  //     ])
  //   },
  // },
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => h(DataTableColumnHeader, { column, title: t('formTemplateFields.status') }),

  //   cell: ({ row }) => {
  //     const status = organizationStatuses.find(
  //       status => status.value === row.getValue('status'),
  //     )

  //     if (!status)
  //       return null

  //     return h('div', { class: 'flex w-[100px] items-center' }, [
  //       status.icon && h(Icon, { class: 'mr-2 h-4 w-4 shrink-0 text-muted-foreground',name:status.icon }),
  //       h('span', {class:'whitespace-nowrap'},status.label),
  //     ])
  //   },
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
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
])