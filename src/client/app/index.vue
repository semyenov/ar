<script setup lang="ts">
import { NuxtRouteAnnouncer } from '#components'

const route = useRoute()
const store = useStore()

store.users.create(
  {
    email: 'test@test.com',
    name: 'test',
    role: 'admin',

    createdAt: new Date(),
    updatedAt: new Date(),
  },
)
</script>

<template>
  <!-- <NuxtRouteAnnouncer :route="route">
    <template #default="{ message }">
      <p>{{ message }} was loaded.</p>
    </template>
  </NuxtRouteAnnouncer>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout> -->
  <dialog>
    <div>
      <h1>Hello</h1>
    </div>
  </dialog>
</template>
