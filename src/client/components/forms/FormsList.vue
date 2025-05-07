<script setup lang="ts">
import { useListForms } from '@/client/lib/api/default/default';

// Use the generated API hook to fetch forms
const { data: formsResponse, isLoading, error } = useListForms();

// Computed property to get just the forms array
const forms = computed(() => formsResponse.value?.items || []);
</script>

<template>
  <div class="forms-list">
    <h2 class="mb-4 text-xl font-semibold">Forms</h2>

    <div v-if="isLoading" class="py-4">
      Loading forms...
    </div>

    <div v-else-if="error" class="py-4 text-red-500">
      Error loading forms: {{ error.message }}
    </div>

    <div v-else-if="forms.length === 0" class="py-4">
      No forms found.
    </div>

    <div v-else class="space-y-4">
      <div v-for="form in forms" :key="form.id" class="p-4 border rounded-md">
        <h3 class="text-lg font-medium">{{ form.title }}</h3>
        <p v-if="form.description" class="mt-1 text-gray-600">{{ form.description }}</p>
        <div class="flex items-center mt-2">
          <span
            class="inline-block px-2 py-1 text-sm rounded"
            :class="{
              'bg-yellow-100 text-yellow-800': form.status === 'DRAFT',
              'bg-blue-100 text-blue-800': form.status === 'UNDER_REVIEW',
              'bg-orange-100 text-orange-800': form.status === 'NEEDS_CHANGES',
              'bg-green-100 text-green-800': form.status === 'APPROVED',
              'bg-red-100 text-red-800': form.status === 'REJECTED',
            }"
          >
            {{ form.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>