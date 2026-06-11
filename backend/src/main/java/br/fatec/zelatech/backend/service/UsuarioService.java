package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.auth.CadastroRequestDTO;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.model.enums.Perfil;
import br.fatec.zelatech.backend.repository.UsuarioRepository;
import br.fatec.zelatech.backend.repository.SolicitacaoCadastroSindicoRepository;
import br.fatec.zelatech.backend.model.SolicitacaoCadastroSindico;
import br.fatec.zelatech.backend.dto.auth.CadastroSindicoRequestDTO;
import br.fatec.zelatech.backend.model.enums.StatusSolicitacao;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SolicitacaoCadastroSindicoRepository solicitacaoRepository;
    private final FileStorageService fileStorageService;

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

        // Se não houver nenhum usuário no banco, o primeiro vira ADMIN
        Perfil perfil = usuarioRepository.count() == 0
                ? Perfil.ADMIN
                : Perfil.MORADOR;

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

    public java.util.List<Usuario> buscarSindicos() {
        return usuarioRepository.findByPerfil(Perfil.SINDICO);
    }

    @Transactional
    public Usuario cadastrarSindico(CadastroSindicoRequestDTO dto) throws IOException {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Já existe um usuário cadastrado com este email.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(dto.getNome());
        novoUsuario.setEmail(dto.getEmail());
        novoUsuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        novoUsuario.setApartamento(dto.getApartamento());
        novoUsuario.setPerfil(Perfil.MORADOR); // Começa como MORADOR até ser aprovado

        novoUsuario = usuarioRepository.save(novoUsuario);

        String ataPath = fileStorageService.salvarArquivo(dto.getAtaEleicao(), "uploads/sindicos/");
        String docPath = fileStorageService.salvarArquivo(dto.getDocumentoIdentidade(), "uploads/sindicos/");

        SolicitacaoCadastroSindico solicitacao = new SolicitacaoCadastroSindico();
        solicitacao.setUsuario(novoUsuario);
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);
        solicitacao.setAtaEleicaoPath(ataPath);
        solicitacao.setDocumentoIdentidadePath(docPath);
        solicitacaoRepository.save(solicitacao);

        return novoUsuario;
    }
}
