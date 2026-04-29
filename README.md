# ZelaTech - Sistema de Gestão de Condomínios

<p align="center">
  <strong>Plataforma moderna e escalável para gestão de chamados de manutenção e comunicação entre síndico e moradores.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring_Boot-3-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/JWT-Security-000000?logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Arquitetura-API_REST_&_SPA-blue?logo=architecture&logoColor=white" alt="API REST & SPA">
  <img src="https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow" alt="Status">
</p>

---

## Sobre o Projeto

O **ZelaTech** é uma aplicação web desenvolvida como projeto acadêmico para a disciplina de **Programação Orientada a Objetos** na FATEC Praia Grande. O sistema agora utiliza uma arquitetura moderna e desacoplada, servindo como um excelente portfólio Fullstack para o mercado de trabalho.

O sistema elimina o uso de livros de ocorrência de papel ou mensagens informais em grupos de WhatsApp, centralizando a comunicação do condomínio. Moradores podem abrir chamados de manutenção com fotos, enquanto o síndico gerencia os status e publica comunicados oficiais no mural.

### Problema Resolvido

| Antes | Depois (com ZelaTech) |
|-------|--------|
| Reclamações perdidas em grupos de WhatsApp | Tickets formalizados com título, categoria e foto |
| Moradores sem saber se o problema foi visto | Acompanhamento de status (Aberto → Em Andamento → Resolvido) |
| Falta de histórico de manutenção | Histórico completo de alterações com auditoria (quem e quando) |
| Avisos no elevador que ninguém lê | Mural digital visível na tela inicial de todos os moradores |

---

## Arquitetura (REST API + SPA)

O projeto migrou de um MVC legado para uma arquitetura totalmente desacoplada:

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND (SPA)                         │
│                    React + Tailwind CSS                         │
│               (Renderização Dinâmica no Cliente)                │
└─────────────────────────────────────────────────────────────────┘
                               │
                Requisições HTTP REST (Axios/Fetch)
                      Tokens JWT (Bearer)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (API RESTful)                      │
│                          Spring Boot                            │
│           (Controllers REST, Services, Spring Security)         │
└─────────────────────────────────────────────────────────────────┘
                               │
                       Spring Data JPA
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                           BANCO DE DADOS                        │
│                             MySQL 8                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Back-end (Spring Boot)
| Tecnologia | Uso |
|------------|-----|
| Java 17+ | Linguagem principal fortemente tipada |
| Spring Boot 3.x | Framework principal para a API REST |
| Spring Security | Autenticação e Autorização com JWT |
| Spring Data JPA | Abstração e Mapeamento Objeto-Relacional (ORM) |
| Hibernate | Implementação JPA padrão |
| Lombok | Redução de boilerplate (Getters/Setters/Construtores) |

### Banco de Dados
| Tecnologia | Tipo | Uso |
|------------|------|-----|
| MySQL | Relacional | Persistência de dados sensíveis (ACID) |

### Front-end (React)
| Tecnologia | Uso |
|------------|-----|
| React | Biblioteca base para construção de Single Page Applications |
| Tailwind CSS | Estilização utilitária rápida e responsiva |
| Axios | Cliente HTTP para consumo da API |

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
- **RBAC (Role-Based Access Control):** Controle de acesso baseado em Roles (`ROLE_SINDICO` e `ROLE_MORADOR`).
- **Autenticação JWT:** Comunicação Stateless e segura.
- **Criptografia de Senhas:** Hashes seguros via BCrypt (`PasswordEncoder`).
- **Proteção de Uploads:** Validação nativa no Spring, salvando apenas o UUID da imagem.

---

## Como Executar Localmente

### Pré-requisitos
- JDK 17+ instalado
- MySQL Server 8.0
- Node.js (para o frontend)
- Git

### Passos de Configuração do Backend

1. **Clone o repositório e acesse a pasta backend**
```bash
git clone https://github.com/joao-luizzz/ZelaTech.git
cd ZelaTech/backend
```

2. **Configure o Banco de Dados**
- Crie um schema no MySQL chamado `zelatech_db`.
- Ajuste as variáveis de conexão (usuário e senha) no arquivo `src/main/resources/application.properties`.

3. **Inicie o Spring Boot**
```bash
./gradlew bootRun
# ou ./mvnw spring-boot:run dependendo da build tool
```
A API estará rodando em `http://localhost:8080`.

*(O passo a passo do frontend será adicionado futuramente).*

---

## Estrutura do Projeto

O código-fonte do backend e frontend são divididos em pastas independentes.

```
ZelaTech/
├── backend/                  # API REST em Spring Boot
│   ├── src/main/java/br/fatec/zelatech/backend/
│   │   ├── controllers/      # Endpoints REST (@RestController)
│   │   ├── services/         # Lógica de Negócio e Validações
│   │   ├── repositories/     # Interfaces JPA
│   │   ├── dtos/             # Objetos de Transferência de Dados
│   │   ├── security/         # Configuração de Filtros e JWT
│   │   └── config/           # Configuração de CORS, etc
│   └── src/main/resources/   # Propriedades da aplicação
│
├── frontend/                 # Aplicação SPA em React (Em breve)
│
├── README.md                 # Documentação principal
├── SPECS.MD                  # Especificações Técnicas
├── requirements.MD           # Matriz de Requisitos
└── AGENTS.MD                 # Diretrizes e Roles de Equipe
```

---

## Equipe Desenvolvedora

Discentes da Fatec Praia Grande:
- **João Luiz** - Lead Architect / Back-end Spring Boot
- **Andrey Kerges** - Front-end Developer (React)
- **Vitor Augusto** - DBA / Model Layer (JPA)
- **Alexandre Hesse** - DevOps & QA

---

<p align="center">
  <sub>Projeto acadêmico para fins de avaliação na disciplina de Programação Orientada a Objetos, migrado para as tecnologias mais demandadas no mercado.</sub>
</p>
