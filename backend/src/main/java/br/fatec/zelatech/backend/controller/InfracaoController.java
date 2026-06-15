package br.fatec.zelatech.backend.controller;

import br.fatec.zelatech.backend.dto.infracao.InfracaoRequestDTO;
import br.fatec.zelatech.backend.dto.infracao.InfracaoResponseDTO;
import br.fatec.zelatech.backend.dto.infracao.RecursoRequestDTO;
import br.fatec.zelatech.backend.service.InfracaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/infracoes")
@RequiredArgsConstructor
public class InfracaoController {

    private final InfracaoService infracaoService;
    private final br.fatec.zelatech.backend.repository.UsuarioRepository usuarioRepository;

    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<InfracaoResponseDTO> registrarInfracao(@Valid @ModelAttribute InfracaoRequestDTO dto) {
        return ResponseEntity.ok(infracaoService.registrarInfracao(dto));
    }

    @GetMapping
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<List<InfracaoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(infracaoService.listarTodas());
    }

    @GetMapping("/minhas")
    @PreAuthorize("hasRole('MORADOR')")
    public ResponseEntity<List<InfracaoResponseDTO>> listarMinhas(@AuthenticationPrincipal String email) {
        br.fatec.zelatech.backend.model.Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return ResponseEntity.ok(infracaoService.listarMinhas(usuario.getId()));
    }

    @PostMapping(value = "/{id}/recursos", consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('MORADOR')")
    public ResponseEntity<InfracaoResponseDTO> enviarRecurso(
            @PathVariable Long id, 
            @Valid @ModelAttribute RecursoRequestDTO dto, 
            @AuthenticationPrincipal String email) {
        
        br.fatec.zelatech.backend.model.Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
                
        return ResponseEntity.ok(infracaoService.enviarRecurso(id, dto, usuario.getId()));
    }

    @PatchMapping("/{id}/julgar")
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<InfracaoResponseDTO> julgarRecurso(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Boolean aceitar = body.get("aceitar");
        if (aceitar == null) {
            throw new IllegalArgumentException("O campo 'aceitar' é obrigatório no corpo da requisição.");
        }
        return ResponseEntity.ok(infracaoService.julgarRecurso(id, aceitar));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<Void> cancelarInfracao(@PathVariable Long id) {
        infracaoService.cancelarInfracao(id);
        return ResponseEntity.noContent().build();
    }
}
