# ZelaTech - Sistema de Gestão de Condomínios

<p align="center">
  <strong>Plataforma moderna, segura e com design premium para gestão de chamados de manutenção e comunicação ágil entre síndico e moradores.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Arquitetura-API_REST-blue?logo=architecture&logoColor=white" alt="API REST">
  <img src="https://img.shields.io/badge/Status-Concluído-brightgreen" alt="Status">
</p>

---

## 📱 Sobre o Projeto

O **ZelaTech** é uma aplicação web completa desenvolvida para a disciplina de **Programação Orientada a Objetos** na FATEC Praia Grande.

O sistema elimina o uso de livros de ocorrência físicos e grupos desorganizados de mensagens através de uma arquitetura desacoplada baseada em uma **API REST (Spring Boot)** segura e um **Frontend Single Page Application (React)** totalmente responsivo e estilizado com uma identidade visual moderna em **Premium Dark Mode**.

---

## 🎨 Design & Usabilidade (Dynamic Light & Premium Dark Mode)

O frontend foi desenvolvido com as melhores práticas de design moderno, apresentando:
- **Sistema de Temas Dinâmico (Light & Dark Mode):** Alternância completa de temas gerenciada via React Context (`ThemeContext`) e botão flutuante rápido, estilizada com a sintaxe ultra moderna do **Tailwind CSS v4** baseada em variáveis semânticas.
- **Interface Visual Premium:** Cores profundas (`#0f172a`, `#1e293b`) no Dark Mode contrastando com detalhes em roxo neon, e uma interface limpa e elegante no Light Mode, ambas com badges semânticos de status.
- **Responsividade Total:** Adaptado perfeitamente para celulares de moradores e desktops de síndicos.
- **Feedback Visual Avançado:** Transições suaves, loadings animados com Lucide React, contadores de caracteres em tempo real e upload de imagem interativo via drag-and-drop ou clique.

---

## ⚙️ Funcionalidades Principais

### 🏠 Área do Morador
- **Mural Digital:** Visualização em tempo real de comunicados oficiais publicados pelo síndico.
- **Abertura de Chamados:** Envio de ocorrências com título (máx. 100 caracteres), categoria (Elétrica, Hidráulica, etc.), descrição detalhada (máx. 500 caracteres), nível de prioridade e anexo opcional de **imagem/foto probatória**.
- **Meus Chamados:** Acompanhamento dinâmico das próprias solicitações organizadas em cards visuais responsivos com bordas coloridas semânticas e barra de progresso.

### 👑 Área do Síndico
- **Painel Administrativo:** Visão global e controle centralizado de todos os chamados abertos no condomínio.
- **Filtros Avançados:** Busca ágil de chamados por categoria e status atual.
- **Gestão de Status:** Avanço do ciclo de vida dos chamados (`Aberto` ➡️ `Em Andamento` ➡️ `Resolvido`) com registro imutável no histórico para auditoria.
- **Mural de Avisos:** Criação rápida e exclusão imediata de comunicados importantes.

---

## 🔒 Segurança & Controle (Checklist Realizado)

- **RBAC (Role-Based Access Control):** Controle de acesso rigoroso baseado em perfis. O primeiro usuário a se cadastrar recebe o papel `ROLE_SINDICO`; cadastros posteriores ganham automaticamente `ROLE_MORADOR`.
- **Tratamento de Autenticação Segura (Custom EntryPoint):** O backend agora utiliza um `AuthenticationEntryPoint` customizado para mapear de forma explícita falhas de autenticação (como tokens expirados ou ausentes) como **HTTP 401 Unauthorized** (ao invés de 403 genérico), desacoplando a expiração de sessão das páginas legítimas de acesso negado simples.
- **Autenticação Stateless:** Sessões dinâmicas gerenciadas através de tokens JWT (`Bearer`) com interceptador Axios no frontend para injeção automática e tratamento inteligente de expiração.
- **Criptografia de Senhas:** Armazenamento seguro de senhas por meio de hash BCrypt nativo do Spring Security (`PasswordEncoder`).
- **Upload Seguro de Arquivos:** Imagens enviadas passam por validação MIME rígida no backend e são salvas com nomes mascarados por UUID para prevenir Directory Traversal.
- **Prevenção de SQL Injection:** Queries parametrizadas geradas de forma nativa pelas interfaces do Spring Data JPA.

---

## 📂 Estrutura do Projeto

```
ZelaTech/
├── backend/                  # API REST em Spring Boot (Java 17)
│   ├── src/main/java/br/fatec/zelatech/backend/
│   │   ├── config/           # Configuração de CORS, Beans e Beans do Security
│   │   ├── controller/       # Endpoints REST (@RestController)
│   │   ├── dto/              # Objetos de Transferência de Dados (Requests/Responses)
│   │   ├── model/            # Entidades de Banco de Dados mapeadas via JPA (@Entity)
│   │   ├── repository/       # Interfaces JpaRepository
│   │   ├── security/         # Filtros JWT e Provedor de Autenticação
│   │   └── service/          # Lógica de Negócios e Transações
│   └── src/main/resources/   # Arquivos de Propriedades e upload local
│
├── frontend/                 # Aplicação SPA em React (Vite)
│   ├── src/assets/           # Assets e Imagens estáticas
│   ├── src/components/       # Layouts compartilhados (Sidebar, MainLayout)
│   ├── src/contexts/         # Contexto de Autenticação global (AuthContext)
│   ├── src/pages/            # Páginas divididas por contexto (morador, sindico, public, shared)
│   ├── src/routes/           # Sistema de rotas e rotas protegidas (ProtectedRoute)
│   ├── src/services/         # Chamadas de API centralizadas (Axios)
│   └── package.json          # Configuração de dependências do Frontend
│
├── database/                 # Modelagem e Scripts de Banco de Dados
│   ├── schema.sql            # Estrutura DDL das tabelas MySQL
│   └── seed.sql              # Dados iniciais para teste
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- JDK 17+
- Node.js (v18+) e NPM
- MySQL Server 8.0+

### 1. Preparação do Banco de Dados
Crie um schema no seu MySQL com o nome `zelatech_db` e execute o script contido em `database/schema.sql` para gerar as tabelas.

### 2. Configuração do Backend (Spring Boot)
1. Vá até a pasta `backend`.
2. Crie um arquivo `.env` baseado no arquivo de exemplo `application.properties.example` preenchendo as variáveis de banco de dados e segredo JWT:
   ```env
   DB_URL=jdbc:mysql://localhost:3306/zelatech_db
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha
   JWT_SECRET=sua_chave_secreta_jwt_de_pelo_menos_256_bits
   ```
3. Inicialize o servidor Spring Boot:
   ```bash
   ./gradlew bootRun
   ```
   A API iniciará no endereço `http://localhost:8080`.

### 3. Configuração do Frontend (React + Vite)
1. Abra outro terminal e acesse a pasta `frontend`.
2. Instale as dependências do projeto:
   ```bash
   npm install
   ```
3. Inicialize o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O frontend abrirá localmente na porta de desenvolvimento (geralmente `http://localhost:5173`).

---

## 👥 Equipe Desenvolvedora (FATEC Praia Grande)

- **João Luiz** - Lead Architect, Backend & DevOps Developer (Spring Boot, Segurança, Banco de Dados)
- **Andrey Kerges** - Frontend Developer (React, Fluxo do Morador, Integração de APIs)
- **Vitor Augusto** - DBA & Model Layer Developer (Entidades JPA, Relacionamentos, Scripts SQL)
- **Alexandre Hesse** - Frontend UX/UI Developer (Fluxo do Síndico, Design System Tailwind)

---
<p align="center">
  <sub>ZelaTech - Desenvolvido com carinho para a disciplina de Programação Orientada a Objetos. FATEC PG, 2026.</sub>
</p>
