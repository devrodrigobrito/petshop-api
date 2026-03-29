# Business Rules - Petshop API

Este documento define as regras de domínio obrigatórias.  
O agente deve implementar essas regras sem inferência ou alteração.

---

## Princípios gerais

- Regras de negócio nunca devem ser ignoradas
- Sempre validar regras antes de persistir dados
- Nenhuma regra pode ser aplicada parcialmente
- Em caso de dúvida, parar e solicitar esclarecimento

---

## USERS & AUTH

- Email deve ser único no sistema
- Usuário com status INACTIVE não pode autenticar
- Refresh token deve ser rotacionado a cada uso

---

## CLIENTS

- CPF deve ser único no sistema
- Cliente com status INACTIVE não pode criar agendamentos

---

## PETS

- Um pet pertence exclusivamente a um cliente (owner)
- Um pet só pode ser utilizado em agendamentos do seu dono
- Apenas ADMIN pode alterar o porte do pet

---

## SERVICES

- Todo serviço deve possuir:
  - duração por porte (SMALL, MEDIUM, LARGE)
  - preço por porte
- Serviço com status INACTIVE:
  - não pode ser usado em novos agendamentos
  - não afeta agendamentos já existentes

---

## EMPLOYEES

- Funcionário com status INACTIVE:
  - não pode receber novos agendamentos
  - pode concluir agendamentos já confirmados

- Ao inativar funcionário:
  - sistema deve identificar agendamentos futuros afetados
  - reatribuição deve ser feita manualmente pelo ADMIN

---

## APPOINTMENTS

### Regras gerais

- Horário permitido: 08:00 às 18:00
- start_time deve estar dentro do horário permitido
- end_time não pode ultrapassar 18:00
- end_time = start_time + total_duration
- total_duration = soma das durações dos serviços selecionados

- Deve existir pelo menos 1 serviço no agendamento
- Pet deve pertencer ao cliente do agendamento

---

### Criação do agendamento

- Sistema verifica disponibilidade de funcionários no momento da criação
- Se nenhum funcionário estiver disponível → erro: "Schedule unavailable"
- Agendamento só é criado se houver ao menos um funcionário disponível

---

### Atribuição de funcionário

- Funcionário é atribuído automaticamente na confirmação
- Deve ser selecionado o primeiro funcionário disponível
- Funcionários INACTIVE não devem ser considerados

---

### Conflito de horário

- Deve ser feita verificação de sobreposição antes do insert
- Não pode existir conflito de horários para:
  - mesmo funcionário
  - mesmo horário

---

### Concorrência

- Deve ser aplicado optimistic locking na confirmação
- Evitar dupla atribuição de funcionário

---

### Cancelamento

#### Cliente

- Pode cancelar apenas agendamentos com status:
  - PENDING
  - CONFIRMED

- Deve respeitar antecedência mínima (definida no sistema)

#### Admin

- Pode cancelar qualquer agendamento ativo
- Deve sempre registrar motivo em `admin_notes` quando fora da regra do cliente

---

### Ajustes

- Alteração de porte do pet em agendamento:
  - apenas ADMIN
  - deve registrar em `admin_notes`

---

### Snapshot

- Após status COMPLETED:
  - dados do agendamento tornam-se imutáveis
- Ajuste de porte pelo ADMIN recalcula `price_in_cents_snapshot` e `duration_minutes_snapshot`
- Ajuste deve ser registrado em `adjustment_notes` em `appointment_services`

---

## Máquina de estados (obrigatório)

O agente deve respeitar estritamente as transições de status.
