<script lang="ts" setup>
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const authClient = useAuth()
async function handleSignUp() {
  const user = {
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    password: password.value,
  }

  await authClient.signUp.email({
    callbackURL: '/auth/dashboard',
    email: user.email,
    fetchOptions: {
      onError(context) {
        console.error(context.error.message)
      },
      onSuccess() {
        useRouter()
          .push('/auth/dashboard')
      },
    },
    name: `${user.firstName} ${user.lastName}`,
    password: user.password,
  })
}
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Card class="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle class="text-xl">
          Sign Up
        </CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="first-name">First name</Label>
              <Input id="first-name" v-model="firstName" placeholder="Max" required />
            </div>
            <div class="grid gap-2">
              <Label for="last-name">Last name</Label>
              <Input id="last-name" v-model="lastName" placeholder="Robinson" required />
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input id="password" v-model="password" type="password" />
          </div>
          <Button type="button" class="w-full" @click="handleSignUp">
            Create an account
          </Button>
        </div>
        <div class="mt-4 text-sm text-center">
          Already have an account?
          <a href="/auth/sign-in" class="underline"> Sign in </a>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
