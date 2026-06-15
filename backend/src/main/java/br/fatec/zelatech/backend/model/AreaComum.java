package br.fatec.zelatech.backend.model;

import br.fatec.zelatech.backend.model.enums.StatusAreaComum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "area_comum")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AreaComum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false)
    private Integer capacidade;

    @Column(name = "hora_abertura", nullable = false)
    private LocalTime horaAbertura;

    @Column(name = "hora_fechamento", nullable = false)
    private LocalTime horaFechamento;

    @Column(name = "valor_taxa", nullable = false)
    private BigDecimal valorTaxa;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusAreaComum status = StatusAreaComum.ATIVO;
}
