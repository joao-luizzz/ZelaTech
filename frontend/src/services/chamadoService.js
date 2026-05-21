import api from './api';

export const chamadoService = {
  async getMeusChamados() {
    const response = await api.get('/chamados/meus');
    return response.data;
  },

  async getAllChamados() {
    const response = await api.get('/chamados');
    return response.data;
  },

  async getChamadoById(id) {
    const response = await api.get(`/chamados/${id}`);
    return response.data;
  },

  async createChamado(dadosChamado) {
    const formData = new FormData();
    formData.append('titulo', dadosChamado.titulo);
    formData.append('descricao', dadosChamado.descricao);
    formData.append('categoria', dadosChamado.categoria);
    formData.append('prioridade', dadosChamado.prioridade);
    
    if (dadosChamado.foto) {
      formData.append('foto', dadosChamado.foto);
    }

    const response = await api.post('/chamados', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/chamados/${id}/status`, { status });
    return response.data;
  }
};
