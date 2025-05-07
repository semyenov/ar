<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { Separator } from '@/client/components/ui/separator'
import { cn } from '@/client/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Separator
    data-sidebar="separator"
    :class="cn('mx-2 w-auto bg-sidebar-border', props.class)"
  >
    <slot />
  </Separator>
</template>
