# System Constants - Petshop API

Este documento define constantes obrigatórias do sistema.  
O agente deve utilizar exclusivamente estes valores.

---

## TIME RULES

WORKING_HOURS_START = "08:00"

WORKING_HOURS_END = "18:00"

---

## AUTH

ACCESS_TOKEN_EXPIRATION = "15m"

REFRESH_TOKEN_EXPIRATION = "7d"

---

## APPOINTMENTS

MIN_SERVICES_PER_APPOINTMENT = 1

---

## CANCELLATION

MIN_CANCELLATION_HOURS = 24

---

## EXECUTION

START_TOLERANCE_MINUTES = 10

---

## STATUS

APPOINTMENT_STATUS = [
"PENDING",
"CONFIRMED",
"IN_PROGRESS",
"COMPLETED",
"CANCELLED"
]

---

## ROLES

ROLES = [
"CLIENT",
"EMPLOYEE",
"ADMIN"
]

---

## PET SIZES

PET_SIZES = [
"SMALL",
"MEDIUM",
"LARGE"
]

---

## ERROR CODES

```ts
ERROR_CODES = {
  UNAVAILABLE_SCHEDULE: {
    message: "Schedule unavailable",
  },
  CANCELLATION_DEADLINE_PASSED: {
    message: "Cancellation deadline has passed",
  },
  UNAUTHORIZED: {
    message: "Unauthorized action",
  },
  NOT_FOUND: {
    message: "Resource not found",
  },
  VALIDATION_FAILED: {
    message: "Validation failed",
  },
};
```
