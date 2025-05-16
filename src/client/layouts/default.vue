<script setup lang=ts>
// const router = useRouter()

// const breadcrumbs = computed(() => {
//   const currentPath = router.currentRoute.value.path
//   const paths = currentPath.split('/')
//   const breadcrumbs: any[] = []
//   let path = ''
//   for (const p of paths) {
//     if (!p) {
//       continue
//     }
//     path += `/${p}`
//     const route = router.options.routes.find((route) => {
//       return route.path === path
//     })
//     if (route) {
//       breadcrumbs.push({
//         href: route.path,
//         label: route.name,
//       })
//     }
//   }

//   return breadcrumbs.sort((a, b) => {
//     return a.href.length - b.href.length
//   })
// })

// const activeTeam = ref({
//   logo: 'tabler:database',
//   name: 'Регионы',
//   plan: 'Созвездие',
// })
</script>

<template>
  <div class="h-full w-full">
    <ClientOnly>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <slot />
        <!-- <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> -->
      </div>
    </ClientOnly>
  </div>
</template>
