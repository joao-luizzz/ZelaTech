package br.fatec.zelatech.backend.model;

import br.fatec.zelatech.backend.model.enums.GravidadeInfracao;
import br.fatec.zelatech.backend.model.enums.StatusInfracao;
import br.fatec.zelatech.backend.model.enums.TipoInfracao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "infracao")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Infracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "infrator_id", nullable = false)
    private Usuario infrator;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoInfracao tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GravidadeInfracao gravidade;

    @Column(nullable = false, length = 1000)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusInfracao status;

    @Column(name = "valor_multa", precision = 10, scale = 2)
    private BigDecimal valorMulta;

    @Column(name = "foto_evidencia", columnDefinition = "TEXT")
    private String fotoEvidencia;

    @CreationTimestamp
    @Column(name = "data_criacao", updatable = false)
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @OneToOne(mappedBy = "infracao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private RecursoInfracao recurso;
}
