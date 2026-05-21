import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function DashboardMorador() {
  // Estado para armazenar os avisos vindos da API
  const [avisos, setAvisos] = useState([])
  // Estado para controlar o carregamento da tela
  const [loading, setLoading] = useState(true)
  // Estado para exibir mensagens de erro ao usuário
  const [erro, setErro] = useState(null)

  // Hook de navegação do React Router para trocar de tela
  const navigate = useNavigate()

  // Busca os avisos do mural assim que o componente é montado
  useEffect(() => {
    const buscarAvisos = async () => {
      try {
        const response = await api.get('/api/v1/avisos')
        setAvisos(response.data)
      } catch (err) {
        setErro('Não foi possível carregar os avisos.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    buscarAvisos()
  }, [])

  // Formata a data ISO para o padrão brasileiro (dd/mm/aaaa)
  const formatarData = (dataISO) => {
    if (!dataISO) return '—'
    return new Date(dataISO).toLocaleDateString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 md:p-10">

      {/* ── Cabeçalho da tela ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Olá, Morador! 👋
        </h1>
        <p className="text-slate-400 mt-1">
          Confira os últimos avisos do condomínio e gerencie seus chamados.
        </p>
      </div>

      {/* ── Botões de ação rápida ── */}
      <div className="flex flex-wrap gap-4 mb-10">
        <button
          onClick={() => navigate('/morador/novo-chamado')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
        >
          + Novo Chamado
        </button>
        <button
          onClick={() => navigate('/morador/meus-chamados')}
          className="bg-[#1e293b] hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl border border-slate-700 transition-all duration-200 shadow-lg"
        >
          📋 Meus Chamados
        </button>
      </div>

      {/* ── Seção do Mural de Avisos ── */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-white mb-4">
          📢 Mural de Avisos
        </h2>

        {/* Estado de carregamento */}
        {loading && (
          <p className="text-slate-400">Carregando avisos...</p>
        )}

        {/* Mensagem de erro */}
        {erro && (
          <p className="text-red-400">{erro}</p>
        )}

        {/* Mensagem quando não há avisos */}
        {!loading && !erro && avisos.length === 0 && (
          <p className="text-slate-400">Nenhum aviso publicado no momento.</p>
        )}

        {/* Grade de cards de avisos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {avisos.map((aviso) => (
            <div
              key={aviso.id}
              className="bg-[#1e293b] rounded-xl shadow-xl border border-slate-700 flex overflow-hidden"
            >
              {/* Barra lateral verde — padrão para comunicados/avisos */}
              <div className="w-[10px] bg-green-500 flex-shrink-0" />

              {/* Conteúdo do card */}
              <div className="p-5 flex-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  {formatarData(aviso.dataPublicacao)}
                </p>
                <h3 className="text-lg font-bold text-white mb-2">
                  {aviso.titulo}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {aviso.conteudo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}