package br.fatec.zelatech.backend.dto.financeiro.asaas;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AsaasCustomerRequestDTO {
    private String name;
    private String email;
    private String cpfCnpj;
}
