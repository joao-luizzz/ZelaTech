import React, { useState, useEffect } from 'react';
import { reservaService } from '../../services/reservaService';
import { Map, Plus, Clock, Users, Loader2, AlertCircle, CheckCircle, Power } from 'lucide-react';

export default function GerenciarAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    capacidade: '',
    horaAbertura: '08:00',
    horaFechamento: '22:00',
    valorTaxa: 0.00
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const data = await reservaService.listarAreasAtivas(); // Atualizarei o back para retornar todas depois se precisar, por enquanto as ativas já dão ideia
      setAreas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await reservaService.cadastrarArea({
        ...formData,
        capacidade: parseInt(formData.capacidade),
        valorTaxa: parseFloat(formData.valorTaxa)
      });
      setFormOpen(false);
      setFormData({ nome: '', capacidade: '', horaAbertura: '08:00', horaFechamento: '22:00', valorTaxa: 0 });
      fetchAreas();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar área comum.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await reservaService.alternarStatusArea(id);
      fetchAreas();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Map className="text-primary" size={32} />
            Áreas Comuns
          </h1>
          <p className="text-muted-foreground">Gerencie os espaços compartilhados do condomínio.</p>
        </div>
        <button 
          onClick={() => setFormOpen(!formOpen)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {formOpen ? 'Cancelar' : <><Plus size={20} /> Nova Área</>}
        </button>
      </div>

      {formOpen && (
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cadastrar Nova Área Comum</h2>
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg flex items-center gap-2 mb-4 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-1 lg:col-span-3">
              <label className="block text-sm font-medium mb-1">Nome do Espaço</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="w-full bg-background border border-border rounded-lg px-3 py-2" placeholder="Ex: Salão de Festas Principal" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capacidade (Pessoas)</label>
              <input type="number" name="capacidade" value={formData.capacidade} onChange={handleChange} required min="1" className="w-full bg-background border border-border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hora de Abertura</label>
              <input type="time" name="horaAbertura" value={formData.horaAbertura} onChange={handleChange} required className="w-full bg-background border border-border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hora de Fechamento</label>
              <input type="time" name="horaFechamento" value={formData.horaFechamento} onChange={handleChange} required className="w-full bg-background border border-border rounded-lg px-3 py-2" />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end mt-2">
              <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                Salvar Área Comum
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : areas.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-dashed border-border">
          Nenhuma área comum cadastrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map(area => (
            <div key={area.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-foreground">{area.nome}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${area.status === 'ATIVO' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                  {area.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground flex-1">
                <div className="flex items-center gap-2">
                  <Users size={16} /> Capacidade: {area.capacidade} pessoas
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} /> Horário: {area.horaAbertura.substring(0,5)} às {area.horaFechamento.substring(0,5)}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex justify-end">
                <button 
                  onClick={() => handleToggleStatus(area.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    area.status === 'ATIVO' 
                      ? 'text-destructive hover:bg-destructive/10' 
                      : 'text-green-500 hover:bg-green-500/10'
                  }`}
                >
                  <Power size={16} />
                  {area.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
