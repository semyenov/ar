<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/client/components/ui/accordion'
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
import { Progress } from '@/client/components/ui/progress'

definePageMeta({
  auth: {
    only: 'user',
    redirectAdminTo: '/admin/dashboard',
    redirectGuestTo: '/auth/sign-in',
  },
  layout: 'user',

})
const { t } = useI18n()

const { activeOrganization: org } = useAuth()

const members = computed(() => {
  return org.value ? org.value.members : []
})
</script>

<template>
  <div class="flex flex-row w-full h-full gap-4 p-4 overflow-y-auto">
    <div class="flex flex-col gap-4 grow">
      <!-- {{ listOrganizations }} -->
      <!-- <pre>{{ org }}</pre> -->
      <template v-if="org">
        <OrganizationsUserCard />
        <FormsUserActiveForm :key="org.id" />
      </template>
      <template v-else>
        <Card>
          <CardHeader>
            <CardTitle class="text-xl">
              Организация
            </CardTitle>
            <CardDescription>Для начала работы нужно выбрать организацию</CardDescription>
          </CardHeader>
        </Card>
      </template>
    </div>
    <div class="flex flex-col gap-4">
      <Card class="!text-left w-full min-w-[600px] h-fit">
        <CardHeader class="flex flex-row justify-between">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <CardTitle>
                Пользователи
              </CardTitle>
              <CardDescription>
                {{ org ? "Пользователи, ответственные за организацию " : "Для начала работы нужно выбрать организацию"
                }}
              </CardDescription>
            </div>
          </div>

          <Icon name="lucide:users" class="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent v-if="org">
          <div class="flex flex-col gap-4">
            <div v-for="(m) in members" :key="m.id">
              <div class="flex flex-row items-center justify-between gap-4">
                <div class="flex flex-row items-center gap-3">
                  <Avatar class="size-9">
                    <AvatarImage
                      src="https://yt3.googleusercontent.com/QviY7Il35MHsXsmV6knCYYPcPuQ9LZXy7e16bVm62K5ejz6gTuzYN-2CseY8gA0-Y3R-mhePxQE=s900-c-k-c0x00ffffff-no-rj"
                      alt="@unovue"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div class="flex flex-col">
                    <p class="font-medium">
                      {{ m.user.name }}
                    </p>
                    <p class="text-muted-foreground">
                      {{ m.user.email }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-row items-center gap-4 max-w-[260px] w-full">
                  <Input disabled type="email" :placeholder="t(`members.roles.${m.role}`)" />
                  <!-- <Label>{{ t(`members.roles.${m.role}`) }}</Label> -->
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card class="text-left">
        <CardHeader class="flex flex-row justify-between">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <CardTitle>
                <p class="text-[16px] leading-[24px] font-semibold">
                  Справочная информация
                </p>
              </CardTitle>
              <CardDescription>
                <p class="text-[14px] leading-[20px] font-normal">
                  Актуальные документы, нормативно-справочные акты и другие полезные материалы
                </p>
              </CardDescription>
            </div>
          </div>
          <div class="flex p-2 h-[32px] w-[32px] items-center justify-center cursor-pointer">
            <Icon name="lucide:message-circle-question" class="text-[16px] opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-4">
            <Card class="transition cursor-pointer hover:bg-secondary">
              <CardHeader class="flex flex-row items-center gap-3 px-4 py-3">
                <div class="flex h-[32px] w-[32px] items-center justify-center cursor-pointer">
                  <Icon name="lucide:file-badge" class="text-[24px]" />
                </div>
                <CardTitle>
                  <p class="text-[14px] text-[#020617] leading-[20px] font-medium">
                    Нормативно правовые акты
                  </p>
                </CardTitle>
              </CardHeader>
            </Card>
            <Card class="transition cursor-pointer hover:bg-secondary">
              <CardHeader class="flex flex-row items-center gap-3 px-4 py-3">
                <div class="flex h-[32px] w-[32px] items-center justify-center cursor-pointer">
                  <Icon name="lucide:list" class="text-[24px]" />
                </div>
                <CardTitle>
                  <p class="text-[14px] text-[#020617] leading-[20px] font-medium">
                    Перечень дефицитных ВУС
                  </p>
                </CardTitle>
              </CardHeader>
            </Card>
            <Card class="transition cursor-pointer hover:bg-secondary">
              <CardHeader class="flex flex-row items-center gap-3 px-4 py-3">
                <div class="flex h-[32px] w-[32px] items-center justify-center cursor-pointer">
                  <Icon name="lucide:file-down" class="text-[24px]" />
                </div>
                <CardTitle>
                  <p class="text-[14px] text-[#020617] leading-[20px] font-medium">
                    Образцы форм и документов
                  </p>
                </CardTitle>
              </CardHeader>
            </Card>
            <!-- <Dialog>
              <DialogTrigger as-child>
                <Button class="gap-1 py-2 px-4 text-accent.foreground hover:text-white bg-[#ffffff]">
                  <Icon name="lucide:plus-circle" />Добавить документ
                </Button>
              </DialogTrigger>

              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Загрузка документов</DialogTitle>
                  <DialogDescription>
                    Выберите документы для добавления:
                  </DialogDescription>
                </DialogHeader>
                <Input id="document" type="file" multiple class="cursor-pointer" />
              </DialogContent>
            </Dialog> -->
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
