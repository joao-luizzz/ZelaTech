import api from './api';

export const muralService = {
  async getAvisos() {
    const response = await api.get('/avisos');
    return response.data;
  },

  async createAviso(dadosAviso) {
    const response = await api.post('/avisos', dadosAviso);
    return response.data;
  },

  async deleteAviso(id) {
    const response = await api.delete(`/avisos/${id}`);
    return response.data;
  }
};
