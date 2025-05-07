<script setup lang="ts">
import { DialogTitle, type DialogTitleProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/client/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] } & DialogTitleProps>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DialogTitle
    :class="cn('text-lg font-semibold text-foreground', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogTitle>
</template>
