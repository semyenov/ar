<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/client/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <td
    :class="
      cn(
        'py-2 px-3 align-middle',
        props.class,
      )
    "
  >
    <slot />
  </td>
</template>
