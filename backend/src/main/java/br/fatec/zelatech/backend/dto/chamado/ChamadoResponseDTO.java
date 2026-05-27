package br.fatec.zelatech.backend.dto.chamado;

import br.fatec.zelatech.backend.model.enums.CategoriaChamado;
import br.fatec.zelatech.backend.model.enums.PrioridadeChamado;
import br.fatec.zelatech.backend.model.enums.StatusChamado;

import java.time.LocalDateTime;

public record ChamadoResponseDTO(
        Long id,
        String titulo,
        String descricao,
        CategoriaChamado categoria,
        PrioridadeChamado prioridade,
        StatusChamado status,
        String fotoPath,
        LocalDateTime dataAbertura,
        String nomeMorador
) {}
