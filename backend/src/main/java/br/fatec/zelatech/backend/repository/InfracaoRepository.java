package br.fatec.zelatech.backend.repository;

import br.fatec.zelatech.backend.model.Infracao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InfracaoRepository extends JpaRepository<Infracao, Long> {
    List<Infracao> findAllByOrderByDataCriacaoDesc();
    List<Infracao> findByInfratorIdOrderByDataCriacaoDesc(Long infratorId);
}
