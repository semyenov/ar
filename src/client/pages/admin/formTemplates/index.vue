<script setup lang="ts">
import { Icon, NuxtLink } from '#components'
import { useListFormTemplates } from '~/client/api'
// import tasks from '@/client/data/tasks.json'

import { organizationStatuses } from '~/client/data/data'

import {columns} from '@/client/components/formTemplates/column'

// import { columns } from '@/client/components/organizations/column'

import { onMounted } from 'vue';


const { t } = useI18n()

definePageMeta({
  // set custom layout

  layout: 'admin',
})
const { data: formsResponse, isLoading, error } = useListFormTemplates();

// Computed property to get just the forms array
const formTemplates = computed(() => formsResponse.value?.items || []);




</script>

<template>
  <div class="grid grid-cols-12 p-4 space-y-4">

    <!-- <Alert class="flex items-start col-span-12 gap-4 p-6">
      <Icon name="tabler:alert-triangle" class="w-8 h-8 text-destructive" />
      <div class="flex flex-col">
        <AlertTitle class="text-base">Внимание</AlertTitle>
        <AlertDescription class="text-muted-foreground">
          Обнаружено {{dataProblem.length}} организаций без пользователя. Рекомендуется назначить пользователей, прежде чем продолжать работу.
        </AlertDescription>
        <NuxtLink class="flex items-center gap-2 mt-2" to="/organizations/problems">Перейти к редактированию <Icon name="tabler:arrow-narrow-right"/></NuxtLink>
      </div>
    </Alert> -->
    <Card class="col-span-12 ">
      <CardHeader>
        <CardTitle class="text-xl">
          {{ t('pages.formTemplates.title') }}
        </CardTitle>
        <CardDescription> {{ t('pages.formTemplates.description') }}</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <FormTemplatesDataTable :data="formTemplates" :columns="columns(t)" />
      </CardContent>
    </Card>
    <!-- <Card class="col-span-4">
      <CardHeader>
        <CardTitle class="text-xl">
          {{ t('pages.organizations.title') }}
        </CardTitle>
        <CardDescription> {{ t('pages.organizations.welcome') }}</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div>
          Большая таблица с данными
        </div>
      </CardContent>
    </Card> -->
  </div>
</template>
