import { useState } from "react";

/**
 * Tela de Mural de Avisos
 * Permite ao síndico publicar comunicados oficiais para os moradores.
 * Requisitos: Lista ordenada, formulário de criação e opção de exclusão.
 */
function Mural() {
  // 1. Estado para a lista de avisos (Dados fictícios iniciais)
  const [avisos, setAvisos] = useState([
    {
      id: 1,
      titulo: "Manutenção do Elevador",
      conteudo: "O elevador social do bloco A ficará parado amanhã das 08h às 12h para manutenção preventiva.",
      data: "12/05/2026"
    },
    {
      id: 2,
      titulo: "Festa Junina do Condomínio",
      conteudo: "Preparem os trajes! Nossa festa será no próximo sábado, dia 20, no salão de festas.",
      data: "10/05/2026"
    }
  ]);

  // 2. Estados para controlar o formulário de novo aviso
  const [mostrarForm, setMostrarForm] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoConteudo, setNovoConteudo] = useState("");

  /**
   * Função para adicionar um novo aviso à lista
   */
  const adicionarAviso = (e) => {
    e.preventDefault(); // Evita o recarregamento da página

    const novoAviso = {
      id: Date.now(), // Gera um ID único baseado no tempo
      titulo: novoTitulo,
      conteudo: novoConteudo,
      data: new Date().toLocaleDateString("pt-BR") // Pega a data atual formatada
    };

    // Adiciona o novo aviso no topo da lista (do mais recente para o mais antigo)
    setAvisos([novoAviso, ...avisos]);
    
    // Limpa o formulário e fecha
    setNovoTitulo("");
    setNovoConteudo("");
    setMostrarForm(false);
  };

  /**
   * Função para excluir um aviso
   */
  const excluirAviso = (id) => {
    if (window.confirm("Deseja realmente excluir este comunicado?")) {
      setAvisos(avisos.filter(aviso => aviso.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-10 font-sans">
      {/* Cabeçalho */}
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

      {/* Formulário de Criação (Só aparece ao clicar em Novo Aviso) */}
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
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors"
            >
              Publicar Agora
            </button>
          </form>
        </section>
      )}

      {/* Listagem de Avisos */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {avisos.length > 0 ? (
          avisos.map((aviso) => (
            <article 
              key={aviso.id}
              className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all shadow-md flex gap-4"
            >
              {/* Barra lateral fixa (Identidade Visual - Verde para Avisos) */}
              <div className="w-1 bg-green-500 rounded-full" />
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{aviso.titulo}</h3>
                  <span className="text-xs text-slate-500 font-medium">{aviso.data}</span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-4">{aviso.conteudo}</p>
                
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

export default Mural;
