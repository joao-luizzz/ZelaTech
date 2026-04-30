package br.fatec.zelatech.backend.controller;

import br.fatec.zelatech.backend.dto.chamado.*;
import br.fatec.zelatech.backend.model.enums.CategoriaChamado;
import br.fatec.zelatech.backend.model.enums.StatusChamado;
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

    @GetMapping("/{id}")
    public ResponseEntity<ChamadoDetalheDTO> buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(chamadoService.buscarComHistorico(id, email));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('MORADOR', 'SINDICO')")
    public ResponseEntity<ChamadoResponseDTO> abrirChamado(
            @Valid @ModelAttribute ChamadoRequestDTO dto,
            @AuthenticationPrincipal String email) throws IOException {

        ChamadoResponseDTO response = chamadoService.abrir(dto, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/meus")
    @PreAuthorize("hasAnyRole('MORADOR', 'SINDICO')")
    public ResponseEntity<List<ChamadoResponseDTO>> listarMeusChamados(
            @AuthenticationPrincipal String email) {

        return ResponseEntity.ok(chamadoService.listarDoMorador(email));
    }

    @GetMapping
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<List<ChamadoResponseDTO>> listarTodos(
            @RequestParam(required = false) StatusChamado status,
            @RequestParam(required = false) CategoriaChamado categoria) {
        return ResponseEntity.ok(chamadoService.listarTodos(status, categoria));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<ChamadoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarStatusDTO dto,
            @AuthenticationPrincipal String email) {

        ChamadoResponseDTO response = chamadoService.atualizarStatus(id, dto, email);
        return ResponseEntity.ok(response);
    }

}
