<script setup lang="ts">
import { Icon, NuxtLink } from '#components'
// import tasks from '@/client/data/tasks.json'
import { faker,fakerRU} from '@faker-js/faker';
import type { ColumnDef } from '@tanstack/vue-table'
import { userStatuses } from '~/client/data/data'

import {columns} from '@/client/components/users/column'

// import { columns } from '@/client/components/organizations/column'
import type { User, Task } from '~/client/data/schema'
import DataTableColumnHeader from '@/client/components/organizations/ColumnHeader.vue'
import DataTableRowActions from '@/client/components/organizations/RowActions.vue'
import { Checkbox } from '@/client/components/ui/checkbox'

const { t } = useI18n()

definePageMeta({
  // set custom layout
  layout: 'admin',
})
const data = ref<User[]>([])



async function getData(): Promise<User[]> {
  const res:User[] = []
  for (let index = 0; index < 10000; index++) {
    // const n = faker.number.int({ min: 0, max: 6 })
    // console.log(userStatuses[n].value);

    res.push({
      id: faker.string.nanoid(),
      status: userStatuses[faker.number.int({ min: 0, max: userStatuses.length-1 })].value,
      first_name: fakerRU.person.firstName(),
      last_name: fakerRU.person.lastName(),
      phone: fakerRU.phone.number({ style:'national'}),
      email: faker.internet.email()
    })
  }
  return res
}

onMounted(async () => {

  data.value = await getData()


})



</script>

<template>
  <div class="grid grid-cols-12 p-4 space-y-4">
    <Card class="col-span-12 ">
      <CardHeader>
        <CardTitle class="text-xl">
          {{ t('pages.organizations.title') }}
        </CardTitle>
        <CardDescription> {{ t('pages.organizations.welcome') }}</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <UsersDataTable :data="data" :columns="columns(t)" />
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
