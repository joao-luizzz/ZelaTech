-- Script de Criação do Banco de Dados ZelaTech (MySQL)
-- Padronização: snake_case

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    apartamento VARCHAR(20) NOT NULL,
    perfil VARCHAR(20) NOT NULL -- Enums: MORADOR, SINDICO
);

CREATE TABLE IF NOT EXISTS aviso (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    conteudo TEXT NOT NULL,
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sindico_id BIGINT NOT NULL,
    CONSTRAINT fk_aviso_sindico FOREIGN KEY (sindico_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS chamado (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    prioridade VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
    foto_path VARCHAR(300),
    data_abertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL,
    CONSTRAINT fk_chamado_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS historico_status (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chamado_id BIGINT NOT NULL,
    status_anterior VARCHAR(20) NOT NULL,
    status_novo VARCHAR(20) NOT NULL,
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id BIGINT NOT NULL,
    CONSTRAINT fk_historico_chamado FOREIGN KEY (chamado_id) REFERENCES chamado(id),
    CONSTRAINT fk_historico_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE INDEX idx_chamado_usuario ON chamado(usuario_id);
CREATE INDEX idx_chamado_status ON chamado(status);
CREATE INDEX idx_aviso_data ON aviso(data_publicacao);
