package br.fatec.zelatech.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationMs) {
        // Deriva a chave a partir do secret lido do .env
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /**
     * Gera um token JWT assinado com HMAC-SHA256.
     * O subject é o email do usuário; o perfil vai como claim adicional.
     */
    public String gerarToken(String email, String perfil) {
        return Jwts.builder()
                .subject(email)
                .claim("perfil", perfil)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Valida o token: verifica assinatura e data de expiração.
     * Retorna false para tokens inválidos ou expirados sem lançar exceção.
     */
    public boolean validarToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extrai o email (subject) de um token já validado.
     */
    public String extrairEmail(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Extrai o perfil (claim personalizado) de um token já validado.
     */
    public String extrairPerfil(String token) {
        return getClaims(token).get("perfil", String.class);
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

