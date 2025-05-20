<script setup lang="ts">
import { createReviewFlow, FormFieldStatus, FormStatus, getForm, getReviewFlow, listReviewFlows, ReviewFlowStatus, updateForm, updateFormField, useListFormFields } from '~/client/api'
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

const { data: formFields, error, isLoading } = useListFormFields({ formId: route.params.id as string })
const form = await getForm(route.params.id as string)
const reviewFlow = await listReviewFlows({ formId: form.id })

const { handleSubmit, isFieldDirty } = useForm({
  // validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  console.log(values)
  const promises = Object.keys(values)
    .map((item) => {
      return updateFormField(item, { value: values[item] })
    },
    )
  const results = await Promise.all(promises)
  if (results.length > 0) {
    await updateForm(form.id, { status: FormStatus.UNDER_REVIEW })
  }
  // console.log(results)
  // if (!reviewFlow) {
  //   await createReviewFlow({ formId: form.id, status: ReviewFlowStatus.OPEN })
  // }
  toast({
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
    title: 'You submitted the following values:',
  })
  router.push('/dashboard')
})
</script>

<template>
  <div class="flex flex-col items-center w-full h-full gap-4 p-4">
    <Card class="!text-left w-full max-w-screen-xl  h-fit">
      <CardHeader class="flex flex-row justify-between">
        <div class="flex flex-col gap-2">
          <CardTitle>
            {{ form.title }}
          </CardTitle>
          <CardDescription>
            {{ form.template?.title }}
          </CardDescription>
        </div>

        <FormsStatusBadge :status="form.status" />
      </CardHeader>
      <CardContent>
        <form class="w-full space-y-6" @submit="onSubmit">
          <FormField
            v-for="field in formFields?.items" v-slot="{ componentField }" :key="field.id" :name="field.id"
            :validate-on-blur="!isFieldDirty"
          >
            <FormItem class="flex flex-col">
              <FormLabel class="flex items-center gap-2">
                {{ field.name }}<div v-if="field.status === FormFieldStatus.APPROVED">
                  <Icon name="lucide:circle-check" class="text-emerald-700 size-5" />
                </div>
                <div v-if="field.status === FormFieldStatus.REJECTED">
                  <Icon name="lucide:circle-alert" class="text-yellow-500 size-5" />
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  :type="field.type" :placeholder="field.name" v-bind="componentField"
                  :disabled="field.status === FormFieldStatus.APPROVED"
                  :model-value="field.value"
                />
              </FormControl>
              <template v-if="field.status === FormFieldStatus.REJECTED && field.comments && field.comments.length > 0">
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
            :disabled="form.status === FormStatus.UNDER_REVIEW || form.status === FormStatus.APPROVED || form.status === FormStatus.REJECTED"
          >
            Отправить на проверку
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
