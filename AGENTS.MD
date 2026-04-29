# AGENTS.md — Diretrizes para IA no Projeto ZelaTech

## 🧠 1. Contexto e Domínio

Você está atuando como assistente de desenvolvimento para o **ZelaTech**, um sistema web moderno de gestão de chamados de manutenção para condomínios residenciais. 
O projeto migrou para uma arquitetura baseada em **API RESTful** e **Single Page Application (SPA)**.

### Stack obrigatória (não sugerir alternativas legadas)
- **Back-end:** Java 17+, Spring Boot 3+, Spring Data JPA, Spring Security (JWT)
- **Banco de Dados:** MySQL 8+
- **Front-end:** React (Vite ou Next.js), TypeScript, Tailwind CSS
- **Integração:** Axios ou Fetch API
- **Segurança:** Autenticação via JWT, senhas com hash BCrypt

### Perfis de usuário (RBAC via Spring Security)
| Perfil | Regra de criação | Permissões |
|--------|-----------------|------------|
| `ROLE_SINDICO` | Primeiro usuário cadastrado no sistema | Acesso total: gerencia chamados, altera status, publica/exclui avisos |
| `ROLE_MORADOR` | Todos os cadastros subsequentes | Acesso restrito: abre chamados, vê apenas os próprios, lê o mural |

### Regras de negócio inegociáveis
1. O fluxo de status de chamado é **estritamente unidirecional**: `ABERTO` → `EM_ANDAMENTO` → `RESOLVIDO`. Retroceder é proibido e deve ser validado no nível de Service.
2. Toda alteração de status gera um registro imutável na tabela `historico_status`. A transação (`@Transactional`) deve salvar o status no chamado e o registro no histórico na mesma operação.
3. O chamado é sempre associado ao morador que o criou via `usuario_id` (FK).
4. Fotos de chamados: salvar no sistema de arquivos do servidor, persistir apenas o path (`foto_path`) no banco, protegido contra Directory Traversal.

---

## 👥 2. Equipe e Responsabilidades

| Integrante | Papel | Responsabilidades no código |
|:-----------|:------|:---------------------------|
| **João Luiz** | Lead Architect / Back-end | API REST, Spring Boot Controllers, Services, DTOs, Spring Security (JWT), integração de regras de negócio |
| **Andrey Kerges** | Front-end Developer | SPA React, Consumo de API (Axios), Componentização, Tailwind CSS, Zustand/Context API para estado |
| **Vitor Augusto** | DBA / Model Layer | Entidades do Spring Data JPA (`@Entity`), Mapeamento ORM, Repositories (`JpaRepository`), scripts SQL |
| **Alexandre Hesse** | DevOps & QA | Configuração CORS, Deploy, Testes (JUnit/Jest), CI/CD, documentação geral |

---

## 🏗️ 3. Padrões de Arquitetura — Regras de Codificação

### Controllers REST (`br.fatec.zelatech.backend.controller`)
- Nomenclatura: `[Entidade]Controller.java`.
- Responsabilidade: Anotados com `@RestController` e `@RequestMapping("/api/v1/...")`. Lidam puramente com HTTP Requests, validam payloads via `@Valid` (DTOs) e chamam os Services. Retornam `ResponseEntity`.

### Services (`br.fatec.zelatech.backend.service`)
- Nomenclatura: `[Entidade]Service.java`.
- Responsabilidade: Anotados com `@Service`. Toda a lógica de negócio pesada, validações de domínio (ex: impedir status retroceder) e injeção de Repositories. Métodos de escrita anotados com `@Transactional`.

### Repositories (`br.fatec.zelatech.backend.repository`)
- Nomenclatura: `[Entidade]Repository.java`.
- Responsabilidade: Interfaces que estendem `JpaRepository`. Proibido escrever JDBC manual.

### DTOs (`br.fatec.zelatech.backend.dto`)
- Nunca trafegar as entidades `@Entity` diretamente nas respostas ou requisições. Usar DTOs e Records.

---

## 🔒 4. Segurança — Checklist Obrigatório

Antes de gerar ou sugerir qualquer código, mentalmente verifique:

| Ponto | Regra |
|-------|-------|
| SQL Injection | O uso de JPA/Hibernate e métodos do `JpaRepository` previne isso. Jamais construir HQL concatenando strings. |
| XSS | O React faz escape automático nativamente, mas o backend não deve confiar nos dados e deve validar o payload (Spring Validation). |
| RBAC | As rotas sensíveis e métodos do Service estão protegidos por `@PreAuthorize("hasRole('SINDICO')")` ou configuração do `SecurityFilterChain`? |
| Senhas | Nunca salvar ou trafegar senhas puras em logs ou na base de dados. `PasswordEncoder` (BCrypt) obrigatório. |
| CORS | O Spring Boot está configurado via `WebMvcConfigurer` para aceitar requisições da porta do frontend (ex: localhost:5173)? |
| JWT | O secret do JWT e senha do BD não devem estar hardcoded. Devem ser lidos do `.env` e carregados no `application.properties` com sintaxe `${VAR_NAME}`. |

---

## 📁 5. Estrutura de Pacotes de Referência (Backend)

```
backend/
├── src/main/java/br/fatec/zelatech/backend/
│   ├── config/         # Configurações globais (CORS, SecurityConfig, etc)
│   ├── controller/     # Endpoints REST
│   ├── dto/            # Records ou classes de transferência de dados
│   ├── model/          # Entidades mapeadas ao banco (@Entity)
│   ├── repository/     # Interfaces JpaRepository
│   ├── security/       # Filtros JWT, serviços de autenticação
│   ├── service/        # Lógica de negócios
│   └── BackendApplication.java
└── src/main/resources/
    ├── application.properties          # Carrega credenciais do .env via ${VAR}
    └── application.properties.example  # Template base (sem senhas reais)
```

---

## 🔍 6. Prompt de Auditoria de Segurança

Use este prompt ao revisar código gerado:

```
Faça uma auditoria de segurança na nova API Spring Boot focando nos seguintes pontos:

1. RBAC — Há algum Controller ou Service que permite a um MORADOR realizar uma ação exclusiva de SÍNDICO?
2. CORS — A configuração permite todas as origens (*)? O ideal é restringir.
3. Exposição — Há algum endpoint retornando a Entidade diretamente (contendo hash de senha) em vez de um DTO limpo?
4. Tratamento de Erros — O `@ExceptionHandler` genérico vaza stacktrace em formato JSON?
5. Validação — Os payloads de POST/PUT estão usando anotações como @Valid, @NotBlank e @Size nos DTOs?

Aponte o arquivo, linha e a correção recomendada para cada problema encontrado.
```

---

## ✅ 7. O que NÃO fazer (restrições explícitas)

- ❌ Não sugerir ou voltar a escrever Servlets clássicos, `HttpServletRequest/Response` ou `web.xml`.
- ❌ Não usar JDBC puro ou `try-with-resources` para queries. O ecossistema agora é Spring Data JPA.
- ❌ Não trafegar entidades (`@Entity`) diretamente. Crie DTOs.
- ❌ Não gerenciar sessões stateful (`HttpSession`). A API deve ser Stateless e usar JWT.
- ❌ Não usar HTML/JSP no backend. Toda renderização visual pertence ao frontend (React).
- ❌ Não adicionar arquivos estáticos (`CSS/JS/Imagens`) dentro da pasta resources do Spring Boot (pois o React terá seu próprio projeto).
