package br.fatec.zelatech.backend.dto.admin;

import br.fatec.zelatech.backend.model.enums.StatusSolicitacao;
import java.time.LocalDateTime;

public record SolicitacaoResponseDTO(
        Long id,
        String nomeUsuario,
        String emailUsuario,
        String apartamento,
        StatusSolicitacao status,
        LocalDateTime dataSolicitacao,
        String ataEleicaoPath,
        String documentoIdentidadePath,
        String parecerAdmin
) {}
