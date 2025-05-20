<script setup lang="ts">
import { FormStatus } from '@prisma/client'
import { useGetReviewFlow, useListForms, useListReviewFlows } from '~/client/api'
import { filter } from 'remeda'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/client/components/ui/accordion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/client/components/ui/card'

// const { t } = useI18n()

const { activeOrganization: org } = useAuth()
const { data: formsResponse, error, isLoading } = useListForms({ organizationId: org.value?.id })

// Computed property to get just the forms array
const forms = computed(() => {
  if (org.value && formsResponse.value) {
    return formsResponse.value.items
  }

  return []
})
// const activeForm = computed(() => {
//   return forms.value[0] ? forms.value[0] : null
// },
// )

// const underReview = computed(() => {
//   return filter(forms.value, (f) => {
//     return f.status === FormStatus.UNDER_REVIEW
//   })
// })
</script>

<template>
  <div>
    <!-- {{ activeForm }} -->
    <template v-if="forms.length > 0">
      <Card v-for="f in forms" :key="f.id">
        <CardHeader class="flex flex-row justify-between items-center pb-[12px]">
          <CardTitle>
            {{ f.title }}
          </CardTitle>
          <!-- {{ flow }} -->
          <FormsStatusBadge :status="f.status" class="px-2 py-1 text-sm" />
        </CardHeader>
        <CardContent>
          <div class="flex flex-col items-start gap-4">
            <!-- <p class="text-xl font-bold text-muted-foreground">
              {{ f.status }}
            </p> -->
            <Button
              :disabled="f.status !== FormStatus.DRAFT && f.status !== FormStatus.NEEDS_CHANGES"

              @click="$router.push(`/forms/${f.id}`)"
            >
              <Icon name="lucide:clipboard-edit" />
              <span>Редактировать</span>
            </Button>
            <FormsHistoryTable :form-id="f.id" class="w-full" />
          </div>
        </CardContent>
      </Card>
    </template>
    <template v-else>
      <Card>
        <CardHeader>
          <CardTitle class="text-xl">
            Заявки
          </CardTitle>
          <CardDescription>У выбранной организации отсутствуют формы для заполнения</CardDescription>
        </CardHeader>
      </Card>
    </template>
  </div>
</template>
