<script setup lang=ts>

const data = {
  navMain: [
    {
      icon: 'tabler:database',
      isActive: true,
      items: [
        {
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
      icon: 'tabler:users',
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

const router = useRouter()

const breadcrumbs = computed(() => {
  const currentPath = router.currentRoute.value.path
  const paths = currentPath.split('/')
  const breadcrumbs: any[] = []
  let path = ''
  for (const p of paths) {
    if (!p) {
      continue
    }
    path += `/${p}`
    const route = router.options.routes.find((route) => {
      return route.path === path
    })
    if (route) {
      breadcrumbs.push({
        href: route.path,
        label: route.name,
      })
    }
  }

  return breadcrumbs.sort((a, b) => {
    return a.href.length - b.href.length
  })
})

const activeTeam = ref({
  logo: 'tabler:database',
  name: 'Регионы',
  plan: 'Созвездие',
})
</script>

<template>
  <ClientOnly>
    <div class="w-full h-full">
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div class="flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground">
                    <component :is="activeTeam.logo" class="size-4" />
                  </div>
                  <div class="grid flex-1 text-sm leading-tight text-left">
                    <span class="font-semibold truncate">{{ activeTeam.name }}</span>
                    <span class="text-xs truncate">{{ activeTeam.plan }}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Основные</SidebarGroupLabel>
              <SidebarMenu>
                <Collapsible
                  v-for="item in data.navMain"
                  :key="item.title"
                  as-child
                  :default-open="item.isActive"
                  class="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger as-child>
                      <SidebarMenuButton :tooltip="item.title">
                        <Icon :name="item.icon" />
                        <span>{{ item.title }}</span>
                        <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem
                          v-for="subItem in item.items"
                          :key="subItem.title"
                        >
                          <SidebarMenuSubButton as-child>
                            <NuxtLink :to="subItem.url" active-class="bg-sidebar-accent text-sidebar-accent-foreground">
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
                          {{
                            data.user.name
                              .slice(0, 1)
                              .toUpperCase()
                          }}
                        </AvatarFallback> -->
                      </Avatar>
                      <!-- <div class="grid flex-1 text-sm leading-tight text-left">
                        <span class="font-semibold truncate">{{ data.user.name }}</span>
                        <span class="text-xs truncate">{{ data.user.email }}</span>
                      </div> -->
                      <ChevronsUpDown class="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom" align="end" :side-offset="4">
                    <DropdownMenuLabel class="p-0 font-normal">
                      <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar class="w-8 h-8 rounded-lg">
                          <!-- <AvatarImage :src="data.user.avatar" :alt="data.user.name" /> -->
                          <!-- <AvatarFallback class="rounded-lg">
                            {{
                              data.user.name
                                .slice(0, 1)
                                .toUpperCase()
                            }}
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
        <SidebarInset>
          <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div class="flex items-center gap-2 px-4">
              <SidebarTrigger class="-ml-1" />
              <Separator orientation="vertical" class="h-4 mr-2" />
              <Breadcrumb>
                <BreadcrumbList>
                  <template v-for="[index, breadcrumb] in breadcrumbs.entries()" :key="breadcrumb.href">
                    <BreadcrumbSeparator v-if="index > 0" class="hidden md:block" />
                    <BreadcrumbItem>
                      <NuxtLink :to="breadcrumb.href">
                        {{ breadcrumb.label }}
                      </NuxtLink>
                    </BreadcrumbItem>
                  </template>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div class="flex flex-col flex-1 gap-4 p-4 pt-0">
            <slot />
            <!-- <div class="grid gap-4 auto-rows-min md:grid-cols-3">
              <div class="aspect-video rounded-xl bg-muted/50" />
              <div class="aspect-video rounded-xl bg-muted/50" />
              <div class="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> -->
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  </ClientOnly>
</template>
<style>
</style>
