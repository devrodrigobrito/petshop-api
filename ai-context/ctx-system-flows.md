# System Flows - Petshop API

Este documento define os fluxos operacionais e a máquina de estados.  
O agente deve seguir exatamente estas sequências.

---

## Regras gerais

- Fluxos devem ser executados na ordem definida
- Nenhuma etapa pode ser pulada
- Toda validação deve ocorrer antes de persistência
- Em caso de falha, interromper execução imediatamente

---

# AUTH FLOWS

## LOGIN

1. Validar input
2. Buscar usuário por email
3. Verificar se usuário está ACTIVE
4. Validar senha (bcrypt)
5. Gerar:
   - access_token (15min)
   - refresh_token (7d)
6. Salvar hash do refresh_token
7. Retornar tokens

---

## REFRESH TOKEN

1. Receber refresh_token
2. Verificar assinatura JWT
3. Extrair jti do payload
4. Buscar token no banco pelo jti
5. Verificar se não está revogado
   - Se revogado → revogar TODOS os tokens do usuário (reuse attack)
6. Verificar se não está expirado
7. Comparar token com hash (bcrypt)
8. Atualizar last_used_at
9. Revogar token anterior
10. Gerar novos tokens
11. Salvar novo hash
12. Retornar tokens

---

## LOGOUT

1. Revogar refresh_token

---

# CLIENT FLOWS

## CREATE CLIENT

1. Validar input
2. Verificar unicidade:
   - email
   - CPF
3. Criar user + client em transação

---

## CREATE PET

1. Validar input
2. Obter client_id via token
3. Criar pet vinculado ao cliente

---

## CREATE APPOINTMENT

### Validações obrigatórias (ordem fixa)

1. Validar input
2. Verificar cliente ACTIVE
3. Verificar pet pertence ao cliente
4. Verificar:
   - serviços ativos
   - duração configurada para o porte
5. Verificar pelo menos 1 serviço
6. Validar horário:
   - start_time >= 08:00
   - end_time <= 18:00
7. Verificar conflito de pet no mesmo horário
8. Calcular total_duration
9. Calcular end_time
10. Calcular total_price_in_cents
11. Buscar funcionários ACTIVE
12. Verificar conflitos por funcionário

---

### Cálculos

8. Calcular total_duration
9. Calcular total_price
10. Calcular end_time

---

### Disponibilidade

11. Buscar funcionários ACTIVE
12. Verificar conflitos por funcionário

- Se nenhum disponível → ERRO: "UNAVAILABLE_SCHEDULE"

---

### Persistência

13. Criar appointment com:

- status: PENDING

14. Criar snapshot (imutável após COMPLETED)

---

# ADMIN FLOWS

## CONFIRM APPOINTMENT

1. Buscar appointment (status = PENDING)
2. Revalidar disponibilidade (proteção concorrência)
3. Aplicar optimistic locking
4. Atribuir funcionário disponível
5. Atualizar status → CONFIRMED

---

## INACTIVATE EMPLOYEE

1. Buscar agendamentos futuros do funcionário
2. Se existirem:
   - retornar lista para decisão do admin

3. Admin escolhe:
   - REASSIGN
   - CANCEL
   - FORCE_INACTIVATE

4. Executar ação escolhida

---

# EMPLOYEE FLOWS

## START APPOINTMENT

1. Verificar status = CONFIRMED
2. Validar janela de tolerância (definir constante)
3. Atualizar status → IN_PROGRESS

---

## COMPLETE APPOINTMENT

1. Verificar status = IN_PROGRESS
2. Atualizar status → COMPLETED
3. Tornar snapshot imutável

---

# CANCEL FLOWS

## CLIENT CANCEL

1. Verificar ownership
2. Verificar status:
   - PENDING ou CONFIRMED
3. Validar prazo mínimo (definir constante)

- Se inválido → ERRO: "CANCELLATION_DEADLINE_PASSED"

4. Atualizar status → CANCELLED
5. Liberar slot do funcionário

---

## ADMIN CANCEL

1. Verificar status não é COMPLETED
2. Validar permissão ADMIN
3. Registrar admin_notes (obrigatório)
4. Atualizar status → CANCELLED
5. Liberar slot do funcionário

---

# STATE MACHINE (OBRIGATÓRIO)

Estados válidos:

- PENDING
- CONFIRMED
- IN_PROGRESS
- COMPLETED
- CANCELLED

---

## Transições permitidas

- PENDING → CONFIRMED
- PENDING → CANCELLED

- CONFIRMED → IN_PROGRESS
- CONFIRMED → CANCELLED

- IN_PROGRESS → COMPLETED
- IN_PROGRESS → CANCELLED (somente ADMIN)

---

## Regras

- Nenhum estado pode ser pulado
- Transições inválidas devem gerar erro
- COMPLETED é estado final (imutável)

---

## FUTURO

- NO_SHOW será tratado como extensão da máquina de estados
