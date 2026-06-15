package br.fatec.zelatech.backend.dto.reserva;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalTime;

public record AreaComumRequestDTO(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotNull(message = "Capacidade é obrigatória") Integer capacidade,
        @NotNull(message = "Hora de abertura é obrigatória") LocalTime horaAbertura,
        @NotNull(message = "Hora de fechamento é obrigatória") LocalTime horaFechamento,
        BigDecimal valorTaxa
) {}
