<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Separator } from "@/client/components/ui/separator";
import { Input } from "@/client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { Textarea } from "@/client/components/ui/textarea";
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-row w-full h-full gap-4 p-4">
    <Card class="!text-left grow h-fit max-w-[890px]">
      <CardHeader class="flex flex-row justify-between pb-[12px]">
        <CardTitle class="text-2xl ">
            Иванов Бобр Курвович
        </CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-6 pt-3">
        <div class="flex flex-col gap-1">
          <p class="font-medium ">Профиль</p>
          <p class="text-sm text-muted-foreground">
            Основная информация о пользователе
          </p>
        </div>
        <Separator />
        <div class="flex flex-col gap-1.5">
          <p class="font-medium ">Имя</p>
          <Input placeholder="Имя" />
          <!-- <p class="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p> -->
        </div>
        <div class="flex flex-col gap-1.5">
          <p class="font-medium ">Фамилия</p>
          <Input placeholder="Фамилия" />
          <!-- <p class="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p> -->
        </div>
        <div class="flex flex-col gap-1.5">
          <p class="font-medium ">Отчество</p>
          <Input placeholder="Отчество" />
          <!-- <p class="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p> -->
        </div>
        <div class="flex flex-col gap-1.5">
          <p class="font-medium ">Email</p>
          <Input placeholder="Электронная почта" />

        </div>
        <div class="flex flex-col gap-1.5">
          <p class="font-medium ">Телефон</p>
          <Input placeholder="Телефон" />

        </div>
        <!-- <div class="flex flex-col gap-1.5">
          <p class="text-[14px] leading-[14px] font-medium">Bio</p>
          <Textarea placeholder="I own a computer." />
          <p class="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div> -->

        <Button class="gap-1 px-4 py-2 w-fit">
          <Icon name="lucide:plus-circle" />Обновить профиль
        </Button>
      </CardContent>
    </Card>

    <div class="flex flex-col gap-4 max-w-[900px] grow">
      <Card class="!text-left h-fit">
        <CardHeader class="flex flex-row justify-between">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <CardTitle
                ><p class="text-[16px] leading-[24px] font-semibold">
                  Организации
                </p></CardTitle
              >
              <CardDescription>
                <p class="text-[14px]  ">
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
                  <div class="flex flex-col">
                    <p class="text-[14px]  font-medium">
                      ООО “Шайн брайт лайк даймонд”
                    </p>
                    <p class=" text-[14px]  text-muted-foreground text-sm">
                      Ленинский проспект д.123, г. Тула, 117135
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
          </div>
        </CardContent>
      </Card>
      <Card class="p-6 text-left">
        <CardContent class="p-0">
          <div class="grid grid-cols-2 gap-6">
            <div class="flex flex-row gap-4 p-4 rounded-lg cursor-pointer hover:bg-slate-100">
              <div>
                <Icon name="lucide:shield-alert" class="w-8 h-8 " />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Сбросить пароль
                </p>
                <p class="text-sm text-muted-foreground">
                  How to install dependencies and structure your app.
                </p>
              </div>
            </div>
            <div class="flex flex-row gap-4 p-4 rounded-lg cursor-pointer hover:bg-slate-100">
              <div>
                <Icon name="lucide:plus-circle" class="w-8 h-8 " />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Добавить организацию
                </p>
                <p class="text-sm text-muted-foreground">
                  How to install dependencies and structure your app.
                </p>
              </div>
            </div>
            <div class="flex flex-row gap-4 p-4 rounded-lg cursor-pointer hover:bg-slate-100">
              <div>
                <Icon name="lucide:lock" class="w-8 h-8 " />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Заблокировать пользователя
                </p>
                <p class="text-sm text-muted-foreground">
                  How to install dependencies and structure your app.
                </p>
              </div>
            </div>
            <div class="flex flex-row gap-4 p-4 rounded-lg cursor-pointer hover:bg-slate-100">
              <div>
                <Icon name="lucide:trash-2" class="w-8 h-8 " />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Удалить пользователя (в архив)
                </p>
                <p class="text-sm text-muted-foreground">
                  How to install dependencies and structure your app.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
