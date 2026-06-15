import clsx from 'clsx';
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { chamadoService } from "../../services/chamadoService";
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useToast } from '../../hooks/useToast';

function DashboardSindico() {

  // Controle de navegação entre páginas do sistema, permitindo acessar os detalhes de um chamado. (Alexandre)
  const navigate = useNavigate();

  // Estados responsáveis por armazenar os chamados, controlar carregamento da página,
  // mensagens de erro e filtros selecionados pelo síndico. (Alexandre)
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODAS");

  const { subscribe, isConnected } = useWebSocket();
  const { showToast } = useToast();

  const fetchChamados = useCallback(async () => {
    try {
      setLoading(true);
      const data = await chamadoService.getAllChamados();
      setChamados(data);
    } catch (err) {
      setError("Erro ao carregar chamados");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ao carregar o componente, realizo uma consulta ao serviço para buscar todos
  // os chamados cadastrados e atualizar a interface com os dados recebidos. (Alexandre)
  useEffect(() => {
    fetchChamados();
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    const sub = subscribe('/topic/chamados', (msg) => {
      showToast(msg.titulo + ' - ' + msg.mensagem, 'info');
      // Delay adicionado para aguardar o commit da transação no banco de dados do backend
      setTimeout(() => {
        fetchChamados();
      }, 500);
    });
    
    return () => {
      if (sub) sub.unsubscribe();
    }
  }, [isConnected, subscribe, showToast, fetchChamados]);

  // Converte os status internos utilizados pelo sistema em textos mais amigáveis
  // para exibição na interface do usuário. (Alexandre)
  const formatStatus = (status) => {
    if (status === "ABERTO") return "Aberto";
    if (status === "EM_ANDAMENTO") return "Em Andamento";
    if (status === "RESOLVIDO") return "Resolvido";
    return status;
  };

  // Aplica os filtros escolhidos pelo síndico, retornando apenas os chamados
  // que correspondem ao status e à categoria selecionados. (Alexandre)
  const chamadosFiltrados = chamados.filter((chamado) => {
    let bateStatus = false;

    if (filtroStatus === 'TODOS') bateStatus = true;
    else if (filtroStatus === 'PENDENTES')
      bateStatus = chamado.status === 'ABERTO' || chamado.status === 'EM_ANDAMENTO';
    else if (filtroStatus === 'RESOLVIDOS')
      bateStatus = chamado.status === 'RESOLVIDO' || chamado.status === 'CONCLUIDO';

    const bateCategoria =
      filtroCategoria === "TODAS" ||
      chamado.categoria === filtroCategoria;

    return bateStatus && bateCategoria;
  });

  // Define uma cor para cada categoria de chamado, facilitando a identificação
  // visual das ocorrências na tela principal. (Alexandre)
  const getCorCategoria = (categoria) => {
    switch (categoria) {
      case "HIDRAULICA": return "bg-orange-500";
      case "ELETRICA": return "bg-primary";
      case "ESTRUTURAL": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10 font-sans">

      {/* Cabeçalho principal contendo identificação do painel e ferramentas de filtragem dos chamados. (Alexandre) */}
      <header className="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Painel de Chamados
          </h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo, Síndico. Veja o que precisa de atenção hoje.
          </p>
        </div>

        {/* Área responsável pelos filtros de status e categoria para facilitar a consulta dos chamados. (Alexandre) */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex bg-card p-1 rounded-lg border border-border inline-flex w-full sm:w-auto overflow-x-auto shadow-sm">
            <button
              onClick={() => setFiltroStatus('TODOS')}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200',
                filtroStatus === 'TODOS'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Todos
            </button>

            <button
              onClick={() => setFiltroStatus('PENDENTES')}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200',
                filtroStatus === 'PENDENTES'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Pendentes
            </button>

            <button
              onClick={() => setFiltroStatus('RESOLVIDOS')}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200',
                filtroStatus === 'RESOLVIDOS'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Resolvidos
            </button>
          </div>

          <select
            className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="TODAS">Todas as Categorias</option>
            <option value="HIDRAULICA">Hidráulica</option>
            <option value="ELETRICA">Elétrica</option>
            <option value="ESTRUTURAL">Estrutural</option>
            <option value="LIMPEZA">Limpeza</option>
            <option value="OUTRO">Outros</option>
          </select>
        </div>
      </header>

      {/* Exibe um indicador visual enquanto os dados estão sendo carregados da API. (Alexandre) */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          Carregando chamados...
        </div>
      ) : error ? (

        /* Exibe mensagem de erro caso ocorra alguma falha durante a consulta dos chamados. (Alexandre) */
        <div className="text-center py-20 text-red-400">
          {error}
        </div>
      ) : (
        <>
          {/* Grade principal responsável por exibir os chamados filtrados em formato de cards. (Alexandre) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chamadosFiltrados.map((chamado) => {
              return (

                // Cada card representa um chamado e permite acesso rápido aos seus detalhes. (Alexandre)
                <div
                  key={chamado.id}
                  onClick={() => navigate(`/chamados/${chamado.id}`)}
                  className="bg-card rounded-xl shadow-xl overflow-hidden flex border border-border hover:border-purple-500 transition-all group cursor-pointer hover:scale-[1.02]"
                >
                  <div className={`w-[10px] ${getCorCategoria(chamado.categoria)}`} />

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          #{chamado.id}
                        </span>

                        {/* Identificação visual do status atual do chamado. (Alexandre) */}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            chamado.status === 'ABERTO'
                              ? 'bg-red-500/20 text-red-400'
                              : chamado.status === 'EM_ANDAMENTO'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}
                        >
                          {formatStatus(chamado.status)}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {chamado.titulo}
                      </h2>

                      <p className="text-muted-foreground text-sm mb-4">
                        {chamado.categoria}
                      </p>
                    </div>

                    {/* Exibição de informações complementares como prioridade e data de abertura. (Alexandre) */}
                    <div className="border-t border-border pt-4 mt-2 flex justify-between items-center text-xs">
                      <div className="flex flex-col text-muted-foreground">
                        <span>Prioridade</span>
                        <span
                          className={`font-semibold ${
                            chamado.prioridade === 'ALTA'
                              ? 'text-red-400'
                              : 'text-card-foreground'
                          }`}
                        >
                          {chamado.prioridade}
                        </span>
                      </div>

                      <div className="flex flex-col text-right text-muted-foreground">
                        <span>Data</span>
                        <span className="font-semibold text-card-foreground">
                          {new Date(chamado.dataAbertura).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mensagem exibida quando nenhum chamado corresponde aos filtros aplicados. (Alexandre) */}
          {chamadosFiltrados.length === 0 && (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border mt-6">
              <p className="text-muted-foreground">
                Nenhum chamado encontrado.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardSindico;