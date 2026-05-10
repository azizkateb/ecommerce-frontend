/// <reference types="vite/client" />

import axios from 'axios';

const apiUrl = import.meta.env['VITE_API_URL'];

if (!apiUrl) {
  throw new Error('Missing environment variable VITE_API_URL. Set it in .env or .env.production.');
}

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        const authError = new Error('Unauthorized');
        (authError as any).status = 401;
        return Promise.reject(authError);
      }
      return Promise.reject(error);
    }

    if (error.request) {
      return Promise.reject(new Error('Network Error: Unable to reach API server.'));
    }

    return Promise.reject(error);
  }
);

export default api;