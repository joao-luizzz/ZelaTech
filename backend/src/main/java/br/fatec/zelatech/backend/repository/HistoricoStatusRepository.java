package br.fatec.zelatech.backend.repository;

import br.fatec.zelatech.backend.model.HistoricoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoStatusRepository extends JpaRepository<HistoricoStatus, Long> {
    List<HistoricoStatus> findByChamadoIdOrderByDataAlteracaoDesc(Long chamadoId);
}
