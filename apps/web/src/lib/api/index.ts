import axios from 'axios';

interface AuthResponse {
  user: unknown;
}

const baseURL = 'http://localhost:3000';

const api = axios.create({
  withCredentials: true,
  baseURL: baseURL,
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios<AuthResponse>(`/api/v1/auth/refresh`, {
          method: 'post',
          withCredentials: true,
          baseURL: baseURL,
        });
        if (response.status === 200) {
          return api.request(originalRequest);
        }
      } catch (e) {
        console.log('Unauthorized');
      }
    }
    throw error;
  },
);

export default api;
