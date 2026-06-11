package br.fatec.zelatech.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final List<String> MIME_TYPES_PERMITIDOS = List.of(
            "image/jpeg", "image/png", "image/webp", "application/pdf"
    );

    public String salvarArquivo(MultipartFile arquivo, String diretorioDestino) throws IOException {
        Path uploadPath = Paths.get(diretorioDestino);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String nomeArquivo = UUID.randomUUID() + "_" + arquivo.getOriginalFilename();
        Path destino = uploadPath.resolve(nomeArquivo);
        arquivo.transferTo(destino);

        String mimeType = Files.probeContentType(destino);
        if (mimeType == null || !MIME_TYPES_PERMITIDOS.contains(mimeType)) {
            Files.deleteIfExists(destino);
            throw new IllegalArgumentException(
                    "Tipo de arquivo não permitido. Envie apenas imagens (JPEG, PNG, WebP) ou PDF."
            );
        }

        return diretorioDestino + nomeArquivo;
    }
}
