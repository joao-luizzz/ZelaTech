import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chamadoService } from '../../services/chamadoService';
import { ArrowLeft, Loader2, AlertCircle, Save } from 'lucide-react';

export default function NovoChamado() {
  // Estados individuais de cada campo do formulário (Andrey)
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('ELETRICA');
  const [prioridade, setPrioridade] = useState('MEDIA');
  const [foto, setFoto] = useState(null); // Arquivo de imagem (opcional)

  // Estados de controle de UI
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const navigate = useNavigate();

  // Lida com a seleção do arquivo de foto
  const handleFotoChange = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      setFoto(arquivo);
    }
  };

  // Submete o formulário montando um FormData (multipart/form-data) via chamadoService
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const dados = {
        titulo,
        descricao,
        categoria,
        prioridade,
        foto
      };

      await chamadoService.createChamado(dados);

      setSucesso(true);
      // Redireciona para a lista de chamados após 1.5s
      setTimeout(() => navigate('/morador/chamados'), 1500);
    } catch (err) {
      setErro('Erro ao abrir chamado. Verifique os dados e tente novamente.');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  // Classes reutilizáveis para os inputs do formulário (Andrey + Premium Dark)
  const inputClass =
    'w-full bg-background border border-border text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder-slate-500';
  const labelClass = 'block text-slate-350 text-sm font-bold mb-2';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Cabeçalho (Andrey) ── */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/morador/dashboard')}
          className="text-muted-foreground hover:text-foreground text-sm mb-4 flex items-center gap-1 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Abrir Novo Chamado
        </h1>
        <p className="text-muted-foreground mt-1">
          Descreva o problema para que o síndico possa atendê-lo.
        </p>
      </div>

      {/* ── Card do formulário (Andrey + Premium Dark) ── */}
      <div className="bg-card rounded-2xl shadow-xl border border-border flex overflow-hidden animate-in fade-in duration-300">
        {/* Barra lateral roxa — identidade da ação de criar (Andrey) */}
        <div className="w-[10px] bg-primary flex-shrink-0" />

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex-1 space-y-6">
          {/* Campo: Título */}
          <div>
            <label className={labelClass}>Título *</label>
            <input
              type="text"
              placeholder="Ex: Vazamento na tubulação do banheiro"
              maxLength={100}
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className={inputClass}
            />
            <p className="text-muted-foreground text-xs mt-1 text-right">
              {titulo.length}/100
            </p>
          </div>

          {/* Campo: Descrição */}
          <div>
            <label className={labelClass}>Descrição *</label>
            <textarea
              placeholder="Detalhe o problema: quando começou, localização exata, etc."
              maxLength={500}
              required
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={`${inputClass} resize-none`}
            />
            <p className="text-muted-foreground text-xs mt-1 text-right">
              {descricao.length}/500
            </p>
          </div>

          {/* Linha com Categoria e Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Campo: Categoria */}
            <div>
              <label className={labelClass}>Categoria *</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className={inputClass}
              >
                <option value="ELETRICA">⚡ Elétrica</option>
                <option value="HIDRAULICA">💧 Hidráulica</option>
                <option value="ESTRUTURAL">🏗️ Estrutural</option>
                <option value="LIMPEZA">🧹 Limpeza</option>
                <option value="OUTRO">🔧 Outro</option>
              </select>
            </div>

            {/* Campo: Prioridade */}
            <div>
              <label className={labelClass}>Prioridade *</label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className={inputClass}
              >
                <option value="BAIXA">🟢 Baixa</option>
                <option value="MEDIA">🟡 Média</option>
                <option value="ALTA">🔴 Alta</option>
              </select>
            </div>
          </div>

          {/* Campo: Foto (opcional) */}
          <div>
            <label className={labelClass}>Foto (opcional)</label>
            <div className="border-2 border-dashed border-border hover:border-purple-500/50 rounded-xl p-6 text-center transition-colors bg-background/50">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFotoChange}
                className="hidden"
                id="foto-input"
              />
              <label htmlFor="foto-input" className="cursor-pointer flex flex-col items-center justify-center space-y-1">
                {foto ? (
                  <p className="text-green-400 text-sm font-bold">
                    ✅ {foto.name}
                  </p>
                ) : (
                  <>
                    <p className="text-slate-350 text-sm">
                      Clique para selecionar uma imagem
                    </p>
                    <p className="text-muted-foreground text-xs">
                      JPEG ou PNG • Máx. 5MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Feedback de erro */}
          {erro && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{erro}</span>
            </div>
          )}

          {/* Feedback de sucesso */}
          {sucesso && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-4 py-3 text-sm">
              ✅ Chamado aberto com sucesso! Redirecionando...
            </div>
          )}

          {/* Botão de envio */}
          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={() => navigate('/morador/dashboard')}
              className="px-5 py-2.5 border border-border text-card-foreground rounded-lg hover:bg-background hover:text-foreground transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando || sucesso}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-transparent rounded-lg shadow-lg shadow-primary/20 text-sm font-bold text-foreground bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviando ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Abrir Chamado</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}