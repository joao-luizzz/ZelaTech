# 🗺️ ZelaTech — Roadmap de Evolução do Produto

Este documento descreve as melhorias, integrações e novas funcionalidades planejadas para as próximas etapas de desenvolvimento da plataforma ZelaTech, visando sua expansão de MVP para escala comercial.

---

## 🔒 1. Segurança, Governança & Auditoria (Super Admin)
*   **Aprovação e Cadastro de Síndicos:**
    *   Criação da role `ADMIN` (Super Administrador) com painel exclusivo de auditoria.
    *   Formulário de cadastro dedicado para síndicos contendo campos para anexação de documentos legais comprobatórios (Ata de Eleição de Assembleia do Condomínio, RG/CPF).
    *   Fluxo de análise manual com deferimento e indeferimento de novos acessos de gestão.
*   **LGPD (Lei Geral de Proteção de Dados):**
    *   Implementação de termos de consentimento no cadastro e possibilidade de exclusão/anonimização de dados pessoais de moradores desligados do condomínio.

## 🔔 2. Notificações Multicanal (Push & E-mail)
*   **Alertas em Tempo Real:**
    *   Integração via WebSockets para atualização instantânea dos chamados em tela, dispensando o recarregamento manual da página.
*   **Comunicação Integrada:**
    *   Notificações automáticas por e-mail (via SendGrid ou Amazon SES) quando um chamado muda de status ou quando novos avisos oficiais são inseridos no mural.
    *   Notificações móveis e no navegador utilizando Firebase Cloud Messaging (FCM).

## 📅 3. Gestão e Agendamento de Áreas Comuns
*   **Módulo de Reservas:**
    *   Calendário interativo para agendamento de áreas compartilhadas (Salão de Festas, Churrasqueira, Espaço Gourmet, Quadras).
    *   Sistema automatizado de bloqueio de das datas conflitantes, regras de antecedência e limites de reservas mensais por apartamento.

## 📊 4. Painel de Indicadores & Métricas (BI)
*   **Métricas para Gestão Condominial:**
    *   Geração de gráficos de incidência para acompanhamento de categorias mais solicitadas (Elétrica, Hidráulica, Infraestrutura).
    *   Acompanhamento de SLA (Tempo Médio de Atendimento e Resolução de Chamados).
    *   Exportação de relatórios gerenciais consolidados em formato PDF e Excel para prestação de contas periódica em assembleias.

## 💳 5. Módulo Financeiro & Integração de Cobranças
*   **Taxa Condominial Digital:**
    *   Integração com APIs de gateway de pagamento (Stripe, Asaas ou Efí) para disponibilização direta de Pix e boletos bancários da taxa de condomínio.
    *   Visualização e download de 2ª via de faturas em aberto no painel do morador.
