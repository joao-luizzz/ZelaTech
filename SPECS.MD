# Especificações Técnicas (SPECS) — ZelaTech

## 1. Arquitetura do Sistema

O projeto utiliza o padrão **MVC (Model-View-Controller)** nativo do ecossistema Java Web:

- **Model:** Classes POJO (entidades de domínio) e classes DAO (Data Access Object) com JDBC puro para persistência.
- **View:** Páginas JSP com JSTL e Expression Language (EL). Estilização via Tailwind CSS. Proibido Scriptlets.
- **Controller:** Servlets Jakarta EE para processar requisições HTTP, validar entradas e gerenciar fluxo de navegação.

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Linguagem | Java | 17+ |
| Container | Apache Tomcat | 10+ |
| API Web | Jakarta Servlets | — |
| Persistência | JDBC puro | — |
| Banco de Dados | MySQL | 8.0+ |
| View | JSP + JSTL | — |
| Estilização | Tailwind CSS | 3.4 |

---

## 3. Modelagem de Dados

### 3.1 Usuário

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|-----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `nome` | VARCHAR(150) | Sim | — |
| `email` | VARCHAR(150) UNIQUE | Sim | Usado como login |
| `senha` | VARCHAR(255) | Sim | Hash SHA-256 |
| `apartamento` | VARCHAR(20) | Sim | Número da unidade |
| `perfil` | ENUM('MORADOR','SINDICO') | Sim | Primeiro cadastro = SINDICO |

### 3.2 Chamado

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|-----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `titulo` | VARCHAR(100) | Sim | Máx. 100 caracteres |
| `descricao` | VARCHAR(500) | Sim | Máx. 500 caracteres |
| `categoria` | ENUM('ELETRICA','HIDRAULICA','ESTRUTURAL','LIMPEZA','OUTRO') | Sim | — |
| `prioridade` | ENUM('BAIXA','MEDIA','ALTA') | Sim | — |
| `status` | ENUM('ABERTO','EM_ANDAMENTO','RESOLVIDO') | Sim | Padrão: ABERTO |
| `foto_path` | VARCHAR(300) | Não | Caminho no servidor |
| `data_abertura` | DATETIME | Sim | Preenchida automaticamente |
| `usuario_id` | INT (FK → usuario.id) | Sim | Morador que abriu o chamado |

### 3.3 HistoricoStatus

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|-----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `chamado_id` | INT (FK → chamado.id) | Sim | — |
| `status_anterior` | ENUM('ABERTO','EM_ANDAMENTO','RESOLVIDO') | Sim | — |
| `status_novo` | ENUM('ABERTO','EM_ANDAMENTO','RESOLVIDO') | Sim | — |
| `data_alteracao` | DATETIME | Sim | Preenchida automaticamente |
| `usuario_id` | INT (FK → usuario.id) | Sim | Síndico que realizou a alteração |

### 3.4 Aviso

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|-----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `titulo` | VARCHAR(100) | Sim | Máx. 100 caracteres |
| `conteudo` | VARCHAR(1000) | Sim | Máx. 1000 caracteres |
| `data_publicacao` | DATETIME | Sim | Preenchida automaticamente |
| `sindico_id` | INT (FK → usuario.id) | Sim | Síndico que publicou |

### 3.5 Diagrama Entidade-Relacionamento

```
┌─────────────────┐     ┌───────────────────┐     ┌─────────────────────┐
│    usuario      │     │      chamado      │     │   historico_status  │
├─────────────────┤     ├───────────────────┤     ├─────────────────────┤
│ id (PK)         │──<  │ id (PK)           │──<  │ id (PK)             │
│ nome            │     │ titulo            │     │ chamado_id (FK)     │
│ email (Unique)  │     │ descricao         │     │ status_anterior     │
│ senha           │     │ categoria         │     │ status_novo         │
│ apartamento     │     │ prioridade        │     │ data_alteracao      │
│ perfil          │     │ status            │     │ usuario_id (FK)     │
└────────┬────────┘     │ foto_path         │     └─────────────────────┘
         │              │ data_abertura     │
         │              │ usuario_id (FK)   │
         │              └───────────────────┘
         │
         │  ┌─────────────────┐
         └─<│     aviso       │
            ├─────────────────┤
            │ id (PK)         │
            │ titulo          │
            │ conteudo        │
            │ data_publicacao │
            │ sindico_id (FK) │
            └─────────────────┘
```

---

## 4. Endpoints e Mapeamentos de Servlet

| URL Pattern | Servlet | Método | Descrição |
|-------------|---------|--------|-----------|
| `/login` | `LoginServlet` | GET | Exibe formulário de login |
| `/login` | `LoginServlet` | POST | Autentica usuário, cria `HttpSession` |
| `/cadastro` | `CadastroServlet` | GET | Exibe formulário de cadastro |
| `/cadastro` | `CadastroServlet` | POST | Registra novo usuário |
| `/logout` | `LogoutServlet` | GET | Invalida sessão e redireciona para `/login` |
| `/dashboard` | `DashboardServlet` | GET | Exibe mural de avisos (todos os perfis) |
| `/chamados` | `ChamadoServlet` | GET | Listagem de chamados (morador: próprios; síndico: todos) |
| `/chamados` | `ChamadoServlet` | POST | Abre novo chamado (Morador) |
| `/chamados/detalhe` | `ChamadoDetalheServlet` | GET | Detalhe do chamado + histórico de status |
| `/chamados/detalhe` | `ChamadoDetalheServlet` | POST | Atualiza status do chamado (Síndico) |
| `/mural` | `MuralServlet` | GET | Lista avisos |
| `/mural` | `MuralServlet` | POST | Cria novo aviso (Síndico) |
| `/mural/excluir` | `MuralServlet` | POST | Exclui aviso (Síndico) |

---

## 5. Regras de Negócio e Validações

### Fluxo de Status
```
ABERTO  →  EM_ANDAMENTO  →  RESOLVIDO
```
- Unidirecional: retroceder é inválido e deve ser rejeitado no Servlet com erro HTTP 403 ou redirecionamento com mensagem de erro.
- Toda transição persiste um registro em `historico_status` imediatamente após o UPDATE em `chamado`.

### Validações de Entrada
| Campo | Regra |
|-------|-------|
| E-mail | Formato válido (`^[^@]+@[^@]+\.[^@]+`); único no banco |
| Senha | Mínimo 6 caracteres |
| Título (chamado/aviso) | Não vazio; máx. 100 caracteres |
| Descrição | Não vazia; máx. 500 caracteres |
| Conteúdo (aviso) | Não vazio; máx. 1000 caracteres |
| Foto | MIME type: `image/jpeg` ou `image/png`; tamanho máx. 5MB; opcional |

### Regras de Acesso (RBAC)
- Servlet verifica `session.getAttribute("perfil")` em todo endpoint protegido.
- Morador que tentar acessar endpoint de síndico recebe redirecionamento com mensagem de acesso negado.
- Requisição sem sessão válida redireciona para `/login`.

---

## 6. Segurança

| Ameaça | Mitigação |
|--------|-----------|
| SQL Injection | `PreparedStatement` obrigatório em todos os DAOs |
| XSS | `<c:out>` em todas as saídas de dados nas JSPs |
| Senhas em plain text | Hash SHA-256 via `HashSenha.java` antes de persistir |
| Upload malicioso | Validação de MIME type + tamanho; nome do arquivo gerado por UUID no servidor |
| Directory Traversal | Path de upload construído com diretório fixo + UUID, nunca com o nome original |
| Credenciais expostas | `config.properties` não versionado (`.gitignore`) |
| Sessão não encerrada | `session.invalidate()` no logout |

---

## 7. Padrões de Código

### DAO (JDBC)
```java
// Padrão obrigatório de try-with-resources
public Chamado buscarPorId(int id) throws SQLException {
    String sql = "SELECT * FROM chamado WHERE id = ?";
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setInt(1, id);
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return mapearChamado(rs);
            }
        }
    }
    return null;
}
```

### JSP (sem Scriptlets)
```jsp
<%-- CORRETO --%>
<c:forEach var="chamado" items="${chamados}">
    <td><c:out value="${chamado.titulo}"/></td>
</c:forEach>

<%-- PROIBIDO --%>
<% for (Chamado c : chamados) { %>
    <td><%= c.getTitulo() %></td>
<% } %>
```

### Upload de Foto
```java
// Nome do arquivo gerado pelo sistema, nunca o original do usuário
String nomeArquivo = UUID.randomUUID().toString() + ".jpg";
String uploadDir = getServletContext().getRealPath("/uploads/chamados/");
Path destino = Paths.get(uploadDir, nomeArquivo); // sem concatenação insegura
Files.copy(part.getInputStream(), destino);
```