import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/httpErrors";

export function rbacMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      throw new ForbiddenError("Access denied");
    }

    return next();
  };
}
