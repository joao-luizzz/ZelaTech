import React, { useState, useEffect } from "react";
import { muralService } from "../../services/muralService";

/**
 * Tela de Mural de Avisos
 * Permite ao síndico publicar comunicados oficiais para os moradores.
 */
function GerenciarMural() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mostrarForm, setMostrarForm] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoConteudo, setNovoConteudo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAvisos();
  }, []);

  const fetchAvisos = async () => {
    try {
      setLoading(true);
      const data = await muralService.getAvisos();
      setAvisos(data);
    } catch (err) {
      setError("Não foi possível carregar os avisos.");
    } finally {
      setLoading(false);
    }
  };

  const adicionarAviso = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const novoAvisoData = { titulo: novoTitulo, conteudo: novoConteudo };
      await muralService.createAviso(novoAvisoData);
      setNovoTitulo("");
      setNovoConteudo("");
      setMostrarForm(false);
      fetchAvisos();
    } catch (err) {
      alert("Erro ao criar aviso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excluirAviso = async (id) => {
    if (window.confirm("Deseja realmente excluir este comunicado?")) {
      try {
        await muralService.deleteAviso(id);
        setAvisos(avisos.filter((aviso) => aviso.id !== id));
      } catch (err) {
        alert("Erro ao excluir aviso.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-10 font-sans">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-700 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            ZelaTech <span className="text-purple-500">|</span> Mural de Avisos
          </h1>
          <p className="text-slate-400 mt-1">Comunique-se oficialmente com os moradores.</p>
        </div>

        <button 
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-purple-500/20"
        >
          {mostrarForm ? "Cancelar" : "Novo Aviso"}
        </button>
      </header>

      {mostrarForm && (
        <section className="mb-10 bg-[#1e293b] p-6 rounded-xl border border-purple-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold mb-4 text-purple-400">Publicar Novo Comunicado</h2>
          <form onSubmit={adicionarAviso} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Título do Aviso</label>
              <input 
                required
                type="text" 
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                placeholder="Ex: Reunião de Condomínio"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Conteúdo</label>
              <textarea 
                required
                rows="4"
                value={novoConteudo}
                onChange={(e) => setNovoConteudo(e.target.value)}
                placeholder="Descreva aqui o aviso detalhadamente..."
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Publicando..." : "Publicar Agora"}
            </button>
          </form>
        </section>
      )}

      <div className="space-y-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Carregando avisos...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-400 bg-red-500/10 rounded-2xl border border-red-500/30">{error}</div>
        ) : avisos.length > 0 ? (
          avisos.map((aviso) => (
            <article 
              key={aviso.id}
              className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all shadow-md flex gap-4"
            >
              <div className="w-1 bg-green-500 rounded-full" />
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{aviso.titulo}</h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(aviso.dataPublicacao || new Date()).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-4 whitespace-pre-wrap">{aviso.conteudo}</p>
                
                <div className="flex justify-end border-t border-slate-800 pt-3">
                  <button 
                    onClick={() => excluirAviso(aviso.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-semibold flex items-center gap-1 transition-colors"
                  >
                    🗑️ Excluir Aviso
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-dashed border-slate-700">
            <p className="text-slate-500">Nenhum aviso publicado no mural.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GerenciarMural;