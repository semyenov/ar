<script lang="ts" setup>
import { useListReviewFlows } from '~/client/api'

const props = defineProps({
  formId: {
    required: true,
    type: String,
  },
})

const { data: flow } = useListReviewFlows({ formId: props.formId })
</script>

<template>
  <div class="flex flex-col w-full h-full gap-4 p-4">
    <Card v-if="flow" class="col-span-12">
      <CardHeader>
        <CardTitle class="text-xl">
          Review Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- <DataTable :data="flow.data" :columns="columns" /> -->
      </CardContent>
    </Card>
  </div>
</template>
