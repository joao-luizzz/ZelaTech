package br.fatec.zelatech.backend.dto.financeiro.asaas;

import lombok.Data;

@Data
public class AsaasWebhookPayloadDTO {
    private String event;
    private Payment payment;

    @Data
    public static class Payment {
        private String id;
        private String status;
    }
}
