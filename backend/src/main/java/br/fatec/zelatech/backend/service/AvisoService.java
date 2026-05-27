package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.aviso.AvisoRequestDTO;
import br.fatec.zelatech.backend.dto.aviso.AvisoResponseDTO;
import br.fatec.zelatech.backend.model.Aviso;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.repository.AvisoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvisoService {

    private final AvisoRepository avisoRepository;
    private final UsuarioService usuarioService;

    @Transactional
    public AvisoResponseDTO publicar(AvisoRequestDTO dto, String emailSindico) {
        Usuario sindico = usuarioService.buscarPorEmail(emailSindico);

        Aviso aviso = new Aviso();
        aviso.setTitulo(dto.titulo());
        aviso.setConteudo(dto.conteudo());
        aviso.setSindico(sindico);

        return toResponseDTO(avisoRepository.save(aviso));
    }

    @Transactional(readOnly = true)
    public List<AvisoResponseDTO> listarTodos() {
        return avisoRepository.findAllByOrderByDataPublicacaoDesc()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public void deletar(Long id) {
        if (!avisoRepository.existsById(id)) {
            throw new IllegalArgumentException("Aviso não encontrado com id: " + id);
        }
        avisoRepository.deleteById(id);
    }

    private AvisoResponseDTO toResponseDTO(Aviso aviso) {
        return new AvisoResponseDTO(
                aviso.getId(),
                aviso.getTitulo(),
                aviso.getConteudo(),
                aviso.getDataPublicacao(),
                aviso.getSindico().getNome()
        );
    }
}
