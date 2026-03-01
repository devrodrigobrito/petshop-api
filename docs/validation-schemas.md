# 🧩 Validation Schemas - PetShop API

Este documento descreve os schemas de validação utilizados na API, definidos com Zod.

Os schemas são responsáveis apenas por validação estrutural e de formato dos dados de entrada.

Regras de negócio e verificações dependentes de banco de dados são tratadas na camada de Service.

---

## AUTH

### registerSchema

- `email` → string, email válido
- `password` → string, mínimo 8 caracteres
- `full_name` → string, mínimo 2 caracteres
- `cpf` → string, formato válido (11 dígitos)
- `phone` → string, opcional

### loginSchema

- `email` → string, email válido
- `password` → string, não vazio

### refreshSchema

- `refresh_token` → string, não vazio

---

## PETS

### createPetSchema

- `name` → string, mínimo 1 caractere
- `species` → string, mínimo 1 caractere
- `breed` → string, opcional
- `size` → enum: SMALL, MEDIUM, LARGE
- `birth_date` → string, formato ISO, opcional

### updatePetSchema

- `name` → string, opcional
- `species` → string, opcional
- `breed` → string, opcional
- `birth_date` → string, formato ISO, opcional

### updatePetSizeSchema

- `size` → enum: SMALL, MEDIUM, LARGE

---

## SERVICES

### createServiceSchema

- `name` → string, mínimo 1 caractere
- `description` → string, opcional

### updateServiceSchema

- `name` → string, opcional
- `description` → string, opcional

### createDurationSchema

- `size` → enum: SMALL, MEDIUM, LARGE
- `duration_minutes` → number, inteiro, positivo
- `price_in_cents` → number, inteiro, positivo

### updateDurationSchema

- `duration_minutes` → number, inteiro, positivo, opcional
- `price_in_cents` → number, inteiro, positivo, opcional

---

## EMPLOYEES

### createEmployeeSchema

- `email` → string, email válido
- `password` → string, mínimo 8 caracteres
- `full_name` → string, mínimo 2 caracteres
- `phone` → string, opcional

### updateEmployeeSchema

- `full_name` → string, opcional
- `phone` → string, opcional

---

## APPOINTMENTS

### createAppointmentSchema

- `pet_id` → string, UUID
- `service_ids` → array de UUID, mínimo 1 item
- `start_time` → string, formato ISO datetime

### cancelByClientSchema

- `cancellation_reason` → string, opcional

### cancelByAdminSchema

- `cancellation_reason` → string, mínimo 10 caracteres, obrigatório

### reassignAppointmentSchema

- `employee_id` → string, UUID

### updatePetSizeSnapshotSchema

- `actual_pet_size` → enum: SMALL, MEDIUM, LARGE
- `adjustment_notes` → string, mínimo 10 caracteres

---

## USERS

### updateProfileSchema

- `full_name` → string, mínimo 2 caracteres, opcional
- `phone` → string, opcional

### updatePasswordSchema

- `current_password` → string, não vazio
- `new_password` → string, mínimo 8 caracteres

---

## Observações

- Os schemas validam apenas estrutura e formato.
- Validações como:
  - CPF único
  - Email único
  - Funcionário disponível
  - Data futura
  - Conflito de horário
  - Regras de negócio

  São tratadas na camada de Service.
