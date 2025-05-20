import { NuxtLink } from '#components'

// import tasks from '@/client/data/tasks.json'
import type { ColumnDef } from '@tanstack/vue-table'
// import { columns } from '@/client/components/organizations/column'
import type { FormTemplate, FormTemplateField } from '~/client/api'

import DataTableColumnHeader from '@/client/components/formTemplates/ColumnHeader.vue'
import DataTableRowActions from '@/client/components/formTemplates/RowActions.vue'

export function columns(t: any): ColumnDef<FormTemplate>[] {
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
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('formTemplates.name') })
      },

      cell: ({ row }) => {
        console.log(row)

        return h('div', { class: 'flex space-x-2' }, [h(NuxtLink, { class: 'transition hover:text-muted-foreground max-w-[500px] truncate ', to: `/admin/formTemplates/${row.original.id}` }, row.getValue('name'))])
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('formTemplates.description') })
      },

      cell: ({ row }) => {
        return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate ' }, row.getValue('description'))])
      },
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('formTemplates.createdAt') })
      },

      cell: ({ row }) => {
        return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate' }, row.getValue('createdAt'))])
      },
      enableSorting: true,
    },
    {
      accessorKey: 'fields',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('formTemplates.fields') })
      },

      cell: ({ row }) => {
        const fields: FormTemplateField[] = row.getValue('fields')

        return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate ' }, fields.length)])
      },
      enableSorting: false,
    },
    {
      accessorKey: '_count',
      header: ({ column }) => {
        return h(DataTableColumnHeader, { column, title: t('formTemplates.countForms') })
      },

      cell: ({ row }) => {
        const count: any = row.getValue('_count')

        return h('div', { class: 'flex space-x-2' }, [h('span', { class: 'max-w-[500px] truncate ' }, count.forms)])
      },
      enableSorting: false,
    },
    {
      cell: ({ row }) => {
        return h(DataTableRowActions, { row })
      },
      id: 'actions',
    },
  ]
}
