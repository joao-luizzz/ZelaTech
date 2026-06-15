import React, { useState, useEffect } from 'react';
import { reservaService } from '../../services/reservaService';
import { CalendarDays, Loader2, XCircle, Clock, MapPin } from 'lucide-react';

export default function MinhasReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const data = await reservaService.listarMinhasReservas();
      setReservas(data);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta reserva?")) return;
    try {
      setActionLoading(id);
      await reservaService.cancelarReserva(id);
      fetchReservas();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao cancelar reserva.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CalendarDays className="text-primary" size={32} />
          Minhas Reservas
        </h1>
        <p className="text-muted-foreground">Consulte e gerencie seus agendamentos de áreas comuns.</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : reservas.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-secondary/30 rounded-lg border border-dashed border-border">
            Você não possui nenhuma reserva registrada.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservas.map((reserva) => (
              <div 
                key={reserva.id} 
                className={`border rounded-xl p-5 shadow-sm transition-colors relative overflow-hidden ${
                  reserva.status === 'CANCELADA' ? 'bg-secondary/50 border-border opacity-70' : 'bg-background border-border hover:border-primary/50'
                }`}
              >
                {/* Status Badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${
                  reserva.status === 'AGENDADA' ? 'bg-primary text-primary-foreground' : 
                  reserva.status === 'CANCELADA' ? 'bg-destructive text-destructive-foreground' : 
                  'bg-green-500 text-white'
                }`}>
                  {reserva.status}
                </div>

                <div className="space-y-4 mt-2">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <MapPin size={20} className="text-primary" />
                    {reserva.areaComumNome}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} /> 
                      <span className="font-medium text-foreground">
                        {new Date(reserva.dataEvento).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} /> 
                      Das {reserva.horaInicio.substring(0,5)} às {reserva.horaFim.substring(0,5)}
                    </div>
                  </div>

                  {reserva.status === 'AGENDADA' && (
                    <div className="pt-4 border-t border-border">
                      <button 
                        onClick={() => handleCancelar(reserva.id)}
                        disabled={actionLoading === reserva.id}
                        className="w-full bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm transition-colors"
                      >
                        {actionLoading === reserva.id ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                        Cancelar Reserva
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
