<script setup lang="ts">
import { ref } from 'vue';
import { useCreateForm } from '@/client/api';
import type { FormCreate } from '@/client/api';

// Default empty form data
const formData = ref<FormCreate>({
  title: '',
  organizationId: '',
  description: null,
  templateId: null,
  executorMemberId: null
});

// Get the organization ID from the user session or a store
const organizationId = ref(''); // This should be set from your auth system

// Use the mutation for creating a form
const { mutate, isPending, error, isSuccess } = useCreateForm();

// Update organization ID when available
watch(() => organizationId.value, (newOrgId) => {
  if (newOrgId) {
    formData.value.organizationId = newOrgId;
  }
});

// Handle form submission
const handleSubmit = () => {
  if (!formData.value.title || !formData.value.organizationId) {
    return;
  }

  mutate({ data: formData.value }, {
    onSuccess: () => {
      // Reset form data
      formData.value = {
        title: '',
        organizationId: organizationId.value,
        description: null,
        templateId: null,
        executorMemberId: null
      };
    }
  });
};
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block mb-1 text-sm font-medium">Title</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          required
          class="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label for="description" class="block mb-1 text-sm font-medium">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          class="w-full p-2 border rounded"
        ></textarea>
      </div>

      <button
        type="submit"
        class="px-4 py-2 text-white bg-blue-500 rounded"
        :disabled="isPending || !formData.title || !formData.organizationId"
      >
        {{ isPending ? 'Creating...' : 'Create Form' }}
      </button>

      <div v-if="error" class="mt-2 text-red-500">
        Error: {{ error.message }}
      </div>

      <div v-if="isSuccess" class="mt-2 text-green-500">
        Form created successfully!
      </div>
    </form>
  </div>
</template>