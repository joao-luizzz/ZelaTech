import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Endereço base da nossa API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição (injetar o token)
api.interceptors.request.use(
  (config) => {
    // Rotas públicas que não devem receber o token
    const rotasPublicas = ['/auth/login', '/auth/cadastro'];
    const isRotaPublica = rotasPublicas.some(rota => config.url?.includes(rota));

    if (!isRotaPublica) {
      const token = localStorage.getItem('@ZelaTech:token');
      
      // Verifica se o token existe e não é uma string literal de nulo/indefinido
      if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (tratar token expirado/inválido)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token expirou ou acesso negado, limpar localStorage e redirecionar
      // O Spring Security retorna 403 por padrão quando o token expira sem um EntryPoint customizado
      localStorage.removeItem('@ZelaTech:token');
      localStorage.removeItem('@ZelaTech:user');
      
      // Só redirecionar se não estivermos já na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
