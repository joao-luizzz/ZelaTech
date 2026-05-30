import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, SearchX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground font-sans">
      <div className="flex items-center gap-2 font-bold text-3xl mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
        <Building2 size={36} className="text-primary" />
        <span className="text-primary">Zela</span>Tech
      </div>
      
      <div className="bg-card border border-border shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center flex flex-col items-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
          <SearchX size={48} />
        </div>
        
        <h1 className="text-7xl font-extrabold text-foreground mb-2 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-4">Página não encontrada</h2>
        
        <p className="text-muted-foreground mb-10 leading-relaxed text-sm md:text-base">
          Ops! Parece que você se perdeu pelos corredores do condomínio. A página que você tentou acessar não existe ou foi movida.
        </p>
        
        <button
          onClick={() => navigate('/login')}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] w-full"
        >
          <ArrowLeft size={20} />
          Voltar para o Início
        </button>
      </div>
      
      <p className="mt-12 text-sm text-muted-foreground font-medium">
        &copy; {new Date().getFullYear()} ZelaTech. Todos os direitos reservados.
      </p>
    </div>
  );
}