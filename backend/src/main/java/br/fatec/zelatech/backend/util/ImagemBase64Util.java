package br.fatec.zelatech.backend.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Base64;

public class ImagemBase64Util {

    public static String converterMultipartFileParaBase64(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            String mimeType = file.getContentType();
            byte[] bytes = file.getBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            return "data:" + mimeType + ";base64," + base64;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao converter arquivo para Base64: " + e.getMessage());
        }
    }
}
