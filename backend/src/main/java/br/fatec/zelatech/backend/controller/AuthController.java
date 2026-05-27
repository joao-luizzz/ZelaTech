package br.fatec.zelatech.backend.controller;

import br.fatec.zelatech.backend.dto.auth.CadastroRequestDTO;
import br.fatec.zelatech.backend.dto.auth.LoginRequestDTO;
import br.fatec.zelatech.backend.dto.auth.LoginResponseDTO;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.service.AuthService;
import br.fatec.zelatech.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthService authService;

    /**
     * POST /api/v1/auth/cadastro
     * Rota pública — qualquer pessoa pode se cadastrar.
     * O primeiro cadastro vira Síndico automaticamente.
     */
    @PostMapping("/cadastro")
    public ResponseEntity<Map<String, String>> cadastrar(@Valid @RequestBody CadastroRequestDTO dto) {
        Usuario usuario = usuarioService.cadastrar(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "mensagem", "Usuário cadastrado com sucesso!",
                        "perfil", usuario.getPerfil().name()
                ));
    }

    /**
     * POST /api/v1/auth/login
     * Rota pública — retorna o token JWT para uso nas próximas requisições.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        LoginResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }
}
