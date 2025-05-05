<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/client/components/ui/avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarProps,
  SidebarRail,
} from '@/client/components/ui/sidebar'

const props = defineProps<SidebarProps>()

const isDark = useDark()
  const toggleDark = useToggle(isDark)

// This is sample data.
const data = {
  navMain: [
    // {
    //   items: [
    //     {
    //       title: 'Главная',
    //       url: '/',
    //     },
    //   ],
    //   title: 'Getting Started',
    //   url: '#',
    // },
    {
      items: [
        {
          isActive: true,
          title: 'Организации',
          url: '/organizations#',
        },

        {
          title: 'Статусы',
          url: '/statuses',
        },
      ],
      title: 'Главное меню',
      url: '#',
    },
    {
      items: [
      {
          title: 'Пользователи',
          url: '/users',
        },
        {
          title: 'База данных',
          url: '#',
        },
      ],
      title: 'Администрирование',
      url: '#',
    },
  ],
  // versions: [
  //   '1.0.1',
  //   '1.1.0-alpha',
  //   '2.0.0-beta1',
  // ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <!-- <VersionSwitcher
        :versions="data.versions"
        :default-version="data.versions[0]"
      /> -->
      <!-- <SearchForm /> -->
      <Avatar>
        <!-- <AvatarImage src="https://github.com/unovue.png" alt="@unovue" /> -->
        <AvatarFallback>R</AvatarFallback>
      </Avatar>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup v-for="item in data.navMain" :key="item.title">
        <SidebarGroupLabel v-if="item.title">{{ item.title }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="childItem in item.items" :key="childItem.title">
              <SidebarMenuButton as-child :is-active="childItem.isActive">
                <a :href="childItem.url">{{ childItem.title }}</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <Button
      size="icon"
      variant="ghost"
      @click="toggleDark()"
    >
      <Icon v-if="isDark" name="tabler:sun" />
      <Icon v-else name="tabler:moon" />
    </Button>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
