# Matriz de Requisitos — ZelaTech

## 1. Requisitos Funcionais (RF)

| ID | Funcionalidade | Descrição | Ator | Prioridade |
|:---|:---|:---|:---|:---|
| **RF01** | Cadastro de Usuário | Registrar novo usuário com nome, e-mail (único), senha (mín. 6 caracteres) e número de apartamento. O primeiro cadastro recebe o perfil SÍNDICO; os demais recebem MORADOR. | Todos | Alta |
| **RF02** | Autenticação | Realizar login com e-mail e senha. Após sucesso, redirecionar para a dashboard do perfil correspondente. Em caso de falha, exibir mensagem de erro. | Todos | Alta |
| **RF03** | Logout | Encerrar sessão de forma segura, invalidando a `HttpSession`. | Todos | Alta |
| **RF04** | RBAC | Restringir acesso por perfil: MORADOR acessa apenas recursos próprios; SÍNDICO acessa e gerencia tudo. Requisições não autenticadas redirecionam para login. | Sistema | Alta |
| **RF05** | Visualização do Mural | Exibir avisos publicados na dashboard inicial, ordenados do mais recente para o mais antigo. | Todos | Alta |
| **RF06** | Gestão de Avisos | Criar e excluir comunicados no mural. Cada aviso possui título (máx. 100 caracteres), conteúdo (máx. 1000 caracteres) e data/hora de publicação (automática). | Síndico | Alta |
| **RF07** | Abertura de Chamado | Registrar chamado com título (máx. 100 caracteres), categoria, descrição (máx. 500 caracteres), prioridade e foto opcional (JPEG/PNG, máx. 5MB). O chamado recebe status ABERTO e data/hora de criação automaticamente. | Morador | Alta |
| **RF08** | Status Inicial Automático | Todo chamado criado recebe automaticamente o status `ABERTO` e o timestamp de abertura. | Sistema | Alta |
| **RF09** | Listagem Individual de Chamados | Listar apenas os chamados abertos pelo próprio morador, exibindo título, categoria, data de abertura e status. Ordenar do mais recente para o mais antigo. | Morador | Alta |
| **RF10** | Detalhe do Chamado | Exibir todos os campos do chamado (título, categoria, descrição, foto se houver, status, data de abertura) e o histórico completo de alterações de status. | Todos | Alta |
| **RF11** | Listagem Geral de Chamados | Visualizar todos os chamados do condomínio com filtros por status e categoria. | Síndico | Alta |
| **RF12** | Atualização de Status | Alterar o status de um chamado seguindo o fluxo `ABERTO → EM_ANDAMENTO → RESOLVIDO`. Toda alteração deve registrar data/hora no histórico. O status não pode retroceder. | Síndico | Alta |
| **RF13** | Histórico de Status | Registrar cada alteração de status com status anterior, novo status, data/hora e identificação do autor da alteração. | Sistema | Alta |
| **RF14** | Validação de Dados | Bloquear submissão com campos obrigatórios vazios, e-mails com formato inválido, e-mails já cadastrados e arquivos acima de 5MB ou com tipo MIME inválido. | Sistema | Média |

---

## 2. Requisitos Não Funcionais (RNF)

| ID | Categoria | Descrição |
|:---|:---|:---|
| **RNF01** | Arquitetura | Implementação em Java OO (Servlets/JSP) seguindo o padrão MVC. Proibido uso de frameworks como Spring ou Hibernate. |
| **RNF02** | Persistência | Banco de dados relacional MySQL 8+, acessado via JDBC puro com `PreparedStatement`. Proibido concatenação de strings em queries. |
| **RNF03** | Interface | Design responsivo com HTML5, CSS3 e Tailwind CSS. Proibido Scriptlets JSP (`<% %>`); usar JSTL e Expression Language. |
| **RNF04** | Armazenamento de Arquivos | Fotos salvas no sistema de arquivos do servidor (`/uploads/chamados/`). O banco armazena apenas o path da imagem. Nome do arquivo gerado por UUID no servidor. |
| **RNF05** | Segurança de Senhas | Senhas armazenadas exclusivamente como hash SHA-256. Nunca persistir ou logar senha em texto plano. |
| **RNF06** | Prevenção de SQL Injection | Uso obrigatório de `PreparedStatement` em todas as operações de banco de dados. |
| **RNF07** | Prevenção de XSS | Toda saída de dados em JSP deve usar `<c:out>` para escapar caracteres especiais. |
| **RNF08** | Gestão de Sessão | Sessão gerenciada pelo servidor via `HttpSession`. Logout invalida a sessão com `session.invalidate()`. |
| **RNF09** | Gerenciamento de Recursos JDBC | Uso obrigatório de `try-with-resources` para garantir fechamento de `Connection`, `PreparedStatement` e `ResultSet`. |
| **RNF10** | Credenciais | Dados de conexão com o banco (URL, usuário, senha) armazenados em `config.properties`, nunca em código-fonte. O arquivo não deve ser versionado. |
| **RNF11** | Compatibilidade | Funcionar nos navegadores Chrome e Firefox em suas versões atuais. |
| **RNF12** | Desempenho | Tempo de resposta adequado para ambiente de desenvolvimento e homologação local. |

---

## 3. Fora de Escopo

Os itens abaixo **não serão desenvolvidos** neste projeto:

- Aplicativo móvel nativo (Android/iOS)
- Integração com sistemas de pagamento de condomínio
- Chat em tempo real entre moradores e síndico
- Relatórios com gráficos ou exportação em PDF
- Notificações por e-mail ou SMS
- Edição de avisos já publicados (apenas criação e exclusão)
- Cadastro de novo Síndico por outro Síndico após o primeiro cadastro (fora do escopo da disciplina)

---

## 4. Rastreabilidade RF × Funcionalidade × Caso de Uso

| RF | Funcionalidade | Caso de Uso Relacionado |
|:---|:---|:---|
| RF01 | Cadastro de Usuário | CU — Novo usuário se registra |
| RF02 | Autenticação | CU — Usuário realiza login |
| RF03 | Logout | CU — Usuário encerra sessão |
| RF04 | RBAC | Transversal (todos os CUs protegidos) |
| RF05 | Visualização do Mural | CU — Usuário acessa dashboard |
| RF06 | Gestão de Avisos | CU03 — Síndico publica aviso no mural |
| RF07 | Abertura de Chamado | CU01 — Morador abre um chamado |
| RF08 | Status Inicial Automático | CU01 (pós-condição) |
| RF09 | Listagem Individual | CU — Morador consulta seus chamados |
| RF10 | Detalhe do Chamado | CU — Usuário visualiza chamado |
| RF11 | Listagem Geral | CU — Síndico consulta chamados |
| RF12 | Atualização de Status | CU02 — Síndico atualiza status |
| RF13 | Histórico de Status | CU02 (pós-condição) |
| RF14 | Validação de Dados | Transversal (RF01, RF06, RF07) |