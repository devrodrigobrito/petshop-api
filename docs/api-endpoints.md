# 🌐 API Endpoints - PetShop API

Este documento descreve o mapa oficial de endpoints da API, organizados por domínio e com suas respectivas permissões de acesso.

---

## AUTH

| Método | Rota                  | Acesso                  |
| ------ | --------------------- | ----------------------- |
| POST   | /api/v1/auth/register | PUBLIC                  |
| POST   | /api/v1/auth/login    | PUBLIC                  |
| POST   | /api/v1/auth/refresh  | PUBLIC                  |
| POST   | /api/v1/auth/logout   | CLIENT, EMPLOYEE, ADMIN |

---

## USERS

| Método | Rota                      | Acesso                  |
| ------ | ------------------------- | ----------------------- |
| GET    | /api/v1/users/me          | CLIENT, EMPLOYEE, ADMIN |
| PATCH  | /api/v1/users/me          | CLIENT, EMPLOYEE, ADMIN |
| PATCH  | /api/v1/users/me/password | CLIENT, EMPLOYEE, ADMIN |

---

## CLIENTS

| Método | Rota                       | Acesso |
| ------ | -------------------------- | ------ |
| GET    | /api/v1/clients            | ADMIN  |
| GET    | /api/v1/clients/:id        | ADMIN  |
| PATCH  | /api/v1/clients/:id        | ADMIN  |
| PATCH  | /api/v1/clients/:id/status | ADMIN  |

---

## EMPLOYEES

| Método | Rota                         | Acesso |
| ------ | ---------------------------- | ------ |
| POST   | /api/v1/employees            | ADMIN  |
| GET    | /api/v1/employees            | ADMIN  |
| GET    | /api/v1/employees/:id        | ADMIN  |
| GET    | /api/v1/employees/available  | ADMIN  |
| PATCH  | /api/v1/employees/:id        | ADMIN  |
| PATCH  | /api/v1/employees/:id/status | ADMIN  |

---

## PETS

| Método | Rota                  | Acesso                  |
| ------ | --------------------- | ----------------------- |
| POST   | /api/v1/pets          | CLIENT                  |
| GET    | /api/v1/pets          | CLIENT (próprios)       |
| GET    | /api/v1/pets/:id      | CLIENT (próprio), ADMIN |
| PATCH  | /api/v1/pets/:id      | CLIENT (próprio), ADMIN |
| PATCH  | /api/v1/pets/:id/size | ADMIN                   |

---

## SERVICES

| Método | Rota                                   | Acesso                  |
| ------ | -------------------------------------- | ----------------------- |
| POST   | /api/v1/services                       | ADMIN                   |
| GET    | /api/v1/services                       | CLIENT, EMPLOYEE, ADMIN |
| GET    | /api/v1/services/:id                   | CLIENT, EMPLOYEE, ADMIN |
| PATCH  | /api/v1/services/:id                   | ADMIN                   |
| PATCH  | /api/v1/services/:id/status            | ADMIN                   |
| POST   | /api/v1/services/:id/durations         | ADMIN                   |
| PATCH  | /api/v1/services/:id/durations/:sizeId | ADMIN                   |

---

## APPOINTMENTS

| Método | Rota                              | Acesso                            |
| ------ | --------------------------------- | --------------------------------- |
| POST   | /api/v1/appointments              | CLIENT                            |
| GET    | /api/v1/appointments              | ADMIN                             |
| GET    | /api/v1/appointments/me           | CLIENT                            |
| GET    | /api/v1/appointments/:id          | CLIENT (próprio), EMPLOYEE, ADMIN |
| GET    | /api/v1/appointments/employee/me  | EMPLOYEE                          |
| POST   | /api/v1/appointments/:id/confirm  | ADMIN                             |
| POST   | /api/v1/appointments/:id/start    | EMPLOYEE                          |
| POST   | /api/v1/appointments/:id/complete | EMPLOYEE                          |
| POST   | /api/v1/appointments/:id/cancel   | CLIENT, ADMIN                     |
| POST   | /api/v1/appointments/:id/reassign | ADMIN                             |
| PATCH  | /api/v1/appointments/:id/pet-size | ADMIN                             |

---

## Observações

- Todas as rotas protegidas exigem autenticação via JWT.
- A autorização é controlada por Role-Based Access Control (RBAC).
- As transições de estado seguem a máquina de estados definida na documentação de regras de negócio.
- A API utiliza versionamento via prefixo `/api/v1`.
