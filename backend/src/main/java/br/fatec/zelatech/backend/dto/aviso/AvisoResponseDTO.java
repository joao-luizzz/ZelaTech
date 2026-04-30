package br.fatec.zelatech.backend.dto.aviso;

import java.time.LocalDateTime;

public record AvisoResponseDTO(
        Long id,
        String titulo,
        String conteudo,
        LocalDateTime dataPublicacao,
        String nomeSindico
) {}
