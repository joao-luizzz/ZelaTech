package br.fatec.zelatech.backend.dto.chamado;

import br.fatec.zelatech.backend.model.enums.CategoriaChamado;
import br.fatec.zelatech.backend.model.enums.PrioridadeChamado;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChamadoRequestDTO {

    @NotBlank(message = "O título é obrigatório")
    private String titulo;

    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    @NotNull(message = "A categoria é obrigatória")
    private CategoriaChamado categoria;

    @NotNull(message = "A prioridade é obrigatória")
    private PrioridadeChamado prioridade;

    // Recebido via multipart/form-data — o path é gerado pelo servidor após o upload
    private MultipartFile foto;
}
