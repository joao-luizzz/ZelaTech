import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Building2, Mail, Lock, Loader2, AlertCircle, User, Shield, ArrowLeft, Sun, Moon } from 'lucide-react';

export default function Login() {
  const location = useLocation();
  const [selectedProfile, setSelectedProfile] = useState(location.state?.profile || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Função responsável por processar o login.
  // Chama o AuthContext para validar credenciais na API e redireciona
  // o usuário de acordo com o seu perfil (SINDICO ou MORADOR). (Andrey)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await login(email, password);
      if (data.user.role === 'ROLE_SINDICO') {
        navigate('/sindico/dashboard');
      } else {
        navigate('/morador/dashboard');
      }
    } catch (err) {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Limpa o estado e volta à tela de seleção de perfil. (Andrey)
  const handleBack = () => {
    setSelectedProfile(null);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        title="Alternar Tema"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="max-w-md w-full bg-card rounded-2xl shadow-2xl border border-border p-8 animate-in fade-in duration-500 relative overflow-hidden">
        
        {!selectedProfile ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <div className="flex justify-center text-primary mb-4">
                <div className="p-3 bg-secondary rounded-2xl border border-border">
                  <Building2 size={40} />
                </div>
              </div>
              <h1 className="text-4xl font-extrabold text-foreground mb-2">
                <span className="text-primary">Zela</span>Tech
              </h1>
              <p className="text-muted-foreground">Selecione seu perfil para acessar</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setSelectedProfile('MORADOR')}
                className="w-full flex items-center p-4 bg-background border border-border rounded-xl hover:border-primary hover:bg-secondary/50 transition-all group text-left"
              >
                <div className="p-3 bg-secondary rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mr-4">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground mb-1">Sou Morador</h3>
                  <p className="text-sm text-muted-foreground">Acesse sua área e acompanhe seus chamados</p>
                </div>
              </button>

              <button 
                onClick={() => setSelectedProfile('SINDICO')}
                className="w-full flex items-center p-4 bg-background border border-border rounded-xl hover:border-primary hover:bg-secondary/50 transition-all group text-left"
              >
                <div className="p-3 bg-secondary rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mr-4">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-card-foreground mb-1">Sou Síndico</h3>
                  <p className="text-sm text-muted-foreground">Acesso ao painel administrativo do condomínio</p>
                </div>
              </button>
            </div>

            <div className="mt-8 text-center text-xs text-muted-foreground">
              © 2026 ZelaTech - Acesso Restrito
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <button 
              onClick={handleBack}
              className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm z-10"
            >
              <ArrowLeft size={16} /> Voltar
            </button>

            <div className="text-center mb-8 mt-4">
              <div className="flex justify-center text-primary mb-4">
                <div className="p-3 bg-secondary rounded-2xl border border-border">
                  {selectedProfile === 'MORADOR' ? <User size={40} /> : <Shield size={40} />}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Acesso {selectedProfile === 'MORADOR' ? 'Morador' : 'Síndico'}
              </h2>
              <p className="text-muted-foreground">Insira suas credenciais para continuar</p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6 text-sm text-center flex items-center justify-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : (
                  'Entrar no Sistema'
                )}
              </button>
            </form>

            {selectedProfile === 'MORADOR' ? (
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Não tem uma conta? </span>
                <Link to="/cadastro" className="font-bold text-primary hover:text-primary/80 transition-colors">
                  Cadastre-se como morador
                </Link>
              </div>
            ) : (
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Síndicos são cadastrados apenas pelo painel de controle.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}