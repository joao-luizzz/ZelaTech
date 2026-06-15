package br.fatec.zelatech.backend.dto.reserva;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaRequestDTO(
        @NotNull(message = "Área Comum é obrigatória") Long areaComumId,
        @NotNull(message = "Data do evento é obrigatória") LocalDate dataEvento,
        @NotNull(message = "Hora de início é obrigatória") LocalTime horaInicio,
        @NotNull(message = "Hora de fim é obrigatória") LocalTime horaFim
) {}
