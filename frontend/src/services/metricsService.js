import api from './api';

export const metricsService = {
  async getDashboardMetrics(dataInicio, dataFim) {
    const params = {};
    if (dataInicio) params.dataInicio = dataInicio;
    if (dataFim) params.dataFim = dataFim;
    
    // Cache buster para evitar problemas similares aos da tela de chamados
    params._t = Date.now();

    const response = await api.get('/metrics/dashboard', { params });
    return response.data;
  }
};
