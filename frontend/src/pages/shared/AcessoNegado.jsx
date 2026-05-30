import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const AcessoNegado = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    if (user?.role === 'ROLE_SINDICO') {
      navigate('/sindico/dashboard');
    } else {
      navigate('/morador/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Luzes de Fundo (Glow Effect) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-purple-500/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border rounded-3xl p-8 text-center shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Ícone de Escudo de Alerta com Pulso */}
        <div className="mx-auto w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-400 mb-6 relative animate-pulse">
          <ShieldAlert size={40} className="stroke-[1.5]" />
          <div className="absolute inset-0 rounded-2xl bg-red-500/5 blur-sm -z-10" />
        </div>

        {/* Badge 403 */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 mb-4 tracking-wider uppercase">
          Erro 403 • Acesso Restrito
        </span>

        {/* Títulos */}
        <h1 className="text-2xl font-extrabold text-foreground mb-3 tracking-tight">
          Área Reservada
        </h1>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Desculpe, o seu perfil de usuário atual não possui as credenciais necessárias para acessar esta página ou recurso.
        </p>

        {/* Ações */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoBack}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 active:scale-[0.98] text-foreground font-bold rounded-2xl shadow-lg shadow-red-500/10 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Voltar para o Painel Seguro
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3.5 px-5 bg-secondary/80 hover:bg-secondary border border-border/60 active:scale-[0.98] text-card-foreground hover:text-foreground font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Voltar à Página Anterior
          </button>
        </div>
      </div>
      
      <p className="absolute bottom-6 text-xs text-slate-600 font-medium tracking-wide">
        ZelaTech Security Gateway
      </p>
    </div>
  );
};

export default AcessoNegado;
