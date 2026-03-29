# Validation Rules - Petshop API

Este documento define como validação deve ser implementada utilizando Zod.  
O agente deve seguir estritamente estas regras.

---

# PRINCÍPIOS

- Toda entrada externa deve ser validada
- Validação é responsabilidade dos schemas (Zod)
- Regras de negócio NÃO devem estar nos schemas
- Services são responsáveis por validações dependentes de banco

---

# SEPARAÇÃO DE RESPONSABILIDADES

## Schemas (Zod)

Responsáveis por:

- formato de dados
- tipos
- obrigatoriedade
- validações simples (min, max, enum, etc.)

---

## Services

Responsáveis por:

- regras de negócio
- validações com banco
- verificações de domínio

---

## PROIBIDO

- Validar regra de negócio no schema
- Validar estrutura no service
- Misturar responsabilidades

---

# LOCALIZAÇÃO

- Cada módulo deve possuir seu próprio arquivo:
  - `*.schema.ts`

Exemplo:

- user.schema.ts
- pet.schema.ts
- appointment.schema.ts

---

# USO NO CONTROLLER

Fluxo obrigatório:

1. Receber request
2. Validar com schema
3. Extrair dados validados
4. Chamar service

---

## Exemplo

```ts
const data = createUserSchema.parse(req.body);
await userService.create(data);
```

O ZodError lançado pelo .parse() é capturado pelo error.middleware.ts
e transformado em resposta padronizada com VALIDATION_FAILED

---

# SCHEMAS DEFINIDOS

O agente deve utilizar exclusivamente os schemas abaixo.

## AUTH

### registerSchema

- email: string (email válido)
- password: string (mínimo 8 caracteres)
- full_name: string (mínimo 2 caracteres)
- cpf: string (11 dígitos)
- phone: opcional

### loginSchema

- email: string
- password: string

### refreshSchema

- refresh_token: string

## PETS

### createPetSchema

- name: string
- species: string
- breed: opcional
- size: enum (SMALL, MEDIUM, LARGE)
- birth_date: ISO string (opcional)

### updatePetSchema

- todos os campos opcionais

### updatePetSizeSchema

- size: enum (SMALL, MEDIUM, LARGE)

## SERVICES

### createServiceSchema

- name: string
- description: opcional

### updateServiceSchema

- campos opcionais

### createDurationSchema

- size: enum
- duration_minutes: number (positivo)
- price_in_cents: number (positivo)

### updateDurationSchema

- campos opcionais

## EMPLOYEES

### createEmployeeSchema

- email: string
- password: mínimo 8 caracteres
- full_name: mínimo 2 caracteres
- phone: opcional

### updateEmployeeSchema

- campos opcionais

## APPOINTMENTS

### createAppointmentSchema

- pet_id: UUID
- service_ids: array de UUID (mínimo 1)
- start_time: ISO datetime

### cancelByClientSchema

- cancellation_reason: opcional

### cancelByAdminSchema

- cancellation_reason: obrigatório (mínimo 10 caracteres)
- ⚠️ mapeado para admin_notes no service

### reassignAppointmentSchema

- employee_id: UUID

### updatePetSizeSnapshotSchema

- actual_pet_size: enum
- adjustment_notes: mínimo 10 caracteres

## USERS

### updateProfileSchema

- full_name: opcional (mínimo 2)
- phone: opcional

### updatePasswordSchema

- current_password: obrigatório
- new_password: mínimo 8 caracteres

## REGRAS IMPORTANTES

- Nunca usar dados diretamente de req.body
- Sempre usar dados validados
- Nunca duplicar schemas
- Reutilizar schemas quando possível
- Sempre respeitar enums definidos em constants.md

## ERROS DE VALIDAÇÃO

- Devem ser tratados pelo error middleware
- Devem seguir padrão de ERROR_CODES:
  - VALIDATION_FAILED

## PROIBIÇÕES

O agente NÃO deve:

- Criar novos schemas sem necessidade
- Alterar schemas existentes sem instrução
- Validar dentro de services
- Validar dentro de repositories
- Ignorar validação
