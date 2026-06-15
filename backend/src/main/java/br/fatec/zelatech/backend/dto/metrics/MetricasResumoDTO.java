package br.fatec.zelatech.backend.dto.metrics;

import java.util.List;

public record MetricasResumoDTO(
        Long totalAbertos,
        Long totalResolvidos,
        Long totalEmAndamento,
        SlaMetricsDTO sla,
        List<CategoriaCountDTO> chamadosPorCategoria,
        List<StatusCountDTO> chamadosPorStatus
) {
}
