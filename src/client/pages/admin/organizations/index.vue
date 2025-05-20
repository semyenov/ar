<script setup lang="ts">
import { Icon, NuxtLink } from '#components'
import { useOrgCreate, useOrgList } from '~/client/api'
// import tasks from '@/client/data/tasks.json'
import { faker, fakerRU } from '@faker-js/faker'
import { organizationStatuses } from '~/client/data/data'

import { columns } from '@/client/components/organizations/column'

// import { columns } from '@/client/components/organizations/column'
import type { Organization } from '~/client/data/schema'

import { onMounted } from 'vue'

const { t } = useI18n()

definePageMeta({
  // set custom layout
  auth: {
    only: 'admin',
    redirectGuestTo: '/auth/sign-in',
    redirectUserTo: '/dashboard',
  },
  layout: 'admin',
})
const data = ref<Organization[]>([])
const dataProblem = ref<Organization[]>([])

async function getData(): Promise<Organization[]> {
  const res: Organization[] = []

  const { data: organizations } = await useOrgList()
  if (!organizations) {
    return []
  }

  for (const org of organizations) {
    res.push({
      address: '',
      district: fakerRU.location.state(),
      id: org.id,
      inn: faker.string.numeric(10),
      kpp: faker.string.numeric(8),
      name: org.name,
      slug: org.slug,
      status: organizationStatuses[faker.number.int({ max: organizationStatuses.length - 1, min: 0 })].value,
    })
  }
  // for (let index = 0; index < 10000; index++) {
  //   // const n = faker.number.int({ min: 0, max: 6 })
  //   // console.log(organizationStatuses[n].value);

  //   res.push({
  //     id: faker.string.nanoid(),
  //     status: organizationStatuses[faker.number.int({ min: 0, max: organizationStatuses.length-1 })].value,
  //     name: fakerRU.company.name(),
  //     inn: faker.string.numeric(10),
  //     kpp: faker.string.numeric(8),
  //     district: fakerRU.location.state(),
  //     address: ''
  //   })
  // }

  return res
}

async function addOrganization() {
  const create = await useOrgCreate()
  console.log(create)
}

onMounted(async () => {
  data.value = await getData()
  dataProblem.value = await getDataProblem()
})
// const columns: ColumnDef<Organization>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => h(Checkbox, {
//       'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
//       'onUpdate:modelValue': (value:any)=> table.toggleAllPageRowsSelected(!!value),
//       'ariaLabel': 'Select all',

//     }),
//     cell: ({ row }) => h(Checkbox, { 'modelValue': row.getIsSelected(), 'onUpdate:modelValue': (value:any) => row.toggleSelected(!!value), 'ariaLabel': 'Select row',  }),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   // {
//   //   accessorKey: 'id',
//   //   header: ({ column }) => h(DataTableColumnHeader, { column, title: t }),
//   //   cell: ({ row }) => h('div', { class: 'w-20' }, row.getValue('id')),
//   //   enableSorting: false,
//   //   enableHiding: false,
//   // },
//   {
//     accessorKey: 'name',
//     header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.name') }),

//     cell: ({ row }) => {
//       return h('div', { class: 'flex space-x-2' }, [
//         h(NuxtLink, { to: `/organizations/${row.id}` ,class: 'max-w-[500px] truncate font-medium' }, row.getValue('name')),
//       ])
//     },
//   },
//   {
//     accessorKey: 'inn',
//     header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.inn') }),

//     cell: ({ row }) => {
//       return h('div', { class: 'flex space-x-2' }, [
//         h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('inn')),
//       ])
//     },
//     enableSorting: false,
//   },
//   {
//     accessorKey: 'kpp',
//     header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.kpp') }),

//     cell: ({ row }) => {
//       return h('div', { class: 'flex space-x-2' }, [
//         h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('kpp')),
//       ])
//     },
//     enableSorting: false,
//   },
//   {
//     accessorKey: 'district',
//     header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.district') }),

//     cell: ({ row }) => {
//       return h('div', { class: 'flex space-x-2' }, [
//         h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('district')),
//       ])
//     },
//   },
//   {
//     accessorKey: 'address',
//     header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.address') }),

//     cell: ({ row }) => {
//       return h('div', { class: 'flex space-x-2' }, [
//         h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('address')),
//       ])
//     },
//   },
//   {
//     accessorKey: 'status',
//     header: ({ column }) => h(DataTableColumnHeader, { column, title: t('schemas.organizations.status') }),

//     cell: ({ row }) => {
//       const status = organizationStatuses.find(
//         status => status.value === row.getValue('status'),
//       )

//       if (!status)
//         return null

//       return h('div', { class: 'flex w-[100px] items-center' }, [
//         status.icon && h(Icon, { class: 'mr-2 h-4 w-4 shrink-0 text-muted-foreground',name:status.icon }),
//         h('span', status.label),
//       ])
//     },
//     filterFn: (row, id, value) => {
//       return value.includes(row.getValue(id))
//     },
//   },
//   // {
//   //   accessorKey: 'priority',
//   //   header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Priority' }),
//   //   cell: ({ row }) => {
//   //     const priority = priorities.find(
//   //       priority => priority.value === row.getValue('priority'),
//   //     )

//   //     if (!priority)
//   //       return null

//   //     return h('div', { class: 'flex items-center' }, [
//   //       priority.icon && h(Icon, { class: 'mr-2 h-4 w-4 text-muted-foreground',name:priority.icon }),
//   //       h('span', {}, priority.label),
//   //     ])
//   //   },
//   //   filterFn: (row, id, value) => {
//   //     return value.includes(row.getValue(id))
//   //   },
//   // },
//   {
//     id: 'actions',
//     cell: ({ row }) => h(DataTableRowActions, { row }),
//   },
// ]

async function getDataProblem(): Promise<Organization[]> {
  const res: Organization[] = []
  for (let index = 0; index < 15; index++) {
    // const n = faker.number.int({ min: 0, max: 6 })
    // console.log(organizationStatuses[n].value);

    res.push({
      address: '',
      district: fakerRU.location.state(),
      id: faker.string.nanoid(),
      inn: faker.string.numeric(10),
      kpp: faker.string.numeric(8),
      name: fakerRU.company.name(),
      slug: faker.string.nanoid(),
      status: organizationStatuses[faker.number.int({ max: organizationStatuses.length - 1, min: 0 })].value,
    })
  }

  return res
}
</script>

<template>
  <div class="grid grid-cols-12 p-4 space-y-4">
    <Button variant="destructive" @click="addOrganization">
      ДОБАВИТЬ ОРГ
    </Button>
    <Alert class="flex items-start col-span-12 gap-4 p-6">
      <Icon name="tabler:alert-triangle" class="w-8 h-8 text-destructive" />
      <div class="flex flex-col">
        <AlertTitle class="text-base">
          Внимание
        </AlertTitle>
        <AlertDescription class="text-muted-foreground">
          Обнаружено {{ dataProblem.length }} организаций без пользователя. Рекомендуется назначить пользователей, прежде чем продолжать работу.
        </AlertDescription>
        <NuxtLink class="flex items-center gap-2 mt-2" to="/organizations/problems">
          Перейти к редактированию <Icon name="tabler:arrow-narrow-right" />
        </NuxtLink>
      </div>
    </Alert>
    <Card class="col-span-12 ">
      <CardHeader>
        <CardTitle class="text-xl">
          {{ t('pages.organizations.title') }}
        </CardTitle>
        <CardDescription> {{ t('pages.organizations.welcome') }}</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <OrganizationsDataTable :data="data" :columns="columns(t)" />
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
