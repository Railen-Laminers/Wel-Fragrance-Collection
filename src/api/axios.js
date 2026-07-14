import axios from 'axios';
import { showToast } from '../utils/toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getSuccessMessage = (config, data) => {
  const method = (config.method || 'get').toUpperCase();
  const url = config.url || '';
  const serverMessage = data?.message;

  if (url.includes('/auth/login')) return 'Signed in successfully.';
  if (url.includes('/auth/logout')) return 'Signed out successfully.';
  if (url.includes('/auth/profile')) return 'Profile updated successfully.';
  if (url.includes('/auth/change-password')) return 'Password updated successfully.';
  if (url.includes('/products')) {
    if (method === 'POST') return 'Product created successfully.';
    if (method === 'PUT') return 'Product updated successfully.';
    if (method === 'DELETE') return 'Product removed.';
    if (serverMessage) return serverMessage;
  }
  if (url.includes('/testimonials')) {
    if (method === 'POST') return 'Testimonial submitted successfully.';
    if (method === 'PATCH') return 'Testimonial status updated.';
    if (method === 'DELETE') return 'Testimonial removed.';
    if (serverMessage) return serverMessage;
  }
  if (url.includes('/inquiries')) {
    if (method === 'POST') return 'Inquiry sent successfully.';
    if (method === 'PATCH') return 'Inquiry updated successfully.';
    if (method === 'DELETE') return 'Inquiry removed.';
    if (serverMessage) return serverMessage;
  }
  if (url.includes('/notifications')) return 'Notification updated.';
  if (serverMessage) return serverMessage;
  if (method === 'POST') return 'Action completed successfully.';
  if (method === 'PUT' || method === 'PATCH') return 'Changes saved successfully.';
  if (method === 'DELETE') return 'Item removed successfully.';

  return null;
};

const getErrorMessage = (error) => {
  const serverMessage = error.response?.data?.message || error.response?.data?.error;
  if (serverMessage) return serverMessage;

  const status = error.response?.status;
  if (status === 400) return 'Please check your details and try again.';
  if (status === 401) return 'Please sign in again to continue.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return 'The requested item could not be found.';
  if (status >= 500) return 'We hit a snag on our side. Please try again in a moment.';

  return 'Something went wrong. Please try again.';
};

api.interceptors.response.use(
  (response) => {
    const method = (response.config?.method || 'get').toLowerCase();

    // Only show automatic toasts for mutations; components can override with custom messages
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      const message = getSuccessMessage(response.config, response.data);
      if (message && !response.config._skipToast) {
        showToast(message, 'success');
      }
    }

    return response;
  },
  (error) => {
    const method = (error.config?.method || 'get').toLowerCase();

    // Only show error toasts for mutations, and skip if component handled it
    if (['post', 'put', 'patch', 'delete'].includes(method) && !error.config?._skipToast) {
      showToast(getErrorMessage(error), 'error');
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;
