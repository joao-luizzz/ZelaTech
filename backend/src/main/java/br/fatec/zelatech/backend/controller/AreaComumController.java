package br.fatec.zelatech.backend.controller;

import br.fatec.zelatech.backend.dto.reserva.AreaComumRequestDTO;
import br.fatec.zelatech.backend.dto.reserva.AreaComumResponseDTO;
import br.fatec.zelatech.backend.service.AreaComumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/areas")
@RequiredArgsConstructor
public class AreaComumController {

    private final AreaComumService areaComumService;

    @GetMapping
    public ResponseEntity<List<AreaComumResponseDTO>> listarAtivas() {
        return ResponseEntity.ok(areaComumService.listarAtivas());
    }

    @PostMapping
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<AreaComumResponseDTO> cadastrar(@Valid @RequestBody AreaComumRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(areaComumService.cadastrar(dto));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<AreaComumResponseDTO> alternarStatus(@PathVariable Long id) {
        return ResponseEntity.ok(areaComumService.alternarStatus(id));
    }
}
