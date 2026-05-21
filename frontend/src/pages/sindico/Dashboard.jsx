import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Dashboard do Síndico
 * Este componente lista todos os chamados do condomínio e permite filtrá-los.
 */
function Dashboard() {
  const navigate = useNavigate(); // Hook para navegação programática

  // Dados iniciais fictícios
  const [chamados] = useState([
    { id: 1, titulo: "Vazamento no corredor", categoria: "Hidráulica", status: "Aberto", prioridade: "Alta", data: "10/05/2026" },
    { id: 2, titulo: "Lâmpada queimada", categoria: "Elétrica", status: "Em Andamento", prioridade: "Média", data: "09/05/2026" },
    { id: 3, titulo: "Portão travando", categoria: "Estrutural", status: "Resolvido", prioridade: "Baixa", data: "08/05/2026" },
    { id: 4, titulo: "Infiltração na garagem", categoria: "Hidráulica", status: "Aberto", prioridade: "Alta", data: "07/05/2026" },
  ]);

  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  const chamadosFiltrados = chamados.filter((chamado) => {
    const bateStatus = filtroStatus === "Todos" || chamado.status === filtroStatus;
    const bateCategoria = filtroCategoria === "Todas" || chamado.categoria === filtroCategoria;
    return bateStatus && bateCategoria;
  });

  const getCorCategoria = (categoria) => {
    switch (categoria) {
      case "Hidráulica": return "bg-orange-500";
      case "Elétrica": return "bg-purple-600";
      case "Estrutural": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 md:p-10">
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
            <option value="Todos">Todos os Status</option>
            <option value="Aberto">Aberto</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Resolvido">Resolvido</option>
          </select>

          <select 
            className="bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="Todas">Todas as Categorias</option>
            <option value="Hidráulica">Hidráulica</option>
            <option value="Elétrica">Elétrica</option>
            <option value="Estrutural">Estrutural</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chamadosFiltrados.map((chamado) => (
          <div 
            key={chamado.id} 
            onClick={() => navigate(`/sindico/chamados/${chamado.id}`)} // Vai para a tela de detalhes
            className="bg-[#1e293b] rounded-xl shadow-xl overflow-hidden flex border border-slate-700 hover:border-purple-500 transition-all group cursor-pointer hover:scale-[1.02]"
          >
            <div className={`w-[10px] ${getCorCategoria(chamado.categoria)}`} />
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">#{chamado.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    chamado.status === 'Aberto' ? 'bg-red-500/20 text-red-400' : 
                    chamado.status === 'Em Andamento' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {chamado.status}
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
                  <span className="font-semibold text-slate-200">{chamado.prioridade}</span>
                </div>
                <div className="flex flex-col text-right text-slate-400">
                  <span>Data</span>
                  <span className="font-semibold text-slate-200">{chamado.data}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {chamadosFiltrados.length === 0 && (
        <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-dashed border-slate-700">
          <p className="text-slate-500">Nenhum chamado encontrado.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
