package br.fatec.zelatech.backend.model;

import br.fatec.zelatech.backend.model.enums.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacao_cadastro_sindico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoCadastroSindico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusSolicitacao status = StatusSolicitacao.PENDENTE;

    @CreationTimestamp
    @Column(name = "data_solicitacao", updatable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "ata_eleicao_path", nullable = false, length = 300)
    private String ataEleicaoPath;

    @Column(name = "documento_identidade_path", nullable = false, length = 300)
    private String documentoIdentidadePath;

    @Column(name = "parecer_admin", columnDefinition = "TEXT")
    private String parecerAdmin;
}
