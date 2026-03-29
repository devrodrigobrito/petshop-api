# Observability - Petshop API

Este documento define as regras de logging, rastreamento e tratamento de erros.  
O agente deve seguir estritamente estas regras.

---

## PRINCÍPIOS

- Toda requisição deve ser rastreável
- Todo erro deve ser tratado de forma centralizada
- Logs devem ser estruturados (JSON)
- Nunca expor dados sensíveis
- Nunca retornar erros não tratados

---

## LOGGING (PINO)

### Biblioteca

- Utilizar Pino para logs estruturados

---

### Estrutura obrigatória

Todo log deve conter:

- level
- timestamp
- service
- method
- requestId
- userId (quando disponível)
- message

---

### Campos adicionais

- context (dados relevantes)
- metadata específica (ex: startTime, appointmentId)

---

### Exemplo

```json
{
  "level": "error",
  "timestamp": "2024-01-01T10:00:00Z",
  "service": "AppointmentService",
  "method": "create",
  "requestId": "req-123",
  "userId": "uuid-123",
  "message": "Schedule unavailable",
  "startTime": "2024-01-01T14:00:00Z"
}
```

---

## REQUEST ID

### Regras

- Toda requisição deve possuir um requestId único
- Deve ser gerado no início da requisição
- Deve ser propagado por todas as camadas

---

### Objetivo

- Rastreabilidade completa
- Debug em produção
- Correlação de logs

---

## NÍVEIS DE LOG

### debug

- Logs detalhados
- Uso em desenvolvimento

---

### info

- Eventos normais de negócio
- Exemplo:
  - criação de agendamento
  - login realizado

---

### warn

- Situações anômalas
- Exemplo:
  - tentativa de acesso não autorizado
  - violação de regra de negócio

---

### error

- Falhas que impedem execução
- Exemplo:
  - erro no banco
  - exceção inesperada

---

## SANITIZAÇÃO (OBRIGATÓRIO)

### Nunca logar:

- password
- password_hash
- token_hash
- access_token
- refresh_token
- CPF completo
- email (em contexto sensível)
- secrets
- variáveis de ambiente

---

### Estratégia

- Utilizar serializers
- Sanitização automática (não manual)

---

## LOGS POR CAMADA

## Auth Middleware

- warn → token inválido, expirado ou ausente

---

### RBAC Middleware

- warn → role insuficiente

---

### Request ID Middleware

- info → requestId gerado e propagado

---

### Services

- info → operações bem-sucedidas
- warn → violações de regra
- error → falhas inesperadas

---

### Error Handler

- error → todos os erros capturados

---

## ERROR HANDLING

### REGRA PRINCIPAL

- Todos os erros devem ser tratados pelo Global Error Handler

---

## FLUXO

```text
Requisição
↓
Validation (Zod)
↓
Auth Middleware
↓
RBAC Middleware
↓
Service
↓
Global Error Handler
```

---

## TIPOS DE ERRO

### Erros Operacionais (AppError)

- Erros esperados
- Fazem parte do domínio

Exemplos:

- Schedule unavailable
- Resource not found
- Cancellation deadline passed

---

### Erros de Programação

- Erros inesperados
- Bugs

---

## DECISÃO DO HANDLER

### Ordem obrigatória

#### **1.** ZodError

→ HTTP 400

→ Retornar erros estruturados

#### **2.** AppError

→ Retornar statusCode definido

#### **3.** Prisma Errors

→ Mapear para HTTP semântico

#### **4.** Erro desconhecido

→ HTTP 500

→ Mensagem genérica

→ Log com stack trace

---

## PRISMA ERROR MAPPING

- P2002 → 409 Conflict
- P2025 → 404 Not Found
- P2003 → 409 Conflict

---

## RESPOSTA PADRÃO

### Erro operacional

```json
{
  "status": "error",
  "message": "Schedule unavailable"
}
```

---

### Erro interno

```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### Erro de validação

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

---

## SEGURANÇA

### Nunca retornar na resposta:

- stack trace
- queries SQL
- mensagens internas do Prisma
- estrutura do sistema
- variáveis de ambiente

---

## ESTRUTURA OBRIGATÓRIA

```txt
src/shared/errors/
  AppError.ts
  httpErrors.ts

src/shared/middlewares/
  error.middleware.ts
  auth.middleware.ts
  rbac.middleware.ts
  request-id.middleware.ts
```

---

## PROIBIÇÕES

### O agente NÃO deve:

- Criar try/catch desnecessário em controllers
- Retornar erros diretamente (sempre lançar)
- Expor erro interno ao cliente
- Logar dados sensíveis
- Ignorar requestId
