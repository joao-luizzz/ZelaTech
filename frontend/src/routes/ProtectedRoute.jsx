import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AcessoNegado from '../pages/shared/AcessoNegado';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Não logado, redireciona pro login
    return <Navigate to="/login" replace />;
  }

  // Se tem roles específicas necessárias e o usuário não possui a role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Usuário logado mas sem permissão, exibe a tela de acesso negado
    return <AcessoNegado />;
  }

  // Usuário autorizado
  return <Outlet />;
};
