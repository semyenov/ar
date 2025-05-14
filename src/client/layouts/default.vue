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
  <div class="w-full h-full">
  <ClientOnly>
      <div class="flex flex-col flex-1 gap-4 p-4 pt-0">
        <slot />
        <!-- <div class="grid gap-4 auto-rows-min md:grid-cols-3">
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> -->
      </div>
    </ClientOnly>
  </div>
</template>
<style>
</style>
