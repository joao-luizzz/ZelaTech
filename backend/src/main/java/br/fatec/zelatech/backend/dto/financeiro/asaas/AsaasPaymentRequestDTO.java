package br.fatec.zelatech.backend.dto.financeiro.asaas;

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
public class AsaasPaymentRequestDTO {
    private String customer;
    private String billingType;
    private BigDecimal value;
    private LocalDate dueDate;
    private String description;
}
