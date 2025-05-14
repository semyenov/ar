<script setup lang="ts" generic="TValue">

import type { ColumnDef } from '@tanstack/vue-table'
import type { FormTemplate } from '~/client/api';


const props = defineProps<{
  columns: ColumnDef<FormTemplate, TValue>[]
  data: FormTemplate[]
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
