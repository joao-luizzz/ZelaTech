import React, { useEffect, useState } from 'react';
import { financeiroService } from '../../services/financeiroService';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { PlusCircle, ExternalLink, X, DollarSign, User, Calendar } from 'lucide-react';
import clsx from 'clsx';

export default function FinanceiroSindico() {
  const [faturas, setFaturas] = useState([]);
  const [moradores, setMoradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [gerandoFatura, setGerandoFatura] = useState(false);
  
  // Form State
  const [moradorId, setMoradorId] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState('');
  
  const { showToast } = useToast();

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      setLoading(true);
      const [faturasData, moradoresData] = await Promise.all([
        financeiroService.listarTodasFaturas(),
        api.get('/usuarios/moradores').then(res => res.data)
      ]);
      setFaturas(faturasData);
      setMoradores(moradoresData);
    } catch (err) {
      showToast('Erro ao carregar dados do financeiro.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGerarFatura = async (e) => {
    e.preventDefault();
    if (!moradorId || !valor || !vencimento) {
      showToast('Preencha todos os campos.', 'warning');
      return;
    }
    
    try {
      setGerandoFatura(true);
      await financeiroService.gerarFatura({
        moradorId: parseInt(moradorId, 10),
        valor: parseFloat(valor),
        vencimento
      });
      showToast('Cobrança gerada com sucesso via Asaas!', 'success');
      setModalAberto(false);
      setMoradorId('');
      setValor('');
      setVencimento('');
      fetchDados();
    } catch (err) {
      showToast('Erro ao gerar cobrança.', 'error');
    } finally {
      setGerandoFatura(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAGA':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-500">Paga</span>;
      case 'VENCIDA':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-500">Vencida</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-500">Pendente</span>;
    }
  };

  const formatarDataLocal = (vencimento) => {
    if (Array.isArray(vencimento)) {
      const [ano, mes, dia] = vencimento;
      const dataString = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}T00:00:00`;
      return new Date(dataString).toLocaleDateString('pt-BR');
    }
    return new Date(vencimento + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Gestão Financeira</h1>
          <p className="text-muted-foreground mt-1">Gerencie as cobranças e a inadimplência do condomínio.</p>
        </div>
        <button 
          onClick={() => setModalAberto(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Gerar Fatura Manual
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Morador</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Valor</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Vencimento</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-foreground text-center">Checkout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {faturas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <CreditCard className="w-10 h-10 text-muted-foreground/50" />
                      <p className="text-muted-foreground font-medium">Nenhuma fatura gerada</p>
                      <p className="text-muted-foreground/70 text-sm">Clique em "Gerar Fatura Manual" para criar a primeira cobrança.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                faturas.map((fatura) => (
                  <tr key={fatura.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 font-bold text-sm">
                          {fatura.moradorNome.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-foreground">{fatura.moradorNome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fatura.valor)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatarDataLocal(fatura.vencimento)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(fatura.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <a 
                        href={fatura.linkPagamento} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Ver Boleto/Pix"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Gerar Fatura */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h3 className="font-semibold text-lg text-foreground">Gerar Nova Fatura</h3>
              <button 
                onClick={() => setModalAberto(false)}
                className="p-1 hover:bg-muted rounded-full text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleGerarFatura} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Selecione o Morador</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <select
                    required
                    value={moradorId}
                    onChange={(e) => setMoradorId(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="" disabled>Selecione...</option>
                    {moradores.map(m => (
                      <option key={m.id} value={m.id}>{m.nome} - Apto {m.apartamento}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Valor (R$)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Data de Vencimento</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="date"
                    required
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 py-2 px-4 border border-border text-foreground rounded-lg hover:bg-muted font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={gerandoFatura}
                  className={clsx(
                    "flex-1 py-2 px-4 bg-primary text-primary-foreground font-bold rounded-lg transition-colors shadow-sm",
                    gerandoFatura ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
                  )}
                >
                  {gerandoFatura ? 'Conectando ao Asaas...' : 'Gerar Fatura'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
