package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.financeiro.asaas.*;
import br.fatec.zelatech.backend.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class GatewayPagamentoService {

    @Value("${asaas.api.key}")
    private String apiKey;

    @Value("${asaas.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String obterOuCriarCliente(Usuario usuario) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("access_token", apiKey);
        
        // 1. Tentar buscar cliente pelo e-mail
        String searchUrl = apiUrl + "/customers?email=" + usuario.getEmail();
        HttpEntity<Void> searchEntity = new HttpEntity<>(headers);
        
        ResponseEntity<AsaasCustomerSearchResponseDTO> searchResponse = restTemplate.exchange(
                searchUrl, HttpMethod.GET, searchEntity, AsaasCustomerSearchResponseDTO.class);
                
        if (searchResponse.getBody() != null && !searchResponse.getBody().getData().isEmpty()) {
            return searchResponse.getBody().getData().get(0).getId();
        }

        // 2. Criar cliente caso não exista
        String createUrl = apiUrl + "/customers";
        AsaasCustomerRequestDTO requestDTO = AsaasCustomerRequestDTO.builder()
                .name(usuario.getNome())
                .email(usuario.getEmail())
                .cpfCnpj(usuario.getCpf())
                .build();
                
        HttpEntity<AsaasCustomerRequestDTO> createEntity = new HttpEntity<>(requestDTO, headers);
        
        try {
            ResponseEntity<AsaasCustomerResponseDTO> createResponse = restTemplate.exchange(
                    createUrl, HttpMethod.POST, createEntity, AsaasCustomerResponseDTO.class);
            return createResponse.getBody().getId();
        } catch (HttpClientErrorException e) {
            System.err.println("Erro ao criar cliente Asaas: " + e.getResponseBodyAsString());
            throw new RuntimeException("Erro do Asaas: " + e.getResponseBodyAsString());
        }
    }

    public AsaasPaymentResponseDTO criarCobranca(String customerId, BigDecimal valor, LocalDate vencimento, String descricao) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("access_token", apiKey);
        
        String url = apiUrl + "/payments";
        
        AsaasPaymentRequestDTO requestDTO = AsaasPaymentRequestDTO.builder()
                .customer(customerId)
                .billingType("UNDEFINED") // Híbrido: Pix ou Boleto
                .value(valor)
                .dueDate(vencimento)
                .description(descricao)
                .build();
                
        HttpEntity<AsaasPaymentRequestDTO> entity = new HttpEntity<>(requestDTO, headers);
        
        try {
            ResponseEntity<AsaasPaymentResponseDTO> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, AsaasPaymentResponseDTO.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.err.println("Erro ao criar cobrança Asaas: " + e.getResponseBodyAsString());
            throw new RuntimeException("Erro do Asaas (Payment): " + e.getResponseBodyAsString());
        }
    }

    public AsaasPixResponseDTO obterQrCodePix(String paymentId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("access_token", apiKey);
        
        String url = apiUrl + "/payments/" + paymentId + "/pixQrCode";
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<AsaasPixResponseDTO> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, AsaasPixResponseDTO.class);
            return response.getBody();
        } catch (Exception e) {
            // Se o PIX não foi gerado a tempo, o Asaas pode retornar 404 momentâneo ou 400.
            return null;
        }
    }
}
