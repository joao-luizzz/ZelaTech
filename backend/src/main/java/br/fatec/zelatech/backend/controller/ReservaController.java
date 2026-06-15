package br.fatec.zelatech.backend.controller;

import br.fatec.zelatech.backend.dto.reserva.ReservaRequestDTO;
import br.fatec.zelatech.backend.dto.reserva.ReservaResponseDTO;
import br.fatec.zelatech.backend.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @PostMapping
    @PreAuthorize("hasRole('MORADOR')")
    public ResponseEntity<ReservaResponseDTO> agendar(
            @Valid @RequestBody ReservaRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservaService.agendar(dto, userDetails.getUsername()));
    }

    @GetMapping("/morador")
    @PreAuthorize("hasAnyRole('MORADOR', 'SINDICO')")
    public ResponseEntity<List<ReservaResponseDTO>> listarMinhasReservas(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reservaService.listarMinhasReservas(userDetails.getUsername()));
    }

    @GetMapping("/area/{areaId}")
    public ResponseEntity<List<ReservaResponseDTO>> listarPorAreaEMes(
            @PathVariable Long areaId,
            @RequestParam int ano,
            @RequestParam int mes) {
        return ResponseEntity.ok(reservaService.listarReservasPorAreaEMes(areaId, ano, mes));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('MORADOR', 'SINDICO')")
    public ResponseEntity<Map<String, String>> cancelar(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        reservaService.cancelarReserva(id, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("mensagem", "Reserva cancelada com sucesso."));
    }
}
