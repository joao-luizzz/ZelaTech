import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { muralService } from '../../services/muralService';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, Calendar, Loader2, AlertCircle } from 'lucide-react';

export default function DashboardMorador() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvisos();
  }, []);

  const fetchAvisos = async () => {
    try {
      setLoading(true);
      const data = await muralService.getAvisos();
      setAvisos(data);
    } catch (err) {
      setError('Não foi possível carregar os avisos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Cabeçalho da tela (Andrey) ── */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Olá, Morador! 👋
        </h1>
        <p className="text-slate-400 mt-1">
          Confira os últimos avisos do condomínio e gerencie seus chamados.
        </p>
      </div>

      {/* ── Botões de ação rápida (Andrey) ── */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate('/morador/chamados/novo')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/20 active:scale-[0.98]"
        >
          + Novo Chamado
        </button>
        <button
          onClick={() => navigate('/morador/chamados')}
          className="bg-[#1e293b] hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl border border-slate-700 transition-all duration-200 shadow-lg active:scale-[0.98]"
        >
          📋 Meus Chamados
        </button>
      </div>

      {/* ── Seção do Mural de Avisos (Andrey + Premium Dark) ── */}
      <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-lg">
            <Bell size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">📢 Mural de Avisos</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 size={32} className="animate-spin mb-4 text-purple-500" />
            <p>Carregando comunicados...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl flex items-start gap-3 text-sm">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        ) : avisos.length === 0 ? (
          <div className="text-center py-20 bg-[#0f172a] rounded-2xl border border-dashed border-slate-700 text-slate-500">
            Nenhum aviso no momento.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {avisos.map((aviso) => (
              <div key={aviso.id} className="border border-slate-850 rounded-xl overflow-hidden hover:border-slate-700 transition-all bg-[#0f172a] shadow-md flex hover:scale-[1.02] duration-200">
                {/* Barra lateral verde (Andrey) */}
                <div className="w-[10px] bg-green-500 flex-shrink-0" />
                
                <div className="p-5 flex-1 flex flex-col h-full">
                  <h3 className="font-bold text-lg text-white mb-2 leading-tight">{aviso.titulo}</h3>
                  <p className="text-slate-300 text-sm mb-4 flex-1 whitespace-pre-wrap leading-relaxed">{aviso.conteudo}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-800">
                    <Calendar size={14} className="text-purple-400" />
                    <span>
                      {format(parseISO(aviso.dataCriacao || aviso.dataPublicacao || new Date().toISOString()), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}