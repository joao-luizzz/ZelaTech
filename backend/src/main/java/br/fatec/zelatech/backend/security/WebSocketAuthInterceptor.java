package br.fatec.zelatech.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            List<String> authorization = accessor.getNativeHeader("Authorization");

            if (authorization == null || authorization.isEmpty()) {
                throw new org.springframework.messaging.MessageDeliveryException("Header Authorization ausente na conexão STOMP");
            }

            String authHeader = authorization.get(0);
            if (!authHeader.startsWith("Bearer ")) {
                throw new org.springframework.messaging.MessageDeliveryException("Token não possui o prefixo Bearer");
            }

            String token = authHeader.substring(7);

            if (!jwtUtil.validarToken(token)) {
                throw new org.springframework.messaging.MessageDeliveryException("Token JWT inválido ou expirado na conexão STOMP");
            }

            String email = jwtUtil.extrairEmail(token);
            String perfil = jwtUtil.extrairPerfil(token);

            String authorityName = perfil.startsWith("ROLE_") ? perfil : "ROLE_" + perfil;
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(authorityName);

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    email, null, List.of(authority)
            );
            
            // Atribui o usuário logado ao accessor para o contexto do websocket
            accessor.setUser(auth);
        }

        return message;
    }
}
