import bcrypt from "bcryptjs";

import { UsersRepository } from "./user.repository";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors/httpErrors";

type UpdateProfileInput = {
  fullName?: string;
  phone?: string;
};

type UpdatePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getMe(userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

    if (user.role === "CLIENT") {
      await this.usersRepository.updateClientProfile(userId, data);
    } else if (user.role === "EMPLOYEE") {
      await this.usersRepository.updateEmployeeProfile(userId, data);
    }

    const updatedUser = await this.usersRepository.findById(userId);
    const { passwordHash, ...userWithoutPassword } = updatedUser!;
    return userWithoutPassword;
  }

  async updatePassword(userId: string, data: UpdatePasswordInput) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

    const passwordMatch = await bcrypt.compare(
      data.currentPassword,
      user.passwordHash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedError();
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10);

    await this.usersRepository.updatePassword(userId, passwordHash);

    return { message: "Password updated successfully" };
  }
}
