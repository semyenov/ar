<script setup lang="ts">

</script>

<template>
  <div
    id="__layout"
    class="flex flex-col items-center justify-center w-full h-full grow dark:text-white"
  >
    <ClientOnly>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header class="flex items-center h-16 gap-2 px-4 border-b shrink-0">
            <!-- <SidebarTrigger class="-ml-1" /> -->
            <!-- <Separator orientation="vertical" class="h-4 mr-2" /> -->
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
