# Folder Structure - Petshop API

Este documento define a estrutura oficial do projeto.  
O agente deve seguir exatamente esta organização.

---

# ROOT

- prisma/
- src/
- docs/
- ai-context/
- package.json
- .env
- .env.example

---

# PRISMA

## prisma/

- schema.prisma → definição do banco
- migrations/ → histórico de migrações
- seeds/ → dados iniciais

---

# SOURCE

## src/

### modules/

Cada domínio deve ser isolado em um módulo.

Estrutura obrigatória por módulo:

- \*.controller.ts
- \*.service.ts
- \*.repository.ts
- \*.routes.ts
- \*.schema.ts (Zod)
- \*.types.ts (tipos auxiliares)

---

### Exemplo (users)

users/

- user.controller.ts
- user.service.ts
- user.repository.ts
- user.routes.ts
- user.schema.ts
- user.types.ts

---

### Regras de módulos

- Um módulo = um domínio
- Não compartilhar lógica entre módulos diretamente
- Comunicação entre módulos deve ocorrer via services

---

# SHARED

## src/shared/

Código reutilizável global

---

### middlewares/

- auth.middleware.ts → autenticação JWT
- rbac.middleware.ts → autorização por roles
- error.middleware.ts → tratamento global de erros
- request-id.middleware.ts → propagação de requestId por requisição

---

### errors/

- AppError.ts → classe base de erro
- httpErrors.ts → erros padronizados

---

### utils/

- Funções utilitárias puras

---

### config/

- env.ts → leitura e validação de variáveis de ambiente

---

# LIB

## src/lib/

- prisma.ts → instância do Prisma Client
- logger.ts → instância do Pino
- jwt.ts → funções de geração e verificação de tokens

---

# ENTRYPOINT

## src/

- app.ts → configuração do Express
- server.ts → inicialização do servidor

---

# REGRAS OBRIGATÓRIAS

- Não criar arquivos fora desta estrutura
- Não misturar responsabilidades
- Cada arquivo deve ter uma única responsabilidade
- Controllers não devem acessar services de outros módulos diretamente sem padronização
- Nunca acessar banco fora de repositories
- Nunca colocar lógica de negócio em:
  - controllers
  - middlewares
  - routes

---

# PADRÕES DE NOMENCLATURA

- arquivos: kebab-case ou padrão do módulo (user.controller.ts)
- classes: PascalCase
- variáveis/funções: camelCase

---

# PROIBIÇÕES

O agente NÃO deve:

- Criar novas pastas fora do padrão
- Criar arquivos genéricos sem domínio (ex: helpers soltos)
- Duplicar lógica entre módulos
- Criar “services globais” sem necessidade
