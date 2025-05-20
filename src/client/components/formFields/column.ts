import type { ColumnDef } from '@tanstack/vue-table'
import type { Comment, FormField } from '~/client/api'

import { FormFieldsRowActions, Icon } from '#components'

import DataTableColumnHeader from '@/client/components/formFields/ColumnHeader.vue'

export function columns(t: any, reviewFlowId: string): ColumnDef<FormField>[] {
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
      accessorKey: 'order',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('formFields.order') })
      },

      cell: ({ row }) => {
        return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('order'))])
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('formFields.name') })
      },

      cell: ({ row }) => {
        console.log(row)

        return h('div', { class: 'flex space-x-2' }, [h('span', row.getValue('name'))])
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('formFields.type') })
      },

      cell: ({ row }) => {
        return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('type'))])
      },
      enableSorting: false,
    },
    {
      accessorKey: 'value',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('formFields.value') })
      },

      cell: ({ row }) => {
        return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('value'))])
      },
      enableSorting: false,
    },
    // {
    //   accessorKey: 'defaultValue',
    //   header: ({ column }) => h(DataTableColumnHeader, { column, title: t('formFields.defaultValue') }),

    //   cell: ({ row }) => {
    //     return h('div', { class: 'flex space-x-2' }, [
    //       h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('defaultValue')),
    //     ])
    //   },
    //   enableSorting: false,
    // },
    {
      accessorKey: 'required',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('formFields.required') })
      },

      cell: ({ row }) => {
        const v = row.getValue('required')

        return h('div', { class: 'flex w-[100px] items-center' }, [h(Icon, { class: 'mr-2 h-4 w-4 shrink-0', name: v ? 'tabler:check' : 'tabler:x' })])
      },
      enableSorting: false,
    },

    {
      accessorKey: 'comments',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('formFields.comments') })
      },

      cell: ({ row }) => {
        const comments = row.getValue('comments') as Comment[]

        return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate ' }, comments.length)])
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('forms.fields.status') })
      },

      cell: ({ row }) => {
        // const status = organizationStatuses.find(
        //   (status) => {
        //     return status.value === row.getValue('status')
        //   },
        // )

        // if (!status) {
        //   return null
        // }

        return h('div', { class: 'flex w-[100px] items-center' }, [
          // status.icon && h(Icon, { class: 'mr-2 h-4 w-4 shrink-0 text-muted-foreground', name: status.icon }),
          h('span', { class: 'whitespace-nowrap' }, row.getValue('status')),
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
        return h(FormFieldsRowActions, {

          reviewFlowId,
          row: row.original,
        })
      },
      id: 'actions',
    },
  ]
}
