import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { muralService } from '../../services/muralService';
import { chamadoService } from '../../services/chamadoService';
import { financeiroService } from '../../services/financeiroService';
import { infracaoService } from '../../services/infracaoService';
import { reservaService } from '../../services/reservaService';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, Calendar, Loader2, AlertCircle, Wrench, CreditCard, AlertTriangle, CalendarDays } from 'lucide-react';

export default function DashboardMorador() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Contagens para os scorecards
  const [resumo, setResumo] = useState({
    chamadosAbertos: 0,
    faturasPendentes: 0,
    infracoesAtivas: 0,
    proximaReserva: null
  });

  // Dispara a busca inicial de avisos assim que o componente é montado na tela. (Andrey)
  useEffect(() => {
    fetchAvisos();
    fetchResumo();
  }, []);

  // Faz a requisição HTTP para a API buscando a lista de avisos atualizada.
  // Gerencia as flags de loading e erro para feedback visual. (Andrey)
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

  const fetchResumo = async () => {
    const results = await Promise.allSettled([
      chamadoService.getMeusChamados(),
      financeiroService.listarMinhasFaturas(),
      infracaoService.listarMinhas(),
      reservaService.listarMinhasReservas()
    ]);

    const chamados = results[0].status === 'fulfilled' ? results[0].value : [];
    const faturas = results[1].status === 'fulfilled' ? results[1].value : [];
    const infracoes = results[2].status === 'fulfilled' ? results[2].value : [];
    const reservas = results[3].status === 'fulfilled' ? results[3].value : [];

    const chamadosAbertos = chamados.filter(c => c.status === 'ABERTO' || c.status === 'EM_ANDAMENTO').length;
    const faturasPendentes = faturas.filter(f => f.status === 'PENDENTE' || f.status === 'VENCIDA').length;
    const infracoesAtivas = infracoes.filter(i => !['RECURSO_ACEITO', 'CANCELADA'].includes(i.status)).length;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const reservasFuturas = reservas
      .filter(r => {
        const dataReserva = Array.isArray(r.dataReserva)
          ? new Date(r.dataReserva[0], r.dataReserva[1] - 1, r.dataReserva[2])
          : new Date(r.dataReserva);
        return dataReserva >= hoje && r.status !== 'CANCELADA';
      })
      .sort((a, b) => {
        const dA = Array.isArray(a.dataReserva) ? new Date(a.dataReserva[0], a.dataReserva[1] - 1, a.dataReserva[2]) : new Date(a.dataReserva);
        const dB = Array.isArray(b.dataReserva) ? new Date(b.dataReserva[0], b.dataReserva[1] - 1, b.dataReserva[2]) : new Date(b.dataReserva);
        return dA - dB;
      });

    setResumo({
      chamadosAbertos,
      faturasPendentes,
      infracoesAtivas,
      proximaReserva: reservasFuturas.length > 0 ? reservasFuturas[0] : null
    });
  };

  const formatarDataReserva = (dataReserva) => {
    if (Array.isArray(dataReserva)) {
      const [ano, mes, dia] = dataReserva;
      return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR');
    }
    return new Date(dataReserva).toLocaleDateString('pt-BR');
  };

  const primeiroNome = user?.nome?.split(' ')[0] || 'Morador';

  const scorecards = [
    {
      label: 'Chamados Abertos',
      value: resumo.chamadosAbertos,
      icon: Wrench,
      color: 'text-blue-500',
      bg: 'bg-blue-500/15',
      path: '/morador/chamados',
      alert: resumo.chamadosAbertos > 0
    },
    {
      label: 'Faturas Pendentes',
      value: resumo.faturasPendentes,
      icon: CreditCard,
      color: resumo.faturasPendentes > 0 ? 'text-red-500' : 'text-green-500',
      bg: resumo.faturasPendentes > 0 ? 'bg-red-500/15' : 'bg-green-500/15',
      path: '/morador/financeiro',
      alert: resumo.faturasPendentes > 0
    },
    {
      label: 'Infrações Ativas',
      value: resumo.infracoesAtivas,
      icon: AlertTriangle,
      color: resumo.infracoesAtivas > 0 ? 'text-orange-500' : 'text-green-500',
      bg: resumo.infracoesAtivas > 0 ? 'bg-orange-500/15' : 'bg-green-500/15',
      path: '/morador/infracoes',
      alert: resumo.infracoesAtivas > 0
    },
    {
      label: 'Próxima Reserva',
      value: resumo.proximaReserva ? formatarDataReserva(resumo.proximaReserva.dataReserva) : '—',
      icon: CalendarDays,
      color: 'text-purple-500',
      bg: 'bg-purple-500/15',
      path: '/morador/reservas',
      alert: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* ── Cabeçalho da tela (Andrey) ── */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Olá, {primeiroNome}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Confira os últimos avisos do condomínio e gerencie seus chamados.
        </p>
      </div>

      {/* ── Scorecards de Resumo ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {scorecards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => navigate(card.path)}
              className="bg-card p-4 rounded-xl shadow-sm border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 flex items-center gap-4 text-left group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.bg} shrink-0`}>
                <Icon size={22} className={card.color} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground truncate">{card.label}</p>
                <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{card.value}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Botões de ação rápida (Andrey) ── */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate('/morador/chamados/novo')}
          className="bg-primary hover:bg-primary/90 text-foreground font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          + Novo Chamado
        </button>
        <button
          onClick={() => navigate('/morador/chamados')}
          className="bg-card hover:bg-slate-700 text-foreground font-bold py-3 px-6 rounded-xl border border-border transition-all duration-200 shadow-lg active:scale-[0.98]"
        >
          📋 Meus Chamados
        </button>
      </div>

      {/* ── Seção do Mural de Avisos (Andrey + Premium Dark) ── */}
      <div className="bg-card rounded-2xl shadow-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-500/20 text-primary rounded-lg">
            <Bell size={24} />
          </div>
          <h2 className="text-xl font-bold text-foreground">📢 Mural de Avisos</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 size={32} className="animate-spin mb-4 text-primary" />
            <p>Carregando comunicados...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl flex items-start gap-3 text-sm">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        ) : avisos.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-2xl border border-dashed border-border text-muted-foreground">
            Nenhum aviso no momento.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {avisos.map((aviso) => (
              <div key={aviso.id} className="border border-slate-850 rounded-xl overflow-hidden hover:border-border transition-all bg-background shadow-md flex hover:scale-[1.02] duration-200">
                {/* Barra lateral verde (Andrey) */}
                <div className="w-[10px] bg-green-500 flex-shrink-0" />
                
                <div className="p-5 flex-1 flex flex-col h-full">
                  <h3 className="font-bold text-lg text-foreground mb-2 leading-tight">{aviso.titulo}</h3>
                  <p className="text-card-foreground text-sm mb-4 flex-1 whitespace-pre-wrap leading-relaxed">{aviso.conteudo}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                    <Calendar size={14} className="text-primary" />
                    <span>
                      {format(parseISO(aviso.dataPublicacao || new Date().toISOString()), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
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