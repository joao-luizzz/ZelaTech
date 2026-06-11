package br.fatec.zelatech.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;
import lombok.Data;

@Data
public class CadastroSindicoRequestDTO {
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    private String senha;

    @NotBlank(message = "O apartamento é obrigatório")
    private String apartamento;

    private MultipartFile ataEleicao;
    private MultipartFile documentoIdentidade;
}
