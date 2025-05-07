<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-row w-full h-full gap-4 p-4">
    <Card class="!text-left grow h-fit max-w-[890px]">
      <CardHeader class="flex flex-row justify-between pb-[12px]">
        <CardTitle
          ><p class="text-[30px] leading-[36px] font-semibold">
            Иванов Бобр Курвович
          </p></CardTitle
        >
      </CardHeader>
      <CardContent class="flex flex-col gap-6 pt-3">
        <div class="flex flex-col gap-1">
          <p class="text-[16px] leading-[20px] font-medium">Profile</p>
          <p class="font-normal text-[14px] leading-[20px] text-[#64748B]">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <div class="flex flex-col gap-1.5">
          <p class="text-[16px] leading-[20px] font-medium">Username</p>
          <Input placeholder="shadcn" />
          <p class="font-normal text-[12px] leading-[20px] text-[#64748B]">
            This is how others will see you on the site.
          </p>
        </div>
        <div class="flex flex-col gap-1.5">
          <p class="text-[16px] leading-[20px] font-medium">Email</p>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a verified email to display</SelectLabel>
                <SelectItem value="apple"> ascas@mail.com </SelectItem>
                <SelectItem value="apple"> scasv@mail.com </SelectItem>
                <SelectItem value="apple"> vuykv@mail.com </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p class="font-normal text-[12px] leading-[20px] text-[#64748B]">
            You can manage verified email addresses in your email settings.
          </p>
        </div>
        <div class="flex flex-col gap-1.5">
          <p class="text-[14px] leading-[14px] font-medium">Bio</p>
          <Textarea placeholder="I own a computer." />
          <p class="font-normal text-[12px] leading-[20px] text-[#64748B]">
            This is how others will see you on the site.
          </p>
        </div>
        <div class="flex flex-col gap-1.5">
          <p class="text-[14px] leading-[20px] font-medium">URLs</p>
          <p class="font-normal text-[12px] leading-[20px] text-[#64748B]">
            Add links to your website, blog, or social media profiles.
          </p>
          <Input placeholder="shadcn" />
          <Input placeholder="shadcn" />
          <Button class="gap-1 px-4 py-2 text-black bg-white v hover:text w-fit white"
            ><Icon name="lucide:plus-circle" />Add URL</Button
          >
        </div>
        <Button class="gap-1 px-4 py-2 w-fit"
          ><Icon name="lucide:plus-circle" />Update profile</Button
        >
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
                  <div class="flex flex-col">
                    <p class="text-[14px] leading-[20px] font-medium">
                      ООО “Шайн брайт лайк даймонд”
                    </p>
                    <p class="font-normal text-[14px] leading-[20px] text-[#64748B]">
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
            <div class="flex flex-row gap-4 p-4 cursor-pointer">
              <div>
                <Icon name="lucide:shield-alert" class="text-[32px] font-normal" />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Сбросить пароль
                </p>
                <p class="font-medium text-[14px] leading-[20px] text-[#64748B]">
                  How to install dependencies and structure your app.
                </p>
              </div>
            </div>
            <div class="flex flex-row gap-4 p-4 cursor-pointer">
              <div>
                <Icon name="lucide:plus-circle" class="text-[32px] font-normal" />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Добавить организацию
                </p>
                <p class="font-medium text-[14px] leading-[20px] text-[#64748B]">
                  How to install dependencies and structure your app.
                </p>
              </div>
            </div>
            <div class="flex flex-row gap-4 p-4 cursor-pointer">
              <div>
                <Icon name="lucide:lock" class="text-[32px] font-normal" />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Заблокировать пользователя
                </p>
                <p class="font-medium text-[14px] leading-[20px] text-[#64748B]">
                  How to install dependencies and structure your app.
                </p>
              </div>
            </div>
            <div class="flex flex-row gap-4 p-4 cursor-pointer">
              <div>
                <Icon name="lucide:trash-2" class="text-[32px] font-normal" />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-medium text-[14px] leading-[14px] text-[#020617]">
                  Удалить пользователя (в архив)
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
  </div>
</template>
