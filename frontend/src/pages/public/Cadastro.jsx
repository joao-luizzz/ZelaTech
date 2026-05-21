import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Building2, Mail, Lock, User, Home, Loader2, AlertCircle } from 'lucide-react';

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
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-700 p-8 animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <div className="flex justify-center text-purple-500 mb-4">
            <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
              <Building2 size={40} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            <span className="text-purple-500">Zela</span>Tech
          </h1>
          <p className="text-slate-400">Crie sua conta de Morador</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm text-center flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            Cadastro realizado com sucesso! Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User size={18} />
              </div>
              <input 
                type="text" 
                id="nome"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Ex: João da Silva"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Apartamento / Bloco</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Home size={18} />
              </div>
              <input 
                type="text" 
                id="apartamento"
                name="apartamento"
                required
                value={formData.apartamento}
                onChange={handleChange}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Ex: Apt 101 Bloco A"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                id="senha"
                name="senha"
                required
                value={formData.senha}
                onChange={handleChange}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || success}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-purple-500/20"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mx-auto" size={20} />
            ) : (
              'Cadastrar no Sistema'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">Já tem uma conta? </span>
          <Link to="/login" className="font-bold text-purple-400 hover:text-purple-300">
            Faça login
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          © 2026 ZelaTech - Acesso Restrito
        </div>
      </div>
    </div>
  );
}