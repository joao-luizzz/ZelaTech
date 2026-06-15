package br.fatec.zelatech.backend.dto.financeiro.asaas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsaasPixResponseDTO {
    private String encodedImage;
    private String payload;
}
