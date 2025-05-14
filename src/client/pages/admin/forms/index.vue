<script setup lang="ts">
import { Icon, NuxtLink } from '#components'
import { useListForms } from '~/client/api'
import moment from 'moment';


import {columns} from '@/client/components/forms/column'
import { filter } from 'remeda'
import { FormStatus } from '@prisma/client'




const { t } = useI18n()

definePageMeta({
  // set custom layout

  layout: 'admin',
})
const { data: formsResponse, isLoading, error } = useListForms();

const currentTab = ref('all')
// Computed property to get just the forms array
const forms = computed(() => formsResponse.value?.items || []);
const underReview = computed(()=>filter(forms.value, f=>f.status === FormStatus.UNDER_REVIEW))

const criticalDiff = 24
const criticalDiffMeasure: moment.unitOfTime.Base = 'hours'

const critical = computed(() => filter(forms.value, f => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss')
  const fd = moment(f.updatedAt).format('YYYY-MM-DD HH:mm:ss')
  console.log(now, fd);
  return moment(now).diff(fd, criticalDiffMeasure) > criticalDiff
}
))
</script>

<template>
  <div class="grid grid-cols-12 p-4 space-y-4">
    <!-- {{ critical }} -->
    <Alert class="flex items-start self-start col-span-12 gap-4 p-6" v-if="critical.length>0">
      <Icon name="tabler:alert-triangle" class="w-8 h-8 text-destructive" />
      <div class="flex flex-col">
        <AlertTitle class="text-base">Внимание</AlertTitle>
        <AlertDescription class="text-muted-foreground">
          Обнаружено {{ critical.length }} не рассмотренная заявка старше
        </AlertDescription>
        <NuxtLink class="flex items-center gap-2 mt-2" to="/organizations/problems">Перейти к редактированию
          <Icon name="tabler:arrow-narrow-right" />
        </NuxtLink>
      </div>
    </Alert>
    <Card class="flex-grow col-span-12 overflow-hidden">
      <CardHeader>
        <CardTitle class="text-xl">
          {{ t('pages.forms.title') }}
        </CardTitle>
        <CardDescription> {{ t('pages.forms.description') }}</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <Tabs v-model="currentTab">
          <TabsList>
            <TabsTrigger value="all">
              Все
            </TabsTrigger>
            <TabsTrigger value="under_review">
              На рассмотрении
            </TabsTrigger>
          </TabsList>
          <TabsContent value="under_review">
            <FormsDataTable :data="underReview" :columns="columns(t)" />
          </TabsContent>
          <TabsContent value="all">
            <FormsDataTable :data="forms" :columns="columns(t)" />
          </TabsContent>
        </Tabs>
        <!-- <FormsDataTable :data="underReview" :columns="columns(t)" /> -->
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
