package br.fatec.zelatech.backend.dto.chamado;

import br.fatec.zelatech.backend.model.enums.StatusChamado;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusDTO(
        @NotNull(message = "O novo status é obrigatório")
        StatusChamado status
) {}
