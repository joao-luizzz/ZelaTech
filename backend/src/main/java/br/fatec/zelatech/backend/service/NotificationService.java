package br.fatec.zelatech.backend.service;

import br.fatec.zelatech.backend.dto.notificacao.NotificacaoDTO;
import br.fatec.zelatech.backend.model.Chamado;
import br.fatec.zelatech.backend.model.Usuario;
import br.fatec.zelatech.backend.model.enums.StatusChamado;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final EmailService emailService;
    private final WebSocketNotificationService webSocketNotificationService;

    @Async("notificationExecutor")
    public void processarAberturaChamado(Chamado chamado, Usuario sindico) {
        if (sindico == null || sindico.getEmail() == null) {
            return;
        }

        // 1. Enviar E-mail para o Síndico
        emailService.enviarNotificacaoChamadoAberto(
                sindico.getEmail(),
                chamado.getTitulo(),
                chamado.getUsuario().getNome()
        );

        // 2. Enviar WebSocket (Broadcast no /topic/chamados para o Síndico)
        NotificacaoDTO dto = new NotificacaoDTO(
                "NOVO_CHAMADO",
                chamado.getId(),
                "Novo chamado de " + chamado.getUsuario().getNome(),
                chamado.getTitulo()
        );
        webSocketNotificationService.notificarSindico(dto);
    }

    @Async("notificationExecutor")
    public void processarMudancaStatus(Chamado chamado, StatusChamado statusAnterior) {
        // Regra: Notificar apenas quando muda para EM_ANDAMENTO ou RESOLVIDO
        if (chamado.getStatus() == StatusChamado.EM_ANDAMENTO || chamado.getStatus() == StatusChamado.RESOLVIDO) {
            
            Usuario morador = chamado.getUsuario();
            if (morador == null || morador.getEmail() == null) {
                return;
            }
            
            // Validação de segurança: garantir que estamos notificando o dono do chamado
            Long donoId = morador.getId();
            
            // 1. Enviar E-mail para o Morador
            emailService.enviarNotificacaoStatusAtualizado(
                    morador.getEmail(),
                    chamado.getTitulo(),
                    chamado.getStatus()
            );

            // 2. Enviar WebSocket para a fila do Morador
            NotificacaoDTO dto = new NotificacaoDTO(
                    "STATUS_CHAMADO",
                    chamado.getId(),
                    "Status Atualizado",
                    "Seu chamado '" + chamado.getTitulo() + "' agora está " + chamado.getStatus().name()
            );
            
            webSocketNotificationService.notificarMorador(donoId, dto);
        }
    }
}
