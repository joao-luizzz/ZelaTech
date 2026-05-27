import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Páginas (vamos importá-las conforme criarmos)
// Public
import Login from '../pages/public/Login';
import Cadastro from '../pages/public/Cadastro';

// Layout
import MainLayout from '../components/layout/MainLayout';

// Morador
import DashboardMorador from '../pages/morador/DashboardMorador';
import MeusChamados from '../pages/morador/MeusChamados';
import NovoChamado from '../pages/morador/NovoChamado';

// Síndico
import DashboardSindico from '../pages/sindico/DashboardSindico';
import GerenciarMural from '../pages/sindico/GerenciarMural';

// Shared
import DetalheChamado from '../pages/shared/DetalheChamado';
import NotFound from '../pages/shared/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rotas Protegidas - Layout Principal */}
      <Route element={<MainLayout />}>
        {/* Rotas de Morador e Síndico (sem role específica, só estar logado) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chamados/:id" element={<DetalheChamado />} />
        </Route>

        {/* Rotas apenas para MORADOR */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_MORADOR']} />}>
          <Route path="/morador/dashboard" element={<DashboardMorador />} />
          <Route path="/morador/chamados" element={<MeusChamados />} />
          <Route path="/morador/chamados/novo" element={<NovoChamado />} />
        </Route>

        {/* Rotas apenas para SINDICO */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_SINDICO']} />}>
          <Route path="/sindico/dashboard" element={<DashboardSindico />} />
          <Route path="/sindico/mural" element={<GerenciarMural />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
