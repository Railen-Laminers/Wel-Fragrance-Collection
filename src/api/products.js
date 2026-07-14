import api from './axios';

export const getPublicProducts = async () => {
  const response = await api.get('/api/products/public');
  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get('/api/products/featured');
  return response.data;
};

export const getAdminProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

export const createProduct = async (payload) => {
  const response = await api.post('/api/products', payload, { _skipToast: true });
  return response.data;
};

export const updateProduct = async (id, payload) => {
  const response = await api.put(`/api/products/${id}`, payload, { _skipToast: true });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`, { _skipToast: true });
  return response.data;
};
