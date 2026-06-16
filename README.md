# ZelaTech - Sistema de Gestão de Condomínios

<p align="center">
  <strong>Plataforma completa de gestão condominial: chamados, financeiro, reservas de áreas comuns, infrações e notificações em tempo real.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Asaas-Pagamentos-00A868?logoColor=white" alt="Asaas">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Arquitetura-API_REST-blue?logo=architecture&logoColor=white" alt="API REST">
  <img src="https://img.shields.io/badge/Status-Concluído-brightgreen" alt="Status">
</p>

---

## 📱 Sobre o Projeto

O **ZelaTech** é uma aplicação web completa desenvolvida para a disciplina de **Programação Orientada a Objetos** na FATEC Praia Grande.

O sistema digitaliza e centraliza toda a gestão condominial, eliminando livros de ocorrência físicos e grupos de mensagens desorganizados. Construído com uma arquitetura desacoplada entre uma **API REST (Spring Boot)** e um **Frontend SPA (React)**, o ZelaTech cobre desde chamados de manutenção até um módulo financeiro integrado com gateway de pagamento, notificações em tempo real via WebSockets, agendamento de áreas comuns e um sistema completo de mediação de infrações e multas.

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
- **Abertura de Chamados (Fase 3):** Envio de ocorrências de manutenção (Elétrica, Hidráulica, etc.) com anexo de imagens. Acompanhamento dinâmico com **notificações via WebSocket** e alertas por **E-mail**.
- **Agendamento de Áreas Comuns (Fase 2):** Sistema inteligente de reservas (Churrasqueira, Salão de Festas, etc.) com prevenção de conflitos de datas e limites de agendamento por unidade.
- **Módulo Financeiro (Fase 5):** Consulta e pagamento da taxa condominial e multas. Integração direta com a **API do Asaas Sandbox** com exibição de **QR Code Pix** na tela e conversão automática de pendências após o pagamento.
- **Defesa de Infrações (Fase 6):** Visualização de notificações, advertências ou multas aplicadas à unidade, com formulário dedicado para **apresentar recurso e enviar provas de defesa**.

### 👑 Área do Síndico / Gestão
- **Painel de Chamados:** Visão global com gestão do ciclo de vida dos chamados (`Aberto` ➡️ `Em Andamento` ➡️ `Resolvido`).
- **Dashboard de Métricas BI (Fase 4):** Gráficos avançados que exibem a volumetria de chamados por categoria, SLA (Tempo Médio de Atendimento) e evolução financeira de arrecadações.
- **Gestão de Espaços Compartilhados (Fase 2):** Criação, edição e controle de status (Ativo/Inativo) das áreas comuns do prédio.
- **Gestão Financeira & Inadimplência (Fase 5):** Painel para disparo de faturas ativas, consulta do histórico de adimplência do condomínio e processamento seguro via **Webhooks**.
- **Mediação de Conflitos & Multas (Fase 6):** Registro oficial de quebras do regimento interno (com anexo de fotos) e ferramenta para **julgamento de recursos**, garantindo a ampla defesa aos moradores.
- **Aprovação de Síndicos (Fase 1):** Painel Master (Super Administrador) com auditoria para aprovar ou rejeitar o acesso de novos síndicos mediante checagem de documentação legal (Ata de Eleição).

---

## 🔒 Segurança & Controle (Checklist Realizado)

- **RBAC (Role-Based Access Control):** Controle de acesso rigoroso com três perfis: `ROLE_ADMIN` (super administrador), `ROLE_SINDICO` (aprovado pelo admin) e `ROLE_MORADOR` (cadastro padrão). Cada perfil acessa apenas seus próprios recursos, protegidos por `@PreAuthorize` nas camadas de controller e service.
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
   ASAAS_API_KEY=sua_chave_api_asaas_sandbox
   MAIL_USERNAME=seu_email@gmail.com
   MAIL_PASSWORD=sua_senha_de_app
   ```
3. Inicialize o servidor Spring Boot:
   ```bash
   ./gradlew bootRun
   ```
   A API iniciará no endereço `http://localhost:8081`.

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
  <sub>ZelaTech - FATEC PG, 2026.</sub>
</p>
