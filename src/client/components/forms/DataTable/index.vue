<script setup lang="ts" generic="TValue">
import type { Form } from '~/client/api'

import { type ColumnDef, getCoreRowModel, getPaginationRowModel, useVueTable } from '@tanstack/vue-table'

const props = defineProps<{
  columns: ColumnDef<Form, TValue>[]
  data: Form[]
}>()

const table = useVueTable({
  get columns() {
    return props.columns
  },
  get data() {
    return props.data
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
</script>

<template>
  <DataTable :data="data" :columns="columns">
    <template #toolbar>
      <FormsDataTableToolbar :table="table" />
    </template>
  </DataTable>
</template>
