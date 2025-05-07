
export const customInstance = <T>(
  config: any,
  options?: any
): Promise<T> => {
  const defaultOptions = {
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json'
    },
    async onRequest({ options }: { options: any }) {
      const token = localStorage.getItem('auth.token');
      if (token) {
        // Handle Authorization header properly
        options.headers = options.headers || {};
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        };
      }
    },
    async onResponseError({ response }: { response: any }) {
      if (response.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = '/auth/sign-in';
      }
    }
  };

  return $fetch(config.url, {
    method: config.method,

    body: config.data,
    ...config.params && { query: config.params },
    ...defaultOptions,
    ...options
  });
};