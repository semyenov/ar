<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/vue-table'

import {
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { valueUpdater } from '~/client/lib/utils'

import { Button } from '@/client/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/client/components/ui/table'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const table = useVueTable({
  get columns() {
    return props.columns
  },
  get data() {
    return props.data
  },
  enableRowSelection: true,
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onColumnFiltersChange: (updaterOrValue) => {
    return valueUpdater(updaterOrValue, columnFilters)
  },
  onColumnVisibilityChange: (updaterOrValue) => {
    return valueUpdater(updaterOrValue, columnVisibility)
  },
  onRowSelectionChange: (updaterOrValue) => {
    return valueUpdater(updaterOrValue, rowSelection)
  },
  onSortingChange: (updaterOrValue) => {
    return valueUpdater(updaterOrValue, sorting)
  },
  state: {
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
    get sorting() {
      return sorting.value
    },
  },
})
</script>

<template>
  <div class="space-y-4">
    <slot name="toolbar">
      <DataTableToolbar :table="table" />
    </slot>
    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <slot name="pagination">
      <DataTablePagination :table="table" />
    </slot>
  </div>
</template>
