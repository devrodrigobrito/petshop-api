import { Router } from "express";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { UsersRepository } from "../users/user.repository";

import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = Router();

// Dependencies
const usersRepository = new UsersRepository();
const authRepository = new AuthRepository();
const authService = new AuthService(usersRepository, authRepository);
const authController = new AuthController(authService);

// Public routes
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

// Protected routes
router.post("/logout", authMiddleware, authController.logout);

export default router;
