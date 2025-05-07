<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-row w-full h-full gap-4 p-4">
    <div class="flex flex-col gap-4 grow">
      <Card class="!text-left w-full h-fit">
        <CardHeader class="flex flex-row justify-between pb-[12px]">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <CardTitle
                ><p class="text-[30px] leading-[36px] font-semibold">
                  ООО «Рога и копыта»
                </p></CardTitle
              >
              <CardDescription
                ><div class="flex flex-row items-center gap-2">
                  <Icon name="lucide:map-pin" class="text-[20px]" />
                  <p class="text-[20px] leading-[28px] font-normal">
                    Ленинский проспект д.123, г. Тула, 117135
                  </p>
                  <Icon name="lucide:copy" class="text-[20px] cursor-pointer" />
                </div>
              </CardDescription>
            </div>
            <div class="flex flex-row items-center gap-4">
              <Progress :model-value="75" />
              <p class="text-[16px] leading-[20px] font-normal text-[#475569]">75%</p>
            </div>
          </div>
          <div
            class="flex bg-[#F0F8FF] rounded-full p-2 h-[32px] w-[32px] items-center justify-center cursor-pointer"
          >
            <Icon name="lucide:clipboard-edit" class="text-[16px]" />
          </div>
        </CardHeader>
      </Card>
      <Card class="text-left">
        <CardHeader class="flex flex-row justify-between items-center pb-[12px]">
          <div class="flex flex-col gap-2">
            <CardTitle
              ><p class="text-[16px] leading-[24px] font-semibold">
                Текущий статус
              </p></CardTitle
            >
          </div>

          <div
            class="flex bg-[#F0F8FF] rounded-full p-2 h-[32px] w-[32px] items-center justify-center cursor-pointer"
          >
            <Icon name="lucide:clipboard-edit" class="text-[16px]" />
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-[24px] leading-[24px] font-bold text-[#64748B]">
            Не заполнен паспорт объекта
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger
                ><p class="font-medium text-[16px] leading-[26px] text-[#020617]">
                  История изменений
                </p></AccordionTrigger
              >
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead class="w-[160px]"> Дата/время </TableHead>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Комментарий</TableHead>
                      <TableHead class="text-right"> Статус </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell class="font-medium">
                        <p class="font-normal text-[14px] leading-[24px] text-[#020617]">
                          2023-06-23 16:43
                        </p>
                      </TableCell>
                      <TableCell
                        ><div class="flex flex-col">
                          <p
                            class="text-[14px] leading-[20px] text-[#020617] font-medium"
                          >
                            Operator 1
                          </p>
                          <p
                            class="font-normal text-[14px] leading-[20px] text-[#64748B]"
                          >
                            m@example.com
                          </p>
                        </div></TableCell
                      >
                      <TableCell>Ну вы, конечно, животные</TableCell>
                      <TableCell class="text-right">
                        <Badge class="bg-[#E60000]">Заявка не одобрена</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell class="font-medium">
                        <p class="font-normal text-[14px] leading-[24px] text-[#020617]">
                          2023-06-23 16:43
                        </p>
                      </TableCell>
                      <TableCell
                        ><div class="flex flex-col">
                          <p
                            class="text-[14px] leading-[20px] text-[#020617] font-medium"
                          >
                            Operator 1
                          </p>
                          <p
                            class="font-normal text-[14px] leading-[20px] text-[#64748B]"
                          >
                            m@example.com
                          </p>
                        </div></TableCell
                      >
                      <TableCell>Ну вы, конечно, животные</TableCell>
                      <TableCell class="text-right">
                        <Badge class="bg-[#F0F8FF] border-[#E2E8F0] text-[#020617]"
                          >Заявка не одобрена</Badge
                        >
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
              <CardTitle
                ><p class="text-[16px] leading-[24px] font-semibold">
                  Пользователи
                </p></CardTitle
              >
              <CardDescription>
                <p class="text-[14px] leading-[20px] font-normal">
                  Invite your team members to collaborate.
                </p>
              </CardDescription>
            </div>
          </div>
          <div
            class="flex p-2 h-[32px] w-[32px] items-center justify-center cursor-pointer"
          >
            <Icon name="lucide:users" class="text-[16px] opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-4">
            <div v-for="(item, index) in Array(3).fill()" :key="index">
              <div class="flex flex-row items-center justify-between gap-4">
                <div class="flex flex-row items-center gap-3">
                  <Avatar class="h-[36px] w-[36px]">
                    <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div class="flex flex-col">
                    <p class="text-[14px] leading-[20px] font-medium">Operator 1</p>
                    <p class="font-normal text-[14px] leading-[20px] text-[#64748B]">
                      m@example.com
                    </p>
                  </div>
                </div>
                <div class="flex flex-row items-center gap-4 max-w-[260px] w-full">
                  <Input disabled type="email" placeholder="Оператор ОИВ/ОМСУ" />
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
                ><p class="text-[16px] leading-[24px] font-semibold">
                  Справочная информация
                </p></CardTitle
              >
              <CardDescription>
                <p class="text-[14px] leading-[20px] font-normal">
                  Invite your team members to collaborate.
                </p>
              </CardDescription>
            </div>
          </div>
          <div
            class="flex p-2 h-[32px] w-[32px] items-center justify-center cursor-pointer"
          >
            <Icon name="lucide:message-circle-question" class="text-[16px] opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-4">
            <Card class="cursor-pointer">
              <CardHeader class="flex flex-row items-center gap-3 px-4 py-3">
                <div
                  class="flex h-[32px] w-[32px] items-center justify-center cursor-pointer"
                >
                  <Icon name="lucide:file-badge" class="text-[24px]" />
                </div>
                <CardTitle
                  ><p class="text-[14px] text-[#020617] leading-[20px] font-medium">
                    Нормативно правовые акты
                  </p></CardTitle
                >
              </CardHeader></Card
            >
            <Card class="cursor-pointer">
              <CardHeader class="flex flex-row items-center gap-3 px-4 py-3">
                <div
                  class="flex h-[32px] w-[32px] items-center justify-center cursor-pointer"
                >
                  <Icon name="lucide:list" class="text-[24px]" />
                </div>
                <CardTitle
                  ><p class="text-[14px] text-[#020617] leading-[20px] font-medium">
                    Перечень дефицитных ВУС
                  </p></CardTitle
                >
              </CardHeader></Card
            >
            <Card class="cursor-pointer">
              <CardHeader class="flex flex-row items-center gap-3 px-4 py-3">
                <div
                  class="flex h-[32px] w-[32px] items-center justify-center cursor-pointer"
                >
                  <Icon name="lucide:file-down" class="text-[24px]" />
                </div>
                <CardTitle
                  ><p class="text-[14px] text-[#020617] leading-[20px] font-medium">
                    Образцы форм и документов
                  </p></CardTitle
                >
              </CardHeader></Card
            >
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
