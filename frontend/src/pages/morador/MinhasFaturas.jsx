import React, { useEffect, useState } from 'react';
import { financeiroService } from '../../services/financeiroService';
import { useToast } from '../../hooks/useToast';
import { CreditCard, QrCode, ExternalLink, X, Copy, Check } from 'lucide-react';
import clsx from 'clsx';

export default function MinhasFaturas() {
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faturaSelecionada, setFaturaSelecionada] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchFaturas();
  }, []);

  const fetchFaturas = async () => {
    try {
      setLoading(true);
      const data = await financeiroService.listarMinhasFaturas();
      setFaturas(data);
    } catch (err) {
      showToast('Erro ao carregar suas faturas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopiarPix = (pixCopiaCola) => {
    navigator.clipboard.writeText(pixCopiaCola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
    showToast('Código Pix copiado!', 'success');
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
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Minhas Faturas</h1>
        <p className="text-muted-foreground mt-1">Acompanhe e pague suas taxas condominiais.</p>
      </div>

      {faturas.length === 0 ? (
        <div className="bg-card p-12 rounded-xl border border-border text-center">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">Nenhuma fatura encontrada</h3>
          <p className="text-muted-foreground mt-1">Você está em dia com o condomínio!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faturas.map((fatura) => (
            <div key={fatura.id} className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vencimento</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatarDataLocal(fatura.vencimento)}
                  </p>
                </div>
                {getStatusBadge(fatura.status)}
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground">Valor</p>
                <p className="text-3xl font-bold text-foreground">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fatura.valor)}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                {fatura.status !== 'PAGA' && (
                  <button
                    onClick={() => setFaturaSelecionada(fatura)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-lg transition-colors"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Pagar Fatura
                  </button>
                )}
                {fatura.status === 'PAGA' && (
                  <button
                    disabled
                    className="w-full flex items-center justify-center px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg"
                  >
                    Pagamento Confirmado
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Pagamento */}
      {faturaSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-lg text-foreground">Pagamento da Fatura</h3>
              <button 
                onClick={() => setFaturaSelecionada(null)}
                className="p-1 hover:bg-muted rounded-full text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
                <p className="text-3xl font-bold text-foreground">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturaSelecionada.valor)}
                </p>
              </div>

              {faturaSelecionada.qrCodePix ? (
                <>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                    <img 
                      src={`data:image/png;base64,${faturaSelecionada.qrCodePix}`} 
                      alt="QR Code PIX" 
                      className="w-48 h-48"
                    />
                  </div>

                  <div className="w-full space-y-3">
                    <button
                      onClick={() => handleCopiarPix(faturaSelecionada.pixCopiaCola)}
                      className="w-full flex items-center justify-center px-4 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium rounded-xl transition-colors"
                    >
                      {copiado ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                      {copiado ? 'Copiado!' : 'Copiar código Pix'}
                    </button>
                    
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-border"></div>
                      <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm">ou</span>
                      <div className="flex-grow border-t border-border"></div>
                    </div>

                    <a
                      href={faturaSelecionada.linkPagamento}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center px-4 py-3 border border-border text-foreground hover:bg-muted font-medium rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Visualizar Boleto Bancário
                    </a>
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    O QR Code Pix não foi gerado a tempo, mas você pode pagar acessando o link do Asaas.
                  </p>
                  <a
                    href={faturaSelecionada.linkPagamento}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Abrir Checkout (Pix/Boleto)
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
