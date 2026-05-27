import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chamadoService } from '../../services/chamadoService';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Plus, Loader2, AlertCircle, Clock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

const StatusBadge = ({ status }) => {
  const styles = {
    ABERTO: 'bg-red-500/20 text-red-400 border-red-500/30',
    EM_ANDAMENTO: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    RESOLVIDO: 'bg-green-500/20 text-green-400 border-green-500/30',
    CONCLUIDO: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  const labels = {
    ABERTO: 'Aberto',
    EM_ANDAMENTO: 'Em Andamento',
    RESOLVIDO: 'Resolvido',
    CONCLUIDO: 'Concluído',
  };

  const icons = {
    ABERTO: <AlertTriangle size={14} className="mr-1" />,
    EM_ANDAMENTO: <Clock size={14} className="mr-1" />,
    RESOLVIDO: <CheckCircle2 size={14} className="mr-1" />,
    CONCLUIDO: <CheckCircle2 size={14} className="mr-1" />,
  };

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border', styles[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')}>
      {icons[status] || null}
      {labels[status] || status}
    </span>
  );
};

export default function MeusChamados() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchChamados();
  }, []);

  const fetchChamados = async () => {
    try {
      setLoading(true);
      const data = await chamadoService.getMeusChamados();
      setChamados(data);
    } catch (err) {
      setError('Não foi possível carregar seus chamados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCorCategoria = (categoria) => {
    const cores = {
      HIDRAULICA: 'bg-orange-500',
      ELETRICA: 'bg-purple-600',
      ESTRUTURAL: 'bg-green-500',
      LIMPEZA: 'bg-blue-500',
      OUTRO: 'bg-slate-500',
    };
    return cores[categoria] || 'bg-slate-500';
  };

  return (
    <div className="space-y-6">
      {/* ── Cabeçalho (Andrey) ── */}
      <div>
        <button
          onClick={() => navigate('/morador/dashboard')}
          className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Meus Chamados
            </h1>
            <p className="text-slate-400 mt-1">
              Acompanhe o status das suas solicitações.
            </p>
          </div>
          <button
            onClick={() => navigate('/morador/chamados/novo')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-purple-500/20 active:scale-[0.98]"
          >
            + Novo Chamado
          </button>
        </div>
      </div>

      {/* ── Feedbacks ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 size={32} className="animate-spin mb-4 text-purple-500" />
          <p>Carregando seus chamados...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      ) : chamados.length === 0 ? (
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-12 text-center max-w-xl mx-auto shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0f172a] text-purple-400 border border-purple-500/20 mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Você ainda não abriu nenhum chamado</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Seus chamados e solicitações abertas aparecerão aqui. Clique abaixo para abrir o seu primeiro chamado.
          </p>
          <button
            onClick={() => navigate('/morador/chamados/novo')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm active:scale-[0.98]"
          >
            Abrir Primeiro Chamado
          </button>
        </div>
      ) : (
        /* ── Grade de cards de chamados (Andrey) ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chamados.map((chamado) => (
            <div
              key={chamado.id}
              onClick={() => navigate(`/chamados/${chamado.id}`)}
              className="bg-[#1e293b] rounded-xl shadow-xl border border-slate-700 flex overflow-hidden cursor-pointer
                         hover:scale-[1.02] hover:border-purple-500 transition-all duration-200"
            >
              {/* Barra lateral colorida conforme a categoria (Andrey) */}
              <div className={`w-[10px] flex-shrink-0 ${getCorCategoria(chamado.categoria)}`} />

              {/* Conteúdo do card */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Linha superior: número do chamado + badge de status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      #{chamado.id}
                    </span>
                    <StatusBadge status={chamado.status} />
                  </div>

                  {/* Título do chamado */}
                  <h3 className="text-white font-bold text-lg leading-snug mb-1 group-hover:text-purple-400 transition-colors">
                    {chamado.titulo}
                  </h3>

                  {/* Categoria */}
                  <p className="text-slate-400 text-sm mb-4">
                    {chamado.categoria.charAt(0) + chamado.categoria.slice(1).toLowerCase()}
                  </p>
                </div>

                {/* Rodapé do card: prioridade e data (Andrey) */}
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3 mt-2">
                  <div>
                    <span className="text-slate-500">Prioridade </span>
                    <span className={clsx(
                      'font-bold uppercase',
                      chamado.prioridade === 'ALTA' ? 'text-red-400' :
                        chamado.prioridade === 'MEDIA' ? 'text-orange-400' : 'text-blue-400'
                    )}>
                      {chamado.prioridade}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Data </span>
                    <span className="text-slate-200 font-bold">
                      {format(parseISO(chamado.dataAbertura || new Date().toISOString()), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}