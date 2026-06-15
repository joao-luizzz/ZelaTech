package br.fatec.zelatech.backend.dto.financeiro;

import br.fatec.zelatech.backend.model.enums.StatusFatura;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FaturaResponseDTO {
    private Long id;
    private Long moradorId;
    private String moradorNome;
    private BigDecimal valor;
    private LocalDate vencimento;
    private StatusFatura status;
    private String linkPagamento;
    private String qrCodePix;
    private String pixCopiaCola;
}
