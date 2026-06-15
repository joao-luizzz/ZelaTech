package br.fatec.zelatech.backend.dto.metrics;

import br.fatec.zelatech.backend.model.enums.StatusChamado;

public record StatusCountDTO(
        StatusChamado status,
        Long quantidade
) {
}
