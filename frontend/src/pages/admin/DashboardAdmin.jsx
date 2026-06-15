import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { ShieldCheck, FileText, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function DashboardAdmin() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [parecer, setParecer] = useState('');

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  const fetchSolicitacoes = async () => {
    try {
      setLoading(true);
      const data = await adminService.listarSolicitacoes();
      setSolicitacoes(data);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id) => {
    try {
      setActionLoading(id);
      await adminService.aprovarSolicitacao(id, parecer);
      setParecer('');
      fetchSolicitacoes();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejeitar = async (id) => {
    try {
      setActionLoading(id);
      await adminService.rejeitarSolicitacao(id, parecer);
      setParecer('');
      fetchSolicitacoes();
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getFullUrl = (path) => `http://localhost:8080/${path}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck className="text-primary" size={32} />
          Painel de Auditoria e Governança
        </h1>
        <p className="text-muted-foreground">
          Gerencie o acesso administrativo e analise as solicitações de novos Síndicos.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Clock className="text-yellow-500" /> Solicitações Pendentes
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : solicitacoes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-secondary/30 rounded-lg border border-dashed border-border">
            Nenhuma solicitação pendente no momento.
          </div>
        ) : (
          <div className="space-y-4">
            {solicitacoes.map((req) => (
              <div key={req.id} className="bg-background border border-border rounded-lg p-5 hover:border-primary/50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Dados do Solicitante */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-bold text-primary">{req.nomeUsuario}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block">E-mail:</span>
                        <span className="font-medium">{req.emailUsuario}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Apt/Bloco:</span>
                        <span className="font-medium">{req.apartamento}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block">Data da Solicitação:</span>
                        <span className="font-medium">{new Date(req.dataSolicitacao).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Documentos */}
                  <div className="flex-1 space-y-3 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <FileText size={16} /> Documentos Anexados
                    </h4>
                    <div className="flex gap-4">
                      <a 
                        href={getFullUrl(req.ataEleicaoPath)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                      >
                        Ver Ata de Eleição
                      </a>
                      <a 
                        href={getFullUrl(req.documentoIdentidadePath)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                      >
                        Ver RG/CNH
                      </a>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex-1 space-y-3 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
                    <h4 className="font-semibold text-sm">Ação Administrativa</h4>
                    <input 
                      type="text" 
                      placeholder="Parecer (Opcional)..." 
                      className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      value={parecer}
                      onChange={(e) => setParecer(e.target.value)}
                    />
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => handleAprovar(req.id)}
                        disabled={actionLoading === req.id}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded font-medium flex items-center justify-center gap-2 text-sm transition-colors"
                      >
                        {actionLoading === req.id ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                        Aprovar
                      </button>
                      <button 
                        onClick={() => handleRejeitar(req.id)}
                        disabled={actionLoading === req.id}
                        className="flex-1 bg-destructive hover:bg-destructive/90 text-white py-2 rounded font-medium flex items-center justify-center gap-2 text-sm transition-colors"
                      >
                        {actionLoading === req.id ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                        Rejeitar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
