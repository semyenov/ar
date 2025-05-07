<script setup lang="ts">
import { faker, fakerRU } from '@faker-js/faker';
import { organizationStatuses } from '../data/data';
import type { Organization } from '../data/schema';
import { groupBy } from 'remeda'
import { Container, Draggable } from '@sozdev/vue-smooth-dnd'

import type { DropPlaceholderOptions, DropResult } from 'smooth-dnd'


const { t } = useI18n()

const router = useRouter()

definePageMeta({
  // set custom layout
  layout: 'admin',

})

const data = ref<Organization[]>([])
const dataProblem = ref<Organization[]>([])
const orgsByStatus = ref<Record<string, Organization[]>>({})

async function getData(): Promise<Organization[]> {
  const res: Organization[] = []
  for (let index = 0; index < 100; index++) {
    // const n = faker.number.int({ min: 0, max: 6 })
    // console.log(organizationStatuses[n].value);

    res.push({
      id: faker.string.nanoid(),
      status: organizationStatuses[faker.number.int({ min: 0, max: organizationStatuses.length - 1 })].value,
      name: fakerRU.company.name(),
      inn: faker.string.numeric(10),
      kpp: faker.string.numeric(8),
      district: fakerRU.location.state(),
      address: `${fakerRU.location.city()}, ${fakerRU.location.streetAddress()}`
    })
  }
  return res
}

onMounted(async () => {

  data.value = await getData()
  orgsByStatus.value = groupBy(data.value, (item: Organization) => item.status)
})

const dropPlaceholderOptions:DropPlaceholderOptions = {
  className: 'drop-preview',
  animationDuration: 150,
  showOnTop: true
}
const applyDrag = (arr: Organization[], dragResult: DropResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}

function onCardDrop(status: string, dropResult: DropResult) {
  console.log(dropResult);
  if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
    const temp = { ...orgsByStatus.value }
    const column = temp[status]

    let newColumn = [...column]
    newColumn = applyDrag(newColumn, dropResult)
    temp[status] = newColumn

    orgsByStatus.value = temp
  }
}


function getCardPayload(status: string) {
  return (index: number) => {
    return orgsByStatus.value[status][index]
  }
}

</script>

<template>
  <div class="flex flex-col flex-grow p-4 overflow-hidden bg-background text-foreground">
    <h1 class="mb-4 text-4xl font-bold">
      {{ t('pages.statuses.title') }}
    </h1>
    <p class="mb-8 text-xl">
      {{ t('pages.statuses.welcome') }}
    </p>
    <div class="flex flex-grow w-full gap-4 overflow-x-auto overflow-y-hidden">
      <Card v-for="(s, si) in organizationStatuses" >
        <CardHeader>{{ s.label }}</CardHeader>
        <CardContent>
          <Container class="card-container" :key="si" group-name="test" @drop="(e) => onCardDrop(s.value, e)"
            :get-child-payload="getCardPayload(s.value)" drag-class="card-ghost" drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions">
            <Draggable v-for="org in orgsByStatus[s.value]" :key="org.id">
              <Card class="transition hover:bg-accent hover:cursor-move" @dblclick="router.push(`/organizations/${org.id}`)">
                <CardHeader>
                  <HoverCard :title="org.name" >
                    <HoverCardTrigger class="truncate">{{ org.name }}</HoverCardTrigger>
                    <HoverCardContent>
                      <div class="flex flex-col">
                        <h4 class="font-medium">{{ org.name }}</h4>
                        <CardDescription>{{ org.address }}</CardDescription>
                        <span class="text-sm">ИНН: {{ org.inn }}</span>
                        <span class="text-sm">КПП: {{ org.kpp }}</span>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <CardDescription>{{ org.address }}</CardDescription>
                </CardHeader>
              </Card>
            </Draggable>
          </Container>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
<style lang="postcss">
.card-container {
  @apply min-w-80 w-80 flex flex-col gap-2;
}
</style>