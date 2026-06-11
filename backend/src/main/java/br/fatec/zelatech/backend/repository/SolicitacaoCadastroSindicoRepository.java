package br.fatec.zelatech.backend.repository;

import br.fatec.zelatech.backend.model.SolicitacaoCadastroSindico;
import br.fatec.zelatech.backend.model.enums.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitacaoCadastroSindicoRepository extends JpaRepository<SolicitacaoCadastroSindico, Long> {
    List<SolicitacaoCadastroSindico> findByStatus(StatusSolicitacao status);
    Optional<SolicitacaoCadastroSindico> findByUsuarioId(Long usuarioId);
}
