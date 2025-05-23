<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from '@tanstack/vue-table'


const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

// const table = useVueTable({
//   get columns() {
//     return props.columns
//   },
//   get data() {
//     return props.data
//   },
//   getCoreRowModel: getCoreRowModel(),
//   getPaginationRowModel: getPaginationRowModel(),
// })
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>
