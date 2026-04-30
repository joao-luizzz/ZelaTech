package br.fatec.zelatech.backend.config;

import br.fatec.zelatech.backend.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // ── Rotas públicas ──────────────────────────────────────────
                .requestMatchers("/api/v1/auth/**").permitAll()

                // ── Rotas do Morador ────────────────────────────────────────
                .requestMatchers(HttpMethod.POST, "/api/v1/chamados").hasRole("MORADOR")
                .requestMatchers(HttpMethod.GET, "/api/v1/chamados/meus").hasRole("MORADOR")

                // ── Rotas do Síndico ────────────────────────────────────────
                .requestMatchers(HttpMethod.GET, "/api/v1/chamados").hasRole("SINDICO")
                .requestMatchers(HttpMethod.PATCH, "/api/v1/chamados/*/status").hasRole("SINDICO")
                .requestMatchers(HttpMethod.POST, "/api/v1/avisos").hasRole("SINDICO")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/avisos/*").hasRole("SINDICO")

                // ── Rotas compartilhadas (qualquer autenticado) ─────────────
                .requestMatchers(HttpMethod.GET, "/api/v1/avisos").authenticated()

                // ── Qualquer outra rota exige autenticação ──────────────────
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}


