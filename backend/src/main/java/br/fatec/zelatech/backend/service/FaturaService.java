package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.financeiro.FaturaRequestDTO;
import br.fatec.zelatech.backend.dto.financeiro.FaturaResponseDTO;
import br.fatec.zelatech.backend.dto.financeiro.asaas.AsaasPaymentResponseDTO;
import br.fatec.zelatech.backend.dto.financeiro.asaas.AsaasPixResponseDTO;
import br.fatec.zelatech.backend.model.Fatura;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.model.enums.StatusFatura;
import br.fatec.zelatech.backend.repository.FaturaRepository;
import br.fatec.zelatech.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FaturaService {

    private final FaturaRepository faturaRepository;
    private final UsuarioRepository usuarioRepository;
    private final GatewayPagamentoService gatewayPagamentoService;

    @Transactional
    public FaturaResponseDTO gerarFatura(FaturaRequestDTO dto) {
        Usuario morador = usuarioRepository.findById(dto.getMoradorId())
                .orElseThrow(() -> new RuntimeException("Morador não encontrado"));

        // 1. Obter ou criar cliente no Asaas
        String customerId = gatewayPagamentoService.obterOuCriarCliente(morador);

        // 2. Criar a cobrança no Asaas
        String descricao = "Taxa Condominial ZelaTech - " + dto.getVencimento().getMonthValue() + "/" + dto.getVencimento().getYear();
        AsaasPaymentResponseDTO payment = gatewayPagamentoService.criarCobranca(customerId, dto.getValor(), dto.getVencimento(), descricao);

        // 3. Obter QR Code PIX da cobrança (o Asaas já gera no mesmo instante para billingType UNDEFINED)
        AsaasPixResponseDTO pix = gatewayPagamentoService.obterQrCodePix(payment.getId());

        // 4. Salvar Fatura no Banco
        Fatura fatura = new Fatura();
        fatura.setUsuario(morador);
        fatura.setValor(dto.getValor());
        fatura.setVencimento(dto.getVencimento());
        fatura.setGatewayId(payment.getId());
        fatura.setLinkPagamento(payment.getInvoiceUrl());
        
        if (pix != null) {
            fatura.setQrCodePix(pix.getEncodedImage());
            fatura.setPixCopiaCola(pix.getPayload());
        }

        fatura = faturaRepository.save(fatura);
        return mapToDTO(fatura);
    }

    @Transactional(readOnly = true)
    public List<FaturaResponseDTO> listarTodasFaturas() {
        return faturaRepository.findAllByOrderByVencimentoDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FaturaResponseDTO> listarFaturasPorMorador(Long moradorId) {
        return faturaRepository.findByUsuarioIdOrderByVencimentoDesc(moradorId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FaturaResponseDTO buscarPorId(Long id) {
        Fatura fatura = faturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fatura não encontrada"));
        return mapToDTO(fatura);
    }

    @Transactional
    public void processarWebhookPagamento(String paymentId) {
        faturaRepository.findByGatewayId(paymentId).ifPresent(fatura -> {
            fatura.setStatus(StatusFatura.PAGA);
            faturaRepository.save(fatura);
        });
    }

    private FaturaResponseDTO mapToDTO(Fatura f) {
        return FaturaResponseDTO.builder()
                .id(f.getId())
                .moradorId(f.getUsuario().getId())
                .moradorNome(f.getUsuario().getNome())
                .valor(f.getValor())
                .vencimento(f.getVencimento())
                .status(f.getStatus())
                .linkPagamento(f.getLinkPagamento())
                .qrCodePix(f.getQrCodePix())
                .pixCopiaCola(f.getPixCopiaCola())
                .build();
    }
}
