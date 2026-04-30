package br.fatec.zelatech.backend.dto.chamado;

import br.fatec.zelatech.backend.model.enums.StatusChamado;
import java.time.LocalDateTime;

public record HistoricoStatusDTO(
        StatusChamado statusAnterior,
        StatusChamado statusNovo,
        LocalDateTime dataAlteracao,
        String nomeSindico
) {}
