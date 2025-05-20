<script setup lang="ts">
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

const { client, useActiveOrganization, user } = useAuth()
const listOrganizations = client.useListOrganizations()

const fallback = computed(() => {
  return user.value
    ? user.value.name.split(' ')
        .map((w) => {
          return w[0]
        })
        .join('')
        .toUpperCase()
    : '?'
},
)
// const authClient = useAuth()
// const listOrganizations = authClient.client.useListOrganizations()
</script>

<template>
  <div id="__layout" class="relative flex flex-col items-center justify-center w-full h-full grow dark:text-white">
    <ClientOnly>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header class="flex items-center h-16 gap-2 px-4 border-b shrink-0">
            <SidebarTrigger class="-ml-1" />
            <Separator orientation="vertical" class="h-4 mr-2" />
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
            <DropdownMenu>
              <DropdownMenuTrigger class="ml-auto">
                <Avatar>
                  <AvatarFallback>{{ fallback }}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Аккаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Профиль</DropdownMenuItem>
                <DropdownMenuItem
                  @click="async () => {
                    await client.signOut()
                    router.push('/auth/sign-in')
                  }"
                >
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <!-- {{ listOrganizations.data }} -->
          </header>
          <slot />
        </SidebarInset>
      </SidebarProvider>
    </ClientOnly>
  </div>
</template>

<style lang="postcss">
html,
body,
#__nuxt,
#__layout {
  @apply !h-screen !w-screen;
}
</style>
