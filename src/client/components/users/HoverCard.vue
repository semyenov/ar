<script lang="ts" setup>
import type { User } from '~/client/data/schema';

const props = defineProps<{
  user: User
}>()
</script>
<template>
  <HoverCard >
    <HoverCardTrigger class="font-medium underline truncate transition cursor-pointer hover:text-muted-foreground">{{ user.first_name }} {{ user.last_name }}</HoverCardTrigger>
    <HoverCardContent class="w-96">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <h4 class="font-medium">{{ user.first_name }} {{ user.last_name }}</h4>
          <Badge>Администратор</Badge>
        </div>
        <CardDescription>Email: {{ user.email }}</CardDescription>
        <CardDescription>Телефон: {{ user.phone }}</CardDescription>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>