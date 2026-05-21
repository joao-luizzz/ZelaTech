import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Home, LogOut, FileText, PlusCircle, Bell, X, Building2 } from 'lucide-react';
import clsx from 'clsx';

export default function MainLayout() {
  const { user, logout, isSindico } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = isSindico
    ? [
        { name: 'Dashboard', path: '/sindico/dashboard', icon: Home },
        { name: 'Mural de Avisos', path: '/sindico/mural', icon: Bell },
      ]
    : [
        { name: 'Início', path: '/morador/dashboard', icon: Home },
        { name: 'Meus Chamados', path: '/morador/chamados', icon: FileText },
        { name: 'Novo Chamado', path: '/morador/chamados/novo', icon: PlusCircle },
      ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col md:flex-row text-slate-100 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#1e293b] border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <Building2 size={24} className="text-purple-500" />
          <span className="text-purple-500">Zela</span>Tech
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-300 hover:text-white">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed md:static inset-y-0 left-0 w-64 bg-[#1e293b] border-r border-slate-700 z-40 transform transition-transform duration-300 ease-in-out flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-slate-700 hidden md:flex">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <Building2 size={24} className="text-purple-500" />
            <span className="text-purple-500">Zela</span>Tech
          </div>
        </div>

        <div className="p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Menu Principal
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-purple-600/20 text-purple-400 border-l-4 border-purple-500 pl-2.5"
                      : "text-slate-400 hover:bg-[#0f172a] hover:text-white"
                  )}
                >
                  <Icon size={18} className={isActive ? "text-purple-400" : "text-slate-400"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.nome || 'Usuário'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role === 'ROLE_SINDICO' ? 'Síndico' : 'Morador'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Sair do sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}