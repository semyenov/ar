<script setup lang="ts">
import { Icon } from '#components'
// import tasks from '@/client/data/tasks.json'
import { faker,fakerRU} from '@faker-js/faker';
import type { ColumnDef } from '@tanstack/vue-table'
import { organizationStatuses } from '~/client/data/data'

// import { columns } from '@/client/components/organizations/column'
import type { Organization, Task } from '~/client/data/schema'
import DataTableColumnHeader from '@/client/components/organizations/ColumnHeader.vue'
import DataTableRowActions from '@/client/components/organizations/RowActions.vue'
import { Checkbox } from '@/client/components/ui/checkbox'

const { t } = useI18n()

definePageMeta({
  // set custom layout
  layout: 'admin',
})
const data = ref<Organization[]>([])

// async function getData(): Promise<Organization[]> {
//   const res:Organization[] = []
//   for (let index = 0; index < 10000; index++) {
//     // const n = faker.number.int({ min: 0, max: 6 })
//     // console.log(organizationStatuses[n].value);

//     res.push({
//       id: faker.string.nanoid(),
//       status: organizationStatuses[faker.number.int({ min: 0, max: organizationStatuses.length-1 })].value,
//       name: fakerRU.company.name(),
//       inn: faker.string.numeric(10),
//       kpp: faker.string.numeric(8),
//       district: fakerRU.location.state(),
//       address: ''
//     })
//   }
//   return res
// }

// onMounted(async () => {

//   data.value = await getData()
//   console.log(data.value);

// })

</script>

<template>
  <div class="grid grid-cols-12 p-4">
    <Card class="col-span-12">
      <CardHeader>
        <CardTitle class="text-xl">
          ООО "Тач ма талала, ма динь динь дон"
        </CardTitle>
        <CardDescription> {{ t('pages.organizations.welcome') }}</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <!-- <OrganizationsDataTable :data="data" :columns="columns" /> -->

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
