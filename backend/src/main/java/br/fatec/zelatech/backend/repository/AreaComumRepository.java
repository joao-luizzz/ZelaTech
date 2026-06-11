package br.fatec.zelatech.backend.repository;

import br.fatec.zelatech.backend.model.AreaComum;
import br.fatec.zelatech.backend.model.enums.StatusAreaComum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AreaComumRepository extends JpaRepository<AreaComum, Long> {
    List<AreaComum> findByStatus(StatusAreaComum status);
}
