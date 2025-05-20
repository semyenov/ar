<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import { FormStatus, getForm, listReviewFlows, useGetReviewFlow, useListFormFields, useListFormHistory, useListForms, useListReviewFlows, useUpdateForm } from '~/client/api'

import { columns } from '@/client/components/formFields/column'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
definePageMeta({
  // set custom layout
  auth: {
    only: 'admin',
    redirectGuestTo: '/auth/sign-in',
    redirectUserTo: '/dashboard',
  },
  layout: 'admin',
})

const queryClient = useQueryClient()
const { data: formHistory } = useListFormHistory({ formId: route.params.id as string }, undefined, queryClient)
const { data: formFields, error, isLoading } = useListFormFields({ formId: route.params.id as string }, undefined, queryClient)

const { mutateAsync } = useUpdateForm({
  mutation: {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['forms', { formId: route.params.id as string }],
      })
    },
  },
}, queryClient)

const form = await getForm(route.params.id as string)
const reviewFlow = await listReviewFlows({ formId: form.id })

const status = ref(form.status)

async function saveForm(id: string, status: FormStatus) {
  mutateAsync({
    data: { status },
    id,
  })
    .then(() => {
      router.push('/admin/forms')
    })
}
// Computed property to get just the forms array
// const fields = computed(() => formFields.value?.items || []);
</script>

<template>
  <div class="flex flex-col w-full h-full gap-4 p-4 overflow-y-auto">
    <NuxtLink class="flex items-center gap-2" to="/admin/forms">
      <Icon name="tabler:arrow-narrow-left" class="w-4 h-4" />
      {{ t('forms.back') }}
    </NuxtLink>
    <Card v-if="formFields" class="col-span-12 ">
      <CardHeader>
        <CardTitle class="text-xl">
          <div class="flex items-center gap-2">
            <h1 class="flex-grow whitespace-nowrap">
              {{ form.title }}
            </h1>
            <Select v-model="status">
              <SelectTrigger class="max-w-80">
                <SelectValue placeholder="Изменить статус заявки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="FormStatus.DRAFT">
                  {{ t('forms.status.draft') }}
                </SelectItem>
                <SelectItem :value="FormStatus.NEEDS_CHANGES">
                  {{ t('forms.status.needs_changes') }}
                </SelectItem>
                <SelectItem :value="FormStatus.UNDER_REVIEW">
                  {{ t('forms.status.under_review') }}
                </SelectItem>
                <SelectItem :value="FormStatus.REJECTED">
                  {{ t('forms.status.rejected') }}
                </SelectItem>
                <SelectItem :value="FormStatus.APPROVED">
                  {{ t('forms.status.approved') }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        <CardDescription> {{ form.description }}</CardDescription>
      </CardHeader>
      <CardContent class="grid h-full">
        <!-- {{ reviewFlow }} -->
        <!-- <pre class="h-40 overflow-y-auto">{{ formFields.items }}</pre> -->
        <div>
          <FormFieldsDataTable :data="formFields.items" :columns="columns(t, reviewFlow.data[0].id)" />

          <Button :disabled="status === form.status" @click="saveForm(form.id, status)">
            Сохранить
          </Button>
        </div>
        <!-- <pre>{{ formFields }}</pre> -->
        <!-- <FormReviewFlow :form-id="form.id" /> -->
      </CardContent>
    </Card>
    <Card v-if="formFields" class="col-span-12 ">
      <CardHeader>
        <CardTitle class="text-xl">
          <div class="flex items-center gap-2">
            <h1 class="flex-grow whitespace-nowrap">
              История изменений
            </h1>
            <!-- <Select v-model="status">
              <SelectTrigger class="max-w-80">
                <SelectValue placeholder="Изменить статус заявки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="FormStatus.DRAFT">
                  {{ t('forms.status.draft') }}
                </SelectItem>
                <SelectItem :value="FormStatus.NEEDS_CHANGES">
                  {{ t('forms.status.needs_changes') }}
                </SelectItem>
                <SelectItem :value="FormStatus.UNDER_REVIEW">
                  {{ t('forms.status.under_review') }}
                </SelectItem>
                <SelectItem :value="FormStatus.REJECTED">
                  {{ t('forms.status.rejected') }}
                </SelectItem>
                <SelectItem :value="FormStatus.APPROVED">
                  {{ t('forms.status.approved') }}
                </SelectItem>
              </SelectContent>
            </Select> -->
          </div>
        </CardTitle>
        <CardDescription> {{ form.description }}</CardDescription>
      </CardHeader>
      <CardContent class="grid h-full">
        <!-- {{ reviewFlow }} -->
        <!-- <pre class="h-40 overflow-y-auto">{{ formFields.items }}</pre> -->
        <div>
          <pre>{{ formHistory }}</pre>
          <!-- <FormFieldsDataTable :data="formFields.items" :columns="columns(t, reviewFlow.data[0].id)" /> -->
        </div>
        <!-- <pre>{{ formFields }}</pre> -->
        <!-- <FormReviewFlow :form-id="form.id" /> -->
      </CardContent>
    </Card>
  </div>
</template>
