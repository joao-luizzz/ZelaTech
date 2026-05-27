import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chamadoService } from "../../services/chamadoService";

function DashboardSindico() {
  const navigate = useNavigate();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODAS");

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        setLoading(true);
        const data = await chamadoService.getAllChamados();
        setChamados(data);
      } catch (err) {
        setError("Erro ao carregar chamados");
      } finally {
        setLoading(false);
      }
    };
    fetchChamados();
  }, []);

  const formatStatus = (status) => {
    if (status === "ABERTO") return "Aberto";
    if (status === "EM_ANDAMENTO") return "Em Andamento";
    if (status === "RESOLVIDO") return "Resolvido";
    return status;
  };

  const chamadosFiltrados = chamados.filter((chamado) => {
    const bateStatus = filtroStatus === "TODOS" || chamado.status === filtroStatus;
    const bateCategoria = filtroCategoria === "TODAS" || chamado.categoria === filtroCategoria;
    return bateStatus && bateCategoria;
  });

  const getCorCategoria = (categoria) => {
    switch (categoria) {
      case "HIDRAULICA": return "bg-orange-500";
      case "ELETRICA": return "bg-purple-600";
      case "ESTRUTURAL": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-10 font-sans">
      <header className="mb-8 border-b border-slate-700 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Painel de Chamados</h1>
          <p className="text-slate-400 mt-1">Bem-vindo, Síndico. Veja o que precisa de atenção hoje.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <select 
            className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="TODOS">Todos os Status</option>
            <option value="ABERTO">Aberto</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="RESOLVIDO">Resolvido</option>
          </select>

          <select 
            className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
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

      {loading ? (
        <div className="text-center py-20 text-slate-400">Carregando chamados...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chamadosFiltrados.map((chamado) => {
              return (
                <div 
                  key={chamado.id} 
                  onClick={() => navigate(`/chamados/${chamado.id}`)}
                  className="bg-[#1e293b] rounded-xl shadow-xl overflow-hidden flex border border-slate-700 hover:border-purple-500 transition-all group cursor-pointer hover:scale-[1.02]"
                >
                  <div className={`w-[10px] ${getCorCategoria(chamado.categoria)}`} />
                  
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">#{chamado.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          chamado.status === 'ABERTO' ? 'bg-red-500/20 text-red-400' : 
                          chamado.status === 'EM_ANDAMENTO' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {formatStatus(chamado.status)}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                        {chamado.titulo}
                      </h2>
                      <p className="text-slate-400 text-sm mb-4">{chamado.categoria}</p>
                    </div>

                    <div className="border-t border-slate-700 pt-4 mt-2 flex justify-between items-center text-xs">
                      <div className="flex flex-col text-slate-400">
                        <span>Prioridade</span>
                        <span className={`font-semibold ${chamado.prioridade === 'ALTA' ? 'text-red-400' : 'text-slate-200'}`}>
                          {chamado.prioridade}
                        </span>
                      </div>
                      <div className="flex flex-col text-right text-slate-400">
                        <span>Data</span>
                        <span className="font-semibold text-slate-200">
                          {new Date(chamado.dataAbertura).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {chamadosFiltrados.length === 0 && (
            <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-dashed border-slate-700 mt-6">
              <p className="text-slate-500">Nenhum chamado encontrado.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardSindico;