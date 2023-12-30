import axios from 'axios';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: unknown;
}

const baseURL = 'http://localhost:3000';

const api = axios.create({
  withCredentials: true,
  baseURL: baseURL,
});
console.log(baseURL);
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
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
        const response = await axios.get<AuthResponse>(
          `${baseURL}/api/v1/auth/refresh`,
          {
            withCredentials: true,
          },
        );
        localStorage.setItem('token', response.data.accessToken);
        return api.request(originalRequest);
      } catch (e) {
        console.log('Unauthorized');
      }
    }
    throw error;
  },
);

export default api;
