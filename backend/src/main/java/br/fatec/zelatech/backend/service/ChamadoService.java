package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.chamado.AtualizarStatusDTO;
import br.fatec.zelatech.backend.dto.chamado.ChamadoRequestDTO;
import br.fatec.zelatech.backend.dto.chamado.ChamadoResponseDTO;
import br.fatec.zelatech.backend.model.Chamado;
import br.fatec.zelatech.backend.model.HistoricoStatus;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.model.enums.StatusChamado;
import br.fatec.zelatech.backend.repository.ChamadoRepository;
import br.fatec.zelatech.backend.repository.HistoricoStatusRepository;
import lombok.RequiredArgsConstructor;
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

    // Fluxo de status permitido: ABERTO -> EM_ANDAMENTO -> RESOLVIDO
    // Nunca pode retroceder
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
    public List<ChamadoResponseDTO> listarTodos() {
        return chamadoRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    /**
     * Regra de negócio: o status só pode avançar no fluxo definido.
     * ABERTO -> EM_ANDAMENTO -> RESOLVIDO. Nunca pode retroceder.
     */
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

        // Registra o histórico antes de alterar
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

    // -------------------------
    // Helpers privados
    // -------------------------

    private String salvarFoto(MultipartFile foto) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String nomeArquivo = UUID.randomUUID() + "_" + foto.getOriginalFilename();
        Path destino = uploadPath.resolve(nomeArquivo);
        foto.transferTo(destino);
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
