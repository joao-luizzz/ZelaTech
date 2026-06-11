package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.metrics.CategoriaCountDTO;
import br.fatec.zelatech.backend.dto.metrics.MetricasResumoDTO;
import br.fatec.zelatech.backend.dto.metrics.SlaMetricsDTO;
import br.fatec.zelatech.backend.dto.metrics.StatusCountDTO;
import br.fatec.zelatech.backend.model.enums.StatusChamado;
import br.fatec.zelatech.backend.repository.ChamadoRepository;
import br.fatec.zelatech.backend.repository.HistoricoStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MetricsService {

    private final ChamadoRepository chamadoRepository;
    private final HistoricoStatusRepository historicoStatusRepository;

    public MetricasResumoDTO obterMetricasDashboard(LocalDateTime dataInicio, LocalDateTime dataFim) {
        List<CategoriaCountDTO> porCategoria = chamadoRepository.countByCategoria(dataInicio, dataFim);
        List<StatusCountDTO> porStatus = chamadoRepository.countByStatus(dataInicio, dataFim);

        Long totalAbertos = sumStatus(porStatus, StatusChamado.ABERTO);
        Long totalResolvidos = sumStatus(porStatus, StatusChamado.RESOLVIDO);
        Long totalEmAndamento = sumStatus(porStatus, StatusChamado.EM_ANDAMENTO);

        List<Object[]> temposBrutos = historicoStatusRepository.findTemposResolucao(dataInicio, dataFim);
        SlaMetricsDTO sla = calcularSla(temposBrutos);

        return new MetricasResumoDTO(
                totalAbertos,
                totalResolvidos,
                totalEmAndamento,
                sla,
                porCategoria,
                porStatus
        );
    }

    private Long sumStatus(List<StatusCountDTO> contagens, StatusChamado status) {
        return contagens.stream()
                .filter(dto -> dto.status() == status)
                .mapToLong(StatusCountDTO::quantidade)
                .sum();
    }

    private SlaMetricsDTO calcularSla(List<Object[]> temposBrutos) {
        if (temposBrutos == null || temposBrutos.isEmpty()) {
            return new SlaMetricsDTO(0.0, 0.0);
        }

        List<Double> horasResolucao = temposBrutos.stream()
                .map(row -> {
                    LocalDateTime abertura = (LocalDateTime) row[0];
                    LocalDateTime resolucao = (LocalDateTime) row[1];
                    return Duration.between(abertura, resolucao).toMinutes() / 60.0;
                })
                .sorted()
                .collect(Collectors.toList());

        double soma = horasResolucao.stream().mapToDouble(Double::doubleValue).sum();
        double media = soma / horasResolucao.size();

        double mediana;
        int size = horasResolucao.size();
        if (size % 2 == 0) {
            mediana = (horasResolucao.get(size / 2 - 1) + horasResolucao.get(size / 2)) / 2.0;
        } else {
            mediana = horasResolucao.get(size / 2);
        }

        // Arredondar para 2 casas decimais
        media = Math.round(media * 100.0) / 100.0;
        mediana = Math.round(mediana * 100.0) / 100.0;

        return new SlaMetricsDTO(media, mediana);
    }
}
