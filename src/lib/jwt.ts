import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { env } from "../shared/config/env";

type AccessTokenPayload = {
  sub: string;
  role: string;
};

type RefreshTokenPayload = {
  sub: string;
  role: string;
  jti: string;
};

export function signAccessToken(userId: string, role: string) {
  const payload: AccessTokenPayload = { sub: userId, role };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function signRefreshToken(userId: string, role: string) {
  const jti = uuidv4();
  const payload: RefreshTokenPayload = { sub: userId, role, jti };

  return {
    token: jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    }),
    jti,
  };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}

export function decodeRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, {
    ignoreExpiration: true,
  }) as JwtPayload;
}
