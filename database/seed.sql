-- Script de Seed para ZelaTech
-- Dados de teste realistas

-- Inserindo Usuários (Senhas em texto plano para teste, mas no backend devem ser BCrypt)
INSERT INTO usuario (nome, email, senha, apartamento, perfil) VALUES
('João Síndico', 'sindico@zelatech.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uy573U9EnYy4pSp9fPToW2Gf.pZfL7F6', '101', 'ROLE_SINDICO'),
('Maria Moradora', 'maria@gmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uy573U9EnYy4pSp9fPToW2Gf.pZfL7F6', '202', 'ROLE_MORADOR'),
('Carlos Morador', 'carlos@hotmail.com', '$2a$10$8.UnVuG9HHgffUDAlk8q6uy573U9EnYy4pSp9fPToW2Gf.pZfL7F6', '303', 'ROLE_MORADOR');

-- Inserindo Avisos
INSERT INTO aviso (titulo, conteudo, sindico_id) VALUES
('Reunião de Condomínio', 'Teremos reunião extraordinária na próxima terça às 19h no salão de festas.', 1),
('Manutenção de Elevador', 'O elevador de serviço ficará indisponível entre 08h e 12h do dia 15/05.', 1);

-- Inserindo Chamados
INSERT INTO chamado (titulo, descricao, categoria, prioridade, status, usuario_id) VALUES
('Lâmpada Queimada', 'A lâmpada do corredor do 2º andar está queimada.', 'ELETRICA', 'BAIXA', 'ABERTO', 2),
('Vazamento Garagem', 'Há um vazamento vindo do teto da vaga 45.', 'HIDRAULICA', 'ALTA', 'EM_ANDAMENTO', 3);
-- Inserindo Histórico de Status
INSERT INTO historico_status (chamado_id, status_anterior, status_novo, usuario_id) VALUES
(2, 'ABERTO', 'EM_ANDAMENTO', 1);
