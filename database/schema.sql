-- Script de Criação do Banco de Dados ZelaTech (MySQL)
-- Padronização: snake_case / ------------scrits, estrutura de relacionamentos e testes 

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    apartamento VARCHAR(20) NOT NULL,
    perfil VARCHAR(20) NOT NULL -- Enums: MORADOR, SINDICO, ADMIN
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

CREATE TABLE IF NOT EXISTS solicitacao_cadastro_sindico (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE', -- PENDENTE, APROVADO, REJEITADO
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ata_eleicao_path VARCHAR(300) NOT NULL,
    documento_identidade_path VARCHAR(300) NOT NULL,
    parecer_admin TEXT,
    CONSTRAINT fk_solicitacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE INDEX idx_solicitacao_status ON solicitacao_cadastro_sindico(status);

CREATE TABLE IF NOT EXISTS area_comum (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    capacidade INT NOT NULL,
    hora_abertura TIME NOT NULL,
    hora_fechamento TIME NOT NULL,
    valor_taxa DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO' -- ATIVO, INATIVO
);

CREATE TABLE IF NOT EXISTS reserva (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    area_comum_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    data_evento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AGENDADA', -- AGENDADA, CANCELADA, CONCLUIDA
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reserva_area FOREIGN KEY (area_comum_id) REFERENCES area_comum(id),
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE INDEX idx_reserva_data ON reserva(data_evento);
CREATE INDEX idx_reserva_area ON reserva(area_comum_id);
