<script setup lang="ts" generic=" TValue">
import type { ColumnDef } from '@tanstack/vue-table'
import type { FormField } from '~/client/api'

const props = defineProps<{
  columns: ColumnDef<FormField, TValue>[]
  data: FormField[]
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
