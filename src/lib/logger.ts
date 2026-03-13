import pino from "pino";
import { env } from "../shared/config/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:
    env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
});
