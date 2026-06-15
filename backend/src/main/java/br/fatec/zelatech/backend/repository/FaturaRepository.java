package br.fatec.zelatech.backend.repository;

import br.fatec.zelatech.backend.model.Fatura;
import br.fatec.zelatech.backend.model.enums.StatusFatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FaturaRepository extends JpaRepository<Fatura, Long> {
    List<Fatura> findByUsuarioIdOrderByVencimentoDesc(Long usuarioId);
    List<Fatura> findAllByOrderByVencimentoDesc();
    List<Fatura> findByStatusOrderByVencimentoDesc(StatusFatura status);
    Optional<Fatura> findByGatewayId(String gatewayId);
}
