<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'

import { Button } from '@/client/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/client/components/ui/dropdown-menu'

import { computed } from 'vue'
const { t } = useI18n()

interface DataTableViewOptionsProps {
  table: Table<TData>
}

const props = defineProps<DataTableViewOptionsProps>()
const pageSize = ref('20')
const columns = computed(() => props.table.getAllColumns()
  .filter(
    column =>
      typeof column.accessorFn !== 'undefined' && column.getCanHide(),
  ))


const position = ref('bottom')
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="hidden h-8 ml-auto lg:flex">
        <Icon name="tabler:settings" class="w-4 h-4 mr-2" />
        Вид
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" class="w-56">
      <DropdownMenuLabel>Столбцы</DropdownMenuLabel>

      <DropdownMenuCheckboxItem v-for="column in columns" :key="column.id" class="capitalize"
        :model-value="column.getIsVisible()" @update:model-value="(value) => column.toggleVisibility(!!value)">
        {{ t(`schemas.organizations.${column.id}`) }}
      </DropdownMenuCheckboxItem>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <span>Строк на странице - {{pageSize}}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup v-model="pageSize" @update:model-value="(e: any) => table.setPageSize(e)">
            <DropdownMenuRadioItem v-for="pageSize in [10, 20, 30, 40, 50, 100]" :key="pageSize" class="capitalize"
              :value="`${ pageSize }`">
              {{ pageSize }}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuContent>

  </DropdownMenu>
</template>