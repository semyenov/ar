<script setup lang="ts">
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/components/ui/card'
import { Progress } from '@/client/components/ui/progress'

const { activeOrganization: org } = useAuth()
</script>

<template>
  <!-- {{ listOrganizations }} -->
  <!-- <pre>{{ org }}</pre> -->
  <Card v-if="org" class="w-full h-fit">
    <CardHeader class="flex flex-row justify-between pb-3">
      <div class="flex flex-col gap-2">
        <CardTitle>
          <p class="text-xl font-semibold">
            {{ org.name }}
          </p>
        </CardTitle>
        <CardDescription>
          <div class="flex flex-row items-center gap-2 text-base">
            <Icon name="tabler:map-pin" class="w-5 h-5 text-foreground" />
            <p class="">
              Ленинский проспект д.123, г. Тула, 117135
            </p>
            <Icon name="lucide:copy" class="text-[20px] cursor-pointer" />
          </div>
        </CardDescription>

        <div class="flex flex-row items-center gap-4">
          <Progress :model-value="75" />
          <p class="text-muted-foreground">
            75%
          </p>
        </div>
      </div>
      <div class="flex items-center justify-center p-2 rounded-full cursor-pointer bg-secondary size-8">
        <Icon name="lucide:clipboard-edit" />
      </div>
    </CardHeader>
  </Card>
</template>
