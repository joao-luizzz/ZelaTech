import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservaService } from '../../services/reservaService';
import { Calendar as CalendarIcon, Clock, Users, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function ReservarArea() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dataEvento: '',
    horaInicio: '',
    horaFim: ''
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const data = await reservaService.listarAreasAtivas();
      setAreas(data.filter(a => a.status === 'ATIVO'));
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

  const handleSelectArea = (area) => {
    setSelectedArea(area);
    setError('');
    // Reset form
    setFormData({
      dataEvento: '',
      horaInicio: area.horaAbertura.substring(0, 5),
      horaFim: area.horaFechamento.substring(0, 5)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await reservaService.agendarReserva({
        areaComumId: selectedArea.id,
        dataEvento: formData.dataEvento,
        horaInicio: formData.horaInicio + ':00', // pad to HH:mm:ss if needed
        horaFim: formData.horaFim + ':00'
      });
      navigate('/morador/reservas');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar o agendamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CalendarIcon className="text-primary" size={32} />
          Reservar Espaço
        </h1>
        <p className="text-muted-foreground">Escolha uma área de lazer e agende seu evento.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lado Esquerdo: Lista de Áreas */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Áreas Disponíveis</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-primary" size={30} />
            </div>
          ) : areas.length === 0 ? (
            <div className="text-muted-foreground text-sm">Nenhuma área disponível no momento.</div>
          ) : (
            areas.map(area => (
              <div 
                key={area.id} 
                onClick={() => handleSelectArea(area)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedArea?.id === area.id 
                    ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary' 
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <h3 className="font-bold text-foreground mb-1">{area.nome}</h3>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1"><Users size={14} /> Até {area.capacidade} pessoas</div>
                  <div className="flex items-center gap-1"><Clock size={14} /> Das {area.horaAbertura.substring(0,5)} às {area.horaFechamento.substring(0,5)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Lado Direito: Formulário de Reserva */}
        <div className="lg:col-span-2">
          {selectedArea ? (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-primary">Agendar: {selectedArea.nome}</h2>
              
              <div className="bg-secondary/50 p-4 rounded-lg mb-6 text-sm text-foreground">
                <p><strong>Regras de Agendamento:</strong></p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                  <li>Antecedência mínima de 24h e máxima de 60 dias.</li>
                  <li>Duração entre 1 e 12 horas.</li>
                  <li>Horário de funcionamento: {selectedArea.horaAbertura.substring(0,5)} até {selectedArea.horaFechamento.substring(0,5)}.</li>
                </ul>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg flex items-center gap-2 mb-6 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data do Evento</label>
                  <input 
                    type="date" 
                    name="dataEvento" 
                    value={formData.dataEvento} 
                    onChange={handleChange} 
                    required 
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} 
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hora de Início</label>
                    <input 
                      type="time" 
                      name="horaInicio" 
                      value={formData.horaInicio} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hora de Término</label>
                    <input 
                      type="time" 
                      name="horaFim" 
                      value={formData.horaFim} 
                      onChange={handleChange} 
                      required 
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                    Confirmar Reserva
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl text-muted-foreground p-8 text-center bg-card/50">
              <CalendarIcon size={48} className="mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">Selecione uma Área Comum</p>
              <p className="text-sm">Clique em uma das áreas disponíveis ao lado para iniciar o agendamento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
