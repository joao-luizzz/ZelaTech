package br.fatec.zelatech.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapeia todas as requisições que começam com /uploads/ para a pasta local uploads/
        // Além disso, também puxa da pasta padrão de seed-images do classpath para funcionar no GitHub
        registry.addResourceHandler("/uploads/chamados/**")
                .addResourceLocations("file:uploads/chamados/", "classpath:/seed-images/chamados/");
    }
}
