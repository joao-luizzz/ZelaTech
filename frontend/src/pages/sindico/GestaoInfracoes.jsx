import React, { useState, useEffect } from 'react';
import { Gavel, Plus, AlertTriangle, FileText, CheckCircle, XCircle, Search, UploadCloud } from 'lucide-react';
import api from '../../services/api';
import { infracaoService } from '../../services/infracaoService';
import { useToast } from '../../hooks/useToast';

export default function GestaoInfracoes() {
  const [infracoes, setInfracoes] = useState([]);
  const [moradores, setMoradores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecursoModalOpen, setIsRecursoModalOpen] = useState(false);
  const [infracaoSelecionada, setInfracaoSelecionada] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    infratorId: '',
    tipo: 'BARULHO',
    gravidade: 'LEVE',
    descricao: '',
    valorMulta: '',
    fotoEvidencia: null
  });

  const carregarDados = async () => {
    try {
      const [resInfracoes, resMoradores] = await Promise.all([
        infracaoService.listarTodas(),
        api.get('/usuarios/moradores')
      ]);
      setInfracoes(resInfracoes);
      setMoradores(resMoradores.data);
    } catch (error) {
      addToast('Erro ao carregar os dados.', 'error');
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
      setFormData(prev => ({ ...prev, fotoEvidencia: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          payload.append(key, formData[key]);
        }
      });

      await infracaoService.registrarInfracao(payload);
      addToast('Infração registrada com sucesso!', 'success');
      setIsModalOpen(false);
      setFormData({
        infratorId: '', tipo: 'BARULHO', gravidade: 'LEVE', descricao: '', valorMulta: '', fotoEvidencia: null
      });
      carregarDados();
    } catch (error) {
      addToast(error.response?.data?.erro || 'Erro ao registrar.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJulgarRecurso = async (aceitar) => {
    try {
      await infracaoService.julgarRecurso(infracaoSelecionada.id, aceitar);
      addToast(aceitar ? 'Recurso aceito! Infração cancelada/abonada.' : 'Recurso negado! Penalidade mantida.', 'success');
      setIsRecursoModalOpen(false);
      carregarDados();
    } catch (error) {
      addToast('Erro ao julgar recurso.', 'error');
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar esta infração?')) {
      try {
        await infracaoService.cancelarInfracao(id);
        addToast('Infração cancelada.', 'success');
        carregarDados();
      } catch (error) {
        addToast('Erro ao cancelar.', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ADVERTENCIA_GERADA': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'MULTA_APLICADA': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'EM_RECURSO': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 font-bold border border-blue-500';
      case 'RECURSO_ACEITO': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'RECURSO_NEGADO': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'CANCELADA': return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Gavel className="text-primary" size={32} />
            Gestão de Infrações
          </h1>
          <p className="text-muted-foreground mt-1">Aplique advertências, multas e julgue os recursos dos moradores.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nova Ocorrência
        </button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
          <h2 className="font-semibold text-card-foreground">Histórico de Ocorrências</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Infrator</th>
                <th className="p-4 font-medium">Tipo / Gravidade</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {infracoes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-muted-foreground">Nenhuma ocorrência registrada no sistema.</td>
                </tr>
              ) : (
                infracoes.map(inf => (
                  <tr key={inf.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm">{new Date(inf.dataCriacao).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4">
                      <div className="font-medium text-foreground">{inf.infratorNome}</div>
                      <div className="text-xs text-muted-foreground">{inf.infratorApartamento}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium">{inf.tipo.replace('_', ' ')}</div>
                      <div className="text-xs text-muted-foreground">{inf.gravidade}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(inf.status)}`}>
                        {inf.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {inf.status === 'EM_RECURSO' && (
                        <button
                          onClick={() => { setInfracaoSelecionada(inf); setIsRecursoModalOpen(true); }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium mr-2"
                        >
                          Julgar Recurso
                        </button>
                      )}
                      {inf.status !== 'CANCELADA' && inf.status !== 'RECURSO_ACEITO' && (
                        <button
                          onClick={() => handleCancelar(inf.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-colors"
                          title="Cancelar Infração"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Infração */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="text-orange-500" /> Registrar Nova Ocorrência
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Morador Infrator</label>
                <select name="infratorId" value={formData.infratorId} onChange={handleChange} required className="w-full bg-background border border-border rounded-lg p-2.5">
                  <option value="">Selecione...</option>
                  {moradores.map(m => (
                    <option key={m.id} value={m.id}>{m.nome} ({m.apartamento})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Infração</label>
                  <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2.5">
                    <option value="BARULHO">Barulho Excessivo</option>
                    <option value="LIXO">Descarte Irregular de Lixo</option>
                    <option value="INFRAESTRUTURA">Danos à Infraestrutura</option>
                    <option value="REGRAS_PISCINA">Uso Irregular da Piscina</option>
                    <option value="VEICULOS_GARAGEM">Problemas na Garagem</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gravidade</label>
                  <select name="gravidade" value={formData.gravidade} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2.5">
                    <option value="LEVE">Leve (Notificação)</option>
                    <option value="MEDIA">Média (Advertência)</option>
                    <option value="GRAVE">Grave (Multa)</option>
                    <option value="GRAVISSIMA">Gravíssima (Multa + Suspensão)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor da Multa (R$)</label>
                <input type="number" step="0.01" name="valorMulta" value={formData.valorMulta} onChange={handleChange} placeholder="Ex: 150.00 (Opcional)" className="w-full bg-background border border-border rounded-lg p-2.5" />
                <p className="text-xs text-muted-foreground mt-1">Se preenchido, a infração já nasce como Multa ao invés de Advertência.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição do Fato</label>
                <textarea name="descricao" value={formData.descricao} onChange={handleChange} required rows="3" className="w-full bg-background border border-border rounded-lg p-2.5 resize-none" placeholder="Descreva os fatos ocorridos..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Evidência (Foto/PDF)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/30 transition-colors">
                  <input type="file" id="fotoEvidencia" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                  <label htmlFor="fotoEvidencia" className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud size={24} className="text-primary" />
                    <span className="text-sm">{formData.fotoEvidencia ? formData.fotoEvidencia.name : 'Clique para anexar arquivo'}</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium border border-border hover:bg-muted transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  {isLoading ? 'Registrando...' : 'Registrar Ocorrência'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Julgar Recurso */}
      {isRecursoModalOpen && infracaoSelecionada && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl w-full max-w-2xl shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border shrink-0">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="text-blue-500" /> Julgar Recurso de Defesa
              </h2>
              <button onClick={() => setIsRecursoModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                <div><span className="text-xs text-muted-foreground block">Infrator</span><span className="font-medium">{infracaoSelecionada.infratorNome}</span></div>
                <div><span className="text-xs text-muted-foreground block">Infração Original</span><span className="font-medium">{infracaoSelecionada.tipo.replace('_', ' ')}</span></div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Descrição Original do Síndico</span>
                  <p className="text-sm mt-1">{infracaoSelecionada.descricao}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground border-b border-border pb-2 mb-3">Defesa Apresentada pelo Morador</h3>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <p className="text-sm whitespace-pre-wrap">{infracaoSelecionada.justificativaRecurso}</p>
                </div>
              </div>

              {infracaoSelecionada.anexoRecurso && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Provas Anexadas</h3>
                  <div className="border border-border rounded-lg overflow-hidden bg-muted/10">
                    {infracaoSelecionada.anexoRecurso.startsWith('data:image') ? (
                      <img src={infracaoSelecionada.anexoRecurso} alt="Prova do Morador" className="w-full h-auto max-h-64 object-contain" />
                    ) : (
                      <div className="p-4 text-center">Arquivo PDF anexado.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border flex justify-between items-center bg-muted/20 shrink-0">
              <p className="text-xs text-muted-foreground max-w-xs">Ao aceitar o recurso, a infração será cancelada. Ao negar, a penalidade original será mantida.</p>
              <div className="flex gap-3">
                <button onClick={() => handleJulgarRecurso(false)} className="px-4 py-2 rounded-lg font-medium text-red-600 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2">
                  <XCircle size={18} /> Rejeitar Defesa
                </button>
                <button onClick={() => handleJulgarRecurso(true)} className="px-4 py-2 rounded-lg font-medium text-green-600 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center gap-2">
                  <CheckCircle size={18} /> Aceitar Defesa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
