import api from './api';

export const adminService = {
  async listarSolicitacoes() {
    const response = await api.get('/admin/solicitacoes');
    return response.data;
  },

  async aprovarSolicitacao(id, parecer) {
    const response = await api.patch(`/admin/solicitacoes/${id}/aprovar`, { parecer });
    return response.data;
  },

  async rejeitarSolicitacao(id, parecer) {
    const response = await api.patch(`/admin/solicitacoes/${id}/rejeitar`, { parecer });
    return response.data;
  }
};
