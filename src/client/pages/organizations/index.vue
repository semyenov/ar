<script setup lang="ts">
import type { Payment } from '~/client/components/organizations/column'

import { columns } from '@/client/components/organizations/column'
// import DataTable from '@client/components/organizations/data-table.vue'

const { t } = useI18n()
definePageMeta({
  // set custom layout
  layout: 'admin',
})
const data = ref<Payment[]>([])

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      amount: 100,
      email: 'm@example.com',
      id: '728ed52f',
      status: 'pending',
    },
    {
      amount: 125,
      email: 'example@gmail.com',
      id: '489e1d42',
      status: 'processing',
    },
    // ...
  ]
}

onMounted(async () => {
  data.value = await getData()
})
</script>

<template>
  <div class="grid grid-cols-12 p-4">
    <Card class="col-span-12">
      <CardHeader>
        <CardTitle class="text-xl">
          {{ t('pages.organizations.title') }}
        </CardTitle>
        <CardDescription> {{ t('pages.organizations.welcome') }}</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <OrganizationsDataTable :data="data" :columns="columns" />
      </CardContent>
    </Card>
    <!-- <Card class="col-span-4">
      <CardHeader>
        <CardTitle class="text-xl">
          {{ t('pages.organizations.title') }}
        </CardTitle>
        <CardDescription> {{ t('pages.organizations.welcome') }}</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div>
          Большая таблица с данными
        </div>
      </CardContent>
    </Card> -->
  </div>
</template>
