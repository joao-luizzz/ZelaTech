import api from './api';

export const authService = {
  async login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    const { token, nome, perfil } = response.data;
    
    if (token) {
      localStorage.setItem('@ZelaTech:token', token);
      
      const mappedRole = perfil.startsWith('ROLE_') ? perfil : `ROLE_${perfil}`;
      const user = {
        email: email,
        nome: nome,
        role: mappedRole,
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

  async registerSindico(formData) {
    const response = await api.post('/auth/cadastro/sindico', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
      const user = JSON.parse(userStr);
      if (user && user.role) {
        user.role = user.role.startsWith('ROLE_') ? user.role : `ROLE_${user.role}`;
      }
      return user;
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
