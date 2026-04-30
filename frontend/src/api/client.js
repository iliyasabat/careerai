import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

client.interceptors.request.use((config) => {
  const user = localStorage.getItem('careeros_user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('careeros_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default client;
