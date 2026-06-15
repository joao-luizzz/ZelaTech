package br.fatec.zelatech.backend.controller;

import br.fatec.zelatech.backend.dto.financeiro.asaas.AsaasWebhookPayloadDTO;
import br.fatec.zelatech.backend.service.FaturaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final FaturaService faturaService;

    @Value("${asaas.webhook.secret}")
    private String webhookSecret;

    @PostMapping("/pagamentos")
    public ResponseEntity<Void> receberWebhook(
            @RequestHeader(value = "asaas-access-token", required = false) String token,
            @RequestBody AsaasWebhookPayloadDTO payload) {

        if (token == null || !token.equals(webhookSecret)) {
            return ResponseEntity.status(401).build();
        }

        if ("PAYMENT_RECEIVED".equals(payload.getEvent()) || "PAYMENT_CONFIRMED".equals(payload.getEvent())) {
            if (payload.getPayment() != null && payload.getPayment().getId() != null) {
                faturaService.processarWebhookPagamento(payload.getPayment().getId());
            }
        }

        return ResponseEntity.ok().build();
    }
}
