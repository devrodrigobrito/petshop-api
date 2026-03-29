# Constraints - Petshop API

Este documento define restrições obrigatórias de arquitetura e implementação.  
O agente deve seguir estritamente estas regras.

---

# PRINCÍPIOS GERAIS

- Nunca inventar regras de negócio
- Nunca ignorar validações
- Nunca acessar o banco diretamente fora da camada correta
- Sempre seguir separação de responsabilidades
- Código deve ser previsível e consistente

---

# STACK OBRIGATÓRIA

- Node.js
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- JWT (auth)
- Zod (validação)
- Bcrypt (hash)
- Pino (logging)
- UUID (identificadores)

---

# ARQUITETURA

## Estrutura obrigatória

- Controllers → lidam com HTTP (request/response)
- Services → contêm regras de negócio
- Repositories (Prisma) → acesso ao banco
- Middlewares → autenticação, autorização, validação
- Shared → erros, utils
- Lib → jwt, logger, prisma

---

## Regras de separação

### Controllers

- Não conter regra de negócio
- Não acessar banco diretamente
- Apenas:
  - receber request
  - chamar service
  - retornar response

---

### Services

- Contêm TODA regra de negócio
- Devem usar repositories
- Devem aplicar:
  - ctx-business-rules.md
  - ctx-system-flows.md
- Não devem conhecer detalhes de HTTP

---

### Repositories (Prisma)

- Responsáveis por acesso ao banco
- Não conter regra de negócio
- Apenas queries e persistência

---

### Middlewares

- Autenticação (JWT)
- Autorização (RBAC)
- Validação (Zod)

---

# VALIDAÇÃO

- Toda entrada deve ser validada com Zod
- Validação deve ocorrer antes da lógica de negócio
- Nunca confiar em dados do cliente

---

# AUTENTICAÇÃO E AUTORIZAÇÃO

- JWT obrigatório em rotas protegidas
- RBAC obrigatório conforme API Contract
- Nunca confiar apenas no frontend

---

# BANCO DE DADOS

- Acesso apenas via Prisma
- Nunca usar queries diretas fora do Prisma
- Sempre respeitar:
  - integridade relacional
  - regras de negócio

---

# LOGGING

- Usar Pino para logs estruturados (JSON)
- Nunca usar console.log em produção
- Usar logger.info, logger.warn, logger.error conforme estratégia em ctx-observability.md

---

# ERROS

- Usar padrão global de erro
- Nunca retornar erro cru
- Sempre usar ERROR_CODES definidos em constants.md

---

# IDENTIFICADORES

- Usar UUID para entidades
- Nunca usar IDs incrementais expostos

---

# API

- Seguir estritamente api-contract.md
- Não criar endpoints novos
- Não alterar rotas existentes
- Respeitar versionamento `/api/v1`

---

# AGENDAMENTOS (CRÍTICO)

- Sempre validar disponibilidade antes de criar/confirmar
- Aplicar optimistic locking
- Nunca permitir conflito de horário
- Sempre seguir máquina de estados

---

# PROIBIÇÕES

O agente NÃO deve:

- Criar lógica fora dos Services
- Duplicar regras de negócio
- Ignorar ctx-constants.md
- Ignorar ctx-business-rules.md
- Criar fluxos novos sem instrução
- Alterar estrutura do projeto sem permissão
- Implementar comportamento não documentado

---

# COMPORTAMENTO EM CASO DE DÚVIDA

Se qualquer informação estiver ausente ou ambígua:

- NÃO assumir
- NÃO inventar
- Solicitar esclarecimento

---

# DOCUMENTOS DE REFERÊNCIA

- ctx-api-contract.md
- ctx-business-rules.md
- ctx-system-flows.md
- ctx-constants.md
- ctx-observability.md
- ctx-validation.md
