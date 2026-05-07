import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Tela de Detalhe do Chamado (Visão do Síndico)
 */
function ChamadoDetalhe() {
  const navigate = useNavigate(); // Hook para voltar para a página anterior

  // Simulação de dados
  const [chamado, setChamado] = useState({
    id: 1,
    titulo: "Vazamento no corredor do 4º andar",
    categoria: "Hidráulica",
    status: "Aberto",
    prioridade: "Alta",
    dataAbertura: "10/05/2026 às 14:30",
    morador: "Alexandre Hesse - Apto 42",
    descricao: "Há um vazamento constante saindo da junta do cano principal no teto do corredor. A água está começando a empossar perto do elevador.",
    foto: "https://via.placeholder.com/600x400?text=Foto+do+Vazamento",
    historico: [
      { data: "10/05/2026 14:30", acao: "Chamado aberto pelo morador" }
    ]
  });

  const avancarStatus = () => {
    let novoStatus = chamado.status;
    let novaAcao = "";

    if (chamado.status === "Aberto") {
      novoStatus = "Em Andamento";
      novaAcao = "Síndico alterou para: Em Andamento";
    } else if (chamado.status === "Em Andamento") {
      novoStatus = "Resolvido";
      novaAcao = "Síndico alterou para: Resolvido";
    }

    if (novoStatus !== chamado.status) {
      setChamado({
        ...chamado,
        status: novoStatus,
        historico: [
          ...chamado.historico,
          { data: new Date().toLocaleString("pt-BR"), acao: novaAcao }
        ]
      });
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Aberto": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "Em Andamento": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Resolvido": return "bg-green-500/20 text-green-400 border-green-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  return (
    <div className="p-6 md:p-10">
      {/* Botão Voltar Funcional */}
      <button 
        onClick={() => navigate(-1)} 
        className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors font-medium"
      >
        ← Voltar para a listagem
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-purple-400 font-mono text-sm uppercase tracking-tighter">Chamado #{chamado.id}</span>
                <h1 className="text-3xl font-bold text-white mt-1">{chamado.titulo}</h1>
              </div>
              <span className={`px-4 py-1 rounded-full border text-xs font-bold uppercase ${getStatusStyle(chamado.status)}`}>
                {chamado.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Categoria</p>
                <p className="text-sm font-semibold">{chamado.categoria}</p>
              </div>
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Prioridade</p>
                <p className={`text-sm font-semibold ${chamado.prioridade === 'Alta' ? 'text-red-400' : 'text-slate-200'}`}>
                  {chamado.prioridade}
                </p>
              </div>
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Data</p>
                <p className="text-[10px] font-semibold">{chamado.dataAbertura}</p>
              </div>
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Solicitante</p>
                <p className="text-sm font-semibold truncate">{chamado.morador}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-2">Descrição</h3>
              <p className="text-slate-300 leading-relaxed bg-[#0f172a] p-4 rounded-xl border border-slate-800 text-sm">
                {chamado.descricao}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4">Evidência</h3>
              <img 
                src={chamado.foto} 
                alt="Foto do chamado" 
                className="w-full h-64 object-cover rounded-xl border border-slate-700"
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Gestão do Status</h3>
            {chamado.status !== "Resolvido" ? (
              <button 
                onClick={avancarStatus}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
              >
                {chamado.status === "Aberto" ? "Iniciar Atendimento" : "Concluir Chamado"}
              </button>
            ) : (
              <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-xl text-center">
                <p className="text-green-400 font-bold italic">✓ Este chamado foi finalizado.</p>
              </div>
            )}
          </section>

          <section className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Histórico</h3>
            <div className="space-y-4">
              {chamado.historico.map((item, index) => (
                <div key={index} className="relative pl-6 border-l border-slate-700 pb-2">
                  <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-purple-500" />
                  <p className="text-[10px] text-slate-500 font-mono">{item.data}</p>
                  <p className="text-xs text-slate-300">{item.acao}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ChamadoDetalhe;
