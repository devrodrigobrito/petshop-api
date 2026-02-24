# 🐾 PetShop API

## 🚧 Status

Projeto em desenvolvimento.

---

API REST para gerenciamento de agendamentos, clientes, pets, serviços e funcionários de um PetShop.

O sistema permite:

- Cadastro de clientes e pets
- Gerenciamento de serviços
- Agendamento com múltiplos serviços
- Controle de funcionários
- Cálculo automático de duração e preço

---

## 🎯 Objetivo

Este projeto foi desenvolvido com foco em:

- Aplicação de boas práticas de arquitetura
- Separação de responsabilidades (SoC)
- Modelagem relacional consistente
- Uso de snapshot para integridade histórica
- Controle de status de agendamento

---

## 🚀 Tecnologias

- Node.js
- Express
- Prisma
- PostgreSQL
- TypeScript
- JWT
- Zod
- Bcrypt
- Logger

---

## 🗄️ Modelagem do Banco

A modelagem foi projetada para:

- Permitir múltiplos serviços por agendamento
- Congelar preço e duração no momento da criação (snapshot)
- Evitar duplicidade de duração por porte
- Manter integridade referencial

![Database Diagram](./docs/database/er-diagram.png)
