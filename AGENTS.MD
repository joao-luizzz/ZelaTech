# AGENTS.md — Diretrizes para IA no Projeto ZelaTech

## 🧠 1. Contexto e Domínio

Você está atuando como assistente de desenvolvimento para o **ZelaTech**, um sistema web de gestão de chamados de manutenção para condomínios residenciais, desenvolvido como projeto acadêmico na FATEC Praia Grande para a disciplina de Programação Orientada a Objetos (Prof. Pupo).

### Stack obrigatória (não sugerir alternativas)
- **Back-end:** Java 17+, Jakarta Servlets, JDBC puro (sem ORM como Hibernate/JPA)
- **Servidor:** Apache Tomcat 10+
- **Banco de Dados:** MySQL 8+
- **Front-end:** JSP, JSTL, Expression Language (EL), Tailwind CSS
- **Segurança:** SHA-256 para hashing de senhas, `PreparedStatement` obrigatório

### Perfis de usuário (RBAC)
| Perfil | Regra de criação | Permissões |
|--------|-----------------|------------|
| `SINDICO` | Primeiro usuário cadastrado no sistema | Acesso total: gerencia chamados, altera status, publica/exclui avisos, vê tudo |
| `MORADOR` | Todos os cadastros subsequentes | Acesso restrito: abre chamados, vê apenas os próprios, lê o mural |

### Regras de negócio inegociáveis
1. O fluxo de status de chamado é **estritamente unidirecional**: `ABERTO` → `EM_ANDAMENTO` → `RESOLVIDO`. Retroceder é proibido e deve ser bloqueado no back-end.
2. Toda alteração de status gera um registro imutável na tabela `historico_status` com `data_alteracao` e `usuario_id` do síndico.
3. O chamado é sempre associado ao morador que o criou via `usuario_id` (FK).
4. Fotos de chamados: salvar no sistema de arquivos do servidor (`/uploads/chamados/`), persistir apenas o path (`foto_path`) no banco.

---

## 👥 2. Equipe e Responsabilidades

| Integrante | Papel | Responsabilidades no código |
|:-----------|:------|:---------------------------|
| **João Luiz** | Lead Architect / Back-end | Arquitetura MVC geral, Servlets (Controllers), integração entre camadas |
| **Andrey Kerges** | Front-end Developer | Views (JSP), estilização Tailwind CSS, usabilidade e responsividade |
| **Vitor Augusto** | DBA / Model Layer | Modelagem do banco, scripts SQL (`/db/`), implementação dos DAOs (JDBC) |
| **Alexandre Hesse** | DevOps & QA | Configuração Tomcat/GitHub, testes, segurança e documentação |

---

## 🏗️ 3. Padrões de Arquitetura (MVC) — Regras de Codificação

### Controllers (Servlets)
- Servlets ficam em `br.fatec.zelatech.controllers`
- Nomenclatura: `[Entidade]Servlet.java` (ex: `ChamadoServlet`, `LoginServlet`, `AvisoServlet`)
- Responsabilidade única: **validar parâmetros da requisição e delegar ao DAO**. Zero lógica de negócio ou SQL direto no Servlet
- Usar `HttpSession` para gerenciar sessão e controle RBAC; verificar o perfil do usuário no início de **todo** método `doGet` e `doPost` que exija autenticação
- Redirecionar para `/login` via `response.sendRedirect()` se a sessão for inválida

### Views (JSP)
- JSPs ficam em `src/main/webapp/WEB-INF/views/`
- **Proibido Scriptlets** (`<% %>`). Usar exclusivamente JSTL (`<c:if>`, `<c:forEach>`, `<c:out>`) e Expression Language (`${bean.campo}`)
- Sempre usar `<c:out value="${dado}"/>` ao renderizar dados vindos do banco para evitar XSS
- Tailwind CSS: usar a CDN para desenvolvimento local (Play CDN) ou o arquivo compilado em `css/`

### Model (DAOs + POJOs)
- POJOs ficam em `br.fatec.zelatech.models` (ex: `Usuario.java`, `Chamado.java`, `Aviso.java`, `HistoricoStatus.java`)
- DAOs ficam em `br.fatec.zelatech.dao` (ex: `UsuarioDAO.java`, `ChamadoDAO.java`)
- **Obrigatório `try-with-resources`** em toda operação JDBC para garantir fechamento de `Connection`, `PreparedStatement` e `ResultSet`
- **Zero concatenação de strings em queries SQL.** Uso exclusivo de `PreparedStatement` com parâmetros posicionais (`?`)
- Conexão com banco via `DatabaseConnection.java` em `br.fatec.zelatech.util` (lê de `config.properties`)

### Utilitários
- `br.fatec.zelatech.util.HashSenha` — hashing SHA-256
- `br.fatec.zelatech.util.DatabaseConnection` — fábrica de conexões JDBC
- Credenciais de banco **nunca em hardcode** — sempre via `src/main/resources/config.properties` (arquivo não versionado, listado no `.gitignore`)

---

## 🔒 4. Segurança — Checklist Obrigatório

Antes de gerar ou sugerir qualquer código, mentalmente verifique:

| Ponto | Regra |
|-------|-------|
| SQL Injection | Todo parâmetro de entrada usa `PreparedStatement`. Nunca `Statement` com concatenação |
| XSS | Todo output em JSP usa `<c:out>`. Nunca `${param.x}` direto no HTML |
| RBAC | Servlet verifica `session.getAttribute("perfil")` antes de qualquer operação privilegiada |
| Upload | Validar tipo MIME (aceitar apenas `image/jpeg` e `image/png`) e tamanho máximo de 5MB; rejeitar extensões executáveis |
| Directory Traversal | Nunca usar o nome de arquivo enviado pelo usuário diretamente no path. Gerar UUID para o nome do arquivo no servidor |
| Senhas | Hash SHA-256 antes de persistir. Nunca salvar ou logar em plain text |
| Sessão | Invalidar sessão no logout (`session.invalidate()`) |
| Credenciais | `config.properties` fora do controle de versão |

---

## 📁 5. Estrutura de Pacotes de Referência

```
ZelaTech/
├── src/main/java/br/fatec/zelatech/
│   ├── controllers/    # Servlets
│   ├── models/         # POJOs
│   ├── dao/            # Data Access Objects (JDBC)
│   └── util/           # HashSenha, DatabaseConnection
├── src/main/webapp/
│   ├── WEB-INF/
│   │   ├── views/      # Arquivos .jsp
│   │   └── web.xml
│   ├── css/            # Tailwind compilado
│   ├── img/
│   └── uploads/        # Fotos de chamados (não versionado)
├── src/main/resources/
│   └── config.properties  # NÃO versionar
└── db/
    └── database.sql    # Script DDL completo
```

---

## 🗺️ 6. Endpoints e Mapeamentos de Servlet

| URL Pattern | Servlet | GET | POST |
|-------------|---------|-----|------|
| `/login` | `LoginServlet` | Exibe formulário de login | Processa autenticação |
| `/cadastro` | `CadastroServlet` | Exibe formulário de cadastro | Salva novo usuário |
| `/logout` | `LogoutServlet` | Invalida sessão e redireciona | — |
| `/dashboard` | `DashboardServlet` | Exibe mural de avisos | — |
| `/chamados` | `ChamadoServlet` | Lista chamados (escopo por perfil) | Cria novo chamado |
| `/chamados/detalhe` | `ChamadoDetalheServlet` | Exibe detalhe + histórico | Atualiza status (Síndico) |
| `/mural` | `MuralServlet` | Lista avisos | Cria novo aviso (Síndico) |
| `/mural/excluir` | `MuralServlet` | — | Exclui aviso (Síndico) |

---

## 🗄️ 7. Modelo de Dados Completo (ENUMs e Tipos)

### ENUMs do banco (usar exatamente esses valores no Java também)

```sql
-- perfil
ENUM('MORADOR', 'SINDICO')

-- categoria (chamado)
ENUM('ELETRICA', 'HIDRAULICA', 'ESTRUTURAL', 'LIMPEZA', 'OUTRO')

-- prioridade (chamado)
ENUM('BAIXA', 'MEDIA', 'ALTA')

-- status (chamado e histórico)
ENUM('ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO')
```

> ⚠️ Os valores dos ENUMs Java (`enum Status { ABERTO, EM_ANDAMENTO, RESOLVIDO }`) devem ser idênticos aos do banco para evitar inconsistências na conversão DAO ↔ ResultSet.

---

## 🔍 8. Prompt de Auditoria de Segurança

Use este prompt ao revisar código gerado:

```
Faça uma auditoria de segurança no código ZelaTech focando nos seguintes pontos:

1. RBAC — Há algum Servlet que não verifica session.getAttribute("perfil") antes de executar
   operações restritas ao SÍNDICO?

2. SQL Injection — Existe alguma query usando concatenação de string em vez de PreparedStatement?

3. XSS — Há alguma JSP que renderiza dados do banco ou de parâmetros sem usar <c:out>?

4. Upload — O código valida tipo MIME e tamanho do arquivo? O nome final do arquivo no servidor
   é gerado pelo sistema (UUID) ou usa o nome enviado pelo usuário?

5. Directory Traversal — O path de destino do upload é construído com File.separator e um
   diretório fixo, impedindo navegação fora de /uploads/chamados/?

6. Sessão — O logout chama session.invalidate()?

7. Credenciais — Há algum dado de conexão (URL, usuário, senha) hardcoded no código Java?

Aponte o arquivo, linha e a correção recomendada para cada problema encontrado.
```

---

## ✅ 9. O que NÃO fazer (restrições explícitas)

- ❌ Não sugerir JPA, Hibernate, Spring, Spring Boot ou qualquer framework fora da stack definida
- ❌ Não usar Scriptlets JSP (`<% %>`)
- ❌ Não usar `Statement` para queries com parâmetros dinâmicos
- ❌ Não hardcodar credenciais de banco
- ❌ Não deixar `Connection`, `PreparedStatement` ou `ResultSet` fora de `try-with-resources`
- ❌ Não permitir que o status de um chamado retroceda
- ❌ Não salvar arquivos de foto com o nome original enviado pelo usuário (risco de Directory Traversal)
- ❌ Não renderizar `${param.x}` ou `${bean.campo}` direto em HTML sem `<c:out>`
