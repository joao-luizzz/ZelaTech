package br.fatec.zelatech.backend.dto.reserva;

import br.fatec.zelatech.backend.model.enums.StatusAreaComum;
import java.math.BigDecimal;
import java.time.LocalTime;

public record AreaComumResponseDTO(
        Long id,
        String nome,
        Integer capacidade,
        LocalTime horaAbertura,
        LocalTime horaFechamento,
        BigDecimal valorTaxa,
        StatusAreaComum status
) {}
