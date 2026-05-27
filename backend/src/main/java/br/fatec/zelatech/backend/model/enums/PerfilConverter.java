package br.fatec.zelatech.backend.model.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PerfilConverter implements AttributeConverter<Perfil, String> {

    @Override
    public String convertToDatabaseColumn(Perfil perfil) {
        if (perfil == null) {
            return null;
        }
        return perfil.name(); // Salva como "SINDICO" ou "MORADOR"
    }

    @Override
    public Perfil convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        if (dbData.equals("ROLE_SINDICO") || dbData.equals("SINDICO")) {
            return Perfil.SINDICO;
        }
        if (dbData.equals("ROLE_MORADOR") || dbData.equals("MORADOR")) {
            return Perfil.MORADOR;
        }
        throw new IllegalArgumentException("Perfil desconhecido no banco de dados: " + dbData);
    }
}
