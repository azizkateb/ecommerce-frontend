import axios from 'axios';
import { environment } from './environments/environment';

const apiUrl = environment.apiUrl;

if (!apiUrl) {
  throw new Error('Missing API URL in Angular environment configuration. Set apiUrl in src/environments/environment.ts or environment.prod.ts.');
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