# 🗺️ ZelaTech — Roadmap de Evolução do Produto

Este documento descreve as melhorias, integrações e novas funcionalidades planejadas para as próximas etapas de desenvolvimento da plataforma ZelaTech, visando sua expansão de MVP para escala comercial.

---

## 🟢 Fase 1: Segurança, Governança & Auditoria (Super Admin)
**Status:** `Concluído` | **Impacto:** Banco de Dados, API REST, UI

*   **Aprovação e Cadastro de Síndicos:**
    *   Criação da role `ROLE_ADMIN` (Super Administrador) com painel exclusivo de auditoria.
    *   Formulário de cadastro dedicado para síndicos contendo campos para anexação de documentos legais comprobatórios (Ata de Eleição de Assembleia do Condomínio, RG/CPF).
    *   Fluxo de análise manual com deferimento e indeferimento de novos acessos de gestão.
*   **LGPD (Lei Geral de Proteção de Dados):**
    *   Implementação de termos de consentimento no cadastro e possibilidade de exclusão/anonimização de dados pessoais de moradores desligados do condomínio.

---

## 🟢 Fase 2: Gestão e Agendamento de Áreas Comuns
**Status:** `Concluído` | **Impacto:** Banco de Dados, API REST, UI

*   **Módulo de Reservas:**
    *   Calendário interativo para agendamento de áreas compartilhadas (Salão de Festas, Churrasqueira, Espaço Gourmet, Quadras).
    *   Sistema automatizado de bloqueio de datas conflitantes, regras de antecedência e limites de reservas mensais por apartamento.

---

## 🟢 Fase 3: Notificações Multicanal (Push & E-mail)
**Status:** `Concluído` | **Impacto:** API REST, Serviços Externos, UI

*   **Alertas em Tempo Real:**
    *   Integração via WebSockets para atualização instantânea dos chamados em tela, dispensando o recarregamento manual da página.
*   **Comunicação Integrada:**
    *   Notificações automáticas por e-mail (via SendGrid ou Amazon SES) quando um chamado muda de status ou quando novos avisos oficiais são inseridos no mural.
    *   Notificações móveis e no navegador utilizando Firebase Cloud Messaging (FCM).

---

## 🟢 Fase 4: Painel de Indicadores & Métricas (BI)
**Status:** `Concluído` | **Impacto:** Banco de Dados (Queries Otimizadas), UI

*   **Métricas para Gestão Condominial:**
    *   Geração de gráficos de incidência para acompanhamento de categorias mais solicitadas (Elétrica, Hidráulica, Infraestrutura).
    *   Acompanhamento de SLA (Tempo Médio de Atendimento e Resolução de Chamados).
    *   Exportação de relatórios gerenciais consolidados em formato PDF e Excel para prestação de contas periódica em assembleias.

---

## 🟢 Fase 5: Módulo Financeiro & Integração de Cobranças
**Status:** `Concluído` | **Impacto:** Banco de Dados, API REST, Gateway de Pagamento, UI

*   **Taxa Condominial Digital:**
    *   Integração com APIs de gateway de pagamento (Stripe, Asaas ou Efí) para disponibilização direta de Pix e boletos bancários da taxa de condomínio.
    *   Visualização e download de 2ª via de faturas em aberto no painel do morador.

---

## 🟡 Fase 6: Mediação de Conflitos & Gestão de Infrações (Multas e Advertências)
**Status:** `Em Andamento` | **Impacto:** Banco de Dados, API REST, UI

*   **Registro de Ocorrências e Infrações:**
    *   Painel do Síndico para registro formal de descumprimentos do Regimento Interno (ex: poluição sonora após horário permitido, destinação inadequada de resíduos ou danos à infraestrutura).
    *   Possibilidade de anexar fotos, depoimentos e relatórios como evidências.
*   **Gradação e Aplicação de Penalidades:**
    *   Parametrização de advertências formais e aplicação automatizada de multas de forma escalonada (Notificação -> Advertência -> Multa -> Reincidência com fator multiplicador).
*   **Notificação Integrada e Direito de Recurso:**
    *   Disparo imediato de e-mails e alertas em tempo real ao condômino infrator.
    *   Aba de contestação, na qual o morador pode redigir e anexar sua defesa prévia para apreciação do conselho diretivo ou votação em assembleia antes do lançamento da cobrança na fatura mensal.
