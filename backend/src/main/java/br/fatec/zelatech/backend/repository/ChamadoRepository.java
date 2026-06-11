package br.fatec.zelatech.backend.repository;

import br.fatec.zelatech.backend.model.Chamado;
import br.fatec.zelatech.backend.model.enums.CategoriaChamado;
import br.fatec.zelatech.backend.model.enums.StatusChamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long>, JpaSpecificationExecutor<Chamado> {
    List<Chamado> findByUsuarioIdOrderByDataAberturaDesc(Long usuarioId);
    List<Chamado> findByStatus(StatusChamado status);
    List<Chamado> findByCategoria(CategoriaChamado categoria);

    @Query("SELECT new br.fatec.zelatech.backend.dto.metrics.StatusCountDTO(c.status, COUNT(c)) " +
           "FROM Chamado c " +
           "WHERE (cast(:dataInicio as timestamp) IS NULL OR c.dataAbertura >= :dataInicio) " +
           "  AND (cast(:dataFim as timestamp) IS NULL OR c.dataAbertura <= :dataFim) " +
           "GROUP BY c.status")
    List<br.fatec.zelatech.backend.dto.metrics.StatusCountDTO> countByStatus(
            @Param("dataInicio") java.time.LocalDateTime dataInicio,
            @Param("dataFim") java.time.LocalDateTime dataFim);

    @Query("SELECT new br.fatec.zelatech.backend.dto.metrics.CategoriaCountDTO(c.categoria, COUNT(c)) " +
           "FROM Chamado c " +
           "WHERE (cast(:dataInicio as timestamp) IS NULL OR c.dataAbertura >= :dataInicio) " +
           "  AND (cast(:dataFim as timestamp) IS NULL OR c.dataAbertura <= :dataFim) " +
           "GROUP BY c.categoria")
    List<br.fatec.zelatech.backend.dto.metrics.CategoriaCountDTO> countByCategoria(
            @Param("dataInicio") java.time.LocalDateTime dataInicio,
            @Param("dataFim") java.time.LocalDateTime dataFim);
}

