import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function NovoChamado() {
  // Estados individuais de cada campo do formulário
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('ELETRICA')
  const [prioridade, setPrioridade] = useState('MEDIA')
  const [foto, setFoto] = useState(null) // Arquivo de imagem (opcional)

  // Estados de controle de UI
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  const navigate = useNavigate()

  // Lida com a seleção do arquivo de foto
  const handleFotoChange = (e) => {
    const arquivo = e.target.files[0]
    if (arquivo) {
      setFoto(arquivo)
    }
  }

  // Submete o formulário montando um FormData (multipart/form-data)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro(null)
    setEnviando(true)

    try {
      // Monta o FormData — obrigatório para envio de arquivo
      const formData = new FormData()
      formData.append('titulo', titulo)
      formData.append('categoria', categoria)
      formData.append('prioridade', prioridade)
      formData.append('descricao', descricao)
      // Só anexa a foto se o usuário selecionou uma
      if (foto) formData.append('foto', foto)

      await api.post('/api/v1/chamados', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setSucesso(true)
      // Redireciona para a lista de chamados após 1.5s
      setTimeout(() => navigate('/morador/meus-chamados'), 1500)
    } catch (err) {
      setErro('Erro ao abrir chamado. Verifique os dados e tente novamente.')
      console.error(err)
    } finally {
      setEnviando(false)
    }
  }

  // Classes reutilizáveis para os inputs do formulário
  const inputClass =
    'w-full bg-[#0f172a] border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder-slate-500'
  const labelClass = 'block text-slate-400 text-sm font-bold mb-2'

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 md:p-10">

      {/* ── Cabeçalho ── */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/morador/dashboard')}
          className="text-slate-400 hover:text-white text-sm mb-4 inline-block transition-colors"
        >
          ← Voltar ao Dashboard
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Abrir Novo Chamado
        </h1>
        <p className="text-slate-400 mt-1">
          Descreva o problema para que o síndico possa atendê-lo.
        </p>
      </div>

      {/* ── Card do formulário ── */}
      <div className="max-w-2xl">
        <div className="bg-[#1e293b] rounded-xl shadow-xl border border-slate-700 flex overflow-hidden">
          {/* Barra lateral roxa — identidade da ação de criar */}
          <div className="w-[10px] bg-purple-600 flex-shrink-0" />

          <form onSubmit={handleSubmit} className="p-6 flex-1 space-y-5">

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
              <p className="text-slate-500 text-xs mt-1 text-right">
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
              <p className="text-slate-500 text-xs mt-1 text-right">
                {descricao.length}/500
              </p>
            </div>

            {/* Linha com Categoria e Prioridade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

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
              <div className="border border-dashed border-slate-600 rounded-xl p-4 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFotoChange}
                  className="hidden"
                  id="foto-input"
                />
                <label htmlFor="foto-input" className="cursor-pointer">
                  {foto ? (
                    <p className="text-green-400 text-sm font-bold">
                      ✅ {foto.name}
                    </p>
                  ) : (
                    <>
                      <p className="text-slate-400 text-sm">
                        Clique para selecionar uma imagem
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        JPEG ou PNG • Máx. 5MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Feedback de erro */}
            {erro && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {erro}
              </p>
            )}

            {/* Feedback de sucesso */}
            {sucesso && (
              <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                ✅ Chamado aberto com sucesso! Redirecionando...
              </p>
            )}

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={enviando || sucesso}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
            >
              {enviando ? 'Enviando...' : '📨 Abrir Chamado'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}