<script setup lang="ts">
const email = ref('')
const password = ref('')
const authClient = useAuth()
async function handleSignIn() {
  await authClient.signIn.email(
    {
      callbackURL: '/auth/dashboard',
      email: email.value,
      password: password.value,
    },
    {
      onError(context) {
        console.error(context.error.message)
      },
    },
  )
}
definePageMeta({
  auth: false,
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Card class="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl">
          Login
        </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a href="/auth/forget-password" class="inline-block ml-auto text-sm underline">
                Forgot your password?
              </a>
            </div>
            <Input id="password" v-model="password" type="password" placeholder="password" required />
          </div>
          <Button type="submit" class="w-full" @click="handleSignIn">
            Login
          </Button>
          <Button
            variant="outline" class="w-full" @click="async () => {
              await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/auth/dashboard',
              })
            }"
          >
            Login with Google
          </Button>
        </div>
        <div class="mt-4 text-sm text-center">
          Don't have an account?
          <a href="/auth/sign-up" class="underline">
            Sign up
          </a>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
