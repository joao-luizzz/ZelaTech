package br.fatec.zelatech.backend.repository;

import br.fatec.zelatech.backend.model.Chamado;
import br.fatec.zelatech.backend.model.enums.CategoriaChamado;
import br.fatec.zelatech.backend.model.enums.StatusChamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {
    List<Chamado> findByUsuarioIdOrderByDataAberturaDesc(Long usuarioId);
    List<Chamado> findByStatus(StatusChamado status);
    List<Chamado> findByCategoria(CategoriaChamado categoria);
}
