import { prisma } from "../../lib/prisma";

export class AuthRepository {
  async createRefreshToken(params: {
    id?: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }) {
    const data: {
      id?: string;
      userId: string;
      tokenHash: string;
      expiresAt: Date;
    } = {
      userId: params.userId,
      tokenHash: params.tokenHash,
      expiresAt: params.expiresAt,
    };

    if (params.id) {
      data.id = params.id;
    }

    return prisma.refreshToken.create({
      data: {
        ...data,
      },
    });
  }

  async findRefreshTokenById(id: string) {
    return prisma.refreshToken.findUnique({
      where: { id },
    });
  }

  async updateLastUsedAt(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: {
        lastUsedAt: new Date(),
      },
    });
  }

  async revokeRefreshToken(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeUserRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
