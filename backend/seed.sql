-- Limpar dados anteriores
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE historico_status;
TRUNCATE TABLE chamado;
TRUNCATE TABLE aviso;
TRUNCATE TABLE usuario;
SET FOREIGN_KEY_CHECKS = 1;

-- USUÁRIOS
-- Senha de todos: 123456
INSERT INTO usuario (nome, email, senha, apartamento, perfil) VALUES
('Carlos Sindico', 'sindico@zelatech.com', '$2a$10$WkgG93tyToNcriliobZRZuIW6f6Xuw6FgORBqeLNNejEXXCl8NGOO', '101', 'SINDICO'),
('Maria Silva', 'maria@gmail.com', '$2a$10$WkgG93tyToNcriliobZRZuIW6f6Xuw6FgORBqeLNNejEXXCl8NGOO', '202', 'MORADOR'),
('João Oliveira', 'joao@gmail.com', '$2a$10$WkgG93tyToNcriliobZRZuIW6f6Xuw6FgORBqeLNNejEXXCl8NGOO', '303', 'MORADOR'),
('Ana Costa', 'ana@gmail.com', '$2a$10$WkgG93tyToNcriliobZRZuIW6f6Xuw6FgORBqeLNNejEXXCl8NGOO', '404', 'MORADOR'),
('Pedro Santos', 'pedro@gmail.com', '$2a$10$WkgG93tyToNcriliobZRZuIW6f6Xuw6FgORBqeLNNejEXXCl8NGOO', '505', 'MORADOR');

-- AVISOS
INSERT INTO aviso (titulo, conteudo, sindico_id) VALUES
('Reunião de Condomínio', 'Reunião extraordinária na próxima terça às 19h no salão de festas. Presença obrigatória.', 1),
('Manutenção do Elevador', 'O elevador ficará em manutenção na quinta-feira das 08h às 14h. Pedimos desculpas.', 1),
('Festa Junina do Condomínio', 'Neste sábado teremos nossa festa junina no jardim. Traga sua família!', 1),
('Reajuste da Taxa Condominial', 'Informamos que a partir do próximo mês haverá reajuste de 8% na taxa mensal.', 1);

-- CHAMADOS
INSERT INTO chamado (titulo, descricao, categoria, prioridade, status, foto_path, usuario_id, data_abertura) VALUES
('Lâmpada queimada no corredor', 'A lâmpada do corredor do 2º andar está queimada há 3 dias.', 'ELETRICA', 'BAIXA', 'ABERTO', 'uploads/chamados/seed-lampada.png', 2, '2005-04-22 10:00:00'),
('Vazamento na garagem', 'Há um vazamento vindo do teto da vaga 45, molhando o carro.', 'HIDRAULICA', 'ALTA', 'EM_ANDAMENTO', 'uploads/chamados/seed-vazamento.png', 3, '2005-04-22 10:00:00'),
('Rachadura na parede', 'Apareceu uma rachadura na parede da escada entre o 3º e 4º andar.', 'ESTRUTURAL', 'ALTA', 'ABERTO', 'uploads/chamados/seed-rachadura.png', 4, '2005-04-22 10:00:00'),
('Lixo acumulado na garagem', 'Há lixo acumulado próximo às vagas 10 a 15 há mais de uma semana.', 'LIMPEZA', 'MEDIA', 'RESOLVIDO', 'uploads/chamados/seed-lixo.png', 5, '2005-04-22 10:00:00'),
('Portão da garagem com defeito', 'O portão eletrônico está abrindo sozinho durante a madrugada.', 'ELETRICA', 'ALTA', 'EM_ANDAMENTO', 'uploads/chamados/seed-portao.png', 2, '2005-04-22 10:00:00'),
('Infiltração no teto', 'Mancha de infiltração aparecendo no teto do meu apartamento 404.', 'HIDRAULICA', 'MEDIA', 'ABERTO', 'uploads/chamados/seed-infiltracao.png', 4, '2005-04-22 10:00:00'),
('Interfone sem funcionar', 'O interfone do apartamento 303 não está funcionando.', 'ELETRICA', 'MEDIA', 'ABERTO', 'uploads/chamados/seed-interfone.png', 3, '2005-04-22 10:00:00');

-- HISTÓRICO DE STATUS
INSERT INTO historico_status (chamado_id, status_anterior, status_novo, usuario_id) VALUES
(2, 'ABERTO', 'EM_ANDAMENTO', 1),
(4, 'ABERTO', 'EM_ANDAMENTO', 1),
(4, 'EM_ANDAMENTO', 'RESOLVIDO', 1),
(5, 'ABERTO', 'EM_ANDAMENTO', 1);
