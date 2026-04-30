package br.fatec.zelatech.backend.dto.aviso;

import jakarta.validation.constraints.NotBlank;

public record AvisoRequestDTO(
        @NotBlank(message = "O título do aviso é obrigatório")
        String titulo,

        @NotBlank(message = "O conteúdo do aviso é obrigatório")
        String conteudo
) {}
