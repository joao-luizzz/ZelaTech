package br.fatec.zelatech.backend.repository;

import br.fatec.zelatech.backend.model.Reserva;
import br.fatec.zelatech.backend.model.enums.StatusReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuarioIdOrderByDataEventoDescHoraInicioDesc(Long usuarioId);

    @Query("SELECT r FROM Reserva r WHERE r.areaComum.id = :areaComumId AND r.dataEvento = :dataEvento AND r.status != 'CANCELADA' " +
           "AND ((r.horaInicio < :horaFim) AND (r.horaFim > :horaInicio))")
    List<Reserva> findOverlappingReservations(
            @Param("areaComumId") Long areaComumId,
            @Param("dataEvento") LocalDate dataEvento,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFim") LocalTime horaFim
    );

    @Query("SELECT r FROM Reserva r WHERE r.areaComum.id = :areaComumId AND r.dataEvento >= :startDate AND r.dataEvento <= :endDate AND r.status != 'CANCELADA'")
    List<Reserva> findByAreaComumIdAndDateRange(
            @Param("areaComumId") Long areaComumId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
