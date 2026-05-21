import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chamadoService } from "../../services/chamadoService";

function ChamadoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    const fetchChamado = async () => {
      try {
        setLoading(true);
        const data = await chamadoService.getChamadoById(id);
        setChamado(data);
      } catch (err) {
        setError("Erro ao carregar detalhes do chamado.");
      } finally {
        setLoading(false);
      }
    };
    fetchChamado();
  }, [id]);

  const formatStatus = (status) => {
    if (status === "ABERTO") return "Aberto";
    if (status === "EM_ANDAMENTO") return "Em Andamento";
    if (status === "RESOLVIDO") return "Resolvido";
    return status;
  };

  const avancarStatus = async () => {
    let novoStatusApi = chamado.status;

    if (chamado.status === "ABERTO") {
      novoStatusApi = "EM_ANDAMENTO";
    } else if (chamado.status === "EM_ANDAMENTO") {
      novoStatusApi = "RESOLVIDO";
    }

    if (novoStatusApi !== chamado.status) {
      try {
        setAtualizando(true);
        await chamadoService.updateStatus(id, novoStatusApi);
        setChamado({
          ...chamado,
          status: novoStatusApi,
          historico: chamado.historico ? [
            ...chamado.historico,
            { dataCriacao: new Date().toISOString(), acao: `Status alterado para ${formatStatus(novoStatusApi)}` }
          ] : [{ dataCriacao: new Date().toISOString(), acao: `Status alterado para ${formatStatus(novoStatusApi)}` }]
        });
      } catch (err) {
        alert("Erro ao atualizar o status.");
      } finally {
        setAtualizando(false);
      }
    }
  };

  const getStatusStyle = (status) => {
    const s = formatStatus(status);
    switch (s) {
      case "Aberto": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "Em Andamento": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Resolvido": return "bg-green-500/20 text-green-400 border-green-500/50";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] text-slate-400 p-10 text-center">Carregando...</div>;
  if (error || !chamado) return <div className="min-h-screen bg-[#0f172a] text-red-400 p-10 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-10 font-sans">
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
                {formatStatus(chamado.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Categoria</p>
                <p className="text-sm font-semibold">{chamado.categoria}</p>
              </div>
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Prioridade</p>
                <p className={`text-sm font-semibold ${chamado.prioridade === 'ALTA' ? 'text-red-400' : 'text-slate-200'}`}>
                  {chamado.prioridade}
                </p>
              </div>
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Data</p>
                <p className="text-[10px] font-semibold">{new Date(chamado.dataCriacao).toLocaleString("pt-BR")}</p>
              </div>
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Solicitante</p>
                <p className="text-sm font-semibold truncate">{chamado.morador?.nome || 'N/A'}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-2">Descrição</h3>
              <p className="text-slate-300 leading-relaxed bg-[#0f172a] p-4 rounded-xl border border-slate-800 text-sm">
                {chamado.descricao}
              </p>
            </div>

            {chamado.fotoUrl && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Evidência</h3>
                <img 
                  src={chamado.fotoUrl} 
                  alt="Foto do chamado" 
                  className="w-full h-64 object-cover rounded-xl border border-slate-700"
                />
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Gestão do Status</h3>
            {chamado.status !== "RESOLVIDO" ? (
              <button 
                onClick={avancarStatus}
                disabled={atualizando}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50"
              >
                {atualizando ? "Atualizando..." : (chamado.status === "ABERTO" ? "Iniciar Atendimento" : "Concluir Chamado")}
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
              {chamado.historico && chamado.historico.length > 0 ? (
                chamado.historico.map((item, index) => (
                  <div key={index} className="relative pl-6 border-l border-slate-700 pb-2">
                    <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-purple-500" />
                    <p className="text-[10px] text-slate-500 font-mono">{new Date(item.dataCriacao || item.data).toLocaleString("pt-BR")}</p>
                    <p className="text-xs text-slate-300">{item.acao}</p>
                  </div>
                ))
              ) : (
                <div className="relative pl-6 border-l border-slate-700 pb-2">
                  <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-purple-500" />
                  <p className="text-[10px] text-slate-500 font-mono">{new Date(chamado.dataCriacao).toLocaleString("pt-BR")}</p>
                  <p className="text-xs text-slate-300">Chamado aberto pelo morador</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ChamadoDetalhe;
