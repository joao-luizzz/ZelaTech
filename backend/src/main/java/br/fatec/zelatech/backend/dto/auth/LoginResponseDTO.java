package br.fatec.zelatech.backend.dto.auth;

import br.fatec.zelatech.backend.model.enums.Perfil;

public record LoginResponseDTO(
        String token,
        String nome,
        Perfil perfil
) {}
