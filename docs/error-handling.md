# Tratamento Global de Erros

Este documento define a estratégia de tratamento global de erros da aplicação, incluindo fluxo completo, classificação de erros, mapeamento HTTP e estrutura padronizada de resposta.

---

## 1. Fluxo Completo de Tratamento de Erros

Fluxo da requisição:

```text
Requisição
↓
Zod middleware        → lança erro de validação estruturado
↓
Auth middleware       → lança UnauthorizedError
↓
RBAC middleware       → lança ForbiddenError
↓
Service               → lança AppError (erros operacionais)
↓
Global Error Handler  → captura todos os erros e decide a resposta HTTP
```

Todos os erros, sejam operacionais ou inesperados, são capturados exclusivamente pelo Global Error Handler.

---

## 2. Classificação de Erros

A aplicação distingue dois tipos principais de erro:

### 2.1 Erros Operacionais (Esperados)

Erros previsíveis que fazem parte do domínio da aplicação.

Exemplos:

- Horário indisponível
- Pet não encontrado
- Prazo de cancelamento encerrado

Esses erros são representados por instâncias de `AppError` ou subclasses específicas.

### 2.2 Erros de Programação (Inesperados)

Bugs reais ou falhas não previstas.

Exemplos:

- Variável undefined
- Falha inesperada de conexão
- Exceção não tratada

Esses erros são tratados como falhas internas (HTTP 500).

---

## 3. Decisão do Global Error Handler

Ordem de tratamento:

1. `err instanceof ZodError`
   → HTTP 400
   → Retorna array estruturado de campos inválidos

2. `err instanceof AppError`
   → Retorna `statusCode` definido
   → Mensagem controlada

3. `err instanceof PrismaError`
   → Mapeamento específico por código do ORM

4. Erro desconhecido
   → HTTP 500
   → Mensagem genérica
   → Log com stack trace completo

---

## 4. Mapeamento de Erros Prisma

Erros conhecidos do Prisma são mapeados para respostas semânticas:

- P2002 → 409 Conflict (violação de unique constraint)
- P2025 → 404 Not Found (registro não encontrado)
- P2003 → 409 Conflict (violação de foreign key)

A mensagem interna do Prisma nunca é exposta na resposta.

---

## 5. Estrutura Padrão da Resposta de Erro

### 5.1 Erros Operacionais

```json
{
  "status": "error",
  "message": "Horário indisponível"
}
```

### 5.2 Erros de Programação

```json
{
  "status": "error",
  "message": "Erro interno do servidor"
}
```

### 5.3 Erros de Validação (Zod)

```json
{
  "status": "error",
  "message": "Dados inválidos",
  "errors": [
    { "field": "email", "message": "Email inválido" },
    { "field": "start_time", "message": "Campo obrigatório" }
  ]
}
```

---

## 6. Segurança

As seguintes informações nunca devem ser expostas na resposta HTTP:

- Stack trace
- Query SQL
- Mensagens internas do Prisma
- Variáveis de ambiente
- Estrutura interna do código

Essas informações são registradas apenas em logs internos estruturados.

---

## 7. Estrutura na Arquitetura

```text
src/
  shared/
    errors/
      AppError.ts
      httpErrors.ts
    middlewares/
      error.middleware.ts
```

- `AppError.ts` → Classe base para erros operacionais
- `httpErrors.ts` → Classes específicas (BadRequestError, NotFoundError, etc.)
- `error.middleware.ts` → Middleware global de captura de erros
