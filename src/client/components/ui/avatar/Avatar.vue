<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { AvatarRoot } from 'reka-ui'

import { cn } from '@/client/lib/utils'

import { avatarVariant, type AvatarVariants } from '.'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
}>(), {
  shape: 'circle',
  size: 'sm',
})
</script>

<template>
  <AvatarRoot :class="cn(avatarVariant({ size, shape }), props.class)">
    <slot />
  </AvatarRoot>
</template>
