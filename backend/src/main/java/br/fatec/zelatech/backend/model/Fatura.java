package br.fatec.zelatech.backend.model;

import br.fatec.zelatech.backend.model.enums.StatusFatura;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fatura")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fatura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate vencimento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusFatura status = StatusFatura.PENDENTE;

    @Column(name = "gateway_id", length = 100)
    private String gatewayId;

    @Column(name = "link_pagamento", length = 2000)
    private String linkPagamento;

    @Column(name = "qr_code_pix", columnDefinition = "TEXT")
    private String qrCodePix;

    @Column(name = "pix_copia_cola", columnDefinition = "TEXT")
    private String pixCopiaCola;

    @CreationTimestamp
    @Column(name = "data_criacao", updatable = false)
    private LocalDateTime dataCriacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}
