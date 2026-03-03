# 🔐 Autenticação e RBAC - PetShop API

Este documento descreve o fluxo de autenticação, o modelo de autorização, a estratégia de RBAC, a validação de ownership e o gerenciamento de refresh tokens.

---

## 1. Middleware de Autenticação

Responsável por validar o access token nas rotas protegidas.

### Responsabilidades

- Extrair o token `Bearer` do header Authorization
- Verificar assinatura do JWT
- Verificar expiração do token
- Injetar `req.user` com payload mínimo:

```ts
{
  id: string;
  role: "ADMIN" | "EMPLOYEE" | "CLIENT";
}
```

Retornar `401 Unauthorized` se:

- Token ausente
- Token inválido
- Token expirado

### Decisão de Arquitetura

O payload do JWT contém apenas dados mínimos e não sensíveis:

- `id`
- `role`

Não são incluídos dados mutáveis ou sensíveis (como email ou nome), evitando inconsistências e exposição desnecessária de informações.

---

## 2. Middleware de RBAC (Role-Based Access Control)

Executado sempre após o middleware de autenticação.

### Responsabilidades

- Ler `req.user.role`
- Verificar se a role é permitida na rota
- Retornar `403 Forbidden` se a role não tiver permissão

### Exemplo

Se a rota permitir apenas `ADMIN`:

- `ADMIN` → permitido
- `EMPLOYEE` → 403
- `CLIENT` → 403

---

## 3. Validação de Ownership (Camada de Service)

RBAC sozinho não protege acesso a recursos específicos.

Algumas rotas exigem verificação de posse do recurso.

### Responsabilidades

- Buscar recurso pelo ID
- Se não existir → retornar `404`
- Se existir mas não pertencer ao `req.user.id`:
  - Retornar `404` (decisão consciente de segurança)

### Decisão de Segurança

Retornar `404` em vez de `403` evita:

- Enumeração de recursos
- Descoberta de IDs válidos
- Vazamento de informação sobre existência de dados

---

## 4. Estratégia de Refresh Token

Os refresh tokens são stateful e persistidos no banco de dados.

### Regras de Armazenamento

- Armazenados como hash, nunca em texto puro
- Cada token possui:
  - `expires_at`
  - `revoked_at`
  - `created_at`

### Medidas de Segurança

- Rotacionado a cada uso
- Revogado no logout
- Validação exige consulta ao banco
- Permite detecção de reuse (uso indevido do mesmo token)

Se um refresh token já revogado for utilizado,
o sistema revoga todos os tokens ativos do usuário
e exige novo login.

---

## 5. Estratégia de Tokens JWT

### Access Token

- Curta duração (15 minutos)
- Stateless
- Validado apenas por assinatura

### Refresh Token

- Longa duração (7 dias)
- Persistido no banco
- Rotacionado a cada uso
- Pode ser revogado

---

## 6. Tabela: refresh_tokens

```ts
TABLE refresh_tokens
─────────────────────────────────────
id          UUID PRIMARY KEY
user_id     UUID REFERENCES users(id)
token_hash  VARCHAR NOT NULL
expires_at  TIMESTAMP NOT NULL
revoked_at  TIMESTAMP
created_at  TIMESTAMP
last_used_at TIMESTAMP
```

### Objetivo

- Permitir revogação controlada de tokens
- Implementar logout seguro
- Detectar reuse attack
- Manter controle de sessão por usuário

---

## 7. Política de Status Codes

`401 Unauthorized`

- Problema de autenticação
- Token ausente ou inválido

`403 Forbidden`

- Usuário autenticado sem permissão suficiente

`404 Not Found`

- Recurso não existe
- Ou não pertence ao usuário (decisão consciente de segurança)
