package br.fatec.zelatech.backend.dto.financeiro;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FaturaRequestDTO {
    @NotNull(message = "ID do morador é obrigatório")
    private Long moradorId;

    @NotNull(message = "Valor é obrigatório")
    private BigDecimal valor;

    @NotNull(message = "Data de vencimento é obrigatória")
    private LocalDate vencimento;
}
