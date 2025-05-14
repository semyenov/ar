<script setup lang="ts" generic="TData, TValue">
import { type Table } from '@tanstack/vue-table'

// import ChevronLeftIcon from '~icons/radix-icons/chevron-left'
// import ChevronRightIcon from '~icons/radix-icons/chevron-right'
// import DoubleArrowLeftIcon from '~icons/radix-icons/double-arrow-left'
// import DoubleArrowRightIcon from '~icons/radix-icons/double-arrow-right'

import { Button } from '@/client/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/client/components/ui/select'

interface DataTablePaginationProps {
  table: Table<TData>
}
defineProps<DataTablePaginationProps>()
</script>

<template>
  <div class="flex items-center justify-between py-4">
    <div class="flex-1 text-sm text-muted-foreground">
      <!-- {{ table.getFilteredSelectedRowModel().rows.length }} из
      {{ table.getFilteredRowModel().rows.length }} строк выбрано -->
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <!-- <p class="text-sm font-medium">
          Строк на странице {{ table.getState().pagination.pageSize }}
        </p> -->
        <!-- <Select
          :model-value="`${table.getState().pagination.pageSize}`"
          @update:model-value="(e:any)=>table.setPageSize(e)"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="pageSize in [10, 20, 30, 40, 50, 100]" :key="pageSize" :value="`${pageSize}`">
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select> -->
      </div>
      <div class="flex w-[130px] items-center justify-center text-sm font-medium">
        Страница {{ table.getState().pagination.pageIndex + 1 }} из
        {{ table.getPageCount() }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden w-8 h-8 p-0 lg:flex"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <Icon name="tabler:chevrons-left" />
        </Button>
        <Button
          variant="outline"
          class="w-8 h-8 p-0"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <Icon name="tabler:chevron-left" />
          <!-- <ChevronLeftIcon class="w-4 h-4" /> -->
        </Button>
        <Button
          variant="outline"
          class="w-8 h-8 p-0"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <Icon name="tabler:chevron-right" />
          <!-- <ChevronRightIcon class="w-4 h-4" /> -->
        </Button>
        <Button
          variant="outline"
          class="hidden w-8 h-8 p-0 lg:flex"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <!-- <DoubleArrowRightIcon class="w-4 h-4" /> -->
          <Icon name="tabler:chevrons-right" />
        </Button>
      </div>
    </div>
  </div>
</template>