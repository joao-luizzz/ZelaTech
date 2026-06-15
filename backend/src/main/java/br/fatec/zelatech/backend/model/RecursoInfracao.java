package br.fatec.zelatech.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "recurso_infracao")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecursoInfracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "infracao_id", nullable = false)
    private Infracao infracao;

    @Column(nullable = false, length = 2000)
    private String justificativa;

    @Column(name = "anexo_provas", columnDefinition = "TEXT")
    private String anexoProvas;

    @CreationTimestamp
    @Column(name = "data_envio", updatable = false)
    private LocalDateTime dataEnvio;
}
