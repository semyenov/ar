<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { type FormTemplate, useListForms, useListFormTemplates } from '~/client/api'
import { filter, map } from 'remeda'
import * as z from 'zod'

import { toast } from '@/client/components/ui/toast'

const { data: formTemplates } = useListFormTemplates()
const { data: forms } = useListForms()
const authClient = useAuth()
const listOrganizations = authClient.client.useListOrganizations()

const selectedTemplate = ref<FormTemplate>()

const orgsWithForms = computed(() => {
  return forms.value
    ? map(filter(forms.value?.items, (f) => {
        return f.templateId === selectedTemplate.value
      }), (f) => {
        return f.organizationId
      })
    : []
})
const availableOrganizations = computed(() => {
  return filter(listOrganizations.value?.data || [], (o) => {
    return !orgsWithForms.value.includes(o.id)
  })
})
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

const formSchema = [
  z.object({
    formTemplate: z.string({ message: 'Выберите шаблон заявки' }),
  }),
  z.object({
    organizations: z.array(z.string())
      .refine((value) => {
        return value.some((item) => {
          return item
        })
      }, {
        message: 'Необходимо выбрать хотя бы одну организацию',
      }),
  }),
]
const initialValues = {
  formTemplate: undefined,

  organizations: [],
}

const stepIndex = ref(1)
const steps = [
  {
    description: 'Выберите шаблон заявки, которую вы хотите назначить на организации',
    step: 1,
    title: 'Шаблон заявки',
  },
  {
    description: 'Выберите организации, которым будет направлена заявка',
    step: 2,
    title: 'Организации',
  },
]

function onSubmit(values: any) {
  console.log(values)
  toast({
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
    title: 'You submitted the following values:',
  })
}
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <Button>Создать заявку</Button>
    </DialogTrigger>
    <DialogContent class="w-full max-w-screen-lg">
      <template v-if="formTemplates?.items">
        <!-- {{ selectedTemplate }} -->
        <!-- {{ forms }} -->
        <!-- <pre class="overflow-y-auto max-h-96">{{ availableOrganizations }}</pre> -->
        <Form
          v-slot="{ meta, values, validate }" as="" :validation-schema="toTypedSchema(formSchema[stepIndex - 1])"
          :initial-values="initialValues" :keep-values="true"
        >
          <!-- {{ toTypedSchema(formSchema[stepIndex - 1]) }} -->
          <Stepper
            v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }" v-model="stepIndex"
            class="block w-full"
          >
            <form
              :key="`form-${stepIndex}`" @submit="(e) => {
                e.preventDefault()
                validate()
                if (stepIndex === steps.length && meta.valid) {
                  onSubmit(values)
                }
              }"
            >
              <div class="flex w-full gap-2 flex-start">
                <StepperItem
                  v-for="step in steps" :key="step.step" v-slot="{ state }"
                  class="relative flex flex-col items-center justify-center w-full" :step="step.step"
                >
                  <StepperSeparator
                    v-if="step.step !== steps[steps.length - 1].step"
                    class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
                  />
                  <StepperTrigger as-child>
                    <Button
                      :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'" size="icon"
                      class="z-10 flex items-center justify-center rounded-full shrink-0"
                      :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                      :disabled="state !== 'completed' && !meta.valid"
                    >
                      <Icon v-if="state === 'completed'" name="tabler:check" class="size-5" />
                      <Icon v-if="state === 'active'" name="tabler:circle" />
                      <Icon v-if="state === 'inactive'" name="tabler:point-filled" class="text-muted-foreground" />
                    </Button>
                  </StepperTrigger>
                  <div class="flex flex-col items-center mt-5 text-center">
                    <StepperTitle
                      :class="[state === 'active' && 'text-primary']"
                      class="text-sm font-semibold transition lg:text-base"
                    >
                      {{ step.title }}
                    </StepperTitle>
                    <StepperDescription
                      :class="[state === 'active' && 'text-primary']"
                      class="text-xs transition sr-only text-muted-foreground md:not-sr-only lg:text-sm"
                    >
                      {{ step.description }}
                    </StepperDescription>
                  </div>
                </StepperItem>
              </div>
              <div class="flex flex-col gap-4 mt-4">
                <template v-if="stepIndex === 1">
                  <FormField v-slot=" componentField " name="formTemplate">
                    <!-- {{ componentField }} -->
                    <FormItem>
                      <FormLabel>Шаблон заявки</FormLabel>
                      <Select v-bind="componentField.componentField" v-model="selectedTemplate">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите шаблон" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem v-for="ft in formTemplates?.items" :key="ft.id" :value="ft.id">
                              {{ ft.name }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </template>
                <template v-if="stepIndex === 2">
                  <FormField name="organizations">
                    <FormItem>
                      <FormField
                        v-for="o in availableOrganizations" v-slot="{ value: checkValue, handleChange }"
                        :key="o.id" type="checkbox" :value="o.id" :unchecked-value="false" name="organizations"
                      >
                        <FormItem>
                          <div class="flex items-center gap-2">
                            <FormControl>
                              <Checkbox :model-value="checkValue?.includes(o.id)" as="div" class="w-5 h-5" @update:model-value="handleChange" />
                            </FormControl>
                            {{ o.name }}
                          </div>
                          <!-- <FormLabel class="mt-0 font-normal"> -->
                          <!-- </FormLabel> -->
                        </FormItem>
                      </FormField>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </template>
              </div>
              <div class="flex items-center justify-between mt-4">
                <Button :disabled="isPrevDisabled" variant="outline" size="sm" @click="prevStep()">
                  Назад
                </Button>
                <div class="flex items-center gap-3">
                  <Button
                    v-if="stepIndex !== 2" :type="meta.valid ? 'button' : 'submit'" :disabled="isNextDisabled"
                    size="sm" @click="meta.valid && nextStep()"
                  >
                    Next
                  </Button>
                  <DialogClose v-if="stepIndex === 2">
                    <Button size="sm" type="submit" :disabled="!meta.valid">
                      Создать заявки
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </form>
          </Stepper>
        </Form>
      </template>
      <template v-else>
        Отсутствуют шаблоны для заявок
        <DialogClose>
          <Button>Закрыть</Button>
        </DialogClose>
      </template>
    </DialogContent>
  </Dialog>
</template>
