package br.fatec.zelatech.backend.controller;

import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.model.enums.Perfil;
import br.fatec.zelatech.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @GetMapping("/moradores")
    @PreAuthorize("hasRole('SINDICO')")
    public ResponseEntity<List<Map<String, Object>>> listarMoradores() {
        List<Map<String, Object>> moradores = usuarioRepository.findByPerfil(Perfil.MORADOR).stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "nome", u.getNome(),
                        "email", u.getEmail(),
                        "apartamento", u.getApartamento() != null ? u.getApartamento() : ""
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(moradores);
    }
}
