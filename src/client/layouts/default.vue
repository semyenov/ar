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
const { user } = authClient

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
// function logOut() {
//   await authClient.signOut({
//     fetchOptions: {
//       onSuccess: () => {
//         router.push('/login') // redirect to login page
//       },
//     },
//   })
// }
// const listOrganizations = await authClient.client.organization.list()
// await authClient.client.organization.setActive({ organizationId: listOrganizations.value.data![0].id })
</script>

<template>
  <div id="__layout" class="relative flex flex-col items-center justify-center w-full h-full grow dark:text-white">
    <ClientOnly>
      <slot />
    </ClientOnly>
  </div>
</template>

<style>
</style>
