# Authentication & RBAC - Petshop API

Este documento define as regras de autenticação, autorização e controle de acesso.  
O agente deve seguir estritamente estas regras.

---

## PRINCÍPIOS

- Toda rota protegida deve exigir autenticação
- Autorização deve ser aplicada via RBAC
- Validação de ownership deve ser feita na camada de service
- Nunca expor informações sensíveis no token

---

## AUTHENTICATION (JWT)

### Middleware obrigatório

- Extrair token do header Authorization (Bearer)
- Verificar assinatura do JWT
- Verificar expiração

---

### Payload do token

O token deve conter apenas:

```ts
{
  sub: string;
  role: "ADMIN" | "EMPLOYEE" | "CLIENT";
}
```

### Regras

- Não incluir dados sensíveis (email, nome, etc.)
- Não incluir dados mutáveis
- Token deve ser mínimo e seguro

### Erros

Retornar `401 Unauthorized` se:

- Token ausente
- Token inválido
- Token expirado

---

## RBAC (ROLE-BASED ACCESS CONTROL)

### Middleware obrigatório

- Executado após autenticação
- Ler `req.user.role`
- Validar permissão da rota

### Regras

- Permissões devem seguir `api-contract.md`
- Se role não permitida → retornar `403 Forbidden`

### Exemplo

Se rota permite apenas ADMIN:

- ADMIN → permitido
- EMPLOYEE → 403
- CLIENT → 403

---

## OWNERSHIP VALIDATION (SERVICE LAYER)

RBAC não substitui validação de ownership.

### Regras obrigatórias

**1.** Buscar recurso pelo ID

**2.** Se não existir → retornar 404

**3.** Se existir mas não pertencer ao usuário:

- retornar `404`

### Segurança

- Nunca retornar 403 para ownership

- Sempre retornar 404 para evitar:
  - enumeração de recursos
  - vazamento de informação

---

## REFRESH TOKEN STRATEGY

### Regras

- Refresh tokens são stateful
- Devem ser armazenados no banco
- Nunca armazenar token em texto puro (usar hash)

### Estrutura

Cada token deve possuir:

- expires_at
- revoked_at
- created_at
- last_used_at

### Segurança

- Rotacionar a cada uso
- Revogar no logout
- Validar no banco
- Detectar reuse

### Reuse detection

Se um refresh token revogado for utilizado:

- Revogar todos os tokens ativos do usuário
- Forçar novo login

---

## TOKEN STRATEGY

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

## DATABASE (refresh_tokens)

Tabela obrigatória:

```ts
refresh_tokens {
  id: UUID
  user_id: UUID
  token_hash: string
  expires_at: timestamp
  revoked_at: timestamp | null
  created_at: timestamp
  last_used_at: timestamp | null
}
```

---

## STATUS CODES

### 401 Unauthorized

- Token ausente
- Token inválido
- Token expirado

### 403 Forbidden

- Usuário autenticado sem permissão (RBAC)

### 404 Not Found

- Recurso não existe
- Recurso não pertence ao usuário (ownership)
