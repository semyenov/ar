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
                <div class="border p-4 rounded-[10px] h-[100px]">Контент изменений</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <Card class="p-6 text-left">
        <CardContent class="p-0">
          <div class="grid grid-cols-2 gap-6">
            <div class="flex flex-row gap-4 p-4 cursor-pointer">
              <div>
                <Icon name="lucide:mail" class="text-[32px] font-normal" />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Отправить email
                </p>
                <p class="font-medium text-[14px] leading-[20px] text-[#64748B]">
                  How to install dependencies and structure your app.
                </p>
              </div>
            </div>
            <div class="flex flex-row gap-4 p-4 cursor-pointer">
              <div>
                <Icon name="lucide:user-plus" class="text-[32px] font-normal" />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Добавить нового пользователя
                </p>
                <p class="font-medium text-[14px] leading-[20px] text-[#64748B]">
                  How to install dependencies and structure your app.
                </p>
              </div>
            </div>
            <div class="flex flex-row gap-4 p-4 cursor-pointer">
              <div>
                <Icon name="lucide:tags" class="text-[32px] font-normal" />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Сменить статус
                </p>
                <p class="font-medium text-[14px] leading-[20px] text-[#64748B]">
                  How to install dependencies and structure your app.
                </p>
              </div>
            </div>
            <div class="flex flex-row gap-4 p-4 cursor-pointer">
              <div>
                <Icon name="lucide:archive" class="text-[32px] font-normal" />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Переместить в архив
                </p>
                <p class="font-medium text-[14px] leading-[20px] text-[#64748B]">
                  How to install dependencies and structure your app.
                </p>
              </div>
            </div>
          </div>
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="apple"> Оператор ОИВ/ОМСУ </SelectItem>
                        <SelectItem value="apple"> Сотрудник организации </SelectItem>
                        <SelectItem value="apple"> Оператор КМП </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div class="flex items-center justify-center w-[32px] h-[32px]">
                    <Icon
                      name="lucide:trash-2"
                      class="text-[16px] opacity-50 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button class="gap-1 text-black bg-white hover:text-white"
              ><Icon name="lucide:plus-circle" />Добавить пользователя</Button
            >
          </div>
        </CardContent>
      </Card>
      <Card class="text-left">
        <CardHeader class="flex flex-row justify-between">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <CardTitle
                ><p class="text-[16px] leading-[24px] font-semibold">
                  Загруженные документы
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
            <Icon name="lucide:files" class="text-[16px] opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-4">
            <div v-for="(item, index) in Array(3).fill()" :key="index">
              <div class="flex flex-row items-center justify-between gap-4">
                <div class="flex flex-row items-center gap-3">
                  <div class="flex flex-col">
                    <p class="text-[14px] leading-[20px] font-medium text-[#020617]">
                      Таблица таблиц.xlsx
                    </p>
                    <p class="font-normal text-[14px] leading-[20px] text-[#64748B]">
                      24.02.2025 1.2Мб
                    </p>
                  </div>
                </div>

                <div class="flex items-center justify-center w-[32px] h-[32px]">
                  <Icon
                    name="lucide:download"
                    class="text-[16px] opacity-50 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
