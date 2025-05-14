<script setup lang="ts">
import { useOrgGetActiveMember, useOrgGetFullOrganization, useOrgList } from '~/client/api'

const { t } = useI18n();
const route = useRoute()
definePageMeta({
  // set custom layout

  layout: 'admin',
})

const { data: organization } = await useOrgGetFullOrganization({
  query: {
    organizationId: route.params.id as string
  }
})


console.log(organization)
</script>

<template>
  <div class="flex flex-row w-full h-full gap-4 p-4">
    <div class="flex flex-col gap-4 grow">
      <Card class="!text-left w-full h-fit">
        <CardHeader class="flex flex-row justify-between pb-[12px] items-start">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <CardTitle class="text-2xl">
                  {{ organization?.name }}
                </CardTitle>
              <CardDescription>
                <div class="flex flex-row items-center gap-2">
                  <Icon name="lucide:map-pin" class="w-5 h-5" />
                  <p class="inline-flex items-center text-base font-normal group">
                    Ленинский проспект д.123, г. Тула, 117135
                    <Icon name="lucide:copy" class="ml-2 transition opacity-0 cursor-pointer group-hover:opacity-100" />
                  </p>
                </div>
              </CardDescription>
            </div>
            <div class="flex flex-row items-center gap-4">
              <Progress :model-value="75" />
              <p class="text-base text-">75%</p>
            </div>
          </div>
          <div
            class="flex items-center justify-center p-2 rounded-full cursor-pointer bg-slate-100"
          >
            <Icon name="lucide:clipboard-edit" class="w-4 h-4" />
          </div>
        </CardHeader>
      </Card>
      <Card class="text-left">
        <CardHeader class="flex flex-row items-center justify-between pb-3">
          <div class="flex flex-col gap-2">
            <CardTitle>
                Текущий статус
              </CardTitle>
          </div>

          <div
            class="flex items-center justify-center p-2 rounded-full cursor-pointer bg-slate-100"
          >
            <Icon name="lucide:clipboard-edit" class="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-xl font-bold text-muted-foreground-foreground">
            Не заполнен паспорт объекта
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger
                ><p class="font-medium ">
                  История изменений
                </p></AccordionTrigger
              >
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead class="w-40"> Дата/время </TableHead>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Комментарий</TableHead>
                      <TableHead class="text-right"> Статус </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell class="font-medium">
                        <p class="font-normal ">
                          2023-06-23 16:43
                        </p>
                      </TableCell>
                      <TableCell>
                        <UsersHoverCard :user="{id:1,first_name:'Бобр',last_name:'Курвович',email:'text@example.com',phone:'+7(123)456-78-90'}"></UsersHoverCard>
                        <!-- <div class="flex flex-col">
                          <p
                            class="text-sm font-medium"
                          >
                            Operator 1
                          </p>
                          <p
                            class="text-sm font-normal text-muted-foreground"
                          >
                            m@example.com
                          </p>
                        </div> -->
                      </TableCell>
                      <TableCell>Ну вы, конечно, животные</TableCell>
                      <TableCell class="text-right">
                        <Badge class="bg-rose-700">Заявка не одобрена</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell class="font-medium">
                        <p class="text-sm font-normal ">
                          2023-06-23 16:43
                        </p>
                      </TableCell>
                      <TableCell>
                        <div class="flex flex-col">
                          <p
                            class="text-sm font-medium"
                          >
                            Operator 1
                          </p>
                          <p
                            class="text-sm text-muted-foreground"
                          >
                            m@example.com
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>Ну вы, конечно, животные</TableCell>
                      <TableCell class="text-right">
                        <Badge class="bg-rose-700">
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
          <div
            class="flex items-center justify-center w-8 h-8 p-2 cursor-pointer"
          >
            <Icon name="lucide:users" class="text-muted-foreground " />
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-4">
            <div v-for="(item, index) in organization?.members" :key="index">
              <div class="flex flex-row items-center justify-between gap-4">
                <div class="flex flex-row items-center gap-3">
                  <Avatar class="h-9 w-9">
                    <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div class="flex flex-col">
                    <p class="text-sm font-medium">{{ item.user.name }}</p>
                    <p class="font-normal text-sm  text-[#64748B]">
                      {{ item.user.email }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-row items-center gap-4 max-w-[260px] w-full">
                  <Input disabled type="email" :placeholder="item.user.email" />
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
              <CardTitle
                ><p class="font-semibold ">
                  Справочная информация
                </p></CardTitle
              >
              <CardDescription>
                <p class="text-sm font-normal">
                  Invite your team members to collaborate.
                </p>
              </CardDescription>
            </div>
          </div>
          <div
            class="flex items-center justify-center w-8 h-8 p-2 cursor-pointer"
          >
            <Icon name="lucide:message-circle-question" class="text-muted-foreground " />
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-4">
            <Card class="transition cursor-pointer hover:bg-accent">
              <CardHeader class="flex flex-row items-center gap-3 px-4 py-3">
                <div
                  class="flex items-center justify-center w-8 h-8 cursor-pointer"
                >
                  <Icon name="lucide:file-badge" class="text-2xl" />
                </div>
                <p class="text-sm ">
                    Нормативно правовые акты
                  </p>
              </CardHeader></Card>
            <Card class="transition cursor-pointer hover:bg-accent">
              <CardHeader class="flex flex-row items-center gap-3 px-4 py-3">
                <div
                  class="flex items-center justify-center w-8 h-8 cursor-pointer"
                >
                  <Icon name="lucide:list" class="text-2xl" />
                </div>
                <p class="text-sm ">
                    Перечень дефицитных ВУС
                  </p>
              </CardHeader></Card>
            <Card class="transition cursor-pointer hover:bg-accent">
              <CardHeader class="flex flex-row items-center gap-3 px-4 py-3">
                <div
                  class="flex items-center justify-center w-8 h-8 cursor-pointer"
                >
                  <Icon name="lucide:file-down" class="text-2xl" />
                </div>
                <p class="text-sm ">
                    Образцы форм и документов
                  </p>
              </CardHeader></Card>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
