package br.fatec.zelatech.backend.dto.infracao;

import br.fatec.zelatech.backend.model.enums.GravidadeInfracao;
import br.fatec.zelatech.backend.model.enums.StatusInfracao;
import br.fatec.zelatech.backend.model.enums.TipoInfracao;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class InfracaoResponseDTO {
    private Long id;
    private Long infratorId;
    private String infratorNome;
    private String infratorApartamento;
    private TipoInfracao tipo;
    private GravidadeInfracao gravidade;
    private String descricao;
    private StatusInfracao status;
    private BigDecimal valorMulta;
    private String fotoEvidencia;
    private LocalDateTime dataCriacao;
    private String justificativaRecurso;
    private String anexoRecurso;
}
