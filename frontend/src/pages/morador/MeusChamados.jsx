import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { chamadoService } from '../../services/chamadoService';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Plus, Loader2, AlertCircle, Clock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useToast } from '../../hooks/useToast';

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
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border', styles[status] || 'bg-muted text-muted-foreground border-border')}>
      {icons[status] || null}
      {labels[status] || status}
    </span>
  );
};

export default function MeusChamados() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('TODOS');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribe, isConnected } = useWebSocket();
  const { showToast } = useToast();

  const fetchChamados = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchChamados();
  }, []);

  useEffect(() => {
    if (!user || !user.id || !isConnected) return;
    
    const sub = subscribe(`/queue/notifications/${user.id}`, (msg) => {
      showToast(msg.titulo + ' - ' + msg.mensagem, 'info');
      // Delay adicionado para aguardar o commit da transação no banco de dados do backend
      setTimeout(() => {
        fetchChamados();
      }, 500);
    });
    
    return () => {
      if (sub) sub.unsubscribe();
    }
  }, [user, isConnected, subscribe, showToast, fetchChamados]);

  const getCorCategoria = (categoria) => {
    const cores = {
      HIDRAULICA: 'bg-orange-500',
      ELETRICA: 'bg-primary',
      ESTRUTURAL: 'bg-green-500',
      LIMPEZA: 'bg-blue-500',
      OUTRO: 'bg-muted-foreground',
    };
    return cores[categoria] || 'bg-muted-foreground';
  };

  const chamadosFiltrados = chamados.filter((chamado) => {
    if (filtro === 'PENDENTES') return chamado.status === 'ABERTO' || chamado.status === 'EM_ANDAMENTO';
    if (filtro === 'RESOLVIDOS') return chamado.status === 'RESOLVIDO' || chamado.status === 'CONCLUIDO';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ── Cabeçalho (Andrey) ── */}
      <div>
        <button
          onClick={() => navigate('/morador/dashboard')}
          className="text-muted-foreground hover:text-foreground text-sm mb-4 flex items-center gap-1 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Meus Chamados
            </h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe o status das suas solicitações.
            </p>
          </div>
          <button
            onClick={() => navigate('/morador/chamados/novo')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-primary/20 active:scale-[0.98]"
          >
            + Novo Chamado
          </button>
        </div>
      </div>

      {/* ── Filtros (Andrey) ── */}
      <div className="flex bg-card p-1 rounded-lg border border-border inline-flex w-full sm:w-auto overflow-x-auto shadow-sm">
        <button
          onClick={() => setFiltro('TODOS')}
          className={clsx('px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200', filtro === 'TODOS' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground')}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro('PENDENTES')}
          className={clsx('px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200', filtro === 'PENDENTES' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground')}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFiltro('RESOLVIDOS')}
          className={clsx('px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200', filtro === 'RESOLVIDOS' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground')}
        >
          Resolvidos
        </button>
      </div>

      {/* ── Feedbacks ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 size={32} className="animate-spin mb-4 text-primary" />
          <p>Carregando seus chamados...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      ) : chamados.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center max-w-xl mx-auto shadow-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background text-primary border border-primary/20 mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Você ainda não abriu nenhum chamado</h3>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Seus chamados e solicitações abertas aparecerão aqui. Clique abaixo para abrir o seu primeiro chamado.
          </p>
          <button
            onClick={() => navigate('/morador/chamados/novo')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm active:scale-[0.98]"
          >
            Abrir Primeiro Chamado
          </button>
        </div>
      ) : chamadosFiltrados.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center max-w-xl mx-auto shadow-xl mt-6">
          <h3 className="text-xl font-bold text-foreground mb-2">Nenhum chamado encontrado</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Você não possui chamados na categoria "{filtro === 'PENDENTES' ? 'Pendentes' : 'Resolvidos'}".
          </p>
        </div>
      ) : (
        /* ── Grade de cards de chamados (Andrey) ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chamadosFiltrados.map((chamado) => (
            <div
              key={chamado.id}
              onClick={() => navigate(`/chamados/${chamado.id}`)}
              className="bg-card rounded-xl shadow-xl border border-border flex overflow-hidden cursor-pointer
                         hover:scale-[1.02] hover:border-primary transition-all duration-200 group"
            >
              {/* Barra lateral colorida conforme a categoria (Andrey) */}
              <div className={`w-[10px] flex-shrink-0 ${getCorCategoria(chamado.categoria)}`} />

              {/* Conteúdo do card */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Linha superior: número do chamado + badge de status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                      #{chamado.id}
                    </span>
                    <StatusBadge status={chamado.status} />
                  </div>

                  {/* Título do chamado */}
                  <h3 className="text-foreground font-bold text-lg leading-snug mb-1 group-hover:text-primary transition-colors">
                    {chamado.titulo}
                  </h3>

                  {/* Categoria */}
                  <p className="text-muted-foreground text-sm mb-4">
                    {chamado.categoria.charAt(0) + chamado.categoria.slice(1).toLowerCase()}
                  </p>
                </div>

                {/* Rodapé do card: prioridade e data (Andrey) */}
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mt-2">
                  <div>
                    <span className="text-muted-foreground">Prioridade </span>
                    <span className={clsx(
                      'font-bold uppercase',
                      chamado.prioridade === 'ALTA' ? 'text-destructive' :
                        chamado.prioridade === 'MEDIA' ? 'text-orange-500' : 'text-blue-500'
                    )}>
                      {chamado.prioridade}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data </span>
                    <span className="text-card-foreground font-bold">
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