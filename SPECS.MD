# Especificações Técnicas (SPECS) — ZelaTech

## 1. Arquitetura do Sistema

O projeto utiliza uma arquitetura **desacoplada**, separando completamente as responsabilidades entre frontend e backend:

- **Backend (API RESTful):** Desenvolvido em Java com **Spring Boot**. Responsável pelas regras de negócio, persistência no banco de dados e autenticação via JWT (JSON Web Tokens) com controle de acesso baseado em roles (RBAC). Ele expõe endpoints REST que trafegam dados estruturados em formato JSON.
- **Frontend (SPA - Single Page Application):** Desenvolvido com **React** e **Vite**. Responsável por toda a renderização da interface no cliente, roteamento SPA seguro (`react-router-dom`) e consumo da API de forma assíncrona.
- **Persistência:** Utiliza **Spring Data JPA (Hibernate)** para mapeamento objeto-relacional e abstração de consultas no banco de dados MySQL.

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Linguagem | Java | 17+ |
| Framework Backend | Spring Boot | 3.x |
| Segurança | Spring Security + JWT | — |
| Persistência | Spring Data JPA (Hibernate) | — |
| Banco de Dados | MySQL | 8.0+ |
| Mensageria Real-Time | WebSockets (STOMP / SockJS) | — |
| E-mail | Spring Mail (JavaMailSender) | — |
| Gateway de Pagamento | API Asaas (Sandbox) | — |
| Framework Frontend | React (Vite) | 18+ |
| Estilização | Tailwind CSS | 4.x |
| Comunicação HTTP | Axios | — |

---

## 3. Modelagem de Dados

### 3.1 Usuário

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|-----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | Identificador único |
| `nome` | VARCHAR(150) | Sim | Nome completo |
| `email` | VARCHAR(150) UNIQUE | Sim | E-mail do morador / síndico |
| `senha` | VARCHAR(255) | Sim | Hash criptografado via BCrypt |
| `apartamento` | VARCHAR(20) | Sim | Unidade habitacional |
| `perfil` | ENUM('MORADOR','SINDICO') | Sim | Role para o controle de acessos |

### 3.2 Chamado

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|-----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `titulo` | VARCHAR(100) | Sim | Limite de 100 caracteres |
| `descricao` | VARCHAR(500) | Sim | Limite de 500 caracteres |
| `categoria` | ENUM('ELETRICA','HIDRAULICA','ESTRUTURAL','LIMPEZA','OUTRO') | Sim | Segmento da ocorrência |
| `prioridade` | ENUM('BAIXA','MEDIA','ALTA') | Sim | Gravidade do problema |
| `status` | ENUM('ABERTO','EM_ANDAMENTO','RESOLVIDO') | Sim | Padrão: `ABERTO` |
| `foto_path` | VARCHAR(300) | Não | Caminho relativo do arquivo local |
| `data_abertura` | DATETIME | Sim | Inserido automaticamente |
| `usuario_id` | INT (FK → usuario.id) | Sim | Vínculo com o Morador |

### 3.3 HistoricoStatus

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|-----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `chamado_id` | INT (FK → chamado.id) | Sim | Chamado modificado |
| `status_anterior` | ENUM('ABERTO','EM_ANDAMENTO','RESOLVIDO') | Sim | Estado antes da alteração |
| `status_novo` | ENUM('ABERTO','EM_ANDAMENTO','RESOLVIDO') | Sim | Estado pós-alteração |
| `data_alteracao` | DATETIME | Sim | Registrado automaticamente |
| `usuario_id` | INT (FK → usuario.id) | Sim | Síndico responsável |

### 3.4 Aviso

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|-----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `titulo` | VARCHAR(100) | Sim | Limite de 100 caracteres |
| `conteudo` | VARCHAR(1000) | Sim | Limite de 1000 caracteres |
| `data_publicacao` | DATETIME | Sim | Registrado automaticamente |
| `sindico_id` | INT (FK → usuario.id) | Sim | Síndico que publicou |

### 3.5 AreaComum

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `nome` | VARCHAR(100) | Sim | Ex: Salão de Festas, Churrasqueira |
| `descricao` | VARCHAR(500) | Não | Descrição da área |
| `capacidade` | INT | Não | Lotação máxima |
| `ativa` | BOOLEAN | Sim | Padrão: `true` |

### 3.6 Reserva

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `area_comum_id` | INT (FK → area_comum.id) | Sim | Área reservada |
| `usuario_id` | INT (FK → usuario.id) | Sim | Morador que fez a reserva |
| `data_reserva` | DATE | Sim | Data da ocupação |
| `horario_inicio` | TIME | Sim | Horário de início |
| `horario_fim` | TIME | Sim | Horário de término |
| `status` | ENUM('PENDENTE','CONFIRMADA','CANCELADA') | Sim | Padrão: `PENDENTE` |

### 3.7 Fatura

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `usuario_id` | INT (FK → usuario.id) | Sim | Morador devedor |
| `descricao` | VARCHAR(255) | Sim | Ex: Taxa Condominial Jun/2026 |
| `valor` | DECIMAL(10,2) | Sim | Valor em reais |
| `vencimento` | DATE | Sim | Data de vencimento |
| `status` | ENUM('PENDENTE','PAGA','VENCIDA') | Sim | Atualizado via Webhook |
| `gateway_id` | VARCHAR(100) | Não | ID da cobrança no Asaas |
| `link_pagamento` | TEXT | Não | Link gerado pelo Asaas |
| `qr_code_pix` | TEXT | Não | Base64 do QR Code Pix |
| `pix_copia_cola` | VARCHAR(2000) | Não | Payload do Pix Copia e Cola |

### 3.8 Infracao

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `infrator_id` | INT (FK → usuario.id) | Sim | Morador infrator |
| `tipo` | ENUM('BARULHO','LIXO','INFRAESTRUTURA',...) | Sim | Categoria da infração |
| `gravidade` | ENUM('LEVE','MEDIA','GRAVE','GRAVISSIMA') | Sim | Graduação da penalidade |
| `descricao` | TEXT | Sim | Relato do síndico |
| `valor_multa` | DECIMAL(10,2) | Não | Valor se houver multa associada |
| `status` | ENUM('ADVERTENCIA_GERADA','MULTA_APLICADA','EM_RECURSO','RECURSO_ACEITO','RECURSO_NEGADO','CANCELADA') | Sim | Ciclo de vida da infração |
| `foto_evidencia` | TEXT | Não | Base64 da foto do síndico |
| `justificativa_recurso` | TEXT | Não | Texto de defesa do morador |
| `anexo_recurso` | TEXT | Não | Base64 do arquivo de prova do morador |
| `data_criacao` | DATETIME | Sim | Registrado automaticamente |

---

## 4. Endpoints da API REST

A base URL de todos os endpoints está sob `/api/v1`.

### Autenticação (`/api/v1/auth`)
| Endpoint | Método | Descrição | Autenticação |
|----------|--------|-----------|--------------|
| `/auth/login` | POST | Autentica usuário e retorna JWT e dados básicos | Pública |
| `/auth/cadastro` | POST | Registra novo morador (ou síndico se for o 1º) | Pública |

### Mural de Avisos (`/api/v1/avisos`)
| Endpoint | Método | Descrição | Autenticação |
|----------|--------|-----------|--------------|
| `/avisos` | GET | Lista todos os avisos em ordem cronológica reversa | Todos |
| `/avisos` | POST | Cria um novo comunicado oficial no mural | Apenas Síndico |
| `/avisos/{id}` | DELETE | Exclui definitivamente um comunicado | Apenas Síndico |

### Chamados (`/api/v1/chamados`)
| Endpoint | Método | Descrição | Autenticação |
|----------|--------|-----------|--------------|
| `/chamados/meus` | GET | Lista os chamados abertos pelo morador autenticado | Apenas Morador |
| `/chamados` | GET | Lista todos os chamados cadastrados no sistema | Apenas Síndico |
| `/chamados` | POST | Abre novo chamado (Multipart Form Data para anexar foto) | Apenas Morador |
| `/chamados/{id}` | GET | Detalha as informações de um chamado e seu histórico | Todos |
| `/chamados/{id}/status` | PATCH | Altera o status atual do chamado | Apenas Síndico |

### Áreas Comuns e Reservas (`/api/v1/areas`, `/api/v1/reservas`)
| Endpoint | Método | Descrição | Autenticação |
|----------|--------|-----------|--------------|
| `/areas` | GET | Lista todas as áreas comuns ativas | Todos |
| `/areas` | POST | Cria nova área comum | Apenas Síndico |
| `/areas/{id}` | PUT | Edita dados de uma área | Apenas Síndico |
| `/reservas` | GET | Lista todas as reservas do condomínio | Apenas Síndico |
| `/reservas/minhas` | GET | Lista as reservas do morador autenticado | Apenas Morador |
| `/reservas` | POST | Cria uma nova reserva | Apenas Morador |
| `/reservas/{id}/cancelar` | PATCH | Cancela uma reserva | Morador/Síndico |

### Financeiro (`/api/v1/financeiro`)
| Endpoint | Método | Descrição | Autenticação |
|----------|--------|-----------|--------------|
| `/financeiro/faturas` | GET | Lista todas as faturas do condomínio | Apenas Síndico |
| `/financeiro/faturas/minhas` | GET | Lista as faturas do morador autenticado | Apenas Morador |
| `/financeiro/faturas` | POST | Gera nova fatura via API do Asaas | Apenas Síndico |
| `/financeiro/webhook` | POST | Recebe eventos de pagamento do Asaas | Pública (token de segurança) |

### Infrações (`/api/v1/infracoes`)
| Endpoint | Método | Descrição | Autenticação |
|----------|--------|-----------|--------------|
| `/infracoes` | GET | Lista todas as infrações do condomínio | Apenas Síndico |
| `/infracoes/minhas` | GET | Lista as infrações do morador autenticado | Apenas Morador |
| `/infracoes` | POST | Registra nova infração contra uma unidade | Apenas Síndico |
| `/infracoes/{id}/recurso` | POST | Envia defesa/recurso para uma infração | Apenas Morador |
| `/infracoes/{id}/julgar` | PATCH | Aceita ou rejeita o recurso do morador | Apenas Síndico |
| `/infracoes/{id}/cancelar` | PATCH | Cancela uma infração | Apenas Síndico |

---

## 5. Regras de Negócio e Validações

### Fluxo de Mudança de Status
O ciclo de vida de um chamado é linear e unidirecional:
```
ABERTO  ──>  EM_ANDAMENTO  ──>  RESOLVIDO
```
*   **Impedimento de Retrocesso:** O backend valida no nível de serviço (`ChamadoService`) se o novo status proposto é menor do que o atual na hierarquia, retornando erro HTTP 400 em caso de descumprimento.
*   **Histórico Consistente:** Toda mudança de status persiste de forma atômica (`@Transactional`) o registro correspondente na tabela `historico_status`.

### Segurança de Uploads
*   **Leitura de Assinatura Binária:** O backend valida o cabeçalho binário (Magic Numbers) das fotos para confirmar se são de fato extensões de imagens válidas (`image/jpeg`, `image/png`), ignorando simples extensões no nome do arquivo.
*   **Ofuscação de Nomes:** Os arquivos são salvos localmente mascarados por um UUID gerado em tempo de execução para evitar substituições e vazamento de caminhos do servidor.
*   **Mapeamento de Recursos Estáticos (`WebMvcConfig`):** O backend expõe o endpoint `/uploads/chamados/**` mapeado de forma híbrida tanto para o diretório físico local de uploads do servidor quanto para o diretório `/seed-images/` do classpath do projeto.

### Fluxo Financeiro (Asaas)
*   **Criação de Cliente:** Antes de gerar uma cobrança, o sistema verifica se o morador já existe no Asaas pelo e-mail. Se não existir, cria automaticamente via `POST /customers`.
*   **Cobrança Híbrida:** As faturas são criadas com tipo `UNDEFINED`, permitindo que o morador escolha entre Pix, Boleto ou Cartão no link gerado.
*   **QR Code Pix Inline:** Imediatamente após a criação da fatura, o backend já busca e salva o Base64 do QR Code Pix para exibição inline no frontend sem dependência de URL externa.
*   **Webhook Seguro:** O endpoint `/financeiro/webhook` valida o header `asaas-access-token` antes de processar qualquer evento de pagamento, e ao receber o evento `PAYMENT_RECEIVED`, baixa automaticamente a fatura no banco.

### Fluxo de Infrações
*   **Registro pelo Síndico:** Ao registrar uma infração, o sistema dispara automaticamente um e-mail e um alerta WebSocket para o morador infrator.
*   **Recurso do Morador:** O morador pode enviar recurso somente enquanto a infração estiver nos status `ADVERTENCIA_GERADA` ou `MULTA_APLICADA`. O envio do recurso muda o status para `EM_RECURSO`.
*   **Julgamento pelo Síndico:** O síndico pode aceitar (status → `RECURSO_ACEITO`) ou rejeitar (status → `RECURSO_NEGADO`) o recurso. O morador é notificado por e-mail e WebSocket em ambos os casos.

---

## 6. Padrões de Código e Arquitetura Avançada

### Backend (Spring Boot)
As camadas Java seguem uma hierarquia rígida de responsabilidades:
1.  **Controller:** Lida com roteamento HTTP, desserialização DTO e validações declarativas (`@Valid`).
2.  **Service:** Centraliza regras de negócio, controle transacional e lançamento de exceções customizadas de domínio.
3.  **Repository:** Fornece a persistência por meio das interfaces do Spring Data JPA.
4.  **Security Exception Handling:** Implementação de `AuthenticationEntryPoint` customizado para mapear formalmente erros de credenciais/JWT inválido ou expirado como **HTTP 401 Unauthorized** com payloads JSON semânticos.

### Frontend (React + Vite)
*   **Serviços Centralizados:** As rotas e requisições da API são mapeadas na pasta `/services` usando a instância do Axios, que insere dinamicamente o Token JWT em todas as requisições protegidas e intercepta erros HTTP 401 para purga de cache e logout automático.
*   **Gerenciamento de Contexto Híbrido:** 
    - `AuthContext`: Lida com sessões, tokens e papéis do usuário.
    - `ThemeContext`: Controla a preferência visual de Light/Dark Mode armazenando o estado no navegador e alternando classes do elemento raiz (`document.documentElement`).
*   **Design System Tailwind CSS v4:** Interface construída com a especificação v4 da framework utilitária, baseando classes em tokens semânticos (`color-background`, `color-card`, `color-primary`) que se traduzem dinamicamente dependendo da presença da classe `.dark`.