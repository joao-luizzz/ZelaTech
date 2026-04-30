package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.auth.LoginRequestDTO;
import br.fatec.zelatech.backend.dto.auth.LoginResponseDTO;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Autentica o usuário e retorna um token JWT com nome e perfil.
     * Lança exceção se o email não existir ou a senha estiver errada.
     */
    public LoginResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioService.buscarPorEmail(dto.email());

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new IllegalArgumentException("Senha incorreta.");
        }

        String token = jwtUtil.gerarToken(usuario.getEmail(), usuario.getPerfil().name());

        return new LoginResponseDTO(token, usuario.getNome(), usuario.getPerfil());
    }
}
