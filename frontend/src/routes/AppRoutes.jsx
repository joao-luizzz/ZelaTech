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
import ReservarArea from '../pages/morador/ReservarArea';
import MinhasReservas from '../pages/morador/MinhasReservas';

// Síndico
import DashboardSindico from '../pages/sindico/DashboardSindico';
import PainelIndicadores from '../pages/sindico/PainelIndicadores';
import GerenciarMural from '../pages/sindico/GerenciarMural';
import GerenciarAreas from '../pages/sindico/GerenciarAreas';

// Shared
import DetalheChamado from '../pages/shared/DetalheChamado';
import NotFound from '../pages/shared/NotFound';

// Admin
import DashboardAdmin from '../pages/admin/DashboardAdmin';

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
          <Route path="/morador/reservas/nova" element={<ReservarArea />} />
          <Route path="/morador/reservas" element={<MinhasReservas />} />
        </Route>

        {/* Rotas apenas para SINDICO */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_SINDICO']} />}>
          <Route path="/sindico/dashboard" element={<DashboardSindico />} />
          <Route path="/sindico/mural" element={<GerenciarMural />} />
          <Route path="/sindico/areas" element={<GerenciarAreas />} />
          <Route path="/sindico/indicadores" element={<PainelIndicadores />} />
        </Route>

        {/* Rotas apenas para ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
