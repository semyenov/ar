<script setup lang="ts" generic="TValue">
import { getCoreRowModel, getPaginationRowModel, useVueTable, type ColumnDef } from '@tanstack/vue-table'
import type { Form } from '~/client/api';


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
  <DataTable :data="data" :columns="columns" >
    <template #toolbar>
      <FormsToolbar :table="table"/>
    </template>
  </DataTable>
</template>
