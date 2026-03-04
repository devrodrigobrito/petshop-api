# Arquitetura de Logs Estruturados

Este documento descreve a estratégia de logging estruturado da aplicação, incluindo biblioteca utilizada, estrutura base dos logs, níveis de severidade e política de sanitização de dados sensíveis.

---

## 1. Biblioteca

### Pino

A aplicação utiliza a biblioteca **Pino** para geração de logs estruturados em formato JSON.

### Configuração

- Output em formato JSON
- Estrutura consistente e padronizada
- Serializers para sanitização automática
- Compatível com ferramentas de observabilidade (Datadog, Elastic, Grafana, etc.)

---

## 2. Estrutura Base do Log

Todo log deve conter os seguintes campos padrão:

- `level` → nível de severidade
- `timestamp` → data/hora em formato ISO
- `service` → nome da camada (ex: AppointmentService)
- `method` → método executado
- `requestId` → identificador único da requisição
- `userId` → quando disponível
- `message` → descrição do evento
- `context` → dados relevantes para debugging

### Exemplo

```json
{
  "level": "error",
  "timestamp": "2024-01-01T10:00:00Z",
  "service": "AppointmentService",
  "method": "create",
  "requestId": "req-123",
  "userId": "uuid-123",
  "message": "Horário indisponível",
  "startTime": "2024-01-01T14:00:00Z"
}
```

---

## 3. RequestId

Cada requisição HTTP recebe um `requestId` único, que é propagado por todas as camadas da aplicação.

### Objetivo

- Permitir rastreamento completo de uma requisição
- Facilitar debugging em produção
- Reconstruir o fluxo completo de execução

Sem `requestId`, torna-se difícil correlacionar logs pertencentes à mesma requisição.

---

## 4. Níveis de Log

### debug

- Informações detalhadas para desenvolvimento
- Não recomendado em produção em alto volume

### info

- Eventos normais de negócio
- Exemplo: criação de agendamento, login realizado

### warn

- Anomalias não críticas
- Exemplo: tentativa de login com senha incorreta
- Tentativa de acessar recurso que não pertence ao usuário

### error

- Falhas que impedem a operação
- Exemplo: erro no banco, exceção inesperada

---

## 5. Serializers (Sanitização Automática)

Para evitar vazamento de dados sensíveis, a aplicação utiliza serializers.

### userSerializer

- Remove campos sensíveis do usuário

### requestSerializer

- Remove headers de autenticação
- Remove tokens
- Remove informações confidenciais

A sanitização é sistêmica e não depende de disciplina manual do desenvolvedor.

---

## 6. Política de Dados Sensíveis

Os seguintes dados nunca devem ser registrados em logs:

- password
- password_hash
- token_hash
- access_token
- refresh_token
- CPF completo (deve ser mascarado)
- Email em contexto de autenticação
- Secrets e chaves privadas

### Justificativa

Logs podem:

- Ser enviados para sistemas externos
- Ficar armazenados por longos períodos
- Ser acessados por múltiplas pessoas

Portanto, vazamento em logs representa risco de segurança e violação de LGPD.

---

## 7. Logs por Camada

**Auth Middleware**: warn → token inválido, expirado, ausente

**RBAC Middleware**: warn → role insuficiente

**Auth Service**: info → login/logout | warn → reuse attack

**Appointment Service**: info → transições de status | warn → violações de regra

**Employee Service**: info → criação/inativação | warn → agendamentos futuros

**Error Handler**: error → todas as falhas com stack trace
