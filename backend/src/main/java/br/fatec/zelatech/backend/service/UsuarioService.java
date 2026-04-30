package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.auth.CadastroRequestDTO;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.model.enums.Perfil;
import br.fatec.zelatech.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Realiza o cadastro de um novo usuário.
     * Regra de negócio: o primeiro usuário cadastrado no sistema
     * recebe automaticamente o perfil de ROLE_SINDICO. Os demais,
     * ROLE_MORADOR.
     */
    @Transactional
    public Usuario cadastrar(CadastroRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Já existe um usuário cadastrado com este email.");
        }

        // Se não houver nenhum usuário no banco, o primeiro vira Síndico
        Perfil perfil = usuarioRepository.count() == 0
                ? Perfil.ROLE_SINDICO
                : Perfil.ROLE_MORADOR;

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(dto.nome());
        novoUsuario.setEmail(dto.email());
        novoUsuario.setSenha(passwordEncoder.encode(dto.senha()));
        novoUsuario.setApartamento(dto.apartamento());
        novoUsuario.setPerfil(perfil);

        return usuarioRepository.save(novoUsuario);
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com o email: " + email));
    }
}
