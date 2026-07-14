import api from './axios';

export const getPublicTestimonials = async () => {
  const response = await api.get('/api/testimonials/public');
  return response.data;
};

export const getAdminTestimonials = async () => {
  const response = await api.get('/api/testimonials');
  return response.data;
};

export const submitTestimonial = async (payload) => {
  const response = await api.post('/api/testimonials', payload);
  return response.data;
};

export const updateTestimonialStatus = async (id, status) => {
  const response = await api.patch(`/api/testimonials/${id}/status`, { status }, { _skipToast: true });
  return response.data;
};

export const deleteTestimonial = async (id) => {
  const response = await api.delete(`/api/testimonials/${id}`, { _skipToast: true });
  return response.data;
};

export const getAdminInquiries = async () => {
  const response = await api.get('/api/inquiries');
  return response.data;
};

export const submitInquiry = async (payload) => {
  const response = await api.post('/api/inquiries', payload);
  return response.data;
};

export const markInquiryAsRead = async (id) => {
  const response = await api.patch(`/api/inquiries/${id}/read`, {}, { _skipToast: true });
  return response.data;
};

export const markInquiryAsUnread = async (id) => {
  const response = await api.patch(`/api/inquiries/${id}/unread`, {}, { _skipToast: true });
  return response.data;
};

export const deleteInquiry = async (id) => {
  const response = await api.delete(`/api/inquiries/${id}`, { _skipToast: true });
  return response.data;
};
