package br.fatec.zelatech.backend.dto.infracao;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class RecursoRequestDTO {
    
    @NotBlank(message = "A justificativa de defesa é obrigatória")
    private String justificativa;
    
    private MultipartFile anexoProvas;
}
