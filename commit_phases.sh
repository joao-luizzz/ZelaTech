#!/bin/bash
# Phase 1: RBAC & Admin
git reset
git add backend/src/main/java/br/fatec/zelatech/backend/controller/AdminController.java \
        backend/src/main/java/br/fatec/zelatech/backend/dto/auth/CadastroSindicoRequestDTO.java \
        backend/src/main/java/br/fatec/zelatech/backend/model/SolicitacaoCadastroSindico.java \
        backend/src/main/java/br/fatec/zelatech/backend/model/enums/StatusSolicitacao.java \
        backend/src/main/java/br/fatec/zelatech/backend/repository/SolicitacaoCadastroSindicoRepository.java \
        backend/src/main/java/br/fatec/zelatech/backend/service/AdminService.java \
        backend/src/main/java/br/fatec/zelatech/backend/controller/AuthController.java \
        backend/src/main/java/br/fatec/zelatech/backend/model/enums/Perfil.java \
        backend/src/main/java/br/fatec/zelatech/backend/repository/UsuarioRepository.java \
        backend/src/main/java/br/fatec/zelatech/backend/service/UsuarioService.java \
        frontend/src/services/adminService.js \
        frontend/src/pages/admin/ \
        frontend/src/pages/public/Cadastro.jsx
git commit -m "feat: concluída Fase 1 - RBAC e Aprovação de Síndicos"

# Phase 2: Reservas e Áreas Comuns
git add backend/src/main/java/br/fatec/zelatech/backend/controller/AreaComumController.java \
        backend/src/main/java/br/fatec/zelatech/backend/controller/ReservaController.java \
        backend/src/main/java/br/fatec/zelatech/backend/dto/reserva/ \
        backend/src/main/java/br/fatec/zelatech/backend/model/AreaComum.java \
        backend/src/main/java/br/fatec/zelatech/backend/model/Reserva.java \
        backend/src/main/java/br/fatec/zelatech/backend/model/enums/StatusAreaComum.java \
        backend/src/main/java/br/fatec/zelatech/backend/model/enums/StatusReserva.java \
        backend/src/main/java/br/fatec/zelatech/backend/repository/AreaComumRepository.java \
        backend/src/main/java/br/fatec/zelatech/backend/repository/ReservaRepository.java \
        backend/src/main/java/br/fatec/zelatech/backend/service/AreaComumService.java \
        backend/src/main/java/br/fatec/zelatech/backend/service/ReservaService.java \
        frontend/src/pages/morador/MinhasReservas.jsx \
        frontend/src/pages/morador/ReservarArea.jsx \
        frontend/src/pages/sindico/GerenciarAreas.jsx \
        frontend/src/services/reservaService.js
git commit -m "feat: concluída Fase 2 - Reservas de Áreas Comuns"

# Phase 3: Notifications
git add .
git commit -m "feat: concluída Fase 3 - Notificações Real-Time e E-mail"
