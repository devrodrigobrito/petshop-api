import bcrypt from "bcryptjs";

import { UsersRepository } from "../users/user.repository";
import { AuthRepository } from "./auth.repository";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  decodeRefreshToken,
} from "../../lib/jwt";

import { UnauthorizedError } from "../../shared/errors/httpErrors";

import { LoginInput, RefreshTokenInput } from "./auth.schema";

export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private authRepository: AuthRepository,
  ) {}

  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("User is inactive");
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);

    const tokenHash = await bcrypt.hash(refreshToken.token, 10);

    await this.authRepository.createRefreshToken({
      id: refreshToken.jti,
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return { accessToken, refreshToken: refreshToken.token };
  }

  async refresh(data: RefreshTokenInput) {
    const { refreshToken } = data;

    const payload = verifyRefreshToken(refreshToken);

    const { sub: userId, role, jti } = payload;

    const storedToken = await this.authRepository.findRefreshTokenById(
      jti as string,
    );

    if (!storedToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (storedToken.revokedAt) {
      await this.authRepository.revokeUserRefreshTokens(storedToken.userId);
      throw new UnauthorizedError("Refresh token revoked");
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError("Refresh token expired");
    }

    const isValid = await bcrypt.compare(refreshToken, storedToken.tokenHash);

    if (!isValid) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    await this.authRepository.updateLastUsedAt(storedToken.id);

    await this.authRepository.revokeRefreshToken(storedToken.id);

    const accessToken = signAccessToken(userId as string, role as string);
    const newRefreshToken = signRefreshToken(userId as string, role as string);

    const tokenHash = await bcrypt.hash(newRefreshToken.token, 10);

    await this.authRepository.createRefreshToken({
      id: newRefreshToken.jti,
      userId: userId as string,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken: newRefreshToken.token };
  }

  async logout(refreshToken: string) {
    const payload = decodeRefreshToken(refreshToken);

    const { jti } = payload;

    const storedToken = await this.authRepository.findRefreshTokenById(
      jti as string,
    );

    if (!storedToken || storedToken.revokedAt) {
      return { message: "Logged out successfully" };
    }

    await this.authRepository.revokeRefreshToken(storedToken.id);

    return { message: "Logged out successfully" };
  }
}
