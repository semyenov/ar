<script setup lang="ts">
import type { FormStatus } from '~/client/api'

const props = defineProps({
  status: {
    required: true,
    type: String as PropType<FormStatus>,
  },
})
const { t } = useI18n()
const badgeTitle = computed(() => {
  return t(`forms.status.${props.status.toLowerCase()}`)
})
const badgeCls = computed(() => {
  switch (props.status) {
    case 'APPROVED':
      return 'bg-emerald-700 text-white'
    case 'DRAFT':
      return 'bg-gray-400 text-white'
    case 'NEEDS_CHANGES':
      return 'bg-amber-700 text-white'
    case 'REJECTED':
      return 'bg-rose-700 text-white'
    case 'UNDER_REVIEW':
      return 'bg-sky-700 text-white'
    default:
      return 'bg-gray-700 text-white'
  }
})
</script>

<template>
  <Badge :class="badgeCls">
    {{ badgeTitle }}
  </Badge>
</template>
