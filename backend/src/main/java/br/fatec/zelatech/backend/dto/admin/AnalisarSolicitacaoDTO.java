package br.fatec.zelatech.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;

public record AnalisarSolicitacaoDTO(
        @NotBlank(message = "O parecer é obrigatório")
        String parecer
) {}
