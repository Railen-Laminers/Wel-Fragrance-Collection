import api from './axios';

export const getFaqs = async () => {
    const response = await api.get('/api/faqs');
    return response.data;
};

export const getPublicFaqs = async () => {
    const response = await api.get('/api/faqs/public');
    return response.data;
};

export const createFaq = async (faqData) => {
    const response = await api.post('/api/faqs', faqData);
    return response.data;
};

export const updateFaq = async (id, faqData) => {
    const response = await api.put(`/api/faqs/${id}`, faqData);
    return response.data;
};

export const deleteFaq = async (id) => {
    const response = await api.delete(`/api/faqs/${id}`);
    return response.data;
};
