# ZelaTech - Sistema de Gestão de Condomínios

<p align="center">
  <strong>Plataforma ágil para gestão de chamados de manutenção e comunicação entre síndico e moradores.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Servlets-API-007396?logo=java&logoColor=white" alt="Servlets">
  <img src="https://img.shields.io/badge/JSP-View-007396?logo=java&logoColor=white" alt="JSP">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Tomcat-10+-F8DC75?logo=apachetomcat&logoColor=black" alt="Tomcat">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Arquitetura-MVC-blue?logo=architecture&logoColor=white" alt="MVC">
  <img src="https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow" alt="Status">
</p>

---

## Sobre o Projeto

O **ZelaTech** é uma aplicação web desenvolvida para a disciplina de **Programação Orientada a Objetos** na FATEC Praia Grande, sob a orientação do Prof. Pupo.

O sistema elimina o uso de livros de ocorrência de papel ou mensagens informais em grupos de WhatsApp, centralizando a comunicação do condomínio. Moradores podem abrir chamados de manutenção com fotos, enquanto o síndico gerencia os status e publica comunicados oficiais no mural.

### Problema Resolvido

| Antes | Depois (com ZelaTech) |
|-------|--------|
| Reclamações perdidas em grupos de WhatsApp | Tickets formalizados com título, categoria e foto |
| Moradores sem saber se o problema foi visto | Acompanhamento de status (Aberto → Em Andamento → Resolvido) |
| Falta de histórico de manutenção | Histórico completo de alterações com auditoria (quem e quando) |
| Avisos no elevador que ninguém lê | Mural digital visível na tela inicial de todos os moradores |

---

## Arquitetura MVC (Model-View-Controller)

O projeto segue estritamente o padrão arquitetural MVC nativo do ecossistema Java Web:

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND (VIEW)                        │
│                JSP (JavaServer Pages) + Tailwind CSS            │
│                       JSTL & Expression Language                │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP GET/POST Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (CONTROLLER)                       │
│                        Servlets Java                            │
│           (Validação, Gestão de Sessão, Fluxo de Navegação)     │
└─────────────────────────────────────────────────────────────────┘
                              │
                    Objetos Java (POJOs)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         PERSISTÊNCIA (MODEL)                    │
│                        Classes DAO (JDBC puro)                  │
│                     Proteção contra SQL Injection               │
└─────────────────────────────────────────────────────────────────┘
                              │
                        Queries SQL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                           BANCO DE DADOS                        │
│                             MySQL 8                             │
│                  Candidatos | Vagas | Histórico                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Back-end
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Java | 17+ | Linguagem principal, seguindo princípios OO |
| Servlets | Jakarta EE | Controladores (processamento de requisições) |
| JDBC | - | Comunicação direta com o banco de dados |
| Apache Tomcat | 10+ | Servidor de aplicação web |

### Banco de Dados
| Tecnologia | Tipo | Uso |
|------------|------|-----|
| MySQL | Relacional | Persistência de usuários, chamados e histórico (ACID) |

### Front-end
| Tecnologia | Uso |
|------------|-----|
| JSP | Camada de visualização renderizada no servidor |
| Tailwind CSS | Estilização rápida e responsiva |
| JSTL | Lógica de apresentação nas views sem scriplets Java |

---

## Funcionalidades Principais

### Área do Morador
- **Abertura de Chamados:** Registro de ocorrências com categoria (Elétrica, Hidráulica, etc.), prioridade e upload de foto probatória.
- **Minhas Solicitações:** Listagem exclusiva dos próprios chamados com indicador visual de status.

### Área do Síndico
- **Gestão de Tickets:** Visão global de todos os chamados abertos no condomínio com filtros.
- **Atualização de Status:** Fluxo de resolução (`Aberto` → `Em Andamento` → `Resolvido`), gerando rastro de auditoria.
- **Mural de Avisos:** Criação e exclusão de comunicados oficiais disparados para todos os moradores.

### Segurança & Controle
- **RBAC (Role-Based Access Control):** O primeiro usuário cadastrado torna-se Síndico; os demais assumem o perfil Morador.
- **Criptografia de Senhas:** Hashes seguros (SHA-256) em vez de texto puro.
- **Prevenção contra Injeção SQL:** Uso exclusivo de `PreparedStatement` em transações de banco.
- **Proteção de Uploads:** Fotos salvas no servidor físico (diretório seguro), gravando apenas a string de referência no banco.

---

## Modelo de Dados (Relacional)

O banco é estruturado para suportar histórico transacional das manutenções:

```sql
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Usuário      │     │    Chamado      │     │ HistóricoStatus │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │ ──< │ id (PK)         │ ──< │ id (PK)         │
│ nome            │     │ titulo          │     │ chamado_id (FK) │
│ email (Unique)  │     │ categoria       │     │ usuario_id (FK) │
│ senha           │     │ status          │     │ status_anterior │
│ apartamento     │     │ foto_path       │     │ status_novo     │
│ perfil          │     │ usuario_id (FK) │     │ data_alteracao  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                 ^
                                 │
                        ┌─────────────────┐
                        │     Aviso       │
                        ├─────────────────┤
                        │ id (PK)         │
                        │ titulo          │
                        │ conteudo        │
                        │ sindico_id (FK) │
                        └─────────────────┘
```

---

## Como Executar Localmente

### Pré-requisitos
- JDK 17
- MySQL Server 8.0
- Apache Tomcat 10+
- IDE compatível (Eclipse, IntelliJ IDEA, VS Code)

### Passos de Configuração

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/ZelaTech.git
cd ZelaTech
```

2. **Configure o Banco de Dados**
- Abra o MySQL Workbench e execute o script localizado em `/db/database.sql`.
- Configure as variáveis de conexão (URL, usuário e senha) no arquivo `src/main/resources/config.properties`.

3. **Deploy no Tomcat**
- Configure o Tomcat na sua IDE apontando para o diretório de build do projeto.
- Adicione o projeto ao servidor e inicie o Tomcat (geralmente na porta 8080).

4. **Acesso**
- Acesse `http://localhost:8080/ZelaTech`
- Crie o primeiro usuário (que se tornará o Síndico automaticamente).

---

## Estrutura do Projeto (MVC)

```
ZelaTech/
├── src/
│   ├── main/
│   │   ├── java/br/fatec/zelatech/
│   │   │   ├── controllers/      # Servlets (LoginServlet, ChamadoServlet)
│   │   │   ├── models/           # POJOs (Usuario, Chamado, Aviso)
│   │   │   ├── dao/              # Acesso a banco (UsuarioDAO, ChamadoDAO)
│   │   │   └── util/             # Utilitários (HashSenha, DatabaseConnection)
│   │   │
│   │   ├── webapp/               # Arquivos Web Públicos
│   │   │   ├── WEB-INF/          # Arquivos Web Protegidos
│   │   │   │   ├── views/        # Arquivos JSP (dashboard.jsp, chamados.jsp)
│   │   │   │   └── web.xml       # Descritor de deploy do Tomcat
│   │   │   │
│   │   │   ├── css/              # Arquivos estáticos Tailwind compilado
│   │   │   ├── img/              # Imagens estáticas
│   │   │   └── uploads/          # Diretório local onde fotos são salvas
│   │   │
│   │   └── resources/
│   │       └── config.properties # Credenciais (não versionadas)
│   │
├── db/                           # Scripts SQL de inicialização
├── .gitignore                    # Regras para ignorar .class e /uploads
└── pom.xml (ou build.gradle)     # Dependências (se usar Maven/Gradle)
```

---

## Equipe Desenvolvedora

Discentes da Fatec Praia Grande:
- **João Luiz** - Arquitetura Back-end & Servlets
- **Alexandre Hesse** - Front-end & JSPs
- **Andrey Kerges** - Banco de Dados & DAOs
- **Vitor Augusto** - Documentação & QA

---

<p align="center">
  <sub>Projeto acadêmico para fins de avaliação na disciplina de Programação Orientada a Objetos.</sub>
</p>
