import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../lib/jwt";
import { UnauthorizedError } from "../errors/httpErrors";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError("Missing Authorization header");
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new UnauthorizedError("Invalid Authorization format");
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub as string,
      role: payload.role as string,
    };
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
