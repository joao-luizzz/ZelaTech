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
  const [avisoParaExcluir, setAvisoParaExcluir] = useState(null);

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
    try {
      await muralService.deleteAviso(id);
      setAvisos(avisos.filter((aviso) => aviso.id !== id));
      setAvisoParaExcluir(null);
    } catch (err) {
      alert("Erro ao excluir aviso.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10 font-sans">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">
            ZelaTech <span className="text-primary">|</span> Mural de Avisos
          </h1>
          <p className="text-muted-foreground mt-1">Comunique-se oficialmente com os moradores.</p>
        </div>

        <button 
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-primary hover:bg-primary/90 text-foreground font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-primary/20"
        >
          {mostrarForm ? "Cancelar" : "Novo Aviso"}
        </button>
      </header>

      {mostrarForm && (
        <section className="mb-10 bg-card p-6 rounded-xl border border-primary/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold mb-4 text-primary">Publicar Novo Comunicado</h2>
          <form onSubmit={adicionarAviso} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Título do Aviso</label>
              <input 
                required
                type="text" 
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                placeholder="Ex: Reunião de Condomínio"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Conteúdo</label>
              <textarea 
                required
                rows="4"
                value={novoConteudo}
                onChange={(e) => setNovoConteudo(e.target.value)}
                placeholder="Descreva aqui o aviso detalhadamente..."
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-foreground font-bold py-2 rounded-lg transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Publicando..." : "Publicar Agora"}
            </button>
          </form>
        </section>
      )}

      <div className="space-y-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Carregando avisos...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-400 bg-red-500/10 rounded-2xl border border-red-500/30">{error}</div>
        ) : avisos.length > 0 ? (
          avisos.map((aviso) => (
            <article 
              key={aviso.id}
              className="bg-card p-6 rounded-xl border border-border hover:border-slate-600 transition-all shadow-md flex gap-4"
            >
              <div className="w-1 bg-green-500 rounded-full" />
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-foreground">{aviso.titulo}</h3>
                  <span className="text-xs text-muted-foreground font-medium">
                    {new Date(aviso.dataPublicacao || new Date()).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <p className="text-card-foreground leading-relaxed mb-4 whitespace-pre-wrap">{aviso.conteudo}</p>
                
                <div className="flex justify-end border-t border-border pt-3">
                  <button 
                    onClick={() => setAvisoParaExcluir(aviso.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-semibold flex items-center gap-1 transition-colors"
                  >
                    🗑️ Excluir Aviso
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">Nenhum aviso publicado no mural.</p>
          </div>
        )}
      </div>

      {avisoParaExcluir && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-foreground mb-2">Excluir Aviso</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Tem certeza que deseja excluir este comunicado? Esta ação não pode ser desfeita e os moradores deixarão de ver este aviso.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setAvisoParaExcluir(null)}
                className="px-4 py-2 text-sm font-bold text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => excluirAviso(avisoParaExcluir)}
                className="px-4 py-2 text-sm font-bold text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-lg transition-colors shadow-lg shadow-destructive/20"
              >
                Excluir Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GerenciarMural;