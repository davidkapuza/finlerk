import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL,
  isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (isServer) {
    const { cookies } = await import('next/headers');
    config.headers.Cookie = cookies().toString();
  }
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      await axios(`/api/v1/auth/refresh`, {
        method: 'post',
        withCredentials: true,
        baseURL: baseURL,
      })
        .then(() => {
          return api.request(originalRequest);
        })
        .catch(() => {
          console.log('Unauthorized');
        });
    }
    throw error;
  },
);

export default api;
