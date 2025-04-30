import type { ColumnDef } from '@tanstack/vue-table'
import DropdownAction from '@/client/components/organizations/DataTableDropDown.vue'

import { h } from 'vue'

export interface Payment {
  amount: number
  email: string
  id: string
  status: 'failed' | 'pending' | 'processing' | 'success'
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'amount',
    cell: ({ row }: any) => {
      const amount = Number.parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        currency: 'USD',
        style: 'currency',
      })
        .format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
    },
    header: () => {
      return h('div', { class: 'text-right' }, 'Amount')
    },

  },
  {
    cell: ({ row }) => {
      const payment = row.original

      return h('div', { class: 'relative text-black' }, h(DropdownAction, {
        payment,
      }))
    },
    enableHiding: false,
    id: 'actions',
  },
]
