import { Request, Response } from "express";
import {
  updatePasswordSchema,
  updateProfileSchema,
} from "../users/user.schema";

import { UsersService } from "./user.service";

export class UsersController {
  constructor(private usersService: UsersService) {}

  getMe = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const user = await this.usersService.getMe(userId);

    return res.status(200).json(user);
  };

  updateProfile = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = updateProfileSchema.parse(req.body);

    const user = await this.usersService.updateProfile(userId, data);

    return res.status(200).json(user);
  };

  updatePassword = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = updatePasswordSchema.parse(req.body);

    await this.usersService.updatePassword(userId, data);

    return res.status(200).json({ message: "Password updated successfully" });
  };
}
