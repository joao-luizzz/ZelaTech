package br.fatec.zelatech.backend.repository;

import br.fatec.zelatech.backend.model.RecursoInfracao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecursoInfracaoRepository extends JpaRepository<RecursoInfracao, Long> {
}
