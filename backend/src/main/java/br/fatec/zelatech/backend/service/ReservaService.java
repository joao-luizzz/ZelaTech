package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.reserva.ReservaRequestDTO;
import br.fatec.zelatech.backend.dto.reserva.ReservaResponseDTO;
import br.fatec.zelatech.backend.model.AreaComum;
import br.fatec.zelatech.backend.model.Reserva;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.model.enums.StatusReserva;
import br.fatec.zelatech.backend.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final AreaComumService areaComumService;
    private final UsuarioService usuarioService;

    @Transactional
    public ReservaResponseDTO agendar(ReservaRequestDTO dto, String emailMorador) {
        AreaComum area = areaComumService.buscarPorId(dto.areaComumId());
        Usuario morador = usuarioService.buscarPorEmail(emailMorador);

        // Validação: antecedência mínima e máxima
        LocalDate hoje = LocalDate.now();
        if (dto.dataEvento().isBefore(hoje.plusDays(1))) {
            throw new IllegalArgumentException("Reservas devem ser feitas com no mínimo 24h de antecedência.");
        }
        if (dto.dataEvento().isAfter(hoje.plusDays(60))) {
            throw new IllegalArgumentException("Não é permitido reservar com mais de 60 dias de antecedência.");
        }

        // Validação: horários de funcionamento
        if (dto.horaInicio().isBefore(area.getHoraAbertura()) || dto.horaFim().isAfter(area.getHoraFechamento())) {
            throw new IllegalArgumentException(
                String.format("Horário inválido. A área funciona das %s às %s.", area.getHoraAbertura(), area.getHoraFechamento())
            );
        }

        // Validação: duração mínima e máxima
        long horas = ChronoUnit.HOURS.between(dto.horaInicio(), dto.horaFim());
        if (horas < 1 || horas > 12) {
            throw new IllegalArgumentException("A reserva deve ter duração mínima de 1 hora e máxima de 12 horas.");
        }

        // Validação de Conflito de Horário
        List<Reserva> conflitos = reservaRepository.findOverlappingReservations(
                area.getId(), dto.dataEvento(), dto.horaInicio(), dto.horaFim()
        );

        if (!conflitos.isEmpty()) {
            throw new IllegalArgumentException("Já existe uma reserva para este horário nesta área comum.");
        }

        Reserva reserva = new Reserva();
        reserva.setAreaComum(area);
        reserva.setUsuario(morador);
        reserva.setDataEvento(dto.dataEvento());
        reserva.setHoraInicio(dto.horaInicio());
        reserva.setHoraFim(dto.horaFim());
        reserva.setStatus(StatusReserva.AGENDADA);

        return toResponseDTO(reservaRepository.save(reserva));
    }

    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> listarMinhasReservas(String emailMorador) {
        Usuario morador = usuarioService.buscarPorEmail(emailMorador);
        return reservaRepository.findByUsuarioIdOrderByDataEventoDescHoraInicioDesc(morador.getId())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> listarReservasPorAreaEMes(Long areaComumId, int ano, int mes) {
        LocalDate startDate = LocalDate.of(ano, mes, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        return reservaRepository.findByAreaComumIdAndDateRange(areaComumId, startDate, endDate)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public void cancelarReserva(Long id, String emailMorador) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada."));

        Usuario morador = usuarioService.buscarPorEmail(emailMorador);

        if (!reserva.getUsuario().getId().equals(morador.getId()) && !morador.getPerfil().name().equals("SINDICO")) {
            throw new IllegalArgumentException("Você não tem permissão para cancelar esta reserva.");
        }

        if (reserva.getDataEvento().isBefore(LocalDate.now()) || 
            (reserva.getDataEvento().isEqual(LocalDate.now()) && LocalTime.now().isAfter(reserva.getHoraInicio()))) {
            throw new IllegalArgumentException("Não é possível cancelar uma reserva passada ou já iniciada.");
        }

        reserva.setStatus(StatusReserva.CANCELADA);
        reservaRepository.save(reserva);
    }

    private ReservaResponseDTO toResponseDTO(Reserva r) {
        return new ReservaResponseDTO(
                r.getId(),
                r.getAreaComum().getId(),
                r.getAreaComum().getNome(),
                r.getUsuario().getId(),
                r.getUsuario().getNome(),
                r.getUsuario().getApartamento(),
                r.getDataEvento(),
                r.getHoraInicio(),
                r.getHoraFim(),
                r.getStatus()
        );
    }
}
