<script lang="ts" setup>
import { type FormHistory, useGetFormField, useListFormFields } from '~/client/api'

const props = defineProps<{ row: FormHistory }>()
const { d, t } = useI18n()
const { data: fields } = useListFormFields({ formId: props.row.formId })

const comment = computed(() => {
  if (!props.row.data) {
    return ''
  }
  const data = JSON.parse(props.row.data)

  if (data && data.action === 'update_field') {
    const field = fields.value?.items.find((field) => {
      return field.id === data.fieldId
    })

    if (data.changes.status) {
      return `Изменен статус поля ${field?.name}: ${data.changes.status}`
    }
    if (data.changes.value) {
      return `Новое значение поля ${field?.name}: ${data.changes.value}`
    }
  }

  return `Изменен статус заявки`
})
</script>

<template>
  <!-- {{ props.row.data }} -->
  <TableRow>
    <TableCell class="font-medium">
      <p class="font-normal text-[14px] leading-[24px] text-[#020617]">
        {{ d(row.createdAt, 'long') }}
      </p>
    </TableCell>
    <TableCell>
      <div class="flex flex-col">
        {{ row.member?.user?.name }}
        <CardDescription>{{ row.member?.user?.email }}</CardDescription>
      </div>
    </TableCell>
    <TableCell>{{ comment }}</TableCell>
    <TableCell class="text-right">
      <FormsStatusBadge :status="row.status" />
    </TableCell>
  </TableRow>
</template>
