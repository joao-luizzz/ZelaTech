package br.fatec.zelatech.backend.dto.reserva;

import br.fatec.zelatech.backend.model.enums.StatusReserva;
import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaResponseDTO(
        Long id,
        Long areaComumId,
        String areaComumNome,
        Long usuarioId,
        String usuarioNome,
        String apartamento,
        LocalDate dataEvento,
        LocalTime horaInicio,
        LocalTime horaFim,
        StatusReserva status
) {}
