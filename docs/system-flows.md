# 🔄 Fluxos do Sistema — PetShop API

Este documento descreve os fluxos operacionais da aplicação.

---

# Fluxo de Autenticação

## Login

1. Usuário envia `email` + `senha`.
2. Sistema verifica se o usuário existe e está ativo.
3. Sistema valida senha utilizando `bcrypt`.
4. Gera:
   - Access Token (15 minutos)
   - Refresh Token (7 dias)
5. Salva **hash do refresh token** no banco.
6. Retorna ambos os tokens ao cliente.

---

## Refresh Token

1. Cliente envia refresh token.
2. Sistema busca hash correspondente no banco.
3. Verifica se não está revogado.
4. Gera novo access token + novo refresh token.
5. Revoga token anterior (refresh token rotation).
6. Retorna novos tokens.

---

## Logout

1. Sistema revoga refresh token no banco.

---

# Fluxo do Cliente

## Cadastro

1. Cliente envia dados.
2. Sistema valida entrada (Zod).
3. Verifica se email e CPF são únicos.
4. Cria `user` + `client` dentro de transação.

---

## Cadastro de Pet

1. Cliente envia dados do pet.
2. Sistema vincula ao `client_id` extraído do token.
3. Cria pet.

---

## Solicitação de Agendamento

1. Cliente envia serviços + `start_time`.
2. Sistema verifica:
   - Cliente ativo
   - Pet pertence ao cliente
   - Serviços ativos e com duração cadastrada para o porte
   - Pelo menos 1 serviço
   - Horário entre 08h–18h
   - `end_time` não ultrapassa 18h
   - Pet não possui agendamento ativo no mesmo intervalo

3. Calcula:
   - `total_duration`
   - `total_price`
4. Calcula `end_time`.
5. Busca funcionários ativos.
6. Verifica sobreposição por funcionário.
7. Se nenhum disponível → erro: **"Horário indisponível"**.
8. Cria agendamento com status `PENDING`.
9. Snapshot congelado.

---

# Fluxo do Admin

## Confirmação

1. Admin visualiza agendamentos `PENDING`.
2. Admin confirma.
3. Sistema:
   - Verifica disponibilidade novamente (proteção contra concorrência).
   - Atribui funcionário disponível no intervalo.
4. Status → `CONFIRMED`.

---

## Inativação de Funcionário

1. Admin solicita inativação.
2. Sistema busca agendamentos futuros do funcionário.
3. Se existirem:
   - Alerta e lista agendamentos.
4. Admin decide:
   - Reatribuir
   - Cancelar
   - Inativar mesmo assim
5. Sistema executa decisão.

---

# Fluxo do Funcionário

## Execução do Serviço

1. Funcionário visualiza agendamentos confirmados.
2. Dentro da tolerância de X minutos do `start_time` → inicia serviço.
3. Status → `IN_PROGRESS`.
4. Ao finalizar → `COMPLETED`.
5. Snapshot torna-se imutável após `COMPLETED`.

---

## NO_SHOW (Implementação Futura)

1. Passados X minutos do `start_time` sem início.
2. Funcionário ou Admin marca como `NO_SHOW`.
3. Slot do funcionário é liberado.

---

# Fluxo de Cancelamento

## Cancelamento pelo Cliente

1. Cliente solicita cancelamento.
2. Sistema verifica:
   - Status (`PENDING` ou `CONFIRMED`)
   - Prazo mínimo (X horas antes do `start_time`)
3. Se fora do prazo → erro: **"Prazo encerrado"**.
4. Status → `CANCELLED`.
5. Slot do funcionário é liberado automaticamente.

---

## Cancelamento pelo Admin

1. Admin pode cancelar em qualquer status ativo.
2. Admin registra motivo em `admin_notes`.
3. Status → `CANCELLED`.
4. Slot do funcionário é liberado automaticamente.

---

# Máquina de Estados

```text
PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
    ↓           ↓            ↓
CANCELLED   CANCELLED   (NO_SHOW futuro)
```

## Observações:

- Nenhum status pode ser pulado.
- Snapshot torna-se imutável após `COMPLETED`.
- `NO_SHOW` será tratado como cancelamento administrativo até implementação formal.
