import api from './api';

export const authService = {
  async login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    const { token, nome, perfil } = response.data;
    
    if (token) {
      localStorage.setItem('@ZelaTech:token', token);
      
      const user = {
        email: email,
        nome: nome,
        role: perfil, // 'ROLE_SINDICO' ou 'ROLE_MORADOR'
      };
      
      localStorage.setItem('@ZelaTech:user', JSON.stringify(user));
      return { token, user };
    }
    
    throw new Error('Token não recebido da API');
  },

  async registerMorador(dadosMorador) {
    const response = await api.post('/auth/cadastro', dadosMorador);
    return response.data;
  },

  logout() {
    localStorage.removeItem('@ZelaTech:token');
    localStorage.removeItem('@ZelaTech:user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('@ZelaTech:user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('@ZelaTech:token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
