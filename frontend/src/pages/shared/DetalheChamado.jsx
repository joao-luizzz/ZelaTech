import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { chamadoService } from '../../services/chamadoService';
import { useAuth } from '../../contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Loader2, AlertCircle, Clock, CheckCircle2, AlertTriangle, User, Tag, Calendar, Save } from 'lucide-react';
import clsx from 'clsx';

const StatusBadge = ({ status }) => {
  const styles = {
    ABERTO: 'bg-red-500/20 text-red-400 border-red-500/30',
    EM_ANDAMENTO: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    RESOLVIDO: 'bg-green-500/20 text-green-400 border-green-500/30',
    CONCLUIDO: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  const labels = {
    ABERTO: 'Aberto',
    EM_ANDAMENTO: 'Em Andamento',
    RESOLVIDO: 'Resolvido',
    CONCLUIDO: 'Concluído',
  };

  const icons = {
    ABERTO: <AlertTriangle size={16} className="mr-1.5" />,
    EM_ANDAMENTO: <Clock size={16} className="mr-1.5" />,
    RESOLVIDO: <CheckCircle2 size={16} className="mr-1.5" />,
    CONCLUIDO: <CheckCircle2 size={16} className="mr-1.5" />,
  };

  return (
    <span className={clsx('inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border', styles[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30')}>
      {icons[status] || null}
      {labels[status] || status}
    </span>
  );
};

export default function DetalheChamado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSindico } = useAuth();
  
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Para o Síndico alterar o status
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchChamado();
  }, [id]);

  const fetchChamado = async () => {
    try {
      setLoading(true);
      const data = await chamadoService.getChamadoById(id);
      setChamado(data);
      setNewStatus(data.status);
    } catch (err) {
      setError('Não foi possível carregar os detalhes do chamado.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (newStatus === chamado.status) return;
    
    setUpdateError('');
    setUpdateSuccess(false);
    setIsUpdating(true);

    try {
      await chamadoService.updateStatus(id, newStatus);
      setChamado({ ...chamado, status: newStatus });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setUpdateError('Erro ao atualizar o status do chamado.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 size={40} className="animate-spin mb-4 text-purple-500" />
        <p className="text-lg">Carregando detalhes...</p>
      </div>
    );
  }

  if (error || !chamado) {
    return (
      <div className="max-w-3xl mx-auto mt-8 bg-red-500/10 text-red-500 p-6 rounded-xl flex flex-col items-center gap-4 text-center border border-red-500/30">
        <AlertCircle size={40} />
        <div>
          <h2 className="text-xl font-bold mb-2">Ops! Algo deu errado</h2>
          <p>{error || 'Chamado não encontrado.'}</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-[#0f172a] text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors font-medium text-sm"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Chamado #{chamado.id}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Detalhes Principais */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-slate-700 p-6 sm:p-8 animate-in fade-in duration-300">
            <div className="mb-6 flex justify-between items-start gap-4">
              <h2 className="text-2xl font-bold text-white leading-tight">{chamado.titulo}</h2>
              <StatusBadge status={chamado.status} />
            </div>

            <div className="max-w-none mb-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descrição do Problema</h3>
              <p className="text-slate-300 whitespace-pre-wrap bg-[#0f172a] p-4 rounded-xl border border-slate-800 leading-relaxed text-sm">
                {chamado.descricao}
              </p>
            </div>
            
            {isSindico && (
              <div className="pt-6 border-t border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Gerenciar Chamado</h3>
                
                {updateError && (
                  <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center gap-2">
                    <AlertCircle size={16} /> {updateError}
                  </div>
                )}
                
                {updateSuccess && (
                  <div className="mb-4 text-sm text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Status atualizado com sucesso!
                  </div>
                )}

                <form onSubmit={handleUpdateStatus} className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1 w-full">
                    <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">
                      Alterar Status
                    </label>
                    <select
                      id="status"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="block w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 sm:text-sm transition-colors"
                    >
                      <option value="ABERTO">Aberto</option>
                      <option value="EM_ANDAMENTO">Em Andamento</option>
                      <option value="RESOLVIDO">Resolvido</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdating || newStatus === chamado.status}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all active:scale-[0.98] font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Salvar Status
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar com Metadados */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-slate-700 p-6 animate-in fade-in duration-300">
            <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">
              Informações Adicionais
            </h3>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Tag className="text-slate-500 mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Categoria</p>
                  <p className="text-sm text-white font-medium">{chamado.categoria.toLowerCase()}</p>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <AlertTriangle className="text-slate-500 mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Prioridade</p>
                  <p className={clsx(
                    "text-sm font-bold uppercase",
                    chamado.prioridade === 'ALTA' ? 'text-red-400' :
                    chamado.prioridade === 'MEDIA' ? 'text-orange-400' :
                    'text-blue-400'
                  )}>
                    {chamado.prioridade}
                  </p>
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <Calendar className="text-slate-500 mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Data de Abertura</p>
                  <p className="text-sm text-white font-medium">
                    {format(parseISO(chamado.dataCriacao || chamado.dataAbertura || new Date().toISOString()), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-[#1e293b] rounded-2xl shadow-xl border border-slate-700 p-6 animate-in fade-in duration-300">
            <h3 className="font-bold text-white mb-4 border-b border-slate-800 pb-2">
              Dados do Solicitante
            </h3>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-lg">
                {chamado.nomeMorador?.[0].toUpperCase() || <User size={20} />}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-white truncate">{chamado.nomeMorador || 'Usuário Desconhecido'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}