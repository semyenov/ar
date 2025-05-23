<script setup lang="ts">
import { createReviewFlow, FormFieldStatus, FormStatus, getForm, getReviewFlow, listReviewFlows, ReviewFlowStatus, updateForm, updateFormField, useListFormFields } from '~/client/api'
import { indexBy } from 'remeda'
import { useForm } from 'vee-validate'

import { Avatar, AvatarFallback, AvatarImage } from '@/client/components/ui/avatar'
import { Button } from '@/client/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/client/components/ui/dialog'
import { toast } from '@/client/components/ui/toast/use-toast'

definePageMeta({
  auth: {
    only: 'user',
    redirectAdminTo: '/admin/dashboard',
    redirectGuestTo: '/auth/sign-in',
  },
  layout: 'user',

})
const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const { data: listFormFields, error, isLoading } = useListFormFields({ formId: route.params.id as string })
const activeForm = await getForm(route.params.id as string)
const reviewFlow = await listReviewFlows({ formId: route.params.id as string })

const { handleSubmit, isFieldDirty } = useForm({
  // validationSchema: formSchema,
})
const fields = computed(() => {
  return indexBy(listFormFields.value?.items || [], (item) => {
    return item.id
  })
})
const form = useForm()

const onSubmit = form.handleSubmit(async (values) => {
  const promises = []
  for (const fk of Object.keys(values)) {
    if (values[fk] && values[fk] !== fields.value[fk].value) {
      promises.push(updateFormField(fk, { value: values[fk] }))
    }
  }
  const results = await Promise.all(promises)
  if (results.length > 0) {
    await updateForm(activeForm.id, { status: FormStatus.UNDER_REVIEW })
  }

  if (!reviewFlow) {
    await createReviewFlow({ formId: activeForm.id, status: ReviewFlowStatus.OPEN })
  }
  // toast({
  //   description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  //   title: 'You submitted the following values:',
  // })
  router.push('/dashboard')
})
</script>

<template>
  <div class="flex flex-col items-center w-full h-full p-4">
    <div class="flex flex-col items-center w-full max-w-screen-xl gap-4">
      <NuxtLink class="flex items-center self-start gap-2" to="/dashboard">
        <Icon name="tabler:arrow-narrow-left" class="w-4 h-4" />
        {{ t('forms.back') }}
      </NuxtLink>
      <Card class="!text-left w-full   h-fit">
        <CardHeader class="flex flex-row justify-between">
          <div class="flex flex-col gap-2">
            <CardTitle>
              {{ activeForm.title }}
            </CardTitle>
            <CardDescription>
              {{ activeForm.template?.title }}
            </CardDescription>
          </div>
          <FormsStatusBadge :status="activeForm.status" />
        </CardHeader>
        <CardContent>
          <form class="w-full space-y-6" @submit="onSubmit">
            <FormField
              v-for="field in listFormFields?.items" v-slot="{ componentField }" :key="field.id" :name="field.id"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem class="flex flex-col">
                <FormLabel class="flex items-center gap-2">
                  {{ field.name }}<div v-if="field.status === FormFieldStatus.APPROVED">
                    <Icon name="lucide:circle-check" class="text-emerald-700 size-5" />
                  </div>
                  <div v-if="field.status === FormFieldStatus.REJECTED">
                    <Icon name="lucide:circle-alert" class="text-warning size-5" />
                  </div>
                </FormLabel>
                <FormControl>
                  {{ componentField }}
                  <Input
                    :type="field.type" :placeholder="field.name" v-bind="componentField" :default-value="field.value || ''"
                    :model-value="field.value"
                  />
                </FormControl>
                <FormMessage />
                <template
                  v-if="field.status === FormFieldStatus.REJECTED && field.comments && field.comments.length > 0"
                >
                  <Alert class="flex items-start gap-3">
                    <Icon name="tabler:message" class="size-5" />
                    <div class="flex flex-col">
                      <AlertTitle>Комментарий к заполнению</AlertTitle>
                      <AlertDescription>
                        {{ field.comments[0].content }}
                      </AlertDescription>
                    </div>
                  </Alert>
                </template>
                <!-- <FormDescription>
                    {{field.}}
                  </FormDescription> -->
                <FormMessage />
              </FormItem>
            </FormField>
            <Button
              type="submit"
            >
              Отправить на проверку
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
