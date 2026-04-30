package br.fatec.zelatech.backend.controller;

import br.fatec.zelatech.backend.dto.aviso.AvisoRequestDTO;
import br.fatec.zelatech.backend.dto.aviso.AvisoResponseDTO;
import br.fatec.zelatech.backend.service.AvisoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/avisos")
@RequiredArgsConstructor
public class AvisoController {

    private final AvisoService avisoService;

    /**
     * GET /api/v1/avisos
     * Qualquer usuário autenticado pode ver o mural de avisos.
     */
    @GetMapping
    public ResponseEntity<List<AvisoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(avisoService.listarTodos());
    }

    /**
     * POST /api/v1/avisos
     * Apenas o Síndico pode publicar avisos.
     */
    @PostMapping
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<AvisoResponseDTO> publicar(
            @Valid @RequestBody AvisoRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        AvisoResponseDTO response = avisoService.publicar(dto, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * DELETE /api/v1/avisos/{id}
     * Apenas o Síndico pode remover avisos.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        avisoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
