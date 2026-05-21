import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function MeusChamados() {
  // Estado com a lista de chamados do morador logado
  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  const navigate = useNavigate()

  // Busca os chamados do morador ao montar o componente
  useEffect(() => {
    const buscarChamados = async () => {
      try {
        const response = await api.get('/api/v1/chamados')
        setChamados(response.data)
      } catch (err) {
        setErro('Não foi possível carregar seus chamados.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    buscarChamados()
  }, [])

  // Retorna a cor da barra lateral com base na categoria do chamado
  const corCategoria = (categoria) => {
    const cores = {
      HIDRAULICA: 'bg-orange-500',
      ELETRICA: 'bg-purple-600',
      ESTRUTURAL: 'bg-green-500',
      LIMPEZA: 'bg-blue-500',
      OUTRO: 'bg-slate-500',
    }
    return cores[categoria] || 'bg-slate-500'
  }

  // Retorna as classes do badge de status com cores semânticas
  const badgeStatus = (status) => {
    const estilos = {
      ABERTO: 'bg-red-500/20 text-red-400 border border-red-500/30',
      EM_ANDAMENTO: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      RESOLVIDO: 'bg-green-500/20 text-green-400 border border-green-500/30',
    }
    return estilos[status] || 'bg-slate-500/20 text-slate-400'
  }

  // Formata o label do status para exibição
  const labelStatus = (status) => {
    const labels = {
      ABERTO: 'Aberto',
      EM_ANDAMENTO: 'Em Andamento',
      RESOLVIDO: 'Resolvido',
    }
    return labels[status] || status
  }

  // Formata a data ISO para o padrão brasileiro
  const formatarData = (dataISO) => {
    if (!dataISO) return '—'
    return new Date(dataISO).toLocaleDateString('pt-BR')
  }

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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Meus Chamados
            </h1>
            <p className="text-slate-400 mt-1">
              Acompanhe o status das suas solicitações.
            </p>
          </div>
          {/* Botão de atalho para abrir novo chamado */}
          <button
            onClick={() => navigate('/morador/novo-chamado')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-xl transition-all duration-200 text-sm"
          >
            + Novo Chamado
          </button>
        </div>
      </div>

      {/* ── Feedback de carregamento ── */}
      {loading && (
        <p className="text-slate-400">Carregando seus chamados...</p>
      )}

      {/* ── Feedback de erro ── */}
      {erro && (
        <p className="text-red-400">{erro}</p>
      )}

      {/* ── Lista vazia ── */}
      {!loading && !erro && chamados.length === 0 && (
        <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-10 text-center">
          <p className="text-slate-400 text-lg">
            Você ainda não abriu nenhum chamado.
          </p>
          <button
            onClick={() => navigate('/morador/novo-chamado')}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl transition-all"
          >
            Abrir Primeiro Chamado
          </button>
        </div>
      )}

      {/* ── Grade de cards de chamados ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chamados.map((chamado) => (
          <div
            key={chamado.id}
            onClick={() => navigate(`/morador/chamados/${chamado.id}`)}
            className="bg-[#1e293b] rounded-xl shadow-xl border border-slate-700 flex overflow-hidden cursor-pointer
                       hover:scale-[1.02] hover:border-purple-500 transition-all duration-200"
          >
            {/* Barra lateral colorida conforme a categoria */}
            <div className={`w-[10px] flex-shrink-0 ${corCategoria(chamado.categoria)}`} />

            {/* Conteúdo do card */}
            <div className="p-5 flex-1">

              {/* Linha superior: número do chamado + badge de status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-[10px] uppercase font-bold">
                  #{chamado.id}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${badgeStatus(chamado.status)}`}>
                  {labelStatus(chamado.status)}
                </span>
              </div>

              {/* Título do chamado */}
              <h3 className="text-white font-bold text-base leading-snug mb-1">
                {chamado.titulo}
              </h3>

              {/* Categoria */}
              <p className="text-slate-400 text-sm mb-4">
                {chamado.categoria.charAt(0) + chamado.categoria.slice(1).toLowerCase()}
              </p>

              {/* Rodapé do card: prioridade e data */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div>
                  <span className="text-slate-500">Prioridade </span>
                  <span className="text-white font-bold">
                    {chamado.prioridade.charAt(0) + chamado.prioridade.slice(1).toLowerCase()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Data </span>
                  <span className="text-white font-bold">
                    {formatarData(chamado.dataAbertura)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}