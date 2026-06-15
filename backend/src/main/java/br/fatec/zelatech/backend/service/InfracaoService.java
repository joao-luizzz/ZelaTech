package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.infracao.InfracaoRequestDTO;
import br.fatec.zelatech.backend.dto.infracao.InfracaoResponseDTO;
import br.fatec.zelatech.backend.dto.infracao.RecursoRequestDTO;
import br.fatec.zelatech.backend.model.Infracao;
import br.fatec.zelatech.backend.model.RecursoInfracao;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.model.enums.StatusInfracao;
import br.fatec.zelatech.backend.repository.InfracaoRepository;
import br.fatec.zelatech.backend.repository.RecursoInfracaoRepository;
import br.fatec.zelatech.backend.repository.UsuarioRepository;
import br.fatec.zelatech.backend.util.ImagemBase64Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InfracaoService {

    private final InfracaoRepository infracaoRepository;
    private final RecursoInfracaoRepository recursoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final WebSocketNotificationService wsNotificationService;

    @Transactional
    public InfracaoResponseDTO registrarInfracao(InfracaoRequestDTO dto) {
        Usuario infrator = usuarioRepository.findById(dto.getInfratorId())
                .orElseThrow(() -> new RuntimeException("Infrator não encontrado"));

        StatusInfracao statusInicial = dto.getValorMulta() != null && dto.getValorMulta().doubleValue() > 0 
                ? StatusInfracao.MULTA_APLICADA 
                : StatusInfracao.ADVERTENCIA_GERADA;

        Infracao infracao = Infracao.builder()
                .infrator(infrator)
                .tipo(dto.getTipo())
                .gravidade(dto.getGravidade())
                .descricao(dto.getDescricao())
                .status(statusInicial)
                .valorMulta(dto.getValorMulta())
                .fotoEvidencia(ImagemBase64Util.converterMultipartFileParaBase64(dto.getFotoEvidencia()))
                .build();

        infracao = infracaoRepository.save(infracao);

        // Notificar morador
        String tipoMsg = statusInicial == StatusInfracao.MULTA_APLICADA ? "Multa" : "Advertência";
        emailService.enviarEmailSimples(
                infrator.getEmail(),
                "Nova " + tipoMsg + " Registrada - ZelaTech",
                "Olá " + infrator.getNome() + ",\nUma nova " + tipoMsg.toLowerCase() + " foi registrada para a sua unidade.\n" +
                "Motivo: " + dto.getDescricao() + "\nPor favor, acesse o sistema ZelaTech para mais detalhes ou para apresentar recurso."
        );
        wsNotificationService.notificarMorador(infrator.getId(), "Nova " + tipoMsg.toLowerCase() + " registrada na sua unidade.");

        return mapToDTO(infracao);
    }

    @Transactional(readOnly = true)
    public List<InfracaoResponseDTO> listarTodas() {
        return infracaoRepository.findAllByOrderByDataCriacaoDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InfracaoResponseDTO> listarMinhas(Long moradorId) {
        return infracaoRepository.findByInfratorIdOrderByDataCriacaoDesc(moradorId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InfracaoResponseDTO enviarRecurso(Long id, RecursoRequestDTO dto, Long moradorId) {
        Infracao infracao = infracaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Infração não encontrada"));

        if (!infracao.getInfrator().getId().equals(moradorId)) {
            throw new RuntimeException("Acesso negado: Você só pode recorrer de suas próprias infrações.");
        }

        if (infracao.getStatus() == StatusInfracao.EM_RECURSO || infracao.getRecurso() != null) {
            throw new RuntimeException("Já existe um recurso em análise para esta infração.");
        }

        RecursoInfracao recurso = RecursoInfracao.builder()
                .infracao(infracao)
                .justificativa(dto.getJustificativa())
                .anexoProvas(ImagemBase64Util.converterMultipartFileParaBase64(dto.getAnexoProvas()))
                .build();

        recurso = recursoRepository.save(recurso);
        infracao.setRecurso(recurso);
        infracao.setStatus(StatusInfracao.EM_RECURSO);
        infracaoRepository.save(infracao);

        // Notificar Síndicos via WS
        wsNotificationService.notificarSindico("Novo recurso enviado por " + infracao.getInfrator().getNome());

        return mapToDTO(infracao);
    }

    @Transactional
    public InfracaoResponseDTO julgarRecurso(Long id, boolean aceitar) {
        Infracao infracao = infracaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Infração não encontrada"));

        if (infracao.getStatus() != StatusInfracao.EM_RECURSO) {
            throw new RuntimeException("Esta infração não está em processo de recurso.");
        }

        infracao.setStatus(aceitar ? StatusInfracao.RECURSO_ACEITO : StatusInfracao.RECURSO_NEGADO);
        infracaoRepository.save(infracao);

        String resultado = aceitar ? "ACEITO" : "NEGADO";
        emailService.enviarEmailSimples(
                infracao.getInfrator().getEmail(),
                "Resultado do Recurso de Infração - ZelaTech",
                "Olá " + infracao.getInfrator().getNome() + ",\nO seu recurso para a infração (" + infracao.getTipo() + ") foi julgado e o resultado é: " + resultado + "."
        );
        wsNotificationService.notificarMorador(infracao.getInfrator().getId(), "Seu recurso de infração foi " + resultado.toLowerCase() + ".");

        return mapToDTO(infracao);
    }
    
    @Transactional
    public void cancelarInfracao(Long id) {
        Infracao infracao = infracaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Infração não encontrada"));
        infracao.setStatus(StatusInfracao.CANCELADA);
        infracaoRepository.save(infracao);
    }

    private InfracaoResponseDTO mapToDTO(Infracao infracao) {
        String justificativa = infracao.getRecurso() != null ? infracao.getRecurso().getJustificativa() : null;
        String anexoRecurso = infracao.getRecurso() != null ? infracao.getRecurso().getAnexoProvas() : null;

        return InfracaoResponseDTO.builder()
                .id(infracao.getId())
                .infratorId(infracao.getInfrator().getId())
                .infratorNome(infracao.getInfrator().getNome())
                .infratorApartamento(infracao.getInfrator().getApartamento())
                .tipo(infracao.getTipo())
                .gravidade(infracao.getGravidade())
                .descricao(infracao.getDescricao())
                .status(infracao.getStatus())
                .valorMulta(infracao.getValorMulta())
                .fotoEvidencia(infracao.getFotoEvidencia())
                .dataCriacao(infracao.getDataCriacao())
                .justificativaRecurso(justificativa)
                .anexoRecurso(anexoRecurso)
                .build();
    }
}
