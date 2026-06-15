package br.fatec.zelatech.backend.dto.financeiro.asaas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsaasCustomerSearchResponseDTO {
    private List<AsaasCustomerResponseDTO> data;
}
