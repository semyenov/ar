# API Client

This API client is automatically generated from the OpenAPI specification using [Orval](https://orval.dev/).

## How to use

### Fetching data

The API client provides hooks that you can use with Vue Query to fetch data. Here's an example of how to use them:

```vue
<script setup lang="ts">
import { useListForms } from '@/client/lib/api';

// Fetching a list of forms
const { 
  data: formsResponse, 
  isLoading, 
  error 
} = useListForms({
  query: {
    // Vue Query options
    refetchOnWindowFocus: false,
  },
  request: {
    // Axios options
    headers: {
      'Custom-Header': 'value'
    }
  }
});

// You can also provide query parameters
const { data: filteredFormsResponse } = useListForms({
  params: {
    status: 'DRAFT',
    limit: 10,
    offset: 0
  }
});

// Fetching a single form by ID
const formId = 'some-id';
const { data: formData } = useGetForm(formId);
</script>
```

### Creating/updating data

For mutations (creating, updating, deleting data), you can use the mutation hooks:

```vue
<script setup lang="ts">
import { useCreateForm } from '@/client/lib/api';
import type { FormCreate } from '@/client/lib/api/model';

// Create a new form
const { 
  mutate: createForm, 
  isLoading, 
  error,
  isSuccess 
} = useCreateForm();

const formData: FormCreate = {
  title: 'New Form',
  organizationId: 'org-id',
  description: 'Form description'
};

// Call the mutation when needed
function handleSubmit() {
  createForm({ data: formData }, {
    onSuccess: (data) => {
      console.log('Form created successfully', data);
    },
    onError: (error) => {
      console.error('Error creating form', error);
    }
  });
}
</script>
```

### Direct API calls

If you need to make direct API calls without using hooks:

```typescript
import { createForm, getForm } from '@/client/lib/api';

// Direct API call to create a form
const newForm = await createForm({
  title: 'New Form',
  organizationId: 'org-id'
});

// Direct API call to get a form
const form = await getForm('form-id');
```

## Regenerating the API client

When the OpenAPI specification is updated, you need to regenerate the API client:

```bash
# Generate the API client
yarn api:generate

# Or watch for changes to the OpenAPI spec
yarn api:watch
```

## Custom Axios instance

The API client uses a custom Axios instance defined in `src/client/lib/api/mutator/custom-instance.ts`. You can modify this file to add global request/response interceptors, error handling, etc.