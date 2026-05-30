import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useTheme } from '../../contexts/ThemeContext';
import { Building2, Mail, Lock, User, Home, Loader2, AlertCircle, Sun, Moon } from 'lucide-react';

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    apartamento: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await authService.registerMorador(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { profile: 'MORADOR' } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
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

      <div className="max-w-md w-full bg-card rounded-2xl shadow-2xl border border-border p-8 animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <div className="flex justify-center text-primary mb-4">
            <div className="p-3 bg-secondary rounded-2xl border border-border">
              <Building2 size={40} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-foreground mb-2">
            <span className="text-primary">Zela</span>Tech
          </h1>
          <p className="text-muted-foreground">Crie sua conta de Morador</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6 text-sm text-center flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-6 text-sm text-center font-medium">
            Cadastro realizado com sucesso! Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Nome Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <User size={18} />
              </div>
              <input 
                type="text" 
                id="nome"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Ex: João da Silva"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Apartamento / Bloco</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Home size={18} />
              </div>
              <input 
                type="text" 
                id="apartamento"
                name="apartamento"
                required
                value={formData.apartamento}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Ex: Apt 101 Bloco A"
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
                id="senha"
                name="senha"
                required
                value={formData.senha}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || success}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mx-auto" size={20} />
            ) : (
              'Cadastrar no Sistema'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Já tem uma conta? </span>
          <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
            Faça login
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          © 2026 ZelaTech - Acesso Restrito
        </div>
      </div>
    </div>
  );
}