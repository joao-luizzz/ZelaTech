package br.fatec.zelatech.backend.dto.notificacao;

public record NotificacaoDTO(
        String tipo,
        Long chamadoId,
        String titulo,
        String mensagem
) {}
