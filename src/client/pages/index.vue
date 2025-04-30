<script setup lang="ts">
const { t } = useI18n()
definePageMeta({
  // set custom layout
  layout: 'default',

})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
    <h1 class="mb-4 text-4xl font-bold">
      {{ t('pages.index.welcome') }}
    </h1>
    <p class="mb-8 text-xl">
      {{ t('pages.index.start') }} <code class="p-1 rounded bg-muted">pages/index.vue</code>
    </p>
  </div>
</template>
