package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.reserva.AreaComumRequestDTO;
import br.fatec.zelatech.backend.dto.reserva.AreaComumResponseDTO;
import br.fatec.zelatech.backend.model.AreaComum;
import br.fatec.zelatech.backend.model.enums.StatusAreaComum;
import br.fatec.zelatech.backend.repository.AreaComumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaComumService {

    private final AreaComumRepository areaComumRepository;

    @Transactional
    public AreaComumResponseDTO cadastrar(AreaComumRequestDTO dto) {
        AreaComum area = new AreaComum();
        area.setNome(dto.nome());
        area.setCapacidade(dto.capacidade());
        area.setHoraAbertura(dto.horaAbertura());
        area.setHoraFechamento(dto.horaFechamento());
        area.setValorTaxa(dto.valorTaxa());
        area.setStatus(StatusAreaComum.ATIVO);

        return toResponseDTO(areaComumRepository.save(area));
    }

    @Transactional(readOnly = true)
    public List<AreaComumResponseDTO> listarAtivas() {
        return areaComumRepository.findByStatus(StatusAreaComum.ATIVO)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public AreaComumResponseDTO alternarStatus(Long id) {
        AreaComum area = areaComumRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Área comum não encontrada com ID: " + id));

        area.setStatus(area.getStatus() == StatusAreaComum.ATIVO ? StatusAreaComum.INATIVO : StatusAreaComum.ATIVO);
        return toResponseDTO(areaComumRepository.save(area));
    }

    public AreaComum buscarPorId(Long id) {
        return areaComumRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Área comum não encontrada com ID: " + id));
    }

    private AreaComumResponseDTO toResponseDTO(AreaComum a) {
        return new AreaComumResponseDTO(
                a.getId(),
                a.getNome(),
                a.getCapacidade(),
                a.getHoraAbertura(),
                a.getHoraFechamento(),
                a.getValorTaxa(),
                a.getStatus()
        );
    }
}
