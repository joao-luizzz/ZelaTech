package br.fatec.zelatech.backend.dto.metrics;

import br.fatec.zelatech.backend.model.enums.CategoriaChamado;

public record CategoriaCountDTO(
        CategoriaChamado categoria,
        Long quantidade
) {
}
