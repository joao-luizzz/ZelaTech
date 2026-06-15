import React, { useState, useEffect } from 'react';
import { AlertTriangle, FileText, Send, UploadCloud, XCircle, Clock, CheckCircle } from 'lucide-react';
import { infracaoService } from '../../services/infracaoService';
import { useToast } from '../../hooks/useToast';

export default function MinhasOcorrencias() {
  const [infracoes, setInfracoes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infracaoSelecionada, setInfracaoSelecionada] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    justificativa: '',
    anexoProvas: null
  });

  const carregarDados = async () => {
    try {
      const res = await infracaoService.listarMinhas();
      setInfracoes(res);
    } catch (error) {
      addToast('Erro ao carregar suas ocorrências.', 'error');
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, anexoProvas: e.target.files[0] }));
    }
  };

  const handleSubmitRecurso = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append('justificativa', formData.justificativa);
      if (formData.anexoProvas) {
        payload.append('anexoProvas', formData.anexoProvas);
      }

      await infracaoService.enviarRecurso(infracaoSelecionada.id, payload);
      addToast('Defesa enviada com sucesso! O síndico analisará o seu caso.', 'success');
      setIsModalOpen(false);
      setFormData({ justificativa: '', anexoProvas: null });
      carregarDados();
    } catch (error) {
      addToast(error.response?.data?.erro || 'Erro ao enviar defesa.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const abrirModalRecurso = (infracao) => {
    setInfracaoSelecionada(infracao);
    setIsModalOpen(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ADVERTENCIA_GERADA': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 rounded-full text-xs font-semibold flex items-center gap-1"><AlertTriangle size={14}/> Advertência</span>;
      case 'MULTA_APLICADA': return <span className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 rounded-full text-xs font-semibold flex items-center gap-1"><AlertTriangle size={14}/> Multa Aplicada</span>;
      case 'EM_RECURSO': return <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 rounded-full text-xs font-semibold flex items-center gap-1"><Clock size={14}/> Em Análise</span>;
      case 'RECURSO_ACEITO': return <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle size={14}/> Defesa Aceita</span>;
      case 'RECURSO_NEGADO': return <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle size={14}/> Defesa Negada</span>;
      case 'CANCELADA': return <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 rounded-full text-xs font-semibold">Cancelada</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="text-orange-500" size={32} />
          Minhas Ocorrências
        </h1>
        <p className="text-muted-foreground mt-1">Acompanhe as notificações da sua unidade e apresente defesa se necessário.</p>
      </div>

      {infracoes.length === 0 ? (
        <div className="bg-card rounded-xl p-8 text-center border border-border shadow-sm">
          <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
          <h2 className="text-xl font-bold text-foreground">Tudo certo por aqui!</h2>
          <p className="text-muted-foreground">Sua unidade não possui nenhuma advertência ou multa registrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {infracoes.map(inf => (
            <div key={inf.id} className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden">
              {/* Highlight border on the left based on severity */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${inf.status === 'RECURSO_ACEITO' || inf.status === 'CANCELADA' ? 'bg-green-500' : inf.gravidade.includes('GRAVE') ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
              
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{inf.tipo.replace('_', ' ')}</h3>
                    <span className="text-xs text-muted-foreground">{new Date(inf.dataCriacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {getStatusBadge(inf.status)}
                </div>

                <div className="bg-muted/30 p-3 rounded-lg border border-border">
                  <p className="text-sm text-foreground">{inf.descricao}</p>
                </div>

                {inf.valorMulta > 0 && (
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">
                    Multa estipulada: {formatCurrency(inf.valorMulta)}
                  </div>
                )}
                
                {inf.status === 'RECURSO_NEGADO' && (
                  <div className="text-xs text-red-500 font-medium">Sua defesa foi analisada e rejeitada. A multa será gerada na sua próxima fatura.</div>
                )}
                {inf.status === 'RECURSO_ACEITO' && (
                  <div className="text-xs text-green-500 font-medium">Sua defesa foi aceita! Esta infração foi abonada e nenhuma penalidade será aplicada.</div>
                )}
              </div>

              <div className="flex flex-col gap-3 shrink-0 md:w-48 justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                {(inf.status === 'ADVERTENCIA_GERADA' || inf.status === 'MULTA_APLICADA') && (
                  <button
                    onClick={() => abrirModalRecurso(inf)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm text-center flex justify-center items-center gap-2 shadow-sm"
                  >
                    <FileText size={16} />
                    Apresentar Defesa
                  </button>
                )}
                
                {inf.fotoEvidencia && (
                  <a 
                    href={inf.fotoEvidencia} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 px-4 rounded-lg font-medium transition-colors text-sm text-center flex justify-center items-center gap-2"
                  >
                    Ver Evidência
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Apresentar Recurso */}
      {isModalOpen && infracaoSelecionada && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="text-blue-500" /> Apresentar Defesa
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="px-6 pt-4 pb-2 bg-muted/20 text-sm text-muted-foreground">
              Você está recorrendo da infração de <strong>{infracaoSelecionada.tipo.replace('_', ' ')}</strong> registrada em {new Date(infracaoSelecionada.dataCriacao).toLocaleDateString('pt-BR')}.
            </div>

            <form onSubmit={handleSubmitRecurso} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sua Justificativa</label>
                <textarea 
                  name="justificativa" 
                  value={formData.justificativa} 
                  onChange={handleChange} 
                  required 
                  rows="5" 
                  className="w-full bg-background border border-border rounded-lg p-3 resize-none text-sm" 
                  placeholder="Escreva sua versão dos fatos. Seja claro e objetivo..."
                ></textarea>
                <p className="text-xs text-muted-foreground mt-1 text-right">{formData.justificativa.length} caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Anexar Provas (Opcional)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/30 transition-colors">
                  <input type="file" id="anexoProvas" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                  <label htmlFor="anexoProvas" className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud size={24} className="text-primary" />
                    <span className="text-sm">{formData.anexoProvas ? formData.anexoProvas.name : 'Clique para anexar fotos ou documentos'}</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium border border-border hover:bg-muted transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isLoading || formData.justificativa.trim() === ''} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Enviando...' : <><Send size={18} /> Enviar Defesa</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
