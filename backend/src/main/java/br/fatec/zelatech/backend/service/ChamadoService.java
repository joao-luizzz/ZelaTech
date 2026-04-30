package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.chamado.*;
import br.fatec.zelatech.backend.model.Chamado;
import br.fatec.zelatech.backend.model.HistoricoStatus;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.model.enums.CategoriaChamado;
import br.fatec.zelatech.backend.model.enums.Perfil;
import br.fatec.zelatech.backend.model.enums.StatusChamado;
import br.fatec.zelatech.backend.repository.ChamadoRepository;
import br.fatec.zelatech.backend.repository.HistoricoStatusRepository;
import br.fatec.zelatech.backend.repository.specification.ChamadoSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChamadoService {

    private static final String UPLOAD_DIR = "uploads/chamados/";

    private static final List<StatusChamado> FLUXO_STATUS = List.of(
            StatusChamado.ABERTO,
            StatusChamado.EM_ANDAMENTO,
            StatusChamado.RESOLVIDO
    );

    private final ChamadoRepository chamadoRepository;
    private final HistoricoStatusRepository historicoStatusRepository;
    private final UsuarioService usuarioService;

    @Transactional
    public ChamadoResponseDTO abrir(ChamadoRequestDTO dto, String emailMorador) throws IOException {
        Usuario morador = usuarioService.buscarPorEmail(emailMorador);

        String fotoPath = null;
        if (dto.getFoto() != null && !dto.getFoto().isEmpty()) {
            fotoPath = salvarFoto(dto.getFoto());
        }

        Chamado chamado = new Chamado();
        chamado.setTitulo(dto.getTitulo());
        chamado.setDescricao(dto.getDescricao());
        chamado.setCategoria(dto.getCategoria());
        chamado.setPrioridade(dto.getPrioridade());
        chamado.setStatus(StatusChamado.ABERTO);
        chamado.setFotoPath(fotoPath);
        chamado.setUsuario(morador);

        return toResponseDTO(chamadoRepository.save(chamado));
    }

    @Transactional(readOnly = true)
    public List<ChamadoResponseDTO> listarDoMorador(String emailMorador) {
        Usuario morador = usuarioService.buscarPorEmail(emailMorador);
        return chamadoRepository
                .findByUsuarioIdOrderByDataAberturaDesc(morador.getId())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ChamadoResponseDTO> listarTodos(StatusChamado status, CategoriaChamado categoria) {
        Specification<Chamado> spec = ChamadoSpecification.comFiltros(status, categoria);
        return chamadoRepository.findAll(spec)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ChamadoDetalheDTO buscarComHistorico(Long id, String emailUsuario) {
        Chamado chamado = chamadoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Chamado não encontrado com id: " + id));

        Usuario usuario = usuarioService.buscarPorEmail(emailUsuario);

        if (usuario.getPerfil() != Perfil.ROLE_SINDICO && !chamado.getUsuario().getEmail().equals(emailUsuario)) {
            throw new IllegalArgumentException("Acesso negado");
        }

        List<HistoricoStatusDTO> historico = historicoStatusRepository.findByChamadoIdOrderByDataAlteracaoDesc(id)
                .stream()
                .map(h -> new HistoricoStatusDTO(
                        h.getStatusAnterior(),
                        h.getStatusNovo(),
                        h.getDataAlteracao(),
                        h.getUsuario().getNome()
                ))
                .toList();

        return new ChamadoDetalheDTO(
                chamado.getId(),
                chamado.getTitulo(),
                chamado.getDescricao(),
                chamado.getCategoria(),
                chamado.getPrioridade(),
                chamado.getStatus(),
                chamado.getFotoPath(),
                chamado.getDataAbertura(),
                chamado.getUsuario().getNome(),
                historico
        );
    }

    @Transactional
    public ChamadoResponseDTO atualizarStatus(Long chamadoId, AtualizarStatusDTO dto, String emailSindico) {
        Chamado chamado = chamadoRepository.findById(chamadoId)
                .orElseThrow(() -> new IllegalArgumentException("Chamado não encontrado com id: " + chamadoId));

        StatusChamado statusAtual = chamado.getStatus();
        StatusChamado statusNovo = dto.status();

        int indexAtual = FLUXO_STATUS.indexOf(statusAtual);
        int indexNovo = FLUXO_STATUS.indexOf(statusNovo);

        if (indexNovo <= indexAtual) {
            throw new IllegalStateException(
                    String.format("Transição de status inválida: '%s' → '%s'. O status não pode retroceder.",
                            statusAtual, statusNovo)
            );
        }

        Usuario sindico = usuarioService.buscarPorEmail(emailSindico);
        HistoricoStatus historico = new HistoricoStatus();
        historico.setChamado(chamado);
        historico.setStatusAnterior(statusAtual);
        historico.setStatusNovo(statusNovo);
        historico.setUsuario(sindico);
        historicoStatusRepository.save(historico);

        chamado.setStatus(statusNovo);
        return toResponseDTO(chamadoRepository.save(chamado));
    }

    private static final List<String> MIME_TYPES_PERMITIDOS = List.of(
            "image/jpeg", "image/png", "image/webp"
    );

    private String salvarFoto(MultipartFile foto) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String nomeArquivo = UUID.randomUUID() + "_" + foto.getOriginalFilename();
        Path destino = uploadPath.resolve(nomeArquivo);
        foto.transferTo(destino);

        String mimeType = Files.probeContentType(destino);
        if (mimeType == null || !MIME_TYPES_PERMITIDOS.contains(mimeType)) {
            Files.deleteIfExists(destino);
            throw new IllegalArgumentException(
                    "Tipo de arquivo não permitido. Envie apenas imagens JPEG, PNG ou WebP."
            );
        }

        return UPLOAD_DIR + nomeArquivo;
    }

    private ChamadoResponseDTO toResponseDTO(Chamado chamado) {
        return new ChamadoResponseDTO(
                chamado.getId(),
                chamado.getTitulo(),
                chamado.getDescricao(),
                chamado.getCategoria(),
                chamado.getPrioridade(),
                chamado.getStatus(),
                chamado.getFotoPath(),
                chamado.getDataAbertura(),
                chamado.getUsuario().getNome()
        );
    }
}
