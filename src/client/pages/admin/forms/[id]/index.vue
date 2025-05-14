<script setup lang="ts">
import { getForm, useListFormFields, useListForms } from '~/client/api'
import {columns} from '@/client/components/formFields/column'

const { t } = useI18n();
const route = useRoute()
definePageMeta({
  // set custom layout

  layout: 'admin',
})

const { data: formFields, isLoading, error } = useListFormFields({formId:route.params.id as string});
const form = await getForm(route.params.id as string)
// Computed property to get just the forms array
// const fields = computed(() => formFields.value?.items || []);
</script>

<template>
  <div class="flex flex-col w-full h-full gap-4 p-4">
     <Card class="col-span-12 " v-if=formFields>
      <CardHeader>
        <CardTitle class="text-xl">
         {{form.title}}
        </CardTitle>
        <CardDescription> {{ form.description }}</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <!-- <pre>{{ formFields }}</pre> -->
        <FormFieldsDataTable :data="formFields.items" :columns="columns(t)" />
      </CardContent>
    </Card>

  </div>
</template>
