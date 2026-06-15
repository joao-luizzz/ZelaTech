import api from './api';

export const infracaoService = {
  // Síndico
  registrarInfracao: async (formData) => {
    const response = await api.post('/infracoes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  listarTodas: async () => {
    const response = await api.get('/infracoes');
    return response.data;
  },

  julgarRecurso: async (id, aceitar) => {
    const response = await api.patch(`/infracoes/${id}/julgar`, { aceitar });
    return response.data;
  },

  cancelarInfracao: async (id) => {
    await api.delete(`/infracoes/${id}`);
  },

  // Morador
  listarMinhas: async () => {
    const response = await api.get('/infracoes/minhas');
    return response.data;
  },

  enviarRecurso: async (id, formData) => {
    const response = await api.post(`/infracoes/${id}/recursos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
