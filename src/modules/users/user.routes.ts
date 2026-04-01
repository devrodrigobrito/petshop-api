import { Router } from "express";

import { UsersController } from "./user.controller";
import { UsersService } from "./user.service";
import { UsersRepository } from "./user.repository";

import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = Router();

// Dependencies
const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

// Public routes
router.get("/me", authMiddleware, usersController.getMe);
router.patch("/me", authMiddleware, usersController.updateProfile);
router.patch("/me/password", authMiddleware, usersController.updatePassword);

export default router;
