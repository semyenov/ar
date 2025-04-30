<script setup lang="ts">
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <div
    id="__layout"
    class="flex flex-col items-center justify-center w-full h-full grow dark:text-white"
  >
    <ClientOnly>
      <Button
        class="absolute border border-gray-300 border-dashed rounded-full dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 top-4 right-4"
        type="menu"
        size="icon"
        variant="outline"
        @click="toggleDark()"
      >
        <Icon v-if="isDark" name="tabler:sun" />
        <Icon v-else name="tabler:moon" />
      </Button>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header class="flex items-center h-16 gap-2 px-4 border-b shrink-0">
            <SidebarTrigger class="-ml-1" />
            <Separator orientation="vertical" class="h-4 mr-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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
