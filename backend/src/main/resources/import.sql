-- ZelaTech - Scripts de População para Testes
-- Responsável: Vitor Augusto (DBA)

USE zelatech_db;

-- Limpeza de dados (Executar com cautela)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE historico_status;
TRUNCATE TABLE chamado;
TRUNCATE TABLE aviso;
TRUNCATE TABLE usuario;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USUÁRIOS (Senha padrão: 123456)
-- O hash BCrypt permite que o login funcione via API
INSERT INTO usuario (id, nome, email, senha, apartamento, perfil) VALUES 
(1, 'João Síndico', 'sindico@email.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uy573U9EnYy4pSp9fPToW2Gf.pZfL7F6', '101-A', 'ROLE_SINDICO'),
(2, 'Vitor Augusto', 'vitor@email.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uy573U9EnYy4pSp9fPToW2Gf.pZfL7F6', '202-B', 'ROLE_MORADOR'),
(3, 'Ana Souza', 'ana@email.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uy573U9EnYy4pSp9fPToW2Gf.pZfL7F6', '303-C', 'ROLE_MORADOR'),
(4, 'Carlos Lima', 'carlos@email.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uy573U9EnYy4pSp9fPToW2Gf.pZfL7F6', '404-D', 'ROLE_MORADOR');

-- 2. AVISOS (Ações do Síndico)
INSERT INTO aviso (titulo, conteudo, data_publicacao, sindico_id) VALUES 
('Manutenção de Elevadores', 'O elevador do bloco A ficará parado amanhã das 08h às 12h.', NOW(), 1),
('Festa Junina', 'Nossa festa será no próximo sábado às 19h no salão de festas!', NOW(), 1);

-- 3. CHAMADOS (Ações dos Moradores)
INSERT INTO chamado (titulo, descricao, categoria, prioridade, status, data_abertura, usuario_id) VALUES 
('Lâmpada Queimada', 'A lâmpada do corredor do 2º andar está queimada.', 'ELETRICA', 'BAIXA', 'ABERTO', NOW(), 2),
('Vazamento Garagem', 'Há um vazamento de água na vaga 45 da garagem.', 'HIDRAULICA', 'ALTA', 'EM_ANDAMENTO', NOW(), 3),
('Interfone Mudo', 'Meu interfone não está recebendo chamadas da portaria.', 'OUTRO', 'MEDIA', 'ABERTO', NOW(), 4);

-- 4. HISTÓRICO DE STATUS (Auditoria)
INSERT INTO historico_status (chamado_id, usuario_id, status_anterior, status_novo, data_alteracao) VALUES 
(2, 1, 'ABERTO', 'EM_ANDAMENTO', NOW());
