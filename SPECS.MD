# Especificações Técnicas (SPECS) — ZelaTech

## 1. Arquitetura do Sistema

O projeto utiliza uma arquitetura **desacoplada**, separando completamente as responsabilidades entre frontend e backend:

- **Backend (API RESTful):** Desenvolvido em Java com **Spring Boot**. Responsável pelas regras de negócio, persistência no banco de dados e autenticação via JWT (JSON Web Tokens). Ele fornece dados estruturados em formato JSON.
- **Frontend (SPA - Single Page Application):** Desenvolvido com **React**. Responsável por toda a interface de usuário, navegação no lado do cliente (Client-side routing) e consumo da API.
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
| Framework Frontend | React (Vite ou Next.js) | 18+ |
| Estilização | Tailwind CSS | 3.4+ |
| Comunicação | Axios ou Fetch API | — |

---

## 3. Modelagem de Dados

### 3.1 Usuário

| Atributo | Tipo SQL | Obrigatório | Observação |
|----------|----------|-------------|-----------|
| `id` | INT (PK, AUTO_INCREMENT) | Sim | — |
| `nome` | VARCHAR(150) | Sim | — |
| `email` | VARCHAR(150) UNIQUE | Sim | Usado como login |
| `senha` | VARCHAR(255) | Sim | Hash BCrypt |
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

## 4. Endpoints da API REST

A comunicação entre React e Spring Boot ocorrerá estritamente através destes endpoints JSON:

### Autenticação
| Endpoint | Método | Descrição | Autenticação |
|----------|--------|-----------|--------------|
| `/api/v1/auth/login` | POST | Autentica usuário e retorna JWT | Pública |
| `/api/v1/auth/cadastro` | POST | Registra novo usuário | Pública |

### Avisos (Mural)
| Endpoint | Método | Descrição | Autenticação |
|----------|--------|-----------|--------------|
| `/api/v1/avisos` | GET | Lista todos os avisos | Todos |
| `/api/v1/avisos` | POST | Cria um novo aviso | Apenas Síndico |
| `/api/v1/avisos/{id}` | DELETE | Exclui um aviso | Apenas Síndico |

### Chamados
| Endpoint | Método | Descrição | Autenticação |
|----------|--------|-----------|--------------|
| `/api/v1/chamados` | GET | Lista chamados (Morador: próprios; Síndico: todos) | Todos |
| `/api/v1/chamados` | POST | Abre novo chamado | Apenas Morador |
| `/api/v1/chamados/{id}` | GET | Retorna detalhes do chamado e histórico | Todos |
| `/api/v1/chamados/{id}/status` | PATCH | Atualiza status do chamado | Apenas Síndico |

---

## 5. Regras de Negócio e Validações

### Fluxo de Status
```
ABERTO  →  EM_ANDAMENTO  →  RESOLVIDO
```
- Unidirecional: O Spring impedirá qualquer transição inválida (ex: RESOLVIDO para EM_ANDAMENTO), retornando um status `400 Bad Request`.
- Toda alteração de status gera automaticamente um registro em `HistoricoStatus` na mesma transação de banco (`@Transactional`).

### Validações de Entrada (Spring Validation)
- As validações de payload (JSON) serão feitas usando anotações como `@NotBlank`, `@Email`, `@Size` diretamente nos DTOs de Request.
- Requisições inválidas retornarão HTTP `400 Bad Request` com a lista de erros.

### Regras de Acesso (RBAC com Spring Security)
- Configurações de rotas no SecurityFilterChain bloquearão acessos indevidos.
- Anotações como `@PreAuthorize("hasRole('SINDICO')")` serão usadas nos endpoints sensíveis.
- Tentativas não autenticadas retornarão `401 Unauthorized`.
- Tentativas sem a Role (perfil) necessária retornarão `403 Forbidden`.

---

## 6. Segurança

| Ameaça | Mitigação |
|--------|-----------|
| SQL Injection | Prevenção nativa pelo Spring Data JPA e Hibernate. |
| XSS | O React, por padrão, escapa todas as variáveis de estado no DOM. |
| Senhas em plain text | Criptografia via `BCryptPasswordEncoder` antes de salvar. |
| Sessão Sequestrada | JWT expirável (ex: validade de 2h). |
| Cross-Origin Requests | Configuração de CORS explícita no Spring Boot para aceitar apenas requisições do domínio do frontend. |

---

## 7. Padrões de Código

### Backend (Spring Boot)
Uso padrão das camadas Controller, Service e Repository.

```java
// Controller
@RestController
@RequestMapping("/api/v1/chamados")
public class ChamadoController {
    // ... endpoints, DTOs e ResponseEntity
}

// Service (Regras de Negócio)
@Service
public class ChamadoService {
    @Transactional
    public ChamadoResponseDTO atualizarStatus(Long id, StatusNovoDTO dto) {
        // ... valida regra de status e salva histórico
    }
}

// Repository (Spring Data JPA)
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {
    List<Chamado> findByUsuarioId(Long usuarioId);
}
```

### Frontend (React)
Uso de hooks funcionais, consumo de API assíncrono e gerenciamento de estado local.

```javascript
// Exemplo de componente React (consumindo a API)
import { useEffect, useState } from 'react';
import api from '../services/api'; // Axios configurado com token JWT

export function MuralAvisos() {
    const [avisos, setAvisos] = useState([]);

    useEffect(() => {
        api.get('/api/v1/avisos')
           .then(response => setAvisos(response.data))
           .catch(error => console.error(error));
    }, []);

    return (
        <div className="p-4">
            {avisos.map(aviso => (
                <div key={aviso.id} className="bg-white shadow p-4 rounded-md mb-4">
                    <h2 className="text-xl font-bold">{aviso.titulo}</h2>
                    <p>{aviso.conteudo}</p>
                </div>
            ))}
        </div>
    );
}
```