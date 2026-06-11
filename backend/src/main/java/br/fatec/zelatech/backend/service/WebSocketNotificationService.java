package br.fatec.zelatech.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notificarSindico(Object payload) {
        messagingTemplate.convertAndSend("/topic/chamados", payload);
    }

    public void notificarMorador(Long userId, Object payload) {
        messagingTemplate.convertAndSend(
                "/queue/notifications/" + userId,
                payload
        );
    }
}
