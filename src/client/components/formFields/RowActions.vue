<script setup lang="ts">
// import DotsHorizontalIcon from '~icons/radix-icons/dots-horizontal'
import { useQueryClient } from '@tanstack/vue-query'
import { createComment, type FormField, FormFieldStatus, getFormField, updateFormField, useCreateComment, useListFormFields, useUpdateFormField } from '~/client/api'

const props = defineProps({

  reviewFlowId: {
    required: true,
    type: String,
  },
  row: {
    required: true,
    type: Object as PropType<FormField>,
  },
})

const queryClient = useQueryClient()
const { mutateAsync } = useUpdateFormField({
  mutation: {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['form-fields', { formId: props.row.formId }],
      })
    },
  },
}, queryClient)

async function handleApply() {
  await mutateAsync({
    data: { status: FormFieldStatus.APPROVED },
    id: props.row.id,
  })
  // emits('apply', props.row.id)
}
async function onSubmit(values: any) {
  console.log(values)
  await createComment({
    content: values.comment,
    formFieldId: props.row.id,
    reviewFlowId: props.reviewFlowId,
  })
    .then((res) => {
      if (res) {
        mutateAsync({
          data: { status: FormFieldStatus.REJECTED },
          id: props.row.id,
        })
      }
    })

  // await mutateAsync({
  //   data: { status: FormFieldStatus.REJECTED },
  //   id: props.row.original.id,
  // })
  // emits('reject', values)
}
</script>

<template>
  <div class="flex items-center justify-end gap-2">
    <Button
      v-if="row.status !== FormFieldStatus.APPROVED" variant="default" class="bg-emerald-700 hover:bg-emerald-500"
      @click="handleApply"
    >
      <Icon name="tabler:check" class="size-4" />
      <span>Принять</span>
    </Button>
    <Form v-slot="{ handleSubmit }" as="" keep-values>
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="default" class="bg-muted text-foreground hover:bg-secondary">
            <Icon name="tabler:bubble-text" class="size-4" />
            <span>Отклонить</span>
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Отклонить и оставить комментарий</DialogTitle>
            <DialogDescription>
              Комментарий будет доступен пользователю при заполнении заявки
            </DialogDescription>
          </DialogHeader>
          <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
            <FormField v-slot="{ componentField }" name="comment">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Textarea placeholder="Введите текст комментария" v-bind="componentField" />
                </FormControl>
              </FormItem>
            </FormField>
          </form>
          <DialogFooter>
            <DialogClose as-child>
              <Button type="submit" form="dialogForm">
                Применить
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  </div>
</template>
