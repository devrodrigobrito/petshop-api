# API Contract - Petshop API

Este documento define o contrato oficial da API.  
O agente deve seguir estritamente estas definições.

---

## Regras gerais

- Nunca criar endpoints fora deste contrato
- Nunca alterar rotas ou métodos HTTP
- Sempre respeitar controle de acesso (RBAC)
- Endpoints devem seguir exatamente os padrões definidos

---

## Base URL

- /api/v1

---

## AUTH

### POST /auth/register

- Acesso: PUBLIC

### POST /auth/login

- Acesso: PUBLIC

### POST /auth/refresh

- Acesso: PUBLIC

### POST /auth/logout

- Acesso: CLIENT, EMPLOYEE, ADMIN

---

## USERS

### GET /users/me

- Acesso: CLIENT, EMPLOYEE, ADMIN

### PATCH /users/me

- Acesso: CLIENT, EMPLOYEE, ADMIN

### PATCH /users/me/password

- Acesso: CLIENT, EMPLOYEE, ADMIN

---

## CLIENTS

### GET /clients

- Acesso: ADMIN

### GET /clients/:id

- Acesso: ADMIN

### PATCH /clients/:id

- Acesso: ADMIN

### PATCH /clients/:id/status

- Acesso: ADMIN

---

## EMPLOYEES

### POST /employees

- Acesso: ADMIN

### GET /employees

- Acesso: ADMIN

### GET /employees/:id

- Acesso: ADMIN

### GET /employees/available

- Acesso: ADMIN
- Deve ser registrada antes de GET /employees/:id no router

### PATCH /employees/:id

- Acesso: ADMIN

### PATCH /employees/:id/status

- Acesso: ADMIN

---

## PETS

### POST /pets

- Acesso: CLIENT

### GET /pets

- Acesso: CLIENT (somente próprios)

### GET /pets/:id

- Acesso: CLIENT (próprio), ADMIN

### PATCH /pets/:id

- Acesso: CLIENT (próprio), ADMIN

### PATCH /pets/:id/size

- Acesso: ADMIN

---

## SERVICES

### POST /services

- Acesso: ADMIN

### GET /services

- Acesso: CLIENT, EMPLOYEE, ADMIN

### GET /services/:id

- Acesso: CLIENT, EMPLOYEE, ADMIN

### PATCH /services/:id

- Acesso: ADMIN

### PATCH /services/:id/status

- Acesso: ADMIN

### POST /services/:id/durations

- Acesso: ADMIN

### PATCH /services/:id/durations/:sizeId

- Acesso: ADMIN

---

## APPOINTMENTS

### POST /appointments

- Acesso: CLIENT

### GET /appointments

- Acesso: ADMIN

### GET /appointments/me

- Acesso: CLIENT

### GET /appointments/:id

- Acesso: CLIENT (próprio), EMPLOYEE, ADMIN

### GET /appointments/employee/me

- Acesso: EMPLOYEE

### POST /appointments/:id/confirm

- Acesso: ADMIN

### POST /appointments/:id/start

- Acesso: EMPLOYEE

### POST /appointments/:id/complete

- Acesso: EMPLOYEE

### POST /appointments/:id/cancel

- Acesso: CLIENT, ADMIN

### POST /appointments/:id/reassign

- Acesso: ADMIN

### PATCH /appointments/:id/pet-size

- Acesso: ADMIN

---

## Regras obrigatórias

- Todas as rotas protegidas exigem autenticação JWT
- RBAC deve ser aplicado em todas as rotas protegidas
- Nenhuma regra de negócio deve ser implementada fora do domínio correto
- Transições de estado devem seguir a máquina definida em Business Rules
- Não criar novos fluxos sem documentação prévia
