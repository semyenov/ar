<script setup lang="ts">
import {
  DropdownMenuSeparator,
  type DropdownMenuSeparatorProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/client/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
} & DropdownMenuSeparatorProps>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DropdownMenuSeparator v-bind="delegatedProps" :class="cn('-mx-1 my-1 h-px bg-muted', props.class)" />
</template>
