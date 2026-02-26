# 📜 Regras de Negócio — PetShop API

Este documento descreve as regras de domínio da aplicação.

---

## USUÁRIOS E AUTENTICAÇÃO

- Email único no sistema
- Refresh token rotacionado a cada uso
- Usuário inativo não pode autenticar

---

## CLIENTES E PETS

- CPF único no sistema
- Um pet só pode ser agendado pelo seu dono
- Porte do pet ajustável apenas por Admin
- Cliente inativo não pode criar agendamentos

---

## SERVIÇOS

- Todo serviço deve ter duração e preço para os três portes
- Serviço inativo não pode ser incluído em novos agendamentos
- Serviços já agendados não são afetados pela inativação

---

## FUNCIONÁRIOS

- Funcionário inativo não pode receber novos agendamentos
- Funcionário inativo pode concluir agendamentos já confirmados
- Sistema alerta agendamentos futuros ao inativar funcionário
- Reatribuição manual pelo Admin antes da execução

---

## AGENDAMENTOS

- Horário permitido: 08h às 18h
- `end_time` não pode ultrapassar 18h
- `end_time` = start_time + total_duration
- Mínimo de um serviço por agendamento
- Pet deve pertencer ao cliente do agendamento
- Sistema atribui primeiro funcionário disponível na confirmação
- Verificação de sobreposição via query antes do insert
- **Optimistic locking** na confirmação simultânea
- Cliente cancela apenas `PENDING` ou `CONFIRMED`
- Cliente cancela com antecedência mínima de X horas antes do `start_time`
- Após prazo apenas Admin cancela com motivo em `admin_notes`
- Transição de status segue máquina de estados
- Snapshot imutável após `COMPLETED`
- Ajuste de porte permitido apenas por Admin com registro em `admin_notes`
