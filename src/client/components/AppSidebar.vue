<script setup lang="ts">
import { type SidebarProps } from '@/client/components/ui/sidebar'

const router = useRouter()
const props = defineProps<SidebarProps>()

const { t } = useI18n()

const data = {
  navMain: [
    {
      icon: 'tabler:database',
      isActive: true,
      items: [
        {
          title: t('pages.formTemplates.title'),
          url: '/admin/formTemplates',
        },
        {
          title: t('pages.forms.title'),
          url: '/admin/forms',
        }
      ],
      title: 'Главное меню',
      url: '#',
    },
    {
      icon: 'tabler:users',
      items: [
        {
          title: t('pages.organizations.title'),
          url: '/admin/organizations',
        }  ,
      {
          title: t('pages.users.title'),
          url: '/admin/users',
        },
        {
          title: t('pages.database.title'),
          url: '#',
        },
      ],
      title: 'Администрирование',
      url: '#',
    },
  ],
  projects: [
    {
      icon: 'tabler:frame',
      name: 'Регионы',
      url: '#',
    },
  ],
  user: {
    avatar: '/avatars/shadcn.jpg',
    email: 'root@root.ru',
    name: 'root',
  }
}



const activeTeam = ref({
  logo: 'tabler:database',
  name: 'Регионы',
  plan: 'Созвездие',
})

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
<Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div class="flex items-center justify-center rounded-lg aspect-square text-primary">
                    <Icon :name="activeTeam.logo" class="size-8" />
                  </div>
                  <div class="grid flex-1 text-sm leading-tight text-left">
                    <span class="font-semibold truncate">{{ activeTeam.name }}</span>
                    <span class="text-xs truncate">{{ activeTeam.plan }}</span>
                  </div>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem
                    v-for="subItem in item.items"
                    :key="subItem.title"
                  >
                    <SidebarMenuSubButton as-child>
                      <NuxtLink
                        :to="subItem.url"
                        active-class="bg-sidebar-accent text-sidebar-accent-foreground"
                      >
                        <span>{{ subItem.title }}</span>
                      </NuxtLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>

    <!-- Footer section -->
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar class="w-8 h-8 rounded-lg">
                  <!-- <AvatarImage :src="data.user.avatar" :alt="data.user.name" /> -->
                  <!-- <AvatarFallback class="rounded-lg">
                    {{ data.user.name.slice(0, 1).toUpperCase() }}
                  </AvatarFallback> -->
                </Avatar>
                <!-- <div class="grid flex-1 text-sm leading-tight text-left">
                  <span class="font-semibold truncate">{{ data.user.name }}</span>
                  <span class="text-xs truncate">{{ data.user.email }}</span>
                </div> -->
                <ChevronsUpDown class="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              :side-offset="4"
            >
              <DropdownMenuLabel class="p-0 font-normal">
                <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar class="w-8 h-8 rounded-lg">
                    <!-- <AvatarImage :src="data.user.avatar" :alt="data.user.name" /> -->
                    <!-- <AvatarFallback class="rounded-lg">
                      {{ data.user.name.slice(0, 1).toUpperCase() }}
                    </AvatarFallback> -->
                  </Avatar>
                  <!-- <div class="grid flex-1 text-sm leading-tight text-left">
                    <span class="font-semibold truncate">{{ data.user.name }}</span>
                    <span class="text-xs truncate">{{ data.user.email }}</span>
                  </div> -->
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
