import { Router } from "express";

import { ClientsController } from "./client.controller";
import { ClientsService } from "./client.service";
import { ClientsRepository } from "./client.repository";
import { UsersRepository } from "../users/user.repository";

import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { rbacMiddleware } from "../../shared/middlewares/rbac.middleware";

const router = Router();

const usersRepository = new UsersRepository();
const clientsRepository = new ClientsRepository();
const clientsService = new ClientsService(clientsRepository, usersRepository);
const clientsController = new ClientsController(clientsService);

router.post("/register", clientsController.register);
router.get(
  "/",
  authMiddleware,
  rbacMiddleware(["ADMIN"]),
  clientsController.findMany,
);
router.get(
  "/:id",
  authMiddleware,
  rbacMiddleware(["ADMIN"]),
  clientsController.findById,
);
router.patch(
  "/:id",
  authMiddleware,
  rbacMiddleware(["ADMIN"]),
  clientsController.update,
);
router.patch(
  "/:id/status",
  authMiddleware,
  rbacMiddleware(["ADMIN"]),
  clientsController.updateStatus,
);

export default router;
