import React, { useEffect, useState } from 'react';
import { metricsService } from '../../services/metricsService';
import { useToast } from '../../hooks/useToast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Label
} from 'recharts';
import { FileText, Download, Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CORES_CATEGORIAS = ['#818cf8', '#34d399', '#fb923c', '#f472b6', '#94a3b8'];
const CORES_STATUS = {
  'ABERTO': '#f87171',
  'EM_ANDAMENTO': '#fbbf24',
  'RESOLVIDO': '#34d399'
};


export default function PainelIndicadores() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await metricsService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      showToast('Erro ao carregar indicadores de BI', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!metrics) return;
    
    const rows = [
      ['RELATÓRIO ZELATECH - INDICADORES E MÉTRICAS'],
      [],
      ['Total Abertos', 'Total Em Andamento', 'Total Resolvidos'],
      [metrics.totalAbertos, metrics.totalEmAndamento, metrics.totalResolvidos],
      [],
      ['SLA (TEMPO DE RESOLUÇÃO)'],
      ['Média (Horas)', 'Mediana (Horas)'],
      [metrics.sla.mediaHoras, metrics.sla.medianaHoras],
      [],
      ['INCIDÊNCIA POR CATEGORIA'],
      ['Categoria', 'Quantidade'],
      ...metrics.chamadosPorCategoria.map(c => [c.categoria, c.quantidade]),
      [],
      ['VOLUMETRIA POR STATUS'],
      ['Status', 'Quantidade'],
      ...metrics.chamadosPorStatus.map(s => [s.status, s.quantidade])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_bi_zelatech.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV exportado com sucesso', 'success');
  };

  const exportPDF = () => {
    if (!metrics) return;
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Indicadores - ZelaTech", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);

    // Tabela SLA
    autoTable(doc, {
      startY: 35,
      head: [['Métrica de SLA', 'Valor (Horas)']],
      body: [
        ['Tempo Médio de Resolução', metrics.sla.mediaHoras],
        ['Tempo Mediano de Resolução', metrics.sla.medianaHoras],
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    // Tabela Status
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Status do Chamado', 'Volume']],
      body: metrics.chamadosPorStatus.map(s => [s.status, s.quantidade]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    // Tabela Categorias
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Categoria', 'Incidência']],
      body: metrics.chamadosPorCategoria.map(c => [c.categoria, c.quantidade]),
      theme: 'grid',
      headStyles: { fillColor: [245, 158, 11] }
    });

    doc.save("relatorio_bi_zelatech.pdf");
    showToast('PDF gerado com sucesso', 'success');
  };

  if (loading || !metrics) {
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
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Painel de Indicadores (BI)</h1>
          <p className="text-muted-foreground mt-1">Métricas de SLA e acompanhamento gerencial do condomínio.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={exportCSV}
            className="flex items-center px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-background transition-all duration-200 shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </button>
          <button 
            onClick={exportPDF}
            className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-primary/20"
          >
            <FileText className="w-4 h-4 mr-2" />
            Gerar Relatório PDF
          </button>
        </div>
      </div>

      {/* Scorecards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-xl shadow-xl border border-border flex items-center space-x-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-red-500/20 text-red-500">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Chamados Abertos</p>
            <h3 className="text-xl font-bold text-foreground">{metrics.totalAbertos}</h3>
          </div>
        </div>

        <div className="bg-card p-4 rounded-xl shadow-xl border border-border flex items-center space-x-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-green-500/20 text-green-500">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Resolvidos</p>
            <h3 className="text-xl font-bold text-foreground">{metrics.totalResolvidos}</h3>
          </div>
        </div>

        <div className="bg-card p-4 rounded-xl shadow-xl border border-border flex items-center space-x-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-500">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">SLA: Média</p>
            <h3 className="text-xl font-bold text-foreground">{metrics.sla.mediaHoras} <span className="text-xs font-normal text-muted-foreground">h</span></h3>
          </div>
        </div>

        <div className="bg-card p-4 rounded-xl shadow-xl border border-border flex items-center space-x-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-purple-500/20 text-purple-500">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">SLA: Mediana</p>
            <h3 className="text-xl font-bold text-foreground">{metrics.sla.medianaHoras} <span className="text-xs font-normal text-muted-foreground">h</span></h3>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico de Incidência por Categoria */}
        <div className="bg-card p-6 rounded-xl shadow-xl border border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Incidência por Categoria</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-48 h-48 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.chamadosPorCategoria}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    label={false}
                    labelLine={false}
                    dataKey="quantidade"
                    nameKey="categoria"
                  >
                    {metrics.chamadosPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES_CATEGORIAS[index % CORES_CATEGORIAS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px',
                      color: 'var(--foreground)',
                      fontSize: '13px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-foreground">
                  {metrics.chamadosPorCategoria.reduce((s, c) => s + c.quantidade, 0)}
                </span>
                <span className="text-xs text-muted-foreground">chamados</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {metrics.chamadosPorCategoria.map((entry, index) => (
                <div key={entry.categoria} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CORES_CATEGORIAS[index % CORES_CATEGORIAS.length] }} />
                  <span className="text-sm text-muted-foreground capitalize">{entry.categoria.toLowerCase()}</span>
                  <span className="text-sm font-bold text-foreground ml-auto pl-4">{entry.quantidade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de Barras - Volumetria de Status */}
        <div className="bg-card p-6 rounded-xl shadow-xl border border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Volumetria por Status</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.chamadosPorStatus}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barSize={48}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="status" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'var(--border)'}}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                    fontSize: '13px'
                  }}
                />
                <Bar dataKey="quantidade" radius={[6, 6, 0, 0]}>
                  {metrics.chamadosPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES_STATUS[entry.status] || '#CBD5E1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
