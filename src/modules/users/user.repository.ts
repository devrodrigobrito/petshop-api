import { prisma } from "../../lib/prisma";

export class UsersRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async updateClientProfile(
    userId: string,
    data: { fullName?: string; phone?: string }
  ) {
    return prisma.client.updateMany({
      where: { userId },
      data,
    });
  }

  async updateEmployeeProfile(
    userId: string,
    data: { fullName?: string; phone?: string }
  ) {
    return prisma.employee.updateMany({
      where: { userId },
      data,
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}
