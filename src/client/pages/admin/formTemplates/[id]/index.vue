<script setup lang="ts">
import { getFormTemplate, useListForms, useListFormTemplateFields, useListFormTemplates, useOrgGetActiveMember, useOrgGetFullOrganization, useOrgList } from '~/client/api'

import { columns } from '@/client/components/formTemplateFields/column'

const { t } = useI18n()
const route = useRoute()
definePageMeta({
  // set custom layout
  auth: {
    only: 'admin',
    redirectGuestTo: '/auth/sign-in',
    redirectUserTo: '/dashboard',
  },
  layout: 'admin',
})

const { data: formTemplateFields, error, isLoading } = useListFormTemplateFields({ templateId: route.params.id as string })
const formTemplate = await getFormTemplate(route.params.id as string)
// Computed property to get just the forms array
const fields = computed(() => {
  return formTemplateFields.value?.items || []
})
</script>

<template>
  <div class="flex flex-col w-full h-full gap-4 p-4">
    <Card class="col-span-12 ">
      <CardHeader>
        <CardTitle class="text-xl">
          {{ formTemplate.name }}
        </CardTitle>
        <CardDescription> {{ formTemplate.description }}</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <FormTemplateFieldsDataTable :data="fields" :columns="columns(t)" />
      </CardContent>
    </Card>
  </div>
</template>
