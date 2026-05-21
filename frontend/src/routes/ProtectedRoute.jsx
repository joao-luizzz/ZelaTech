import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Não logado, redireciona pro login
    return <Navigate to="/login" replace />;
  }

  // Se tem roles específicas necessárias e o usuário não possui a role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Usuário logado mas sem permissão, joga pro dashboard padrão baseado no perfil dele
    if (user.role === 'ROLE_SINDICO') {
      return <Navigate to="/sindico/dashboard" replace />;
    } else {
      return <Navigate to="/morador/dashboard" replace />;
    }
  }

  // Usuário autorizado
  return <Outlet />;
};
