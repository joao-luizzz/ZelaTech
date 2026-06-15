package br.fatec.zelatech.backend.controller;

import br.fatec.zelatech.backend.dto.financeiro.FaturaRequestDTO;
import br.fatec.zelatech.backend.dto.financeiro.FaturaResponseDTO;
import br.fatec.zelatech.backend.service.FaturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/faturas")
@RequiredArgsConstructor
public class FinanceiroController {

    private final FaturaService faturaService;
    private final br.fatec.zelatech.backend.repository.UsuarioRepository usuarioRepository;

    @PostMapping
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<FaturaResponseDTO> gerarFatura(@Valid @RequestBody FaturaRequestDTO requestDTO) {
        return ResponseEntity.ok(faturaService.gerarFatura(requestDTO));
    }

    @GetMapping
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<List<FaturaResponseDTO>> listarTodasFaturas() {
        return ResponseEntity.ok(faturaService.listarTodasFaturas());
    }

    @GetMapping("/minhas")
    @PreAuthorize("hasRole('MORADOR')")
    public ResponseEntity<List<FaturaResponseDTO>> listarMinhasFaturas(@AuthenticationPrincipal String email) {
        br.fatec.zelatech.backend.model.Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return ResponseEntity.ok(faturaService.listarFaturasPorMorador(usuario.getId())); 
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SINDICO', 'MORADOR')")
    public ResponseEntity<FaturaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(faturaService.buscarPorId(id));
    }
}
