package br.fatec.zelatech.backend.dto.infracao;

import br.fatec.zelatech.backend.model.enums.GravidadeInfracao;
import br.fatec.zelatech.backend.model.enums.TipoInfracao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class InfracaoRequestDTO {

    @NotNull(message = "ID do morador infrator é obrigatório")
    private Long infratorId;

    @NotNull(message = "Tipo de infração é obrigatório")
    private TipoInfracao tipo;

    @NotNull(message = "Gravidade da infração é obrigatória")
    private GravidadeInfracao gravidade;

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    private BigDecimal valorMulta;
    private MultipartFile fotoEvidencia;
}
