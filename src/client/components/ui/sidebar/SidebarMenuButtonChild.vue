<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { Primitive, type PrimitiveProps } from 'reka-ui'

import { cn } from '@/client/lib/utils'

import { type SidebarMenuButtonVariants, sidebarMenuButtonVariants } from '.'

export interface SidebarMenuButtonProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
  isActive?: boolean
  size?: SidebarMenuButtonVariants['size']
  variant?: SidebarMenuButtonVariants['variant']
}

const props = withDefaults(defineProps<SidebarMenuButtonProps>(), {
  as: 'button',
  size: 'default',
  variant: 'default',
})
</script>

<template>
  <Primitive
    data-sidebar="menu-button"
    :data-size="size"
    :data-active="isActive"
    :class="cn(sidebarMenuButtonVariants({ variant, size }), props.class)"
    :as="as"
    :as-child="asChild"
    v-bind="$attrs"
  >
    <slot />
  </Primitive>
</template>
