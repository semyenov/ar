<script lang="ts" setup>
import type { Member } from '@prisma/client'
import type { PropType } from 'vue'

const props = defineProps({
  member: {
    required: true,
    type: Object as PropType<Member>,
  },
})
</script>

<template>
  <HoverCard>
    <HoverCardTrigger class="font-medium truncate transition cursor-pointer hover:underline hover:text-muted-foreground">
      {{ props.member.user.name }}
    </HoverCardTrigger>
    <HoverCardContent class="w-96">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <h4 class="text-sm font-semibold">
            {{ props.member.user.name }}
          </h4>
          <div class="flex items-center gap-2">
            <Badge>{{ props.member.role }}</Badge>
          </div>
        </div>
        <CardDescription>Email: {{ props.member.user.email }}</CardDescription>
        <NuxtLink to="/users/${user.id}" class="self-end text-xs hover:text-muted-foreground">
          Подробнее
        </NuxtLink>
        <!-- <CardDescription>Телефон: {{ user.phone }}</CardDescription> -->
      </div>
    </HoverCardContent>
  </HoverCard>
</template>
