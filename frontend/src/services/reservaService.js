import api from './api';

export const reservaService = {
  // Áreas Comuns
  async listarAreasAtivas() {
    const response = await api.get('/areas');
    return response.data;
  },

  async cadastrarArea(dadosArea) {
    const response = await api.post('/areas', dadosArea);
    return response.data;
  },

  async alternarStatusArea(id) {
    const response = await api.patch(`/areas/${id}/status`);
    return response.data;
  },

  // Reservas
  async agendarReserva(dadosReserva) {
    const response = await api.post('/reservas', dadosReserva);
    return response.data;
  },

  async listarMinhasReservas() {
    const response = await api.get('/reservas/morador');
    return response.data;
  },

  async listarReservasPorAreaEMes(areaId, ano, mes) {
    const response = await api.get(`/reservas/area/${areaId}`, { params: { ano, mes } });
    return response.data;
  },

  async cancelarReserva(id) {
    const response = await api.patch(`/reservas/${id}/cancelar`);
    return response.data;
  }
};
