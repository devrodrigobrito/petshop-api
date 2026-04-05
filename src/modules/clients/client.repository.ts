import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";

export class ClientsRepository {
  async create(data: Prisma.ClientCreateInput, tx?: Prisma.TransactionClient) {
    const prismaClient = tx ?? prisma;

    return prismaClient.client.create({
      data,
      include: {
        user: true,
      },
    });
  }

  async findMany() {
    return prisma.client.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.client.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async findByCpf(cpf: string) {
    return prisma.client.findUnique({
      where: { cpf },
      include: {
        user: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      fullName?: string;
      cpf?: string | null;
      phone?: string | null;
    },
  ) {
    return prisma.client.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async updateStatus(id: string, isActive: boolean) {
    return prisma.client.update({
      where: { id },
      data: {
        user: {
          update: {
            isActive,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }
}
