<script setup lang="ts">
import { DialogDescription, type DialogDescriptionProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/client/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] } & DialogDescriptionProps>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DialogDescription
    :class="cn('text-sm text-muted-foreground', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogDescription>
</template>
