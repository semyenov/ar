<script setup lang="ts">
import { useListForms } from '@/client/lib/api/default/default';
import type { FormStatus } from '@/client/lib/api/model/formStatus';
import type { ListFormsParams } from '@/client/lib/api/model/listFormsParams';

// Define page meta with admin layout
definePageMeta({
  layout: 'admin',
});

const { t } = useI18n();

// Pagination params
const paginationParams = ref<ListFormsParams>({
  limit: 10,
  offset: 0
});

// Status filter
const statusFilter = ref<FormStatus | null>(null);

// Search term
const searchTerm = ref('');

// Combine all params
const queryParams = computed<ListFormsParams>(() => {
  const params: ListFormsParams = {
    ...paginationParams.value
  };

  if (statusFilter.value) {
    params.status = statusFilter.value;
  }

  if (searchTerm.value.trim()) {
    // Using as any to bypass type checking for the search property
    (params as any).search = searchTerm.value.trim();
  }

  return params;
});

// Get forms using the generated API client with params
const { data: formsResponse, isLoading, error, refetch } = useListForms(queryParams);

// Computed property to get forms array
const forms = computed(() => formsResponse.value?.items || []);

// Filtered forms (same as forms for now, could be extended later)
const filteredForms = computed(() => forms.value);

// Calculate total pages
const totalPages = computed(() => {
  if (!formsResponse.value?.total) return 1;
  const limit = paginationParams.value.limit || 10;
  return Math.ceil(formsResponse.value.total / limit);
});

// Current page
const currentPage = computed(() => {
  const offset = paginationParams.value.offset || 0;
  const limit = paginationParams.value.limit || 10;
  return Math.floor(offset / limit) + 1;
});

// Go to page
const goToPage = (page: number) => {
  const limit = paginationParams.value.limit || 10;
  paginationParams.value.offset = (page - 1) * limit;
};

// Status options for filter
const statusOptions = ref([
  { label: t('common.all'), value: null },
  { label: t('forms.status.draft'), value: 'DRAFT' },
  { label: t('forms.status.underReview'), value: 'UNDER_REVIEW' },
  { label: t('forms.status.needsChanges'), value: 'NEEDS_CHANGES' },
  { label: t('forms.status.approved'), value: 'APPROVED' },
  { label: t('forms.status.rejected'), value: 'REJECTED' },
]);

// Watch for filter changes to reset pagination
watch([statusFilter, searchTerm], () => {
  paginationParams.value.offset = 0;
}, { deep: true });

// Format date to readable format
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<template>
  <div class="grid grid-cols-12 gap-4 p-4">
    <Card class="col-span-12">
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle class="text-xl">{{ t('forms.title') }}</CardTitle>
          <CardDescription>{{ t('forms.description') }}</CardDescription>
        </div>
        <div class="flex items-center space-x-2">
          <div class="relative flex items-center">
            <Input
              v-model="searchTerm"
              :placeholder="t('forms.search')"
              class="w-64 pr-10"
            />
            <button
              class="absolute text-gray-400 right-3 hover:text-gray-600"
              @click="searchTerm = ''"
              v-if="searchTerm"
            >
              ✕
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm">{{ t('forms.filterByStatus') }}:</span>
            <select v-model="statusFilter" class="p-2 border rounded">
              <option v-for="option in statusOptions" :key="option.value || 'all'" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <Button @click="refetch">{{ t('common.refresh') }}</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="py-8 text-center">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p class="mt-2">{{ t('common.loading') }}</p>
        </div>

        <div v-else-if="error" class="py-8 text-center text-red-500">
          <p>{{ t('common.error') }}: {{ error.message }}</p>
          <Button variant="outline" class="mt-4" @click="refetch">{{ t('common.retry') }}</Button>
        </div>

        <div v-else-if="filteredForms?.length === 0" class="py-8 text-center">
          <p>{{ t('forms.noForms') }}</p>
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>{{ t('forms.fields.title') }}</TableHead>
              <TableHead>{{ t('forms.fields.status') }}</TableHead>
              <TableHead>{{ t('forms.fields.createdAt') }}</TableHead>
              <TableHead>{{ t('forms.fields.updatedAt') }}</TableHead>
              <TableHead>{{ t('forms.fields.actions') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="form in filteredForms" :key="form.id">
              <TableCell>
                <div>
                  <div class="font-medium">{{ form.title }}</div>
                  <div v-if="form.description" class="text-sm text-gray-500">{{ form.description }}</div>
                </div>
              </TableCell>
              <TableCell>
                <span
                  class="inline-block px-2 py-1 text-xs rounded"
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
              </TableCell>
              <TableCell>{{ formatDate(form.createdAt) }}</TableCell>
              <TableCell>{{ formatDate(form.updatedAt) }}</TableCell>
              <TableCell>
                <div class="flex items-center space-x-2">
                  <Button variant="outline" size="sm" as-child>
                    <NuxtLink :to="`/forms/${form.id}`">{{ t('common.view') }}</NuxtLink>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="sm">
                        <span class="sr-only">{{ t('common.open') }}</span>
                        <span class="w-4 h-4">⋮</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>{{ t('common.edit') }}</DropdownMenuItem>
                      <DropdownMenuItem>{{ t('common.delete') }}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-6 space-x-1">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            &lt;
          </Button>

          <Button
            v-for="page in totalPages"
            :key="page"
            variant="outline"
            size="sm"
            :class="{ 'bg-primary text-primary-foreground': page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>

          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            &gt;
          </Button>
        </div>
      </CardContent>

      <CardFooter v-if="formsResponse?.total" class="flex justify-between">
        <div class="text-sm text-gray-500">
          {{ t('forms.showing') }} {{ (currentPage - 1) * (paginationParams.limit || 10) + 1 }} -
          {{ Math.min(currentPage * (paginationParams.limit || 10), formsResponse.total) }}
          {{ t('forms.of') }} {{ formsResponse.total }}
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">{{ t('forms.perPage') }}:</span>
          <select
            v-model="paginationParams.limit"
            class="p-1 text-sm border rounded"
            @change="paginationParams.offset = 0"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>