<script setup lang="ts">
const authClient = useAuth()

const { data: session } = await authClient.client.getSession()
const router = useRouter()
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center overflow-hidden no-visible-scrollbar px-6 md:px-0">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>
          User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center gap-2">
          <Avatar>
            <AvatarImage :src="session?.user.image || ''" alt="User profile" />
            <AvatarFallback>{{ session?.user.name[0] }}</AvatarFallback>
          </Avatar>
          <div>
            <p class="text-sm">
              {{ session?.user?.name }}
            </p>
            <p class="text-xs">
              {{ session?.user?.email }}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary" @click="async () => {
            await authClient.signOut()
            router.push('/auth/sign-in')
          }"
        >
          Sing Out
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
