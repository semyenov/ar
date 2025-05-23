<script setup lang="ts">
const store = useStore()

const formTemplate = await store.formTemplates.create({
  description: 'Test',
  id: 'test',
  lastModifiedBy: 'test',
  name: 'Test',
})
</script>

<template>
  <div>
    {{ formTemplate }}
  </div>
</template>
