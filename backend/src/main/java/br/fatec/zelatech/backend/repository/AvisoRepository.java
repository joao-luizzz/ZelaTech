package br.fatec.zelatech.backend.repository;

import br.fatec.zelatech.backend.model.Aviso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvisoRepository extends JpaRepository<Aviso, Long> {
    List<Aviso> findAllByOrderByDataPublicacaoDesc();
}
