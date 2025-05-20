<script setup lang="ts">
definePageMeta({
  layout: 'user',
})
const authClient = useAuth()
const features = [
  'Email & Password',
  'Organization | Teams',
  'Passkeys',
  'Multi Factor',
  'Password Reset',
  'Email Verification',
  'Roles & Permissions',
  'Rate Limiting',
  'Session Management',
]
const { data: session } = await authClient.client.getSession()
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center overflow-hidden no-visible-scrollbar px-6 md:px-0">
    <main class="flex flex-col items-center justify-center row-start-2 gap-4">
      <div class="flex flex-col gap-1">
        <h3 class="text-4xl font-bold text-center text-black dark:text-white">
          Better Auth.
        </h3>

        <p class="text-sm text-center break-words md:text-base">
          Official demo to showcase
          <a
            href="https://better-auth.com"
            target="_blank"
            className="italic underline"
          >better-auth
          </a>
          features and capabilities. <br>
        </p>

        <div class="flex flex-col flex-wrap gap-3 pt-2">
          <div class="py-2 border-dotted border-y bg-secondary/60 opacity-80">
            <div class="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span class="text-center">
                All features on this demo are Implemented with Better Auth without
                any custom backend code
              </span>
            </div>
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <div v-for="feature in features" :key="feature">
              <span
                class="flex items-center gap-1 pb-1 text-xs transition-all duration-150 ease-in-out border-b cursor-pointer text-muted-foreground hover:text-foreground hover:border-foreground"
              >{{
                feature }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 mx-auto mt-2">
          <NuxtLink v-if="!session" to="/auth/sign-in">
            <Button variant="outline" class="rounded-none">
              Sign In
            </Button>
          </NuxtLink>
          <NuxtLink v-if="session" to="/auth/dashboard">
            <Button variant="outline" class="rounded-none">
              Dashboard
            </Button>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>
