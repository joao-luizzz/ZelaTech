package br.fatec.zelatech.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;
import org.hibernate.validator.constraints.br.CPF;
import lombok.Data;

@Data
public class CadastroSindicoRequestDTO {
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "CPF é obrigatório")
    @CPF(message = "CPF inválido")
    private String cpf;

    @NotBlank(message = "Senha é obrigatória")
    private String senha;

    @NotBlank(message = "O apartamento é obrigatório")
    private String apartamento;

    private MultipartFile ataEleicao;
    private MultipartFile documentoIdentidade;
}
