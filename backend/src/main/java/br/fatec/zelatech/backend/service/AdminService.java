package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.admin.SolicitacaoResponseDTO;
import br.fatec.zelatech.backend.model.SolicitacaoCadastroSindico;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.model.enums.Perfil;
import br.fatec.zelatech.backend.model.enums.StatusSolicitacao;
import br.fatec.zelatech.backend.repository.SolicitacaoCadastroSindicoRepository;
import br.fatec.zelatech.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final SolicitacaoCadastroSindicoRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarSolicitacoesPendentes() {
        return solicitacaoRepository.findByStatus(StatusSolicitacao.PENDENTE)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public void aprovarSolicitacao(Long id, String parecer) {
        SolicitacaoCadastroSindico solicitacao = buscarSolicitacao(id);
        solicitacao.setStatus(StatusSolicitacao.APROVADO);
        solicitacao.setParecerAdmin(parecer);
        
        Usuario usuario = solicitacao.getUsuario();
        usuario.setPerfil(Perfil.SINDICO);
        usuarioRepository.save(usuario);
        solicitacaoRepository.save(solicitacao);
    }

    @Transactional
    public void rejeitarSolicitacao(Long id, String parecer) {
        SolicitacaoCadastroSindico solicitacao = buscarSolicitacao(id);
        solicitacao.setStatus(StatusSolicitacao.REJEITADO);
        solicitacao.setParecerAdmin(parecer);
        solicitacaoRepository.save(solicitacao);
    }

    private SolicitacaoCadastroSindico buscarSolicitacao(Long id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada com ID: " + id));
    }

    private SolicitacaoResponseDTO toResponseDTO(SolicitacaoCadastroSindico s) {
        return new SolicitacaoResponseDTO(
                s.getId(),
                s.getUsuario().getNome(),
                s.getUsuario().getEmail(),
                s.getUsuario().getApartamento(),
                s.getStatus(),
                s.getDataSolicitacao(),
                s.getAtaEleicaoPath(),
                s.getDocumentoIdentidadePath(),
                s.getParecerAdmin()
        );
    }
}
