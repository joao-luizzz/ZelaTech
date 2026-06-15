import api from './api';

export const financeiroService = {
  async listarMinhasFaturas() {
    const response = await api.get('/faturas/minhas');
    return response.data;
  },

  async listarTodasFaturas() {
    const response = await api.get('/faturas');
    return response.data;
  },

  async gerarFatura(faturaData) {
    const response = await api.post('/faturas', faturaData);
    return response.data;
  },

  async getFatura(id) {
    const response = await api.get(`/faturas/${id}`);
    return response.data;
  }
};
