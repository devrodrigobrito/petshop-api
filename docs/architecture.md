## 🏗️ Arquitetura da Aplicação - PetShop API

O projeto é organizado por domínio (feature-based), onde cada módulo contém suas próprias camadas de controller, service, repository e validação.

---

```text
petshop-api/
├── prisma/
│   ├── migrations/
│   ├── seeds/
│   └── schema.prisma
│
├── src/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── user.schema.ts
│   │   │   └── user.types.ts
│   │   │
│   │   ├── clients/
│   │   ├── employees/
│   │   ├── pets/
│   │   ├── services/
│   │   └── appointments/
│   │
│   ├── shared/
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rbac.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   └── httpErrors.ts
│   │   ├── utils/
│   │   └── config/
│   │       └── env.ts
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── logger.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .env.example
├── .gitignore
└── package.json
```
