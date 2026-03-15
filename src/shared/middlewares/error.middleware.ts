import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

import { AppError } from "../errors/AppError";
import { logger } from "../../lib/logger";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Zod validation error
  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      status: "error",
      message: "Invalid data",
      errors,
    });
  }

  // AppError (operational errors)
  if (err instanceof AppError) {
    logger.warn(
      { requestId: req.headers["x-request-id"], message: err.message },
      "Operational error",
    );

    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message: "Unique constraint violation",
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Record not found",
      });
    }

    if (err.code === "P2003") {
      return res.status(409).json({
        status: "error",
        message: "Related record not found",
      });
    }
  }

  // Unknown errors (programming bugs)
  logger.error(
    { requestId: req.headers["x-request-id"], err },
    "Unexpected error",
  );

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}
