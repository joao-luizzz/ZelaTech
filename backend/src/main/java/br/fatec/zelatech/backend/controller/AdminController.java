package br.fatec.zelatech.backend.controller;

import br.fatec.zelatech.backend.dto.admin.AnalisarSolicitacaoDTO;
import br.fatec.zelatech.backend.dto.admin.SolicitacaoResponseDTO;
import br.fatec.zelatech.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/solicitacoes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarSolicitacoes() {
        return ResponseEntity.ok(adminService.listarSolicitacoesPendentes());
    }

    @PatchMapping("/solicitacoes/{id}/aprovar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> aprovar(
            @PathVariable Long id,
            @Valid @RequestBody AnalisarSolicitacaoDTO dto) {
        
        adminService.aprovarSolicitacao(id, dto.parecer());
        return ResponseEntity.ok(Map.of("mensagem", "Solicitação aprovada com sucesso."));
    }

    @PatchMapping("/solicitacoes/{id}/rejeitar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> rejeitar(
            @PathVariable Long id,
            @Valid @RequestBody AnalisarSolicitacaoDTO dto) {
        
        adminService.rejeitarSolicitacao(id, dto.parecer());
        return ResponseEntity.ok(Map.of("mensagem", "Solicitação rejeitada com sucesso."));
    }
}
