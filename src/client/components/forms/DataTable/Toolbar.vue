<script setup lang="ts" generic="TData, TValue">
import type { Table } from '@tanstack/vue-table'
import { Button } from '@/client/components/ui/button'

import { Input } from '@/client/components/ui/input'
import { computed } from 'vue'
// import Cross2Icon from '~icons/radix-icons/cross-2'

import { priorities, organizationStatuses } from '@/client/data/data'
import DataTableFacetedFilter from '/client/components/DataTable/FacetedFilter.vue'
import DataTableViewOptions from '/client/components/DataTable/ViewOptions.vue'
import { FormStatus } from '~/client/api'

interface DataTableToolbarProps {
  table: Table<TData>
}
const { t } = useI18n()
const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)

const statuses = computed(() => {
  return Object.keys(FormStatus).map((s) => ({
    label: t(`forms.status.${s.toLowerCase()}`),
    value: s,
  }))
})
const templates = computed(() => {
  return Object.keys(FormStatus).map((s) => ({
    label: t(`forms.status.${s.toLowerCase()}`),
    value: s,
  }))
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center flex-1 space-x-2">
      <Input
        placeholder="Поиск по имени"
        :model-value="(table.getColumn('name')?.getFilterValue() as string) ?? ''"
        class="h-8 w-[150px] lg:w-[250px]"
        @input="table.getColumn('title')?.setFilterValue($event.target.value)"
      />
      <DataTableFacetedFilter
        v-if="table.getColumn('status')"
        :column="table.getColumn('status')"
        :title="t('schemas.organizations.status')"
        :options="statuses"
      />
      <!-- <DataTableFacetedFilter
        v-if="table.getColumn('template')"
        :column="table.getColumn('priority')"
        title="Priority"
        :options="priorities"
      /> -->

      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <Icon name="tabler:x" class="w-4 h-4 ml-2" />
      </Button>
    </div>
    <DataTableViewOptions :table="table" />
  </div>
</template>