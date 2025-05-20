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
  layout: 'default',

})
const { t } = useI18n()

const authClient = useAuth()
const org = authClient.client.useActiveOrganization()
const members = computed(() => {
  return org.value.data ? org.value.data.members : []
})
</script>

<template>
  <div class="flex flex-row w-full h-full gap-4 p-4">
    <div class="flex flex-col gap-4 grow">
      <!-- {{ listOrganizations }} -->
      <pre>{{ org }}</pre>
      <Card v-if="org.data" class="w-full h-fit">
        <CardHeader class="flex flex-row justify-between pb-3">
          <div class="flex flex-col gap-2">
            <CardTitle>
              <p class="text-xl font-semibold">
                {{ org.data.name }}
              </p>
            </CardTitle>
            <CardDescription>
              <div class="flex flex-row items-center gap-2 text-base">
                <Icon name="tabler:map-pin" class="w-5 h-5 text-foreground" />
                <p class="">
                  Ленинский проспект д.123, г. Тула, 117135
                </p>
                <Icon name="lucide:copy" class="text-[20px] cursor-pointer" />
              </div>
            </CardDescription>

            <div class="flex flex-row items-center gap-4">
              <Progress :model-value="75" />
              <p class="text-muted-foreground">
                75%
              </p>
            </div>
          </div>
          <div class="flex bg-[#F0F8FF] rounded-full p-2 h-[32px] w-[32px] items-center justify-center cursor-pointer">
            <Icon name="lucide:clipboard-edit" class="text-[16px]" />
          </div>
        </CardHeader>
      </Card>
      <Card class="text-left">
        <CardHeader class="flex flex-row justify-between items-center pb-[12px]">
          <CardTitle>
            Текущий статус
          </CardTitle>

          <div class="flex bg-[#F0F8FF] rounded-full p-2 h-[32px] w-[32px] items-center justify-center cursor-pointer">
            <Icon name="lucide:clipboard-edit" class="text-[16px]" />
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-[24px] leading-[24px] font-bold text-[#64748B]">
            Не заполнен паспорт объекта
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <p class="font-medium text-[16px] leading-[26px] text-[#020617]">
                  История изменений
                </p>
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead class="w-[160px]">
                        Дата/время
                      </TableHead>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Комментарий</TableHead>
                      <TableHead class="text-right">
                        Статус
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell class="font-medium">
                        <p class="font-normal text-[14px] leading-[24px] text-[#020617]">
                          2023-06-23 16:43
                        </p>
                      </TableCell>
                      <TableCell>
                        <div class="flex flex-col">
                          <p class="text-[14px] leading-[20px] text-[#020617] font-medium">
                            Operator 1
                          </p>
                          <p class="font-normal text-[14px] leading-[20px] text-[#64748B]">
                            m@example.com
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>Ну вы, конечно, животные</TableCell>
                      <TableCell class="text-right">
                        <Badge class="bg-[#E60000]">
                          Заявка не одобрена
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell class="font-medium">
                        <p class="font-normal text-[14px] leading-[24px] text-[#020617]">
                          2023-06-23 16:43
                        </p>
                      </TableCell>
                      <TableCell>
                        <div class="flex flex-col">
                          <p class="text-[14px] leading-[20px] text-[#020617] font-medium">
                            Operator 1
                          </p>
                          <p class="font-normal text-[14px] leading-[20px] text-[#64748B]">
                            m@example.com
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>Ну вы, конечно, животные</TableCell>
                      <TableCell class="text-right">
                        <Badge class="bg-[#F0F8FF] border-[#E2E8F0] text-[#020617]">
                          Заявка не одобрена
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
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
                Invite your team members to collaborate.
              </CardDescription>
            </div>
          </div>

          <Icon name="lucide:users" class="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-4">
            <div v-for="(m, mi) in members" :key="m.id">
              <div class="flex flex-row items-center justify-between gap-4">
                <div class="flex flex-row items-center gap-3">
                  <Avatar class="size-9">
                    <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
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
                  <!-- <Input disabled type="email" placeholder="Оператор ОИВ/ОМСУ" /> -->
                  <Label>{{ t(`members.roles.${m.role}`) }}</Label>
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
                  Invite your team members to collaborate.
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
            <Card class="cursor-pointer">
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
            <Card class="cursor-pointer">
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
            <Card class="cursor-pointer">
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
            <Dialog>
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
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
