import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, Home, LogOut, FileText, PlusCircle, Bell, X, Building2, Sun, Moon, ShieldCheck, Map, Calendar, CalendarDays } from 'lucide-react';
import clsx from 'clsx';

export default function MainLayout() {
  const { user, logout, isSindico, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = isAdmin 
    ? [
        { name: 'Aprovações de Síndicos', path: '/admin/dashboard', icon: ShieldCheck }
      ]
    : isSindico
      ? [
          { name: 'Dashboard', path: '/sindico/dashboard', icon: Home },
          { name: 'Mural de Avisos', path: '/sindico/mural', icon: Bell },
          { name: 'Áreas Comuns', path: '/sindico/areas', icon: Map },
        ]
      : [
          { name: 'Início', path: '/morador/dashboard', icon: Home },
          { name: 'Meus Chamados', path: '/morador/chamados', icon: FileText },
          { name: 'Novo Chamado', path: '/morador/chamados/novo', icon: PlusCircle },
          { name: 'Reservar Espaço', path: '/morador/reservas/nova', icon: Calendar },
          { name: 'Minhas Reservas', path: '/morador/reservas', icon: CalendarDays },
        ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-card border-b border-border p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2 text-foreground font-bold text-xl">
          <Building2 size={24} className="text-primary" />
          <span className="text-primary">Zela</span>Tech
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground transition-colors">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed md:static inset-y-0 left-0 w-64 bg-card border-r border-border z-40 transform transition-transform duration-300 ease-in-out flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border hidden md:flex">
          <div className="flex items-center gap-2 text-foreground font-bold text-xl">
            <Building2 size={24} className="text-primary" />
            <span className="text-primary">Zela</span>Tech
          </div>
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors" title="Alternar Tema">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
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
                      ? "bg-primary/20 text-primary border-l-4 border-primary pl-2.5"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
              {user?.nome?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">{user?.nome || 'Usuário'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role === 'ROLE_SINDICO' ? 'Síndico' : user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Morador'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={18} />
            Sair do sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto bg-background">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}