<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h } from 'vue'
import * as z from 'zod'

import { Button } from '@/client/components/ui/button'
import { Checkbox } from '@/client/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/client/components/ui/form'
import { toast } from '@/client/components/ui/toast'

const items = [
  {
    id: 'recents',
    label: 'Recents',
  },
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const

const formSchema = toTypedSchema(z.object({
  items: z.array(z.string())
    .refine((value) => {
      return value.some((item) => {
        return item
      })
    }, {
      message: 'You have to select at least one item.',
    }),
}))

const { handleSubmit } = useForm({
  initialValues: {
    items: ['recents', 'home'],
  },
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  toast({
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
    title: 'You submitted the following values:',
  })
})
</script>

<template>
  <form @submit="onSubmit">
    <FormField name="items">
      <FormItem>
        <div class="mb-4">
          <FormLabel class="text-base">
            Sidebar
          </FormLabel>
          <FormDescription>
            Select the items you want to display in the sidebar.
          </FormDescription>
        </div>

        <FormField
          v-for="item in items" v-slot="{ value, handleChange }" :key="item.id" type="checkbox"
          :value="item.id" :unchecked-value="false" name="items"
        >
          <FormItem class="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox :model-value="value.includes(item.id)" @update:model-value="handleChange" />
            </FormControl>
            <FormLabel class="font-normal">
              {{ item.label }}
            </FormLabel>
          </FormItem>
        </FormField>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-start mt-4">
      <Button type="submit">
        Submit
      </Button>
    </div>
  </form>
</template>
