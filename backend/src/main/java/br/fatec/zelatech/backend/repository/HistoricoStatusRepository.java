package br.fatec.zelatech.backend.repository;

import br.fatec.zelatech.backend.model.HistoricoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoStatusRepository extends JpaRepository<HistoricoStatus, Long> {
    List<HistoricoStatus> findByChamadoIdOrderByDataAlteracaoDesc(Long chamadoId);

    @Query("SELECT c.dataAbertura, h.dataAlteracao " +
           "FROM HistoricoStatus h JOIN h.chamado c " +
           "WHERE h.statusNovo = 'RESOLVIDO' " +
           "  AND (cast(:dataInicio as timestamp) IS NULL OR c.dataAbertura >= :dataInicio) " +
           "  AND (cast(:dataFim as timestamp) IS NULL OR c.dataAbertura <= :dataFim)")
    List<Object[]> findTemposResolucao(
            @org.springframework.data.repository.query.Param("dataInicio") java.time.LocalDateTime dataInicio,
            @org.springframework.data.repository.query.Param("dataFim") java.time.LocalDateTime dataFim);
}
