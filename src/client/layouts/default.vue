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
  },
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

// const activeTeam = ref({
//   logo: 'tabler:database',
//   name: 'Регионы',
//   plan: 'Созвездие',
// })

const authClient = useAuth()
const listOrganizations = authClient.client.useListOrganizations()

// const listOrganizations = await authClient.client.organization.list()
// await authClient.client.organization.setActive({ organizationId: listOrganizations.value.data![0].id })
</script>

<template>
  <div id="__layout" class="relative flex flex-col items-center justify-center w-full h-full grow dark:text-white">
    <ClientOnly>
      <SidebarProvider>
        <!-- <AppSidebar /> -->
        <SidebarInset>
          <header class="flex items-center h-16 gap-2 px-4 border-b shrink-0">
            <!-- <SidebarTrigger class="-ml-1" /> -->
            <!-- <Separator orientation="vertical" class="h-4 mr-2" /> -->
            <Breadcrumb>
              <BreadcrumbList>
                <template v-for="b, bi in breadcrumbs" :key="b.href">
                  <BreadcrumbItem class="hidden md:block">
                    <BreadcrumbLink href="#">
                      {{ b }}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator v-if="bi < breadcrumbs.length - 1" class="hidden md:block" />
                </template>
                <!-- <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem> -->
              </BreadcrumbList>
            </Breadcrumb>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem v-for="(item, index) in listOrganizations.data" :key="index" :value="item.id">
                    {{ item.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </header>
          <slot />
        </SidebarInset>
      </SidebarProvider>
    </ClientOnly>
  </div>
</template>

<style>
</style>
