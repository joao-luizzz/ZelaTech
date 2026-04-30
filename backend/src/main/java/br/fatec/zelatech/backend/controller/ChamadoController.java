package br.fatec.zelatech.backend.controller;

import br.fatec.zelatech.backend.dto.chamado.AtualizarStatusDTO;
import br.fatec.zelatech.backend.dto.chamado.ChamadoRequestDTO;
import br.fatec.zelatech.backend.dto.chamado.ChamadoResponseDTO;
import br.fatec.zelatech.backend.service.ChamadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/chamados")
@RequiredArgsConstructor
public class ChamadoController {

    private final ChamadoService chamadoService;

    // ─────────────────────────────────────────────────────────────────
    // ROTAS DO MORADOR
    // ─────────────────────────────────────────────────────────────────

    /**
     * POST /api/v1/chamados
     * Morador abre um chamado. Recebe multipart/form-data por causa do upload de foto.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('MORADOR')")
    public ResponseEntity<ChamadoResponseDTO> abrirChamado(
            @Valid @ModelAttribute ChamadoRequestDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        ChamadoResponseDTO response = chamadoService.abrir(dto, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/v1/chamados/meus
     * Morador lista apenas os próprios chamados.
     */
    @GetMapping("/meus")
    @PreAuthorize("hasRole('MORADOR')")
    public ResponseEntity<List<ChamadoResponseDTO>> listarMeusChamados(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(chamadoService.listarDoMorador(userDetails.getUsername()));
    }

    // ─────────────────────────────────────────────────────────────────
    // ROTAS DO SÍNDICO
    // ─────────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/chamados
     * Síndico lista todos os chamados do condomínio.
     */
    @GetMapping
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<List<ChamadoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(chamadoService.listarTodos());
    }

    /**
     * PATCH /api/v1/chamados/{id}/status
     * Síndico avança o status de um chamado. Lança erro se tentar retroceder.
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<ChamadoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarStatusDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        ChamadoResponseDTO response = chamadoService.atualizarStatus(id, dto, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
